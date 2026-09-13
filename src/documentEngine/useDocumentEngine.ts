import { advanceStage, activateNextStages, canonicalDemoActorId, canActOnStage, getActiveReviewStages, flowFromConfiguration, hasConfiguredNextStage } from "./workflow";
import { SignatureCredentialMode } from "./signatureCredential";
import { buildDocumentPages, composeArtifactPages, getSignatureSlots } from "./pagination";
import { useState, useCallback, useRef } from "react";
import { DocumentMasterState, DocumentArtifact, DocumentObservation, DocumentObservationAnchor, DocumentSignature, DocumentType, ActividadMatrizDoc, AnexoDoc, InformeDataDoc, FlowStageNode } from "./types";
import { FlujoGrupo, UsuarioAdmin, PeriodoAcademico } from "../modulo7/types";
import { INITIAL_DOCUMENT_MASTER, INITIAL_DOCUMENTS_LIST, JUSTIFICACION_INICIAL, OBJETIVO_INICIAL, FLOW_STAGES_INICIAL } from "./mockDataDocument";
import { findPlanByIdentity } from "./documentIdentity";

export function normalizeInformeTitle(titulo: string): string {
  return titulo.replace(/^(?:INFORME\s+DE\s*:\s*)+/i, "").trim().toUpperCase();
}

const STORAGE_KEY = "fisei_documents_collection_v8";
const documentDate = () => new Date().toLocaleDateString("es-EC", { timeZone: "America/Guayaquil", day: "2-digit", month: "2-digit", year: "numeric" });
const documentTime = () => new Date().toLocaleTimeString("es-EC", { timeZone: "America/Guayaquil", hour: "2-digit", minute: "2-digit" });
const timestamp = () => `${documentDate()} ${documentTime()}`;
const uniqueId = (prefix: string) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const editableStates = ["BORRADOR", "LISTO PARA FIRMA", "EN CORRECCIÓN"];

type EngineConfiguration = { flujos: FlujoGrupo[]; usuarios: UsuarioAdmin[]; periodos?: PeriodoAcademico[] };
type AuditLog = (tipo: string, objeto: string, accion: string, descripcion: string, usuario: string, rol: string) => void;
type BasicDocumentData = { teacherId?: string; groupId?: string; periodId?: string; grupo?: string; carrera?: string; periodo?: string; titulo?: string; informeOrigen?: "DERIVADO_PLAN" | "INDEPENDIENTE"; documentoRelacionadoId?: string; documentoRelacionadoTitulo?: string; antecedentes?: string; actividadesInforme?: import("./types").ActividadInformeDoc[] };
type PlanDraft = { justificacion: string; objetivo: string; matriz: ActividadMatrizDoc[]; tieneAnexos: "si" | "no" | null; anexos: AnexoDoc[]; fuente?: string; collectsPersonalData?: boolean };
type InformeDraft = { titulo: string; grupo: string; carrera?: string; periodo: string; tieneAnexos: "si" | "no" | null; anexos: AnexoDoc[] } & InformeDataDoc;

function isStoredDocument(value: unknown): value is DocumentMasterState {
  if (!value || typeof value !== "object") return false;
  const doc = value as Partial<DocumentMasterState>;
  return typeof doc.id === "string" && typeof doc.teacherId === "string" && typeof doc.groupId === "string" && typeof doc.periodId === "string" && typeof doc.nombre === "string" && typeof doc.grupo === "string" && typeof doc.periodo === "string" && typeof doc.documentState === "string" && Boolean(doc.currentArtifact?.elaborador?.id) && Array.isArray(doc.currentArtifact?.signatures) && Array.isArray(doc.flowStages) && Array.isArray(doc.observations) && Array.isArray(doc.artifactHistory);
}

function composeArtifact(artifact: DocumentArtifact, stages: FlowStageNode[]): DocumentArtifact {
  const snapshot = structuredClone(artifact);
  const pages = composeArtifactPages(snapshot, stages);
  return { ...snapshot, pages, pageCount: pages.length, signatureSlots: getSignatureSlots(pages) };
}

