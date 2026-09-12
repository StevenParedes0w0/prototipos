// ─── Motor Documental: Tipos y Modelos Institucionales ────────────────────────

export interface ActividadMatrizDoc {
  id: number;
  nombre: string;
  desde: string;
  hasta: string;
  responsables: string[];
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
  id: number;
  documentoId: string;
  formalVersion: string;
  ronda: number;
  pagina: number;
  revisor: string;
  cargo?: string;
  fecha: string;
  texto: string;
  estado: "activa" | "resuelta" | "historica";
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

export interface DocumentPage {
  id: string;
  type: string;
  signatureSlots?: {
    stageId?: string;
    userId?: string;
    action?: string;
    role?: string;
    label?: string;
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
  generatedAt: string;   // e.g. "07/09/2026 09:30"
  generatedBy: string;   // "Ing. Andrea Pérez, Mg."
  grupo: string;         // "Comisión de Eventos Académicos" o "Unidad de Titulación"
  carrera: string;       // "Ingeniería de Software"
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
  artifactHistory: DocumentArtifact[];
  observations: DocumentObservation[];
  flowStages: FlowStageNode[];
  fechaUltimaActualizacion: string;
  mensajeDevolucion?: string;
  documentoRelacionadoId?: string;
  documentoRelacionadoTitulo?: string;
}


