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

export interface DocumentObservation {
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

export interface InformeDataDoc {
  introduccion: string;
  desarrollo: string;
  resultados: string;
  observaciones?: string;
  documentoRelacionado?: string;
}

export interface DocumentArtifact {
  id: string;
  documentType: DocumentType;
  titulo?: string;
  formalVersion: string; // e.g. "1.0"
  reviewRound: number;   // e.g. 1, 2, 3
  pageCount: number;     // e.g. 3, 4 (o N páginas dinámicas)
  generatedAt: string;   // e.g. "07/09/2026 09:30"
  generatedBy: string;   // "Ing. Andrea Pérez, Mg."
  grupo: string;         // "Comisión de Eventos Académicos" o "Unidad de Titulación"
  periodo: string;       // "Julio – Diciembre 2026"
  unidadAcademica: string; // "FISEI – UTA"
  elaborador: {
    id?: string;
    nombre: string;
    cargo: string;
    email: string;
  };
  // Campos específicos para Plan de Trabajo
  justificacion?: string;
  objetivo?: string;
  matriz?: ActividadMatrizDoc[];
  // Campos específicos para Informe
  informeData?: InformeDataDoc;
  tieneAnexos: "si" | "no" | null;
  anexos: AnexoDoc[];
  signatures: DocumentSignature[];
}

export interface FlowStageNode {
  id: string;
  actorId?: string;
  stageName: string; // "ETAPA 1 — Elaboración", "ETAPA 2 — Revisión", "ETAPA 3 — Validación final"
  subLevelName?: string; // "Nivel 1 — Revisión técnica", "Nivel 2 — Coordinación"
  actorName: string;
  actorCargo: string;
  actorRole: "docente" | "revisor" | "validador";
  estado: "PENDIENTE" | "FIRMADO" | "APROBADO" | "DEVUELTO" | "EN_CURSO";
  signature?: DocumentSignature;
}

export interface DocumentMasterState {
  id: string;
  codigo: string;
  nombre: string;
  documentType: DocumentType;
  grupo: string;
  periodo: string;
  formalVersion: string;
  reviewRound: number;
  documentState: DocumentState;
  operationalState?: "EN EJECUCIÓN" | "FINALIZADO";
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


