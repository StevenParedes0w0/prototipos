import type { ActividadMatrizDoc } from "./types";

export type ResponsibleGroupType = "Comisión" | "Unidad" | "Club" | "Coordinación" | "Otro" | string;

interface ResponsibleDisplayInput {
  groupType?: ResponsibleGroupType;
  selectedResponsibleIds?: string[];
  allGroupMemberIds?: string[];
  selectedResponsibleNames?: string[];
}

const uniqueNonEmpty = (values: string[] = []) => [...new Set(values.map(value => value.trim()).filter(Boolean))];

export function getCollectiveResponsibleLabel(groupType?: ResponsibleGroupType): string {
  switch (groupType) {
    case "Comisión": return "Responsable de la comisión";
    case "Unidad": return "Responsable de la unidad";
    case "Club": return "Responsable del club";
    default: return "Responsable del grupo";
  }
}

export function getResponsibleDisplayLabel({
  groupType,
  selectedResponsibleIds = [],
  allGroupMemberIds = [],
  selectedResponsibleNames = [],
}: ResponsibleDisplayInput): string {
  const selectedIds = uniqueNonEmpty(selectedResponsibleIds);
  const allIds = uniqueNonEmpty(allGroupMemberIds);
  const selectedSet = new Set(selectedIds);
  const allSelected = allIds.length > 0 && selectedIds.length === allIds.length && allIds.every(id => selectedSet.has(id));
  if (allSelected) return getCollectiveResponsibleLabel(groupType);
  return uniqueNonEmpty(selectedResponsibleNames).join(", ");
}

export function getActivityResponsibleDisplayLabel(activity: Pick<ActividadMatrizDoc, "responsables" | "responsableNames" | "responsablesEtiqueta">): string {
  return activity.responsablesEtiqueta?.trim()
    || uniqueNonEmpty(activity.responsableNames?.length ? activity.responsableNames : activity.responsables).join(", ");
}
