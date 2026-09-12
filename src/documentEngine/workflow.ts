import { FlujoGrupo, UsuarioAdmin } from "../modulo7/types";
import { DocumentMasterState, FlowStageNode, DocumentSignature } from "./types";

// Existing demo modules use these aliases for the same people.
export function canonicalDemoActorId(id?: string): string {
  const aliases: Record<string, string> = { "usr-1": "usr-andrea-01", "usr-2": "usr-carlos-02", "usr-3": "usr-patricia-03", "usr-4": "usr-roberto-04", "usr-5": "usr-laura-05" };
  return id ? aliases[id] || id : "";
}

export function flowFromConfiguration(flow: FlujoGrupo, users: UsuarioAdmin[], elaborador = { id: "usr-andrea-01", nombre: "Ing. Andrea Pérez, Mg." }): FlowStageNode[] {
  return flow.etapas.flatMap((stage, index) => {
    const role = stage.tipoResponsable === "Elaborador" ? "docente" : index === flow.etapas.length - 1 ? "validador" : "revisor";
    const actionMode = stage.actionMode || "SIGN_AND_APPROVE";
    const actors = role === "docente" ? [{ id: elaborador.id, name: elaborador.nombre }]
      : stage.revisoresIds?.length ? stage.revisoresIds.map(id => {
        const user = users.find(u => canonicalDemoActorId(u.id) === canonicalDemoActorId(id) && u.estado === "ACTIVO");
        return { id: user ? canonicalDemoActorId(user.id) : undefined, name: user?.nombreCompleto || "Responsable pendiente de asignación" };
      }) : [{ id: undefined, name: "Responsable pendiente de asignación" }];
    return actors.map((actor, actorIndex): FlowStageNode => ({
      id: `${stage.id}-${actorIndex}`, actorId: actor.id, actorName: actor.name,
      actorCargo: role === "docente" ? "Docente elaborador" : stage.nombre,
      actorRole: role, stageName: stage.nombre, estado: "PENDIENTE", actionMode,
      destinationName: stage.destinatarioNombre, destinationType: stage.tipoResponsable,
      approvalGroup: stage.id, approvalRule: stage.reglaAprobacion || "TODOS DEBEN APROBAR",
      actionLabel: role === "docente" ? "ELABORADO_POR" : role === "validador" ? "VALIDADO_POR" : "REVISADO_POR",
    }));
  });
}

export function activateNextStages(stages: FlowStageNode[]): FlowStageNode[] {
  const next = stages.find(s => s.estado === "PENDIENTE" || s.estado === "EN_CURSO");
  if (!next) return stages;
  return stages.map(s => {
    if (s.estado !== "PENDIENTE" && s.estado !== "EN_CURSO") return s;
    const isCurrent = s.id === next.id || Boolean(next.approvalGroup && s.approvalGroup === next.approvalGroup);
    return { ...s, estado: isCurrent ? "EN_CURSO" : "PENDIENTE" };
  });
}

export function hasConfiguredNextStage(stages: FlowStageNode[]): boolean {
  const elaborationIndex = stages.findIndex(stage => stage.actorRole === "docente");
  if (elaborationIndex < 0) return false;
  const nextStages = stages.slice(elaborationIndex + 1);
  if (!nextStages.length) return false;
  return nextStages.every(stage => {
    const named = Boolean(stage.stageName.trim()) && !/pendiente de (configuraci[oó]n|asignaci[oó]n)/i.test(`${stage.stageName} ${stage.actorName}`);
    return named && (stage.actionMode === "APPROVE_ONLY" || Boolean(stage.actorId));
  });
}

export function getActiveReviewStages(doc: DocumentMasterState): FlowStageNode[] {
  if (!["EN REVISIÓN", "EN VALIDACIÓN FINAL"].includes(doc.documentState)) return [];
  return activateNextStages(doc.flowStages).filter(s => s.estado === "EN_CURSO" && s.actorRole !== "docente");
}

export function canActOnStage(doc: DocumentMasterState, stageId: string, userId: string): boolean {
  return getActiveReviewStages(doc).some(s => s.id === stageId && Boolean(s.actorId) && canonicalDemoActorId(s.actorId) === canonicalDemoActorId(userId));
}

export function canAccessReviewDocument(doc: DocumentMasterState, userId: string): boolean {
  const sameActor = (stage: FlowStageNode) => Boolean(stage.actorId) && canonicalDemoActorId(stage.actorId) === canonicalDemoActorId(userId) && stage.actorRole !== "docente";
  return getActiveReviewStages(doc).some(sameActor)
    || doc.flowStages.some(s => sameActor(s) && ["APROBADO", "FIRMADO", "DEVUELTO"].includes(s.estado))
    || Boolean(doc.workflowHistory?.some(round => round.stages.some(s => sameActor(s) && ["APROBADO", "FIRMADO", "DEVUELTO"].includes(s.estado))));
}

export function advanceStage(doc: DocumentMasterState, stage: FlowStageNode, signature?: DocumentSignature): DocumentMasterState {
  let stages = doc.flowStages.map(s => s.id === stage.id ? { ...s, estado: "APROBADO" as const, signature } : s);
  if (stage.approvalRule === "AL MENOS UNO" && stage.approvalGroup) {
    stages = stages.map(s => s.approvalGroup === stage.approvalGroup && s.id !== stage.id ? { ...s, estado: "APROBADO" as const } : s);
  }
  stages = activateNextStages(stages);
  const next = stages.find(s => s.estado === "EN_CURSO");
  return {
    ...doc, flowStages: stages,
    documentState: !next ? "VALIDADO" : next.actorRole === "validador" ? "EN VALIDACIÓN FINAL" : "EN REVISIÓN",
    operationalState: !next && doc.documentType === "PLAN_TRABAJO" ? "EN EJECUCIÓN" : doc.operationalState,
    observations: doc.observations.map(o => o.ronda === doc.reviewRound && (o.stageId === stage.id || (!o.stageId && o.revisor === stage.actorName)) ? { ...o, congelada: true } : o),
    currentArtifact: signature ? { ...doc.currentArtifact, signatures: [...doc.currentArtifact.signatures, signature] } : doc.currentArtifact,
  };
}
