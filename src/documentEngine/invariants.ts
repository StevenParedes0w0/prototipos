import { DocumentMasterState } from "./types";

export function documentInconsistencies(document: DocumentMasterState): string[] {
  const issues: string[] = [];
  const authorStage = document.flowStages.find(stage => stage.actorRole === "docente");
  const requiresAuthorSignature = authorStage?.actionMode !== "APPROVE_ONLY";
  const authorSignature = document.currentArtifact.signatures.some(signature =>
    signature.stageId === authorStage?.id || signature.role === "docente"
  );
  const reviewState = document.documentState === "EN REVISIÓN" || document.documentState === "EN VALIDACIÓN FINAL";

  if (reviewState && requiresAuthorSignature && !authorSignature) {
    issues.push("El documento figura en revisión sin la firma requerida del elaborador.");
  }
  if (reviewState && authorStage && !["FIRMADO", "APROBADO"].includes(authorStage.estado)) {
    issues.push("La etapa de elaboración no consta como completada.");
  }
  if (document.documentState === "BORRADOR" && document.flowStages.some(stage => stage.actorRole !== "docente" && stage.estado === "EN_CURSO")) {
    issues.push("Existe una etapa de revisión activa sobre un borrador.");
  }
  if (document.currentArtifact.pageCount !== (document.currentArtifact.pages?.length || 0)) {
    issues.push("La cantidad de páginas no coincide con el artefacto documental.");
  }
  return issues;
}
