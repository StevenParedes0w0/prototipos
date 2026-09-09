export type EstadoActividad = "PENDIENTE" | "EN CURSO" | "EVIDENCIAS COMPLETAS" | "VENCIDA";
export type EstadoEvidencia = "PENDIENTE" | "CARGADA" | "PLAZO VENCIDO";

export interface VersionArchivoEvidencia {
  version: number;
  nombreArchivo: string;
  tamano: string;
  fechaCarga: string;
  cargadoPor: string;
  vigente: boolean;
  motivoReemplazo?: string;
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
}

export interface ActividadEjecucion {
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
  recursos: string[];
  medios: MedioVerificacion[];
  estado: EstadoActividad;
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
