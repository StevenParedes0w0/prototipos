// Módulo 7 — Datos Mock para Administración y Configuración Institucional
import {
  UsuarioAdmin,
  GrupoInstitucional,
  PeriodoAcademico,
  ActividadCatalogo,
  RecursoCatalogo,
  MedioVerificacionCatalogo,
  FlujoGrupo,
  FeriadoItem,
  PlantillaDocumental,
} from "./types";

export const USUARIO_ADMIN_DEMO = {
  nombre: "Ing. Laura Medina, Mg.",
  nombreCorto: "Laura Medina",
  correo: "laura.medina@uta.edu.ec",
  avatar: "LM",
  rol: "Administrador",
};

export const USUARIOS_ADMIN_INICIALES: UsuarioAdmin[] = [
  {
    id: "usr-1",
    nombres: "Andrea Estefanía",
    apellidos: "Pérez Gómez",
    nombreCompleto: "Ing. Andrea Pérez, Mg.",
    correo: "andrea.perez@uta.edu.ec",
    rol: "Docente",
    estado: "ACTIVO",
    ultimoAcceso: "07/09/2026 — 10:14",
    grupos: [
      {
        grupoId: "grp-1",
        grupoNombre: "Unidad de Titulación",
        rolEnGrupo: "Miembro",
      },
      {
        grupoId: "grp-2",
        grupoNombre: "Comisión de Eventos Académicos",
        rolEnGrupo: "Miembro",
      },
    ],
  },
  {
    id: "usr-2",
    nombres: "Carlos Alberto",
    apellidos: "López Mendoza",
    nombreCompleto: "Ing. Carlos López, Mg.",
    correo: "carlos.lopez@uta.edu.ec",
    rol: "Docente / Revisor",
    estado: "ACTIVO",
    ultimoAcceso: "07/09/2026 — 11:30",
    grupos: [
      {
        grupoId: "grp-1",
        grupoNombre: "Unidad de Titulación",
        rolEnGrupo: "Coordinador",
      },
      {
        grupoId: "grp-4",
        grupoNombre: "Comisión de Vinculación con la Sociedad",
        rolEnGrupo: "Miembro",
      },
    ],
  },
  {
    id: "usr-3",
    nombres: "Patricia María",
    apellidos: "Salazar Ortiz",
    nombreCompleto: "Ing. Patricia Salazar, Mg.",
    correo: "patricia.salazar@uta.edu.ec",
    rol: "Revisor",
    estado: "ACTIVO",
    ultimoAcceso: "06/09/2026 — 16:45",
    grupos: [
      {
        grupoId: "grp-1",
        grupoNombre: "Unidad de Titulación",
        rolEnGrupo: "Miembro",
      },
    ],
  },
  {
    id: "usr-4",
    nombres: "Roberto Javier",
    apellidos: "Vega Morales",
    nombreCompleto: "Ing. Roberto Vega, Mg.",
    correo: "roberto.vega@uta.edu.ec",
    rol: "Docente",
    estado: "INACTIVO",
    ultimoAcceso: "14/06/2026 — 09:20",
    grupos: [
      {
        grupoId: "grp-2",
        grupoNombre: "Comisión de Eventos Académicos",
        rolEnGrupo: "Miembro",
      },
    ],
  },
  {
    id: "usr-5",
    nombres: "Laura Beatriz",
    apellidos: "Medina Suárez",
    nombreCompleto: "Ing. Laura Medina, Mg.",
    correo: "laura.medina@uta.edu.ec",
    rol: "Administrador",
    estado: "ACTIVO",
    ultimoAcceso: "07/09/2026 — 08:00",
    grupos: [],
  },
];

