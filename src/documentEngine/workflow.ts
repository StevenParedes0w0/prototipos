import { FlujoGrupo, UsuarioAdmin } from "../modulo7/types";
import { DocumentMasterState, FlowStageNode, DocumentSignature } from "./types";
import { FLOW_STAGES_INICIAL } from "./mockDataDocument";

export function flowFromConfiguration(flow: FlujoGrupo, users: UsuarioAdmin[]): FlowStageNode[] {
  return flow.etapas.flatMap((stage, index) => {
    const role = stage.tipoResponsable === "Elaborador" ? "docente" : index === flow.etapas.length - 1 ? "validador" : "revisor";
    const actionMode = stage.actionMode || "SIGN_AND_APPROVE";
    const actors = role === "docente" ? [{id:"usr-andrea-01",name:"Ing. Andrea Pérez, Mg."}] : actionMode === "APPROVE_ONLY" ? [{id:undefined,name:stage.nombre}] : (stage.revisoresIds?.length ? stage.revisoresIds.map(id => {
      const user=users.find(u => u.id === id);
      const known=FLOW_STAGES_INICIAL.find(s => s.actorName === user?.nombreCompleto);
      return {id:known?.actorId || id,name:user?.nombreCompleto || "Responsable pendiente de asignación"};
    }) : [{id:undefined,name:"Responsable pendiente de asignación"}]);
    return actors.map((actor, actorIndex) => ({id:`${stage.id}-${actorIndex}`,actorId:actor.id,actorName:actor.name,actorCargo:role === "docente" ? "Docente elaborador" : stage.nombre,actorRole:role,stageName:stage.nombre,estado:"PENDIENTE",actionMode,approvalGroup:stage.id,approvalRule:stage.reglaAprobacion}));
  });
}

export function advanceStage(doc: DocumentMasterState, stage: FlowStageNode, signature?: DocumentSignature): DocumentMasterState {
  let stages=doc.flowStages.map(s => s.id === stage.id ? {...s,estado:"APROBADO" as const,signature} : s);
  if (stage.approvalRule === "AL MENOS UNO" && stage.approvalGroup) stages=stages.map(s => s.approvalGroup === stage.approvalGroup && s.id !== stage.id ? {...s,estado:"APROBADO" as const} : s);
  const nextIndex=stages.findIndex(s => s.estado === "PENDIENTE" || s.estado === "EN_CURSO");
  stages=stages.map((s,i) => i === nextIndex ? {...s,estado:"EN_CURSO" as const} : s);
  const next=stages[nextIndex];
  return {...doc,flowStages:stages,documentState:!next ? "VALIDADO" : next.actorRole === "validador" ? "EN VALIDACIÓN FINAL" : "EN REVISIÓN",operationalState:!next && doc.documentType === "PLAN_TRABAJO" ? "EN EJECUCIÓN" : doc.operationalState,currentArtifact:signature ? {...doc.currentArtifact,signatures:[...doc.currentArtifact.signatures,signature]} : doc.currentArtifact};
}
