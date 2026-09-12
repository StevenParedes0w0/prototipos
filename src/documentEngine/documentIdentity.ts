import { DocumentMasterState } from "./types";

export interface PlanIdentity {
  teacherId: string;
  groupId: string;
  periodId: string;
}

export function samePlanIdentity(document: DocumentMasterState, identity: PlanIdentity): boolean {
  return document.documentType === "PLAN_TRABAJO"
    && document.teacherId === identity.teacherId
    && document.groupId === identity.groupId
    && document.periodId === identity.periodId;
}

export function findPlanByIdentity(documents: DocumentMasterState[], identity: PlanIdentity): DocumentMasterState | undefined {
  return documents.find(document => samePlanIdentity(document, identity));
}
