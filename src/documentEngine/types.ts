// ─── Motor Documental: Tipos y Modelos Institucionales ────────────────────────

export interface ActividadMatrizDoc {
  id: number;
  nombre: string;
  desde: string;
  hasta: string;
  responsables: string[];
  responsableIds?: string[];
  responsableNames?: string[];
  responsablesEtiqueta?: string;
  recursos: string[];
  medios: string[];
}

export interface AnexoDoc {
  id: number;
  nombre: string;
  archivo: string;
  tamano: string;
}

export type DocumentState =
  | "BORRADOR"
  | "LISTO PARA FIRMA"
  | "FIRMADO POR ELABORADOR"
  | "EN REVISIÓN"
  | "DEVUELTO"
  | "EN CORRECCIÓN"
  | "EN VALIDACIÓN FINAL"
  | "VALIDADO"
  | "EN EJECUCIÓN";

export interface DocumentSignature {
  credentialMode?: "manual" | "demo";
  isDemo?: boolean;
  stageId?: string;
  actorId?: string;
  actor: string;
  cargo: string;
  role: "docente" | "revisor" | "validador";
  fecha: string;
  hora: string;
  ubicacion: string;
  hashCertificado?: string;
  algoritmo?: string;
}

export interface DocumentObservationAnchor {
  pageNumber: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DocumentObservation {
  anchor?: DocumentObservationAnchor;
  revisorId?: string;
  stageId?: string;
  congelada?: boolean;
  id: number;
  documentoId: string;
  artifactId: string;
  formalVersion: string;
  ronda: number;
  pagina: number;
  pageIndex: number;
  pageNumber: number;
  revisor: string;
  cargo?: string;
  fecha: string;
  authorUserId: string;
  authorName: string;
  createdAt: string;
  texto: string;
  estado: "activa" | "resuelta" | "historica";
  status: "ACTIVE" | "RESOLVED" | "HISTORICAL";
  tipo: "general" | "seccion";
  seccion?: string;
}

export type DocumentType = "PLAN_TRABAJO" | "INFORME";

export interface ActividadInformeDoc {
  id: number;
  actividad: string;
  mediosVerificacion: string;
  porcentajeEjecucion: number; // 0 - 100
  observaciones: string;
}

export interface ContactoDelegacionDoc {
  id: number;
  nombreDelegacion: string;
  ciudadPaisInstitucion: string;
  entidadPersonaContacto: string;
  institucion?: string;
  nombreCargo?: string;
  datosContacto: string;
  temaTratado?: string;
  temaProposito?: string;
  compromisoResponsablePlazo?: string;
  acuerdoSeguimiento?: string;
}

export interface HistorialCambioFila {
  version: string;
  descripcion: string;
  fecha: string;
}

export interface InformeDataDoc {
  informeOrigen: "DERIVADO_PLAN" | "INDEPENDIENTE";
  relatedPlanId?: string;
  relatedPlanTitulo?: string;
  antecedentes: string;
  // Si DERIVADO_PLAN:
  actividadesInforme?: ActividadInformeDoc[];
  // Si INDEPENDIENTE:
  desarrolloTextoLibre?: string;
  conclusiones: string;
  oportunidadesMejora: string;
  aplicaRegistroContactos: boolean;
  contactosDelegacion?: ContactoDelegacionDoc[];
  // Campos de compatibilidad:
  introduccion?: string;
  desarrollo?: string;
  resultados?: string;
  observaciones?: string;
  documentoRelacionado?: string;
}

export interface DocumentPageBlock {
  type: "text" | "matrix" | "report-matrix" | "contacts" | "annexes" | "signatures" | "history";
  section: string;
  title?: string;
  text?: string;
  start?: number;
  end?: number;
  continued?: boolean;
  rows?: string[][];
}

export interface DocumentPage {
  id: string;
  type: string;
  activityStart?: number;
  activityEnd?: number;
  orientation?: "portrait" | "landscape";
  contentSections?: string[];
  blocks?: DocumentPageBlock[];
  signatureSlots?: {
    stageId?: string;
    userId?: string;
    action?: string;
    role?: string;
    label?: string;
    actorName?: string;
    actorCargo?: string;
    actionMode?: "SIGN_AND_APPROVE" | "APPROVE_ONLY";
    destinationName?: string;
  }[];
}

export interface DocumentArtifact {
  id: string;
  documentType: DocumentType;
  codigoFormatoOficial?: "UTA-SGC-A-2-1-P7-T1" | "UTA-SGC-A-2-1-P7-T2" | string;
  titulo?: string;
  formalVersion: string; // e.g. "1.0"
  reviewRound: number;   // e.g. 1, 2, 3
  pageCount: number;     // e.g. 3, 4 (o N páginas dinámicas)
  pages?: DocumentPage[]; // Representación de las páginas del documento
  elaborationFinalizedAt?: string;
  fuente?: string;
  collectsPersonalData?: boolean;
  generatedAt: string;   // e.g. "07/09/2026 09:30"
  generatedBy: string;   // "Ing. Andrea Pérez, Mg."
  grupo: string;         // "Comisión de Eventos Académicos" o "Unidad de Titulación"
  carrera: string;       // "Ingeniería de Software"
  institutionalUnitType?: "ACADEMIC" | "ADMINISTRATIVE";
  institutionalUnitId?: string;
  careerId?: string;
  templateConfiguration?: {
    templateId?: string;
    configVersion?: string;
    sectionOrder: string[];
    activeSectionIds: string[];
    capturedAt: string;
  };
  periodo: string;       // "Julio – Diciembre 2026"
  unidadAcademica: string; // "Facultad de Ingeniería en Sistemas, Electrónica e Industrial"
  elaborador: {
    id?: string;
    nombre: string;
    cargo: string;
    email: string;
  };
  // Campos específicos para Plan de Trabajo (T1)
  justificacion?: string;
  objetivo?: string;
  matriz?: ActividadMatrizDoc[];
  // Campos específicos para Informe (T2)
  informeData?: InformeDataDoc;
  tieneAnexos: "si" | "no" | null;
  anexos: AnexoDoc[];
  signatures: DocumentSignature[];
  signatureSlots?: { role: string; pageIndex: number; pageNumber?: number; stageId?: string; label: string; action: string; }[];
  historialCambios?: HistorialCambioFila[];
}

export interface FlowStageNode {
  destinationName?: string;
  destinationType?: string;
  approvalGroup?: string;
  approvalRule?: "TODOS DEBEN APROBAR" | "AL MENOS UNO";
  actionMode?: "SIGN_AND_APPROVE" | "APPROVE_ONLY";
  id: string;
  actorId?: string;
  stageName: string; // "ETAPA 1 — Elaboración", "ETAPA 2 — Revisión", "ETAPA 3 — Validación final"
  subLevelName?: string; // "Nivel 1 — Revisión técnica", "Nivel 2 — Coordinación"
  actorName: string;
  actorCargo: string;
  actorRole: "docente" | "revisor" | "validador";
  estado: "PENDIENTE" | "FIRMADO" | "APROBADO" | "DEVUELTO" | "EN_CURSO";
  signature?: DocumentSignature;
  actionLabel?: "ELABORADO_POR" | "REVISADO_POR" | "VALIDADO_POR" | "APROBADO_POR";
}

export interface DocumentMasterState {
  draftCreatedAt?: string;
  id: string;
  teacherId: string;
  groupId: string;
  periodId: string;
  codigo: string;
  codigoFormatoOficial?: "UTA-SGC-A-2-1-P7-T1" | "UTA-SGC-A-2-1-P7-T2" | string;
  nombre: string;
  documentType: DocumentType;
  grupo: string;
  carrera?: string;
  periodo: string;
  formalVersion: string;
  reviewRound: number;
  documentState: DocumentState;
  operationalState?: "EN EJECUCIÓN" | "FINALIZADO";
  finalActionLabel?: "VALIDADO_POR" | "APROBADO_POR";
  finalValidatorId?: string;
  finalValidatorName?: string;
  currentArtifact: DocumentArtifact;
  signedArtifact?: DocumentArtifact;
  artifactHistory: DocumentArtifact[];
  observations: DocumentObservation[];
  flowStages: FlowStageNode[];
  workflowHistory?: { reviewRound: number; stages: FlowStageNode[]; fecha: string }[];
  fechaUltimaActualizacion: string;
  mensajeDevolucion?: string;
  returnedByUserId?: string;
  returnedByName?: string;
  returnedAt?: string;
  documentoRelacionadoId?: string;
  documentoRelacionadoTitulo?: string;
}