export const GRUPOS_ADMIN_INICIALES: GrupoInstitucional[] = [
  {
    id: "grp-1",
    nombre: "Unidad de Titulación",
    tipo: "Unidad",
    descripcion: "Gestión institucional y seguimiento académico de trabajos de integración curricular y titulación FISEI.",
    estado: "ACTIVO",
    flujoConfigurado: true,
    miembros: [
      {
        usuarioId: "usr-1",
        nombreCompleto: "Ing. Andrea Pérez, Mg.",
        correo: "andrea.perez@uta.edu.ec",
        rolEnGrupo: "Miembro",
      },
      {
        usuarioId: "usr-2",
        nombreCompleto: "Ing. Carlos López, Mg.",
        correo: "carlos.lopez@uta.edu.ec",
        rolEnGrupo: "Coordinador",
      },
      {
        usuarioId: "usr-3",
        nombreCompleto: "Ing. Patricia Salazar, Mg.",
        correo: "patricia.salazar@uta.edu.ec",
        rolEnGrupo: "Miembro",
      },
    ],
    actividades: [
      {
        id: "ag-1",
        actividadId: "act-cat-1",
        nombre: "Seguimiento al avance de trabajos de titulación",
        categoria: "POA",
        obligatoriedad: "OBLIGATORIA",
        estado: "ACTIVO",
      },
      {
        id: "ag-2",
        actividadId: "act-cat-2",
        nombre: "Difusión de normativa interna de titulación",
        categoria: "Plan de Mejoras",
        obligatoriedad: "OBLIGATORIA",
        estado: "ACTIVO",
      },
      {
        id: "ag-3",
        actividadId: "act-cat-3",
        nombre: "Consolidación del banco de reactivos",
        categoria: "POA",
        obligatoriedad: "OPCIONAL",
        estado: "ACTIVO",
      },
    ],
  },
  {
    id: "grp-2",
    nombre: "Comisión de Eventos Académicos",
    tipo: "Comisión",
    descripcion: "Organización de simposios, jornadas científicas, congresos y webinars de la facultad.",
    estado: "ACTIVO",
    flujoConfigurado: true,
    miembros: [
      {
        usuarioId: "usr-1",
        nombreCompleto: "Ing. Andrea Pérez, Mg.",
        correo: "andrea.perez@uta.edu.ec",
        rolEnGrupo: "Miembro",
      },
      {
        usuarioId: "usr-4",
        nombreCompleto: "Ing. Roberto Vega, Mg.",
        correo: "roberto.vega@uta.edu.ec",
        rolEnGrupo: "Miembro",
      },
    ],
    actividades: [
      {
        id: "ag-4",
        actividadId: "act-cat-4",
        nombre: "Talleres y jornadas de actualización docente",
        categoria: "Acción de Mejora",
        obligatoriedad: "OBLIGATORIA",
        estado: "ACTIVO",
      },
    ],
  },
  {
    id: "grp-3",
    nombre: "Club Académico de Software",
    tipo: "Club",
    descripcion: "Fomento al desarrollo tecnológico, hackathons y semilleros de programación competitiva.",
    estado: "ACTIVO",
    flujoConfigurado: false,
    miembros: [
      {
        usuarioId: "usr-1",
        nombreCompleto: "Ing. Andrea Pérez, Mg.",
        correo: "andrea.perez@uta.edu.ec",
        rolEnGrupo: "Miembro",
      },
    ],
    actividades: [
      {
        id: "ag-5",
        actividadId: "act-cat-5",
        nombre: "Competencias internas de programación universitaria",
        categoria: "POA",
        obligatoriedad: "OPCIONAL",
        estado: "ACTIVO",
      },
    ],
  },
  {
    id: "grp-4",
    nombre: "Comisión de Vinculación con la Sociedad",
    tipo: "Comisión",
    descripcion: "Proyectos comunitarios y transferencia de conocimiento hacia sectores productivos.",
    estado: "ACTIVO",
    flujoConfigurado: true,
    miembros: [
      {
        usuarioId: "usr-2",
        nombreCompleto: "Ing. Carlos López, Mg.",
        correo: "carlos.lopez@uta.edu.ec",
        rolEnGrupo: "Miembro",
      },
    ],
    actividades: [],
  },
];

export const PERIODOS_ADMIN_INICIALES: PeriodoAcademico[] = [
  {
    id: "per-1",
    nombre: "Julio – Diciembre 2026",
    desde: "2026-07-01",
    hasta: "2026-12-31",
    ventanaElaboracionDesde: "2026-07-01",
    ventanaElaboracionHasta: "2026-07-20",
    ventanaRevisionDesde: "2026-07-21",
    ventanaRevisionHasta: "2026-08-05",
    estado: "ACTIVO",
  },
  {
    id: "per-2",
    nombre: "Enero – Junio 2026",
    desde: "2026-01-05",
    hasta: "2026-06-30",
    ventanaElaboracionDesde: "2026-01-05",
    ventanaElaboracionHasta: "2026-01-25",
    ventanaRevisionDesde: "2026-01-26",
    ventanaRevisionHasta: "2026-02-10",
    estado: "CERRADO",
  },
];