function hydrateDocument(document: DocumentMasterState): DocumentMasterState {
  if (document.currentArtifact.pages?.length) return document;
  return { ...document, currentArtifact: composeArtifact(document.currentArtifact, document.flowStages) };
}

export function useDocumentEngine(onAuditLog?: AuditLog, configuration?: EngineConfiguration) {
  const [documents, setDocuments] = useState<DocumentMasterState[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      const parsed: unknown = saved ? JSON.parse(saved) : null;
      if (Array.isArray(parsed) && parsed.length && parsed.every(isStoredDocument)) return parsed.map(hydrateDocument);
    } catch { /* A damaged DEMO snapshot can be reset without breaking navigation. */ }
    return structuredClone(INITIAL_DOCUMENTS_LIST).map(hydrateDocument);
  });
  const documentsRef = useRef(documents);
  const [sessionUser, setSessionUser] = useState({ id: "usr-andrea-01", nombre: "Ing. Andrea Pérez, Mg." });
  const sessionRef = useRef(sessionUser);
  const simularSesionDemo = useCallback((id: string, nombre: string) => {
    const user = configuration?.usuarios.find(u => canonicalDemoActorId(u.id) === canonicalDemoActorId(id));
    sessionRef.current = { id: canonicalDemoActorId(id), nombre: user?.nombreCompleto || nombre };
    setSessionUser(sessionRef.current);
  }, [configuration]);
  const [selectedDocId, setSelectedDocId] = useState(documents[0]?.id || INITIAL_DOCUMENT_MASTER.id);
  const docMaster = documents.find(d => d.id === selectedDocId) || documents[0] || INITIAL_DOCUMENT_MASTER;
  const isAuthor = (doc: DocumentMasterState) => canonicalDemoActorId(doc.currentArtifact.elaborador.id) === sessionRef.current.id;
  const isClosed = (doc: DocumentMasterState) => Boolean(configuration?.periodos?.some(p => p.id === doc.periodId && p.estado === "CERRADO"));
  const canEdit = (doc: DocumentMasterState) => isAuthor(doc) && editableStates.includes(doc.documentState) && !doc.currentArtifact.signatures.length;

  const commitDocuments = useCallback((next: DocumentMasterState[]) => {
    documentsRef.current = next;
    setDocuments(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* Session state remains usable when storage is full. */ }
  }, []);
  const mutateDocument = (targetDocId: string, updater: (doc: DocumentMasterState) => DocumentMasterState, event?: string, detail?: string): DocumentMasterState | null => {
    const target = documentsRef.current.find(d => d.id === targetDocId);
    if (!target || isClosed(target)) return null;
    const next = updater(target);
    if (next === target) return null;
    commitDocuments(documentsRef.current.map(d => d.id === targetDocId ? next : d));
    if (event) onAuditLog?.(event, next.nombre, event, detail || `${event} · Versión ${next.formalVersion} · Ronda ${next.reviewRound}`, sessionRef.current.nombre, isAuthor(next) ? "Docente" : "Revisor");
    return next;
  };
  const seleccionarDocumento = useCallback((id: string) => setSelectedDocId(id), []);

  const crearNuevoDocumento = (tipo: DocumentType, datos: BasicDocumentData = {}): DocumentMasterState => {
    const relatedPlan = datos.documentoRelacionadoId ? documentsRef.current.find(d => d.id === datos.documentoRelacionadoId && d.documentType === "PLAN_TRABAJO") : undefined;
    const grupo = relatedPlan?.grupo || datos.grupo || "Comisión de Eventos Académicos";
    const periodo = relatedPlan?.periodo || datos.periodo || "Julio – Diciembre 2026";
    const configuredFlow = configuration?.flujos.find(f => f.grupoId === datos.groupId || f.grupoNombre === grupo);
    const teacherId = relatedPlan?.teacherId || datos.teacherId || sessionRef.current.id;
    const groupId = relatedPlan?.groupId || datos.groupId || configuredFlow?.grupoId || `demo-group:${grupo}`;
    const periodId = relatedPlan?.periodId || datos.periodId || configuration?.periodos?.find(p => p.nombre === periodo)?.id || `demo-period:${periodo}`;
    const existing = tipo === "PLAN_TRABAJO" ? findPlanByIdentity(documentsRef.current, { teacherId, groupId, periodId }) : undefined;
    if (existing) { setSelectedDocId(existing.id); return existing; }
    const carrera = relatedPlan?.carrera || datos.carrera || "Ingeniería de Software";
    const titulo = tipo === "INFORME" ? normalizeInformeTitle(datos.titulo || `Seguimiento de actividades — ${grupo}`) : datos.titulo || `Plan de Trabajo: ${grupo}`;
    const id = uniqueId(tipo === "INFORME" ? "doc-inf" : "doc-plan");
    const authorUser = configuration?.usuarios.find(u => canonicalDemoActorId(u.id) === sessionRef.current.id);
    const elaborador = { id: sessionRef.current.id, nombre: sessionRef.current.nombre, cargo: "Docente elaborador", email: authorUser?.correo || "" };
    const flowSource = relatedPlan?.flowStages || (configuredFlow && configuration ? flowFromConfiguration(configuredFlow, configuration.usuarios, elaborador) : configuration ? [FLOW_STAGES_INICIAL[0], { ...FLOW_STAGES_INICIAL[1], actorId: undefined, actorName: "Responsable pendiente de configuración", stageName: "Etapa pendiente de configuración" }] : FLOW_STAGES_INICIAL);
    const flowStages: FlowStageNode[] = flowSource.map(stage => ({ ...stage, ...(stage.actorRole === "docente" ? { actorId: elaborador.id, actorName: elaborador.nombre } : {}), estado: "PENDIENTE", signature: undefined }));
    const codigoFormatoOficial = tipo === "INFORME" ? "UTA-SGC-A-2-1-P7-T2" : "UTA-SGC-A-2-1-P7-T1";
    const pages = buildDocumentPages(tipo, 0, flowStages);
    const activities = (relatedPlan?.currentArtifact.matriz || []).map(a => ({ id: a.id, actividad: a.nombre, mediosVerificacion: a.medios.join("; "), porcentajeEjecucion: 0, observaciones: "" }));
    const artifact: DocumentArtifact = {
      id: uniqueId(`art-${id}`), documentType: tipo, codigoFormatoOficial, titulo, formalVersion: "1.0", reviewRound: 1, pageCount: pages.length, pages,
      generatedAt: timestamp(), generatedBy: elaborador.nombre, grupo, carrera, periodo,
      unidadAcademica: relatedPlan?.currentArtifact.unidadAcademica || "Facultad de Ingeniería en Sistemas, Electrónica e Industrial", elaborador,
      justificacion: tipo === "PLAN_TRABAJO" ? JUSTIFICACION_INICIAL : undefined, objetivo: tipo === "PLAN_TRABAJO" ? OBJETIVO_INICIAL : undefined, matriz: tipo === "PLAN_TRABAJO" ? [] : undefined,
      informeData: tipo === "INFORME" ? { informeOrigen: datos.informeOrigen || "DERIVADO_PLAN", relatedPlanId: relatedPlan?.id, relatedPlanTitulo: relatedPlan?.nombre, antecedentes: datos.antecedentes || "", actividadesInforme: activities, conclusiones: "", oportunidadesMejora: "", aplicaRegistroContactos: false, contactosDelegacion: [] } : undefined,
      tieneAnexos: "no", anexos: [], signatures: [], signatureSlots: getSignatureSlots(pages),
      historialCambios: [{ version: "1.0", descripcion: `Elaboración inicial del ${tipo === "INFORME" ? "Informe" : "Plan de Trabajo"}`, fecha: documentDate() }],
    };
    const newDoc: DocumentMasterState = {
      id, teacherId, groupId, periodId, codigo: `DEMO-${tipo === "INFORME" ? "INF" : "PT"}-${Date.now()}`, codigoFormatoOficial, nombre: titulo, documentType: tipo, grupo, carrera, periodo,
      formalVersion: "1.0", reviewRound: 1, documentState: "BORRADOR", currentArtifact: composeArtifact(artifact, flowStages), artifactHistory: [], observations: [], flowStages,
      draftCreatedAt: new Date().toISOString(), fechaUltimaActualizacion: timestamp(), documentoRelacionadoId: relatedPlan?.id, documentoRelacionadoTitulo: relatedPlan?.nombre,
    };
    commitDocuments([newDoc, ...documentsRef.current]);
    setSelectedDocId(id);
    onAuditLog?.("DOCUMENTO CREADO", titulo, "DOCUMENTO CREADO", `Borrador DEMO de ${grupo}`, elaborador.nombre, "Docente");
    return newDoc;
  };

  const generarArtefacto = (targetDocId: string, datos: PlanDraft) => {
    const next = mutateDocument(targetDocId, doc => {
      if (!canEdit(doc) || doc.documentType !== "PLAN_TRABAJO" || !datos.justificacion.trim() || !datos.objetivo.trim() || !datos.matriz.length || datos.matriz.some(a => !a.desde || !a.hasta || !a.responsables.length || !a.recursos.length || !a.medios.length || [...a.responsables, ...a.recursos, ...a.medios].some(v => !v.trim()))) return doc;
      const artifact = composeArtifact({ ...doc.currentArtifact, ...datos, anexos: datos.tieneAnexos === "si" ? datos.anexos : [], id: uniqueId(`art-${doc.id}-r${doc.reviewRound}`), generatedAt: timestamp(), generatedBy: doc.currentArtifact.elaborador.nombre }, doc.flowStages);
      return { ...doc, documentState: "LISTO PARA FIRMA", currentArtifact: artifact, fechaUltimaActualizacion: timestamp() };
    }, "DOCUMENTO GENERADO");
    return next?.currentArtifact;
  };

  const generarArtefactoInforme = (targetDocId: string, datos: InformeDraft) => {
    const next = mutateDocument(targetDocId, doc => {
      if (!canEdit(doc) || doc.documentType !== "INFORME" || !datos.antecedentes.trim() || !datos.conclusiones.trim() || !datos.oportunidadesMejora.trim()) return doc;
      const relatedPlan = datos.informeOrigen === "DERIVADO_PLAN" ? documentsRef.current.find(d => d.id === datos.relatedPlanId && d.documentType === "PLAN_TRABAJO") : undefined;
      if (datos.informeOrigen === "DERIVADO_PLAN" && (!relatedPlan || !["VALIDADO", "EN EJECUCIÓN"].includes(relatedPlan.documentState))) return doc;
      if (doc.documentoRelacionadoId && datos.relatedPlanId !== doc.documentoRelacionadoId) return doc;
      if (datos.actividadesInforme?.some(a => !Number.isFinite(a.porcentajeEjecucion) || a.porcentajeEjecucion < 0 || a.porcentajeEjecucion > 100)) return doc;
      const activities = relatedPlan ? (relatedPlan.currentArtifact.matriz || []).map(a => {
        const execution = datos.actividadesInforme?.find(item => item.id === a.id);
        return { id: a.id, actividad: a.nombre, mediosVerificacion: a.medios.join("; "), porcentajeEjecucion: execution?.porcentajeEjecucion ?? 0, observaciones: execution?.observaciones || "" };
      }) : [];
      const grupo = relatedPlan?.grupo || datos.grupo;
      const periodo = relatedPlan?.periodo || datos.periodo;
      const carrera = relatedPlan?.carrera || datos.carrera || doc.carrera || "Ingeniería de Software";
      const artifact = composeArtifact({
        ...doc.currentArtifact, id: uniqueId(`art-${doc.id}-r${doc.reviewRound}`), titulo: normalizeInformeTitle(datos.titulo), grupo, periodo, carrera,
        generatedAt: timestamp(), generatedBy: doc.currentArtifact.elaborador.nombre,
        informeData: { ...datos, relatedPlanId: relatedPlan?.id, relatedPlanTitulo: relatedPlan?.nombre, actividadesInforme: activities, contactosDelegacion: datos.aplicaRegistroContactos ? datos.contactosDelegacion || [] : [] },
        tieneAnexos: datos.tieneAnexos, anexos: datos.tieneAnexos === "si" ? datos.anexos : [],
      }, doc.flowStages);
      return { ...doc, nombre: artifact.titulo || doc.nombre, grupo, periodo, carrera, documentState: "LISTO PARA FIRMA", currentArtifact: artifact, documentoRelacionadoId: relatedPlan?.id, documentoRelacionadoTitulo: relatedPlan?.nombre, fechaUltimaActualizacion: timestamp() };
    }, "DOCUMENTO GENERADO");
    return next?.currentArtifact;
  };

  const firmarComoElaborador = (targetDocId: string, certFile: string, _ubicacion = "", credentialMode: SignatureCredentialMode = "manual") => {
    let signed = false;
    mutateDocument(targetDocId, doc => {
    const stage = doc.flowStages.find(s => s.actorRole === "docente" && canonicalDemoActorId(s.actorId) === sessionRef.current.id);
    if (!isAuthor(doc) || !stage || !["PENDIENTE", "EN_CURSO"].includes(stage.estado) || doc.documentState !== "LISTO PARA FIRMA" || doc.currentArtifact.signatures.some(s => s.stageId === stage.id) || !/\.(p12|pfx)$/i.test(certFile) || !hasConfiguredNextStage(doc.flowStages)) return doc;
    const slot = doc.currentArtifact.signatureSlots?.find(s => s.stageId === stage.id);
    if (!slot) return doc;
    const signature: DocumentSignature = { stageId: stage.id, actorId: stage.actorId, actor: doc.currentArtifact.elaborador.nombre, cargo: stage.actorCargo, role: "docente", fecha: documentDate(), hora: documentTime(), ubicacion: `Página ${slot.pageNumber || slot.pageIndex} — ${slot.label}`, credentialMode, isDemo: credentialMode === "demo" };
    const finalizedDate = doc.currentArtifact.elaborationFinalizedAt || documentDate();
    const artifact = { ...doc.currentArtifact, elaborationFinalizedAt: finalizedDate, signatures: [signature], historialCambios: (doc.currentArtifact.historialCambios || []).map((row, i) => i === 0 ? { ...row, fecha: finalizedDate } : row) };
    signed = true;
    return { ...doc, documentState: "FIRMADO POR ELABORADOR", currentArtifact: artifact, signedArtifact: structuredClone(artifact), flowStages: doc.flowStages.map(s => s.id === stage.id ? { ...s, estado: "FIRMADO", signature } : s), fechaUltimaActualizacion: timestamp() };
    }, "DOCUMENTO FIRMADO", credentialMode === "demo" ? "Firma DEMO del elaborador; no corresponde a una firma electrónica real." : "Firma simulada del elaborador.");
    return signed;
  };

  const enviarARevision = (targetDocId: string) => {
    let sent = false;
    mutateDocument(targetDocId, doc => {
    if (!isAuthor(doc) || doc.documentState !== "FIRMADO POR ELABORADOR" || !hasConfiguredNextStage(doc.flowStages)) return doc;
    const stages = activateNextStages(doc.flowStages);
    const next = stages.find(s => s.estado === "EN_CURSO");
    if (!next || next.actorRole === "docente") return doc;
    sent = true;
    return { ...doc, flowStages: stages, documentState: next?.actorRole === "validador" ? "EN VALIDACIÓN FINAL" : "EN REVISIÓN", fechaUltimaActualizacion: timestamp() };
    }, "DOCUMENTO ENVIADO A REVISIÓN");
    return sent;
  };

  const ownActiveStage = (doc: DocumentMasterState, _actor = sessionRef.current.nombre) => getActiveReviewStages(doc).find(s => canonicalDemoActorId(s.actorId) === sessionRef.current.id);
  const ownObservation = (doc: DocumentMasterState, obs: DocumentObservation) => obs.ronda === doc.reviewRound && obs.estado === "activa" && !obs.congelada && (obs.revisorId ? canonicalDemoActorId(obs.revisorId) === sessionRef.current.id : obs.revisor === sessionRef.current.nombre) && Boolean(ownActiveStage(doc)) && (!obs.stageId || canActOnStage(doc, obs.stageId, sessionRef.current.id));
  const agregarObservacion = (targetDocId: string, pagina: number, texto: string, seccion = "", tipo: "general" | "seccion" = "seccion", revisor = sessionRef.current.nombre, anchor?: DocumentObservationAnchor) => {
    let observation: DocumentObservation | undefined;
    mutateDocument(targetDocId, doc => {
      const stage = ownActiveStage(doc, revisor);
      if (!stage || !texto.trim() || !Number.isInteger(pagina) || pagina < 1 || pagina > (doc.currentArtifact.pages?.length || doc.currentArtifact.pageCount)) return doc;
      if (anchor && (anchor.pageNumber !== pagina || ![anchor.x, anchor.y, anchor.width, anchor.height].every(Number.isFinite) || anchor.x < 0 || anchor.y < 0 || anchor.width <= 0 || anchor.height <= 0 || anchor.x + anchor.width > 1.000001 || anchor.y + anchor.height > 1.000001)) return doc;
      const createdAt = timestamp();
      observation = { id: Date.now() + doc.observations.length, documentoId: doc.id, artifactId: doc.currentArtifact.id, formalVersion: doc.formalVersion, ronda: doc.reviewRound, pagina, pageIndex: pagina - 1, pageNumber: pagina, revisor: stage.actorName, revisorId: stage.actorId, stageId: stage.id, cargo: stage.actorCargo, fecha: createdAt, authorUserId: sessionRef.current.id, authorName: stage.actorName, createdAt, texto: texto.trim(), estado: "activa", status: "ACTIVE", tipo, seccion: tipo === "general" ? "General" : seccion || `Página ${pagina}`, anchor: anchor ? { ...anchor } : undefined };
      return { ...doc, observations: [...doc.observations, observation], fechaUltimaActualizacion: timestamp() };
    }, "OBSERVACIÓN REGISTRADA");
    return observation;
  };
  const editarObservacion = (targetDocId: string, id: number, texto: string) => mutateDocument(targetDocId, doc => {
    if (!texto.trim() || !doc.observations.some(o => o.id === id && ownObservation(doc, o))) return doc;
    return { ...doc, observations: doc.observations.map(o => o.id === id ? { ...o, texto: texto.trim() } : o), fechaUltimaActualizacion: timestamp() };
  }, "OBSERVACIÓN EDITADA");
  const eliminarObservacion = (targetDocId: string, id: number) => mutateDocument(targetDocId, doc => {
    if (!doc.observations.some(o => o.id === id && ownObservation(doc, o))) return doc;
    return { ...doc, observations: doc.observations.filter(o => o.id !== id), fechaUltimaActualizacion: timestamp() };
  }, "OBSERVACIÓN ELIMINADA");

  const devolverDocumento = (targetDocId: string, revisor = sessionRef.current.nombre, motivo = "Revise las observaciones antes de reenviar el documento.") => Boolean(mutateDocument(targetDocId, doc => {
    const stage = ownActiveStage(doc, revisor);
    const expectedState = stage?.actorRole === "validador" ? "EN VALIDACIÓN FINAL" : "EN REVISIÓN";
    if (!stage || doc.documentState !== expectedState || (!motivo.trim() && !doc.observations.some(o => o.ronda === doc.reviewRound && o.estado === "activa"))) return doc;
    const returnedAt = timestamp();
    const historicalArtifact = structuredClone(doc.signedArtifact || doc.currentArtifact);
    const artifactHistory = doc.artifactHistory.some(a => a.id === historicalArtifact.id) ? doc.artifactHistory : [...doc.artifactHistory, historicalArtifact];
    return { ...doc, documentState: "EN CORRECCIÓN", artifactHistory, mensajeDevolucion: motivo.trim(), returnedByUserId: sessionRef.current.id, returnedByName: stage.actorName, returnedAt, flowStages: doc.flowStages.map(s => s.id === stage.id ? { ...s, estado: "DEVUELTO" } : s.estado === "EN_CURSO" ? { ...s, estado: "PENDIENTE" } : s), observations: doc.observations.map(o => o.ronda === doc.reviewRound ? { ...o, congelada: true } : o), fechaUltimaActualizacion: returnedAt };
  }, "DOCUMENTO DEVUELTO", motivo));
  const iniciarCorreccion = (targetDocId: string) => mutateDocument(targetDocId, doc => !isAuthor(doc) || !["DEVUELTO", "EN CORRECCIÓN"].includes(doc.documentState) ? doc : doc.documentState === "EN CORRECCIÓN" ? doc : { ...doc, documentState: "EN CORRECCIÓN", fechaUltimaActualizacion: timestamp() }, "CORRECCIÓN INICIADA");
  const resolverObservacion = (targetDocId: string, id: number) => mutateDocument(targetDocId, doc => {
    if (!isAuthor(doc) || doc.documentState !== "EN CORRECCIÓN" || !doc.observations.some(o => o.id === id && o.estado === "activa" && o.ronda === doc.reviewRound)) return doc;
    return { ...doc, observations: doc.observations.map(o => o.id === id ? { ...o, estado: "resuelta", status: "RESOLVED" as const } : o), fechaUltimaActualizacion: timestamp() };
  }, "OBSERVACIÓN CORREGIDA");
  const prepararNuevaRonda = (targetDocId: string) => mutateDocument(targetDocId, doc => {
    if (!isAuthor(doc) || doc.documentState !== "EN CORRECCIÓN") return doc;
    const nextRound = doc.reviewRound + 1;
    return {
      ...doc, reviewRound: nextRound, documentState: "BORRADOR", currentArtifact: structuredClone({ ...doc.currentArtifact, id: uniqueId(`art-${doc.id}-r${nextRound}`), reviewRound: nextRound, generatedAt: timestamp(), signatures: [] }),
      signedArtifact: undefined,
      artifactHistory: doc.artifactHistory.some(a => a.id === doc.currentArtifact.id) ? doc.artifactHistory : [...doc.artifactHistory, structuredClone(doc.currentArtifact)],
      workflowHistory: [...(doc.workflowHistory || []), { reviewRound: doc.reviewRound, stages: structuredClone(doc.flowStages), fecha: timestamp() }],
      observations: doc.observations.map(o => o.ronda === doc.reviewRound ? { ...o, estado: "historica", status: "HISTORICAL" as const, congelada: true } : o),
      flowStages: doc.flowStages.map(s => ({ ...s, estado: "PENDIENTE", signature: undefined })), mensajeDevolucion: undefined, returnedByUserId: undefined, returnedByName: undefined, returnedAt: undefined, fechaUltimaActualizacion: timestamp(),
    };
  }, "NUEVA RONDA INICIADA");

  const firmarEtapa = (targetDocId: string, actor: string, _cargo: string, _ubicacion: string, role: "revisor" | "validador") => Boolean(mutateDocument(targetDocId, doc => {
    const stage = ownActiveStage(doc, actor);
    if (!stage || stage.actorRole !== role || stage.actionMode === "APPROVE_ONLY" || doc.observations.some(o => ownObservation(doc, o))) return doc;
    const slot = doc.currentArtifact.signatureSlots?.find(s => s.stageId === stage.id);
    if (!slot) return doc;
    const signature: DocumentSignature = { stageId: stage.id, actorId: stage.actorId, actor: stage.actorName, cargo: stage.actorCargo, role, fecha: documentDate(), hora: documentTime(), ubicacion: `Página ${slot.pageNumber || slot.pageIndex} — ${slot.label}` };
    const next = advanceStage(doc, stage, signature);
    return { ...next, fechaUltimaActualizacion: timestamp(), finalValidatorId: next.documentState === "VALIDADO" ? stage.actorId : doc.finalValidatorId, finalValidatorName: next.documentState === "VALIDADO" ? actor : doc.finalValidatorName };
  }, "ETAPA APROBADA", `Firma simulada y aprobación de la etapa por ${actor}.`));
  const aprobarYFirmarRevisor = (targetDocId: string, actor = sessionRef.current.nombre, cargo = "", ubicacion = "") => firmarEtapa(targetDocId, actor, cargo, ubicacion, "revisor");
  const validarYFirmarFinal = (targetDocId: string, actor = sessionRef.current.nombre, cargo = "", ubicacion = "") => firmarEtapa(targetDocId, actor, cargo, ubicacion, "validador");
  const aprobarSinFirma = (targetDocId: string, stageId: string) => Boolean(mutateDocument(targetDocId, doc => {
    const stage = getActiveReviewStages(doc).find(s => s.id === stageId && s.actionMode === "APPROVE_ONLY");
    if (!stage || (stage.actorId ? !canActOnStage(doc, stageId, sessionRef.current.id) : false) || doc.observations.some(o => ownObservation(doc, o))) return doc;
    return { ...advanceStage(doc, stage), fechaUltimaActualizacion: timestamp() };
  }, "ETAPA APROBADA", "Registro DEMO de aprobación sin firma personal por el operador asignado."));

  const configurarFlujoDocumento = (targetDocId: string, stages: FlowStageNode[]) => mutateDocument(targetDocId, doc => {
    if (!canEdit(doc) || stages.length < 2 || stages[0]?.actorRole !== "docente") return doc;
    const flowStages = stages.map(stage => ({ ...stage, ...(stage.actorRole === "docente" ? { actorId: doc.currentArtifact.elaborador.id, actorName: doc.currentArtifact.elaborador.nombre } : {}), estado: "PENDIENTE" as const, signature: undefined }));
    return { ...doc, flowStages, currentArtifact: composeArtifact(doc.currentArtifact, flowStages) };
  }, "FLUJO CONFIGURADO");
  const actualizarDatosBasicos = (targetDocId: string, datos: { groupId: string; periodId: string; grupo: string; periodo: string }) => mutateDocument(targetDocId, doc => {
    if (!canEdit(doc) || documentsRef.current.some(d => d.id !== doc.id && findPlanByIdentity([d], { teacherId: doc.teacherId, groupId: datos.groupId, periodId: datos.periodId }))) return doc;
    return { ...doc, ...datos, nombre: doc.documentType === "PLAN_TRABAJO" ? `Plan de Trabajo — ${datos.grupo}` : doc.nombre, currentArtifact: { ...doc.currentArtifact, grupo: datos.grupo, periodo: datos.periodo }, fechaUltimaActualizacion: timestamp() };
  });
  const restablecerDemo = useCallback(() => { commitDocuments(structuredClone(INITIAL_DOCUMENTS_LIST).map(hydrateDocument)); setSelectedDocId(INITIAL_DOCUMENTS_LIST[0]?.id || INITIAL_DOCUMENT_MASTER.id); }, [commitDocuments]);

  return { simularSesionDemo, currentUser: sessionRef.current, aprobarSinFirma, configurarFlujoDocumento, resolverObservacion, actualizarDatosBasicos, documents, selectedDocId, docMaster, currentArtifact: docMaster.currentArtifact, observations: docMaster.observations, flowStages: docMaster.flowStages, seleccionarDocumento, crearNuevoDocumento, generarArtefacto, generarArtefactoInforme, firmarComoElaborador, enviarARevision, agregarObservacion, editarObservacion, eliminarObservacion, devolverDocumento, iniciarCorreccion, prepararNuevaRonda, aprobarYFirmarRevisor, validarYFirmarFinal, restablecerDemo };
}
