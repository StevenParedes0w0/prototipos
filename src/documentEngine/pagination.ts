import { DocumentArtifact, DocumentPage, DocumentPageBlock, DocumentType, FlowStageNode } from "./types";

export const MATRIX_ROWS_PER_PAGE = 6;
export const DOCUMENT_PAGE_WIDTH = 794;
export const DOCUMENT_PAGE_HEIGHT = 1123;
export const signatureActionLabel = (stage: Pick<FlowStageNode, "actionLabel" | "actorRole">) =>
  stage.actionLabel === "APROBADO_POR" ? "Aprobado por" : stage.actionLabel === "VALIDADO_POR" || stage.actorRole === "validador" ? "Validado por" : stage.actionLabel === "REVISADO_POR" || stage.actorRole === "revisor" ? "Revisado por" : "Elaborado por";
export const normalizeInformeTitle = (value: string) => value.replace(/^(?:\s*informe\s+de\s*:\s*)+/i, "").trim();
export function annexLabel(index: number): string {
  let value = index + 1, label = "";
  while (value > 0) { value--; label = String.fromCharCode(65 + value % 26) + label; value = Math.floor(value / 26); }
  return label;
}

// Conservative line budgets keep the DEMO deterministic without a PDF backend.
// The composed blocks belong to the artifact and are never recomposed after signing.
export function composeArtifactPages(artifact: DocumentArtifact, stages: FlowStageNode[]): DocumentPage[] {
  const pages: DocumentPage[] = [{ id: "page-1", type: "cover", orientation: "portrait" }, { id: "page-2", type: "index", orientation: "portrait" }];
  let current: DocumentPage | undefined;
  let remaining = 0;
  const newPage = (orientation: "portrait" | "landscape" = "portrait") => {
    current = { id: `page-${pages.length + 1}`, type: "content", orientation, blocks: [], contentSections: [] };
    pages.push(current);
    remaining = orientation === "landscape" ? 415 : 800;
  };
  const add = (block: DocumentPageBlock, height: number, orientation: "portrait" | "landscape" = "portrait") => {
    if (!current || current.orientation !== orientation || remaining < height) newPage(orientation);
    current!.blocks!.push(block);
    if (!current!.contentSections!.includes(block.section)) current!.contentSections!.push(block.section);
    remaining -= height;
  };
  const text = (section: string, title: string, value: string | undefined) => {
    const content = value?.trim() || "—";
    const chunks = content.match(/[\s\S]{1,1700}(?:\s|$)|[\s\S]{1,1700}/g) || [content];
    chunks.forEach((chunk, i) => add({ type: "text", section, title: i ? title + " (continuación)" : title, text: chunk, continued: i > 0 }, 48 + Math.ceil(chunk.length / 80) * 17 + (chunk.match(/\n/g)?.length || 0) * 17));
  };
  const table = (type: DocumentPageBlock["type"], section: string, title: string, rows: string[][], widths: number[], orientation: "portrait" | "landscape", maxLines = 14) => {
    const fragments: { cells: string[]; index: number }[] = [];
    rows.forEach((cells, index) => {
      const count = Math.max(1, ...cells.map((cell, i) => Math.ceil(cell.length / (widths[i] * maxLines))));
      for (let part = 0; part < count; part++) fragments.push({ cells: cells.map((cell, i) => cell.slice(part * widths[i] * maxLines, (part + 1) * widths[i] * maxLines)), index });
    });
    let active: DocumentPageBlock | undefined;
    for (const row of fragments) {
      const height = Math.max(type === "contacts" ? 180 : 32, ...row.cells.map((cell, i) => (Math.ceil(cell.length / widths[i]) + (cell.match(/\n/g)?.length || 0)) * 15 + 14));
      if (!current || current.orientation !== orientation || !active || remaining < height) {
        const block: DocumentPageBlock = { type, section, title, rows: [], start: row.index, end: row.index + 1, continued: fragments.indexOf(row) > 0 };
        if (!current || current.orientation !== orientation || remaining < height + 85) newPage(orientation);
        add(block, 85, orientation);
        active = block;
      }
      active.rows!.push(row.cells);
      active.end = row.index + 1;
      remaining -= height;
    }
    if (!rows.length) add({ type, section, title, rows: [], start: 0, end: 0 }, 95, orientation);
  };
  if (artifact.documentType === "PLAN_TRABAJO") {
    text("justificacion", "1. JUSTIFICACIÓN", artifact.justificacion);
    text("objetivo", "2. OBJETIVO", artifact.objetivo);
    current = undefined;
    table("matrix", "matriz", "3. MATRIZ DE ACTIVIDADES", (artifact.matriz || []).map(row => [row.nombre, row.desde, row.hasta, row.responsablesEtiqueta || row.responsables.join("\n"), row.recursos.join("\n"), row.medios.join("\n")]), [32, 10, 10, 25, 27, 28], "landscape");
    add({ type: "text", section: "fuente", text: "Fuente: " + (artifact.fuente || "—") + "\nElaborado por: " + artifact.grupo }, 42, "landscape");
    if (artifact.collectsPersonalData) add({ type: "text", section: "proteccion-datos", text: "Nota: Los datos proporcionados serán tratados conforme a la Ley Orgánica de Protección de Datos Personales, garantizando su confidencialidad, seguridad y uso responsable, y serán utilizados exclusivamente para fines institucionales." }, 64, "landscape");
  } else {
    const data = artifact.informeData;
    text("antecedentes", "1. ANTECEDENTES", data?.antecedentes || data?.introduccion);
    if (data?.informeOrigen === "DERIVADO_PLAN") table("report-matrix", "desarrollo", "2. DESARROLLO DE ACTIVIDADES", (data.actividadesInforme || []).map(row => [row.actividad, row.mediosVerificacion, row.porcentajeEjecucion + "%", row.observaciones || "—"]), [29, 26, 17, 24], "portrait");
    else text("desarrollo", "2. DESARROLLO DE ACTIVIDADES", data?.desarrolloTextoLibre || data?.desarrollo);
    text("conclusiones", "3. CONCLUSIONES", data?.conclusiones || data?.resultados);
    text("oportunidades", "4. OPORTUNIDADES DE MEJORA", data?.oportunidadesMejora || data?.observaciones);
    if (data?.aplicaRegistroContactos) {
      current = undefined;
      table("contacts", "contactos", "5. REGISTRO DE CONTACTOS Y GESTIONES DE LA DELEGACIÓN", (data.contactosDelegacion || []).map(row => [row.nombreDelegacion, row.ciudadPaisInstitucion, [row.institucion || row.entidadPersonaContacto, row.nombreCargo].filter(Boolean).join("\n"), row.datosContacto, row.temaTratado || row.temaProposito || "—", row.compromisoResponsablePlazo || row.acuerdoSeguimiento || "—"]), [90, 90, 26, 20, 25, 25], "portrait", 10);
    }
  }
  current = undefined;
  const annexes = artifact.tieneAnexos === "si" ? artifact.anexos : [];
  if (annexes.length) annexes.forEach((annex, i) => add({ type: "annexes", section: "anexos", title: i ? undefined : (artifact.documentType === "PLAN_TRABAJO" ? "4" : "6") + ". ANEXOS", start: i, end: i + 1, text: "Anexo " + annexLabel(i) + ": " + annex.nombre + "\n" + annex.archivo + " · " + annex.tamano }, 72 + Math.ceil((annex.nombre.length + annex.archivo.length) / 75) * 17));
  else add({ type: "annexes", section: "anexos", title: (artifact.documentType === "PLAN_TRABAJO" ? "4" : "6") + ". ANEXOS", text: "No aplica." }, 82);
  for (let index = 0; index < stages.length; index++) {
    const stage = stages[index];
    const activePage = current as DocumentPage | undefined;
    const previousSignatureBlock = activePage?.blocks?.at(-1);
    const canAppend = previousSignatureBlock?.type === "signatures" && remaining >= 105;
    if (canAppend) { previousSignatureBlock.end = index + 1; remaining -= 105; }
    else add({ type: "signatures", section: "firmas", title: "FIRMAS DE RESPONSABILIDAD", start: index, end: index + 1 }, 150);
    current!.signatureSlots ||= [];
    current!.signatureSlots.push({ stageId: stage.id, userId: stage.actorId, role: stage.actorRole, action: stage.actionLabel || (stage.actorRole === "docente" ? "ELABORADO_POR" : stage.actorRole === "revisor" ? "REVISADO_POR" : "VALIDADO_POR"), label: signatureActionLabel(stage), actorName: stage.actorName, actorCargo: stage.actorCargo, actionMode: stage.actionMode, destinationName: stage.destinationName });
  }
  const history = artifact.historialCambios?.length ? artifact.historialCambios : [{ version: artifact.formalVersion, descripcion: "Elaboración inicial del " + (artifact.documentType === "PLAN_TRABAJO" ? "Plan de Trabajo" : "Informe"), fecha: artifact.elaborationFinalizedAt || artifact.generatedAt.split(" ")[0] }];
  table("history", "historial", "CONTROL DE HISTORIAL DE CAMBIOS", history.map(row => ["v" + row.version.replace(/^v/i, ""), row.descripcion, row.fecha]), [14, 65, 22], "portrait");
  return pages;
}

