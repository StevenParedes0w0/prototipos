// Módulo 7 — Tipos de Administración y Configuración Institucional

export type RolSistema = "Docente" | "Revisor" | "Docente / Revisor" | "Administrador";

export type EstadoUsuario = "ACTIVO" | "INACTIVO";

export type RolEnGrupo = "Miembro" | "Coordinador" | "Otro";

export interface PertenenciaGrupo {
  grupoId: string;
  grupoNombre: string;
  rolEnGrupo: RolEnGrupo;
}

export interface UsuarioAdmin {
  id: string;
  nombres: string;
  apellidos: string;
  nombreCompleto: string;
  correo: string;
  rol: RolSistema;
  estado: EstadoUsuario;
  ultimoAcceso: string;
  grupos: PertenenciaGrupo[];
}

export type TipoGrupoInstitucional = "Comisión" | "Unidad" | "Club" | "Coordinación" | "Otro";

export interface ActividadEnGrupo {
  id: string;
  actividadId: string;
  nombre: string;
  categoria: "POA" | "Plan de Mejoras" | "Acción de Mejora" | "Otra";
  obligatoriedad: "OBLIGATORIA" | "OPCIONAL";
  estado: "ACTIVO" | "INACTIVO";
}

export interface GrupoInstitucional {
  id: string;
  nombre: string;
  tipo: TipoGrupoInstitucional;
  descripcion: string;
  estado: "ACTIVO" | "INACTIVO";
  flujoConfigurado: boolean;
  miembros: Array<{
    usuarioId: string;
    nombreCompleto: string;
    correo: string;
    rolEnGrupo: RolEnGrupo;
  }>;
  actividades: ActividadEnGrupo[];
}

export interface PeriodoAcademico {
  id: string;
  nombre: string;
  desde: string; // YYYY-MM-DD
  hasta: string; // YYYY-MM-DD
  ventanaElaboracionDesde: string;
  ventanaElaboracionHasta: string;
  ventanaRevisionDesde: string;
  ventanaRevisionHasta: string;
  estado: "ACTIVO" | "CERRADO" | "BORRADOR";
}

export interface ActividadCatalogo {
  id: string;
  nombre: string;
  descripcion: string;
  categoria: "POA" | "Plan de Mejoras" | "Acción de Mejora" | "Otra";
  gruposAsociadosNombres: string[];
  estado: "ACTIVO" | "INACTIVO";
}

export interface RecursoCatalogo {
  id: string;
  nombre: string;
  descripcion: string;
  estado: "ACTIVO" | "INACTIVO";
  enUsoHistorico?: boolean;
}

export interface MedioVerificacionCatalogo {
  id: string;
  nombre: string;
  descripcion: string;
  formatoRequerido: string; // "1 archivo PDF"
  estado: "ACTIVO" | "INACTIVO";
  enUsoHistorico?: boolean;
}

export interface EtapaFlujo {
  destinatarioNombre?: string;
  actionMode?: "SIGN_AND_APPROVE" | "APPROVE_ONLY";
  id: string;
  numero: number;
  nombre: string; // "Elaboración", "Revisión", "Coordinación", "Validación final"
  descripcion: string;
  tipoResponsable: "Elaborador" | "Revisores" | "Coordinador" | "Autoridad";
  revisoresIds?: string[];
  revisoresNombres?: string[];
  reglaAprobacion?: "TODOS DEBEN APROBAR" | "AL MENOS UNO";
}

export interface FlujoGrupo {
  grupoId: string;
  grupoNombre: string;
  estado: "CONFIGURADO" | "PENDIENTE";
  etapas: EtapaFlujo[];
}

export interface FeriadoItem {
  id: string;
  fecha: string; // YYYY-MM-DD
  descripcion: string;
  tipo: "Feriado nacional" | "Feriado local" | "Receso institucional";
  estado: "ACTIVO" | "INACTIVO";
}

export interface PlantillaDocumental {
  id: string;
  nombre: string;
  tipoDocumento: string;
  version: string;
  estado: "ACTIVA" | "DEMO" | "INACTIVA";
  ultimaActualizacion: string;
  secciones: string[];
  configuracion: PlantillaSeccionConfig[];
}

export type TipoUnidadInstitucional = "ACADEMIC" | "ADMINISTRATIVE";

export interface CarreraInstitucional {
  id: string;
  nombre: string;
  estado: "ACTIVO" | "INACTIVO";
}

export interface UnidadInstitucional {
  id: string;
  nombre: string;
  tipo: TipoUnidadInstitucional;
  estado: "ACTIVO" | "INACTIVO";
  carreras: CarreraInstitucional[];
}

export interface PlantillaSeccionConfig {
  id: string;
  titulo: string;
  estado: "REQUERIDA" | "OPCIONAL" | "CONDICIONAL";
  activa: boolean;
  bloqueada: boolean;
  detalle: string;
}