export const ACTIVIDADES_CATALOGO_INICIALES: ActividadCatalogo[] = [
  {
    id: "act-cat-1",
    nombre: "Seguimiento al avance de trabajos de titulación",
    descripcion: "Supervisión metodológica y técnica de los proyectos de titulación de grado.",
    categoria: "POA",
    gruposAsociadosNombres: ["Unidad de Titulación"],
    estado: "ACTIVO",
  },
  {
    id: "act-cat-2",
    nombre: "Difusión de normativa interna de titulación",
    descripcion: "Jornadas de socialización de guías y formatos aprobados para los estudiantes.",
    categoria: "Plan de Mejoras",
    gruposAsociadosNombres: ["Unidad de Titulación"],
    estado: "ACTIVO",
  },
  {
    id: "act-cat-3",
    nombre: "Consolidación del banco de reactivos",
    descripcion: "Construcción y revisión de preguntas para el examen complexivo de fin de carrera.",
    categoria: "POA",
    gruposAsociadosNombres: ["Unidad de Titulación"],
    estado: "ACTIVO",
  },
  {
    id: "act-cat-4",
    nombre: "Talleres y jornadas de actualización docente",
    descripcion: "Capacitación en metodologías activas y herramientas digitales docentes.",
    categoria: "Acción de Mejora",
    gruposAsociadosNombres: ["Comisión de Eventos Académicos"],
    estado: "ACTIVO",
  },
  {
    id: "act-cat-5",
    nombre: "Competencias internas de programación universitaria",
    descripcion: "Hackathon intersemestral de ingeniería de software y algoritmia.",
    categoria: "POA",
    gruposAsociadosNombres: ["Club Académico de Software"],
    estado: "ACTIVO",
  },
];

export const RECURSOS_CATALOGO_INICIALES: RecursoCatalogo[] = [
  { id: "rec-1", nombre: "Matriz de seguimiento", descripcion: "Hoja de control de avance semanal institucional", estado: "ACTIVO", enUsoHistorico: true },
  { id: "rec-2", nombre: "Almacenamiento institucional", descripcion: "Repositorio institucional en la nube universitaria", estado: "ACTIVO", enUsoHistorico: true },
  { id: "rec-3", nombre: "Reglamento de titulación", descripcion: "Normativa vigente del régimen académico", estado: "ACTIVO", enUsoHistorico: true },
  { id: "rec-4", nombre: "Sistema de gestión académica", descripcion: "Plataforma integrada de registro de notas y asistencias", estado: "ACTIVO", enUsoHistorico: true },
  { id: "rec-5", nombre: "Sala de reuniones", descripcion: "Espacio físico equipado para deliberación y sustentaciones", estado: "ACTIVO", enUsoHistorico: true },
  { id: "rec-6", nombre: "Equipos de cómputo", descripcion: "Estaciones de trabajo de laboratorio para análisis de datos", estado: "ACTIVO", enUsoHistorico: true },
];

export const MEDIOS_CATALOGO_INICIALES: MedioVerificacionCatalogo[] = [
  { id: "med-1", nombre: "Informe", descripcion: "Documento técnico descriptivo del cumplimiento de metas", formatoRequerido: "1 archivo PDF", estado: "ACTIVO", enUsoHistorico: true },
  { id: "med-2", nombre: "Acta", descripcion: "Registro formal de resoluciones tomadas en sesión", formatoRequerido: "1 archivo PDF", estado: "ACTIVO", enUsoHistorico: true },
  { id: "med-3", nombre: "Oficio", descripcion: "Comunicación oficial dirigida a decanato o dependencias", formatoRequerido: "1 archivo PDF", estado: "ACTIVO", enUsoHistorico: true },
  { id: "med-4", nombre: "Resolución", descripcion: "Disposición normativa o directiva de consejo directivo", formatoRequerido: "1 archivo PDF", estado: "ACTIVO", enUsoHistorico: true },
  { id: "med-5", nombre: "Registro fotográfico", descripcion: "Evidencia visual fechada de la ejecución de actividades", formatoRequerido: "1 archivo PDF", estado: "ACTIVO", enUsoHistorico: true },
  { id: "med-6", nombre: "Certificado", descripcion: "Constancia de participación o aval emitida por autoridad", formatoRequerido: "1 archivo PDF", estado: "ACTIVO", enUsoHistorico: true },
];

