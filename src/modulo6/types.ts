import { ActividadEjecucion, MedioVerificacion, EstadoEvidencia, EventoAuditoria } from "../modulo5/types";

export interface ItemEvidenciaRevisor {
  actividadId: string;
  actividadNombre: string;
  planNombre: string;
  grupo: string;
  docente: string;
  responsables: string[];
  recursos: string[];
  desde: string;
  hasta: string;
  medioId: string;
  medioNombre: string;
  archivoNombre: string;
  archivoTamano: string;
  version: number;
  fechaCarga: string;
  fechaLimite: string;
  estado: EstadoEvidencia;
  observacionActual?: string;
  revisadoPor?: string;
  fechaRevision?: string;
  medio: MedioVerificacion;
  actividad: ActividadEjecucion;
}

export interface FiltrosBandejaRevisor {
  periodo: string;
  grupo: string;
  docente: string;
  plan: string;
  actividad: string;
  medio: string;
  estado: string;
  busqueda: string;
}

export interface ResumenBandejaRevisor {
  pendientes: number;
  validadasHoy: number;
  observadas: number;
  totalRevisadas: number;
}

export interface FiltrosSeguimiento {
  periodo: string;
  grupo: string;
  docente: string;
  plan: string;
  estado: string;
  busqueda: string;
}

export interface ItemSeguimientoPlan {
  planId: string;
  planNombre: string;
  docente: string;
  grupo: string;
  periodo: string;
  version: string;
  actividadesTotales: number;
  actividadesCompletas: number;
  actividadesEnCurso: number;
  actividadesPendientes: number;
  actividadesVencidas: number;
  evidenciasRequeridas: number;
  evidenciasCargadas: number;
  evidenciasValidadas: number;
  evidenciasObservadas: number;
  evidenciasPendientesCarga: number;
  actividades: ActividadEjecucion[];
}

export interface ResumenSeguimientoGlobal {
  planesEnEjecucion: number;
  actividadesEnCurso: number;
  actividadesVencidas: number;
  evidenciasPendientesValidacion: number;
  evidenciasObservadas: number;
  evidenciasValidadas: number;
}
