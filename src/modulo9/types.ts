// Módulo 9 — Tipos e interfaces de Reportes, Históricos y Cierre de Período

export type EstadoPeriodo = "ACTIVO" | "CERRADO";

export type EstadoPlanReporte =
  | "BORRADOR"
  | "EN REVISIÓN"
  | "DEVUELTO"
  | "EN CORRECCIÓN"
  | "EN EJECUCIÓN"
  | "APROBADO"
  | "CUMPLIDO"
  | "FINALIZADO";

export type FormatoReporte = "PDF" | "Excel";

export type TipoReporteGenerar =
  | "resumen_plan"
  | "actividades_evidencias"
  | "historial_validacion";

export interface ReporteActividadItem {
  id: string;
  numero?: number;
  nombre: string;
  categoria: string;
  criterio?: string;
  desde: string;
  hasta: string;
  mediosTotal: number;
  evidenciasRequeridas?: number;
  mediosCargados: number;
  mediosValidados: number;
  mediosObservados: number;
  mediosPendientes: number;
  estadoDocumental: "EVIDENCIA VALIDADA" | "VALIDACIÓN PENDIENTE" | "OBSERVADA" | "PENDIENTE DE CARGA";
  estadoValidacion?: "VALIDADA" | "OBSERVADA" | "PENDIENTE";
  observaciones?: string;
}

export interface ReportePlanItem {
  id: string;
  codigo?: string;
  nombre: string;
  grupo: string;
  nombreGrupo?: string;
  docente: string;
  docenteNombre?: string;
  periodo: string;
  version: string;
  estado: EstadoPlanReporte | string;
  actividadesTotal: number;
  totalActividades?: number;
  actividadesCompletas: number; // aquellas con todos los medios cargados
  evidenciasRequeridas: number;
  evidenciasCargadas: number;
  evidenciasValidadas: number;
  evidenciasObservadas: number;
  evidenciasPendientes: number;
  fechaElaboracion?: string;
  fechaModificacion?: string;
  actividades?: ReporteActividadItem[];
}

export interface EvidenciaHistoricaItem {
  id: string;
  nombre: string;
  tipo?: string;
  descripcion?: string;
  version: string;
  archivoNombre: string;
  archivoTamano: string;
  tamano?: string;
  fechaCarga: string;
  cargadoPor: string;
  estado: "VALIDADA" | "OBSERVADA" | "PLAZO VENCIDO";
  validadoPor?: string;
  validador?: string;
  fechaValidacion?: string;
  observacionesHistoricas?: {
    texto: string;
    fechaHora: string;
    revisor: string;
    versionEvaluada: string;
  }[];
}

export interface VersionPlanHistorico {
  version: string; // "1.0", "2.0"
  fecha: string;
  fechaAprobacion?: string;
  origen: string; // e.g. "Elaboración inicial", "Actualización formal de cronograma institucional"
  motivo?: string;
  resolucion?: string;
  aprobadoPor?: string;
  descripcion: string;
  esVersionVigente?: boolean;
  cambiosEstructurales?: string[];
  cambios?: {
    campo: string;
    v1: string;
    v2: string;
  }[];
}

export interface HistorialEventoItem {
  id: string;
  fecha: string;
  usuario: string;
  evento: string;
  detalle: string;
}

export interface PlanHistorico {
  id: string;
  codigo?: string;
  periodo: string;
  grupo: string;
  nombreGrupo?: string;
  docente: string;
  docenteNombre?: string;
  planNombre: string;
  versionVigente: string;
  versionFinal?: string;
  estadoFinal: "FINALIZADO";
  estado?: string;
  fechaElaboracion: string;
  fechaCierre?: string;
  resolucionAprobacion?: string;
  actividadesTotal: number;
  totalActividades?: number;
  evidenciasRequeridas: number;
  evidenciasCargadas?: number;
  evidenciasValidadas: number;
  evidenciasObservadasHistoricas: number;
  versiones: VersionPlanHistorico[];
  actividades: {
    id: string;
    numero?: number;
    nombre: string;
    categoria: string;
    criterio?: string;
    desde: string;
    hasta: string;
    evidenciasRequeridas?: number;
    estado: "EVIDENCIAS COMPLETAS" | "CUMPLIDA";
    medios: EvidenciaHistoricaItem[];
  }[];
  evidencias?: EvidenciaHistoricaItem[];
  historialEventos?: HistorialEventoItem[];
  trazabilidadId?: string;
}

export interface PeriodoResumenCierre {
  id: string;
  nombre: string;
  periodo?: string;
  estado: EstadoPeriodo;
  totalPlanes?: number;
  planesTotal: number;
  planesFinalizados: number;
  planesEnEjecucion: number;
  actividadesTotal: number;
  evidenciasRequeridas: number;
  evidenciasCargadas: number;
  evidenciasValidadas: number;
  evidenciasObservadas: number;
  evidenciasPendientes: number;
  fechaCierre?: string;
  cerradoPor?: string;
}

export interface FiltrosReportes {
  periodo: string;
  grupo: string;
  docente: string;
  plan: string;
  estado: string;
  busqueda: string;
}