export const FLUJOS_INICIALES: FlujoGrupo[] = [
  {
    grupoId: "grp-1",
    grupoNombre: "Unidad de Titulación",
    estado: "CONFIGURADO",
    etapas: [
      {
        id: "etp-1",
        numero: 1,
        nombre: "Elaboración",
        descripcion: "El docente elabora el plan de trabajo con sus actividades y medios de verificación.",
        tipoResponsable: "Elaborador",
      },
      {
        id: "etp-2",
        numero: 2,
        nombre: "Revisión",
        descripcion: "Revisión técnica de fondo por los revisores designados para el grupo.",
        tipoResponsable: "Revisores",
        revisoresIds: ["usr-2", "usr-3"],
        revisoresNombres: ["Ing. Carlos López, Mg.", "Ing. Patricia Salazar, Mg."],
        reglaAprobacion: "TODOS DEBEN APROBAR",
      },
      {
        id: "etp-3",
        numero: 3,
        nombre: "Coordinación",
        descripcion: "Visto bueno del coordinador del grupo o carrera.",
        tipoResponsable: "Coordinador",
        revisoresIds: ["usr-2"],
        revisoresNombres: ["Ing. Carlos López, Mg."],
      },
      {
        id: "etp-4",
        numero: 4,
        nombre: "Validación final",
        descripcion: "Validación final por la autoridad configurada para este grupo.",
        tipoResponsable: "Autoridad",
        revisoresNombres: ["Autoridad correspondiente"],
      },
    ],
  },
  {
    grupoId: "grp-2",
    grupoNombre: "Comisión de Eventos Académicos",
    estado: "CONFIGURADO",
    etapas: [
      {
        id: "etp-21",
        numero: 1,
        nombre: "Elaboración",
        descripcion: "Elaboración de la planificación de eventos del período.",
        tipoResponsable: "Elaborador",
      },
      {
        id: "etp-22",
        numero: 2,
        nombre: "Revisión",
        descripcion: "Revisión por pares de la comisión.",
        tipoResponsable: "Revisores",
        revisoresIds: ["usr-2"],
        revisoresNombres: ["Ing. Carlos López, Mg."],
        reglaAprobacion: "TODOS DEBEN APROBAR",
      },
      {
        id: "etp-23",
        numero: 3,
        nombre: "Validación final",
        descripcion: "Validación final por la autoridad institucional correspondiente.",
        tipoResponsable: "Autoridad",
        revisoresNombres: ["Autoridad correspondiente"],
      },
    ],
  },
];

export const FERIADOS_INICIALES: FeriadoItem[] = [
  {
    id: "fer-1",
    fecha: "2026-10-09",
    descripcion: "Independencia de Guayaquil",
    tipo: "Feriado nacional",
    estado: "ACTIVO",
  },
  {
    id: "fer-2",
    fecha: "2026-11-02",
    descripcion: "Día de los Difuntos",
    tipo: "Feriado nacional",
    estado: "ACTIVO",
  },
  {
    id: "fer-3",
    fecha: "2026-11-03",
    descripcion: "Independencia de Cuenca",
    tipo: "Feriado nacional",
    estado: "ACTIVO",
  },
  {
    id: "fer-4",
    fecha: "2026-11-12",
    descripcion: "Independencia de Ambato",
    tipo: "Feriado local",
    estado: "ACTIVO",
  },
  {
    id: "fer-5",
    fecha: "2026-12-25",
    descripcion: "Navidad",
    tipo: "Feriado nacional",
    estado: "ACTIVO",
  },
];

export const PLANTILLAS_INICIALES: PlantillaDocumental[] = [
  {
    id: "plt-1",
    nombre: "Plan de Trabajo institucional",
    tipoDocumento: "Plan de Trabajo",
    version: "1.0 — DEMO",
    estado: "ACTIVA",
    ultimaActualizacion: "01/07/2026",
    secciones: [
      "1. Información institucional / Información general (REQUERIDA)",
      "2. Justificación (REQUERIDA)",
      "3. Objetivo (REQUERIDO)",
      "4. Matriz de actividades (REQUERIDA: Actividad, Desde, Hasta, Responsable(s), Recursos, Medios de verificación)",
      "5. Anexos (OPCIONAL)",
      "6. FIRMAS DE RESPONSABILIDAD (REQUERIDA)",
      "7. CONTROL DE HISTORIAL DE CAMBIOS (REQUERIDO: Versión, Descripción del Cambio, Fecha de Actualización)",
    ],
  },
  {
    id: "plt-2",
    nombre: "Informe de seguimiento",
    tipoDocumento: "Informe Periódico",
    version: "1.0 — DEMO",
    estado: "DEMO",
    ultimaActualizacion: "15/06/2026",
    secciones: [
      "1. Datos informativos",
      "2. Resumen de ejecución",
      "3. Detalle de actividades cumplidas",
      "4. Conclusiones y recomendaciones",
    ],
  },
  {
    id: "plt-3",
    nombre: "Reporte institucional",
    tipoDocumento: "Reporte Consolidado",
    version: "1.0 — DEMO",
    estado: "DEMO",
    ultimaActualizacion: "10/05/2026",
    secciones: [
      "1. Alcance institucional",
      "2. Estadísticas de cumplimiento",
      "3. Observaciones y validaciones",
    ],
  },
];
