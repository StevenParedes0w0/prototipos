import { DocumentPage, DocumentType, FlowStageNode } from "./types";

export const MATRIX_ROWS_PER_PAGE = 6;
export function buildDocumentPages(type: DocumentType, activityCount: number, stages: FlowStageNode[]): DocumentPage[] {
  const matrixCount = Math.max(1, Math.ceil(activityCount / MATRIX_ROWS_PER_PAGE));
  const sections = type === "PLAN_TRABAJO"
    ? ["cover", "index", "content", ...Array.from({length:matrixCount}, () => "matrix"), "signatures"]
    : ["cover", "index", ...Array.from({length:matrixCount}, () => "report-content"), "contacts-signatures", "validation"];
  return sections.map((section, index) => ({
    id: `page-${index + 1}`, type: section,
    signatureSlots: stages.filter(stage => stage.actionMode !== "APPROVE_ONLY" && (type === "PLAN_TRABAJO" ? section === "signatures" : stage.actorRole === "validador" ? section === "validation" : section === "contacts-signatures")).map(stage => ({stageId:stage.id,userId:stage.actorId,role:stage.actorRole,action:stage.actionLabel || (stage.actorRole === "docente" ? "ELABORADO_POR" : stage.actorRole === "revisor" ? "REVISADO_POR" : "VALIDADO_POR"),label:stage.actorRole === "docente" ? "Elaborado por" : stage.actorRole === "revisor" ? "Revisado por" : "Validado por"}))
  }));
}
export function getSignatureSlots(pages: DocumentPage[]) {
  return pages.flatMap((page, index) => (page.signatureSlots || []).map(slot => ({...slot, role:slot.role || "", action:slot.action || "", label:slot.label || "", pageIndex:index + 1, pageNumber:index + 1})));
}
