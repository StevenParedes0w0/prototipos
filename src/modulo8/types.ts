// Módulo 8 — Tipos de Notificaciones, Auditoría y Trazabilidad Institucional

export type DestinatarioRol = "Docente" | "Revisor" | "Administrador";

export type TipoNotificacion =
  | "PLAN_DEVUELTO"
  | "PLAN_APROBADO"
  | "PLAN_PENDIENTE_REVISION"
  | "PLAN_CORREGIDO"
  | "ACTIVIDAD_PROXIMA"
  | "ACTIVIDAD_VENCE_HOY"
  | "PLAZO_VENCIDO"
  | "EVIDENCIA_CARGADA"
  | "EVIDENCIA_REEMPLAZADA"
  | "EVIDENCIA_OBSERVADA"
  | "EVIDENCIA_VALIDADA"
  | "ADMIN_GRUPO_SIN_FLUJO"
  | "ADMIN_PERIODO_PREPARADO"
  | "ADMIN_CATALOGO_ACTUALIZADO";

export interface ObjetoRelacionadoNotificacion {
  tipo: "Plan de Trabajo" | "Evidencia" | "Actividad" | "Configuración";
  nombre: string;
  grupo?: string;
  autor?: string;
  accionLabel: string;
  accionDestino: string; // View id: "planes", "evidencias", "actividades", "evidenciasValidar", "bandeja", "adminFlujos", "adminPeriodos", "adminCatalogos"
  actividadId?: string;
  medioId?: string;
  modalDirecto?: "observacion" | "visor" | "obsPlan" | "revisionPlan";
}

export interface NotificacionItem {
  id: string;
  destinatarioRol: DestinatarioRol;
  destinatarioUsuarioId: string; // "docente-andrea", "revisor-carlos", "admin-laura"
  titulo: string;
  mensaje: string;
  fechaHora: string; // DD/MM/AAAA — HH:mm (e.g. 07/09/2026 — 09:35)
  tiempoRelativo: string; // "Hace 15 min", "Hace 1 h", "Ayer", etc.
  tipo: TipoNotificacion;
  leida: boolean;
  objetoRelacionado: ObjetoRelacionadoNotificacion;
}

export type ModuloAuditoria =
  | "Planes de Trabajo"
  | "Actividades"
  | "Evidencias"
  | "Usuarios"
  | "Grupos"
  | "Períodos"
  | "Catálogos"
  | "Flujos"
  | "Feriados"
  | "Plantillas"
  | "Administración";

export type TipoEventoAuditoria =
  | "Creación"
  | "Modificación"
  | "Envío"
  | "Revisión"
  | "Devolución"
  | "Aprobación"
  | "Firma"
  | "Carga"
  | "Reemplazo"
  | "Observación"
  | "Validación"
  | "Activación"
  | "Desactivación"
  | "Asignación"
  | "Cambio de configuración";

export interface AuditoriaEvento {
  id: string;
  fechaHora: string; // "07/09/2026 — 10:35"
  fecha: string; // "07/09/2026"
  hora: string; // "10:35"
  usuario: string; // "Ing. Andrea Pérez, Mg."
  rol: "Docente" | "Revisor" | "Administrador";
  modulo: ModuloAuditoria;
  accion: string; // "REEMPLAZÓ EVIDENCIA", "VALIDÓ EVIDENCIA", etc.
  tipoEvento: TipoEventoAuditoria;
  objeto: string; // "Acta — v2.0"
  grupo: string; // "Unidad de Titulación"
  periodo: string; // "Julio – Diciembre 2026"
  descripcion: string;
  estadoAnterior?: string;
  estadoPosterior?: string;
  objetoId?: string;
  tipoObjeto?: "Plan" | "Evidencia" | "Actividad" | "Usuario" | "Configuracion";
  firmaElectronicaInfo?: {
    firmante: string;
    documento: string;
    fechaHora: string;
  };
}

export interface TrazabilidadHito {
  id: string;
  fechaHora: string;
  usuario: string;
  rol: string;
  hito: string;
  detalle: string;
  badge?: string;
  badgeColor?: { bg: string; text: string; border: string };
  version?: string;
}

export interface TrazabilidadObjeto {
  id: string;
  tipo: "Plan" | "Evidencia" | "Usuario";
  titulo: string;
  subtitulo: string;
  hitos: TrazabilidadHito[];
}
