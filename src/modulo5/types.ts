export type EstadoActividad = "PENDIENTE" | "EN CURSO" | "EVIDENCIAS COMPLETAS" | "VENCIDA";
export type EstadoEvidencia = "PENDIENTE" | "CARGADA" | "PENDIENTE DE VALIDACIÓN" | "VALIDADA" | "OBSERVADA" | "PLAZO VENCIDO";

export interface EventoAuditoria {
  id: string;
  tipo: "CARGA" | "REEMPLAZO" | "VALIDACION" | "OBSERVACION";
  titulo: string;
  descripcion?: string;
  usuario: string;
  fecha: string;
  hora: string;
  version: number;
  observacionTexto?: string;
}

export interface VersionArchivoEvidencia {
  url?: string;
  version: number;
  nombreArchivo: string;
  tamano: string;
  fechaCarga: string;
  cargadoPor: string;
  vigente: boolean;
  motivoReemplazo?: string;
  estadoRevision?: "PENDIENTE DE VALIDACIÓN" | "VALIDADA" | "OBSERVADA";
  revisadoPor?: string;
  fechaRevision?: string;
  observacion?: string;
}

export interface MedioVerificacion {
  id: string;
  nombre: string;
  descripcion?: string;
  estado: EstadoEvidencia;
  archivoVigente?: {
    nombre: string;
    tamano: string;
    fechaCarga: string;
    cargadoPor: string;
    url?: string;
  };
  historialVersiones: VersionArchivoEvidencia[];
  estadoValidacion?: "PENDIENTE DE VALIDACIÓN" | "VALIDADA" | "OBSERVADA";
  revisionActual?: {
    revisadoPor: string;
    fechaRevision: string;
    observacion?: string;
  };
  eventosAuditoria?: EventoAuditoria[];
}

export interface ActividadEjecucion {
  planId?: string;
  planVersion?: string;
  docenteElaborador?: string;
  sourceActivityId?: number;
  soloLectura?: boolean;
  id: string;
  nombre: string;
  categoria: string; // e.g. "POA", "Plan de Mejoras"
  tipo: "obligatoria" | "opcional";
  planNombre: string;
  grupo: string;
  periodo: string;
  desde: string; // "DD/MM/YYYY"
  hasta: string; // "DD/MM/YYYY"
  fechaLimiteExacta: string; // e.g. "18/09/2026 — 23:59"
  responsables: string[];
  responsableIds?: string[];
  recursos: string[];
  medios: MedioVerificacion[];
  estado: EstadoActividad;
}

export interface ArchivoEvidenciaInput {
  nombre: string;
  tamano: string;
  url?: string;
  sizeBytes?: number;
}

export interface FiltrosActividades {
  periodo: string;
  plan: string;
  grupo: string;
  estado: string;
  busqueda: string;
}

export interface FiltrosEvidencias {
  periodo: string;
  plan: string;
  grupo: string;
  estado: string;
  medio: string;
  busqueda: string;
}