// Compatibility for old callers; new artifacts compose from complete content.
export function buildDocumentPages(type: DocumentType, activityCount: number, stages: FlowStageNode[]): DocumentPage[] {
  const matrixCount = Math.max(1, Math.ceil(activityCount / MATRIX_ROWS_PER_PAGE));
  const sections = type === "PLAN_TRABAJO" ? ["cover", "index", "content", ...Array.from({ length: matrixCount }, () => "matrix"), "signatures"] : ["cover", "index", ...Array.from({ length: matrixCount }, () => "report-content"), "contacts-signatures", "validation"];
  return sections.map((section, index) => ({ id: "page-" + (index + 1), type: section, orientation: section === "matrix" ? "landscape" : "portrait", signatureSlots: stages.filter(stage => stage.actionMode !== "APPROVE_ONLY" && (type === "PLAN_TRABAJO" ? section === "signatures" : stage.actorRole === "validador" ? section === "validation" : section === "contacts-signatures")).map(stage => ({ stageId: stage.id, userId: stage.actorId, role: stage.actorRole, action: stage.actionLabel, label: signatureActionLabel(stage), actorName: stage.actorName, actorCargo: stage.actorCargo })) }));
}
export function getSignatureSlots(pages: DocumentPage[]) {
  return pages.flatMap((page, index) => (page.signatureSlots || []).filter(slot => slot.actionMode !== "APPROVE_ONLY").map(slot => ({ ...slot, role: slot.role || "", action: slot.action || "", label: slot.label || "", pageIndex: index + 1, pageNumber: index + 1 })));
}
