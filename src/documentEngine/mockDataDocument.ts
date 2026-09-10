// ─── Mock Data inicial para el Motor Documental FISEI ─────────────────────────
import { ActividadMatrizDoc, DocumentArtifact, DocumentMasterState, FlowStageNode } from "./types";

export const FECHA_SISTEMA = "07/09/2026";

export const MATRIZ_INICIAL_DOC: ActividadMatrizDoc[] = [
  {
    id: 1,
    nombre: "Elaboración de cronograma de eventos académicos del período",
    desde: "08/09/2026",
    hasta: "20/09/2026",
    responsables: ["Ing. Andrea Pérez, Mg."],
    recursos: ["Laboratorios FISEI", "Plataforma Virtual UTA"],
    medios: ["Cronograma oficial aprobado en PDF"],
  },
  {
    id: 2,
    nombre: "Coordinación y gestión de ponentes para conferencias magistrales",
    desde: "21/09/2026",
    hasta: "15/10/2026",
    responsables: ["Ing. Andrea Pérez, Mg."],
    recursos: ["Auditorio FISEI", "Equipo audiovisual"],
    medios: ["Cartas de invitación y confirmación de ponentes"],
  },
  {
    id: 3,
    nombre: "Revisión técnica de proyectos de grado para jornada científica",
    desde: "16/10/2026",
    hasta: "05/11/2026",
    responsables: ["Ing. Andrea Pérez, Mg.", "Ing. Carlos López, Mg."],
    recursos: ["Aulas de posgrado", "Repositorio digital"],
    medios: ["Actas de evaluación de proyectos"],
  },
  {
    id: 4,
    nombre: "Ejecución de la Semana Técnica de Software e Innovación",
    desde: "06/11/2026",
    hasta: "20/11/2026",
    responsables: ["Ing. Andrea Pérez, Mg."],
    recursos: ["Campus Huachi", "Salas de cómputo"],
    medios: ["Registro de asistencia y fotografías del evento"],
  },
  {
    id: 5,
    nombre: "Informe final de resultados y evaluación de eventos del período",
    desde: "21/11/2026",
    hasta: "15/12/2026",
    responsables: ["Ing. Andrea Pérez, Mg."],
    recursos: ["Sistema de Gestión FISEI"],
    medios: ["Informe final de actividades firmado electrónicamente"],
  },
];

export const JUSTIFICACION_INICIAL =
  "La Comisión de Eventos Académicos de la FISEI desarrolla actividades orientadas al fortalecimiento del intercambio científico, actualización tecnológica y vinculación académica de estudiantes y docentes. Durante el período Julio – Diciembre 2026 se requiere coordinar eventos institucionales de impacto, conferencias magistrales y la Semana Técnica de Software para responder a los estándares de acreditación y calidad educativa de la Universidad Técnica de Ambato.";

export const OBJETIVO_INICIAL =
  "Planificar, coordinar y ejecutar los eventos académicos y científicos de la FISEI durante el período Julio – Diciembre 2026, asegurando la participación de ponentes calificados y el cumplimiento de los cronogramas institucionales aprobados.";

export const FLOW_STAGES_INICIAL: FlowStageNode[] = [
  {
    id: "stage-1",
    actorId: "usr-andrea-01",
    stageName: "ETAPA 1 — Elaboración",
    actorName: "Ing. Andrea Pérez, Mg.",
    actorCargo: "Docente elaborador",
    actorRole: "docente",
    estado: "PENDIENTE",
  },
  {
    id: "stage-2",
    actorId: "usr-carlos-02",
    stageName: "ETAPA 2 — Revisión",
    subLevelName: "Nivel 1 — Revisión técnica",
    actorName: "Ing. Carlos López, Mg.",
    actorCargo: "Responsable de revisión técnica",
    actorRole: "revisor",
    estado: "PENDIENTE",
  },
  {
    id: "stage-3",
    actorId: "usr-patricia-03",
    stageName: "ETAPA 3 — Validación final",
    subLevelName: "Validación y Aprobación",
    actorName: "Ing. Patricia Salazar, Mg.",
    actorCargo: "Coordinadora de Comisión / Autoridad",
    actorRole: "validador",
    estado: "PENDIENTE",
  },
];

export const INITIAL_ARTIFACT: DocumentArtifact = {
  id: "art-plan-fisei-v1-r1",
  documentType: "PLAN_TRABAJO",
  titulo: "Plan de Trabajo: Comisión de Eventos Académicos",
  formalVersion: "1.0",
  reviewRound: 1,
  pageCount: 4,
  generatedAt: "07/09/2026 09:15",
  generatedBy: "Ing. Andrea Pérez, Mg.",
  grupo: "Comisión de Eventos Académicos",
  periodo: "Julio – Diciembre 2026",
  unidadAcademica: "FISEI – UTA",
  elaborador: {
    id: "usr-andrea-01",
    nombre: "Ing. Andrea Pérez, Mg.",
    cargo: "Docente elaborador",
    email: "andrea.perez@uta.edu.ec",
  },
  justificacion: JUSTIFICACION_INICIAL,
  objetivo: OBJETIVO_INICIAL,
  matriz: MATRIZ_INICIAL_DOC,
  tieneAnexos: "si",
  anexos: [
    {
      id: 1,
      nombre: "Propuesta temática y cronograma detallado de ponencias",
      archivo: "cronograma_detallado_2026.pdf",
      tamano: "1.2 MB",
    },
  ],
  signatures: [],
};

export const OBSERVACIONES_INICIALES_EVENTOS = [
  {
    id: 1,
    documentoId: "doc-plan-eventos-2026",
    formalVersion: "1.0",
    ronda: 1,
    pagina: 2,
    revisor: "Ing. Carlos López, Mg.",
    cargo: "Responsable de revisión técnica",
    fecha: "06/09/2026 11:20",
    texto: "Ajustar el cronograma y recursos en la sección de ponencias magistrales para evitar solapamiento con exámenes.",
    estado: "activa" as const,
    tipo: "seccion" as const,
    seccion: "Actividad 2 — Coordinación de ponentes",
  },
  {
    id: 2,
    documentoId: "doc-plan-eventos-2026",
    formalVersion: "1.0",
    ronda: 1,
    pagina: 3,
    revisor: "Ing. Carlos López, Mg.",
    cargo: "Responsable de revisión técnica",
    fecha: "06/09/2026 11:25",
    texto: "Especificar medios de verificación definitivos para la Semana Técnica antes de reenviar.",
    estado: "activa" as const,
    tipo: "seccion" as const,
    seccion: "Actividad 4 — Semana Técnica",
  },
];

export const INITIAL_ARTIFACT_EVENTOS_CORRECCION: DocumentArtifact = {
  ...INITIAL_ARTIFACT,
  signatures: [
    {
      actorId: "usr-andrea-01",
      actor: "Ing. Andrea Pérez, Mg.",
      cargo: "Docente elaborador",
      role: "docente",
      fecha: "05/09/2026",
      hora: "23:41",
      ubicacion: "Página 4 — Firmas de Responsabilidad: Elaborado por",
    },
  ],
};

export const INITIAL_DOCUMENT_MASTER: DocumentMasterState = {
  id: "doc-plan-eventos-2026",
  codigo: "PT-FISEI-2026-004",
  nombre: "Plan de Trabajo: Comisión de Eventos Académicos",
  documentType: "PLAN_TRABAJO",
  grupo: "Comisión de Eventos Académicos",
  periodo: "Julio – Diciembre 2026",
  formalVersion: "1.0",
  reviewRound: 1,
  documentState: "EN CORRECCIÓN",
  finalValidatorId: "usr-patricia-03",
  finalValidatorName: "Ing. Patricia Salazar, Mg.",
  currentArtifact: INITIAL_ARTIFACT_EVENTOS_CORRECCION,
  artifactHistory: [],
  observations: OBSERVACIONES_INICIALES_EVENTOS,
  flowStages: [
    {
      id: "stage-1",
      actorId: "usr-andrea-01",
      stageName: "ETAPA 1 — Elaboración",
      actorName: "Ing. Andrea Pérez, Mg.",
      actorCargo: "Docente elaborador",
      actorRole: "docente",
      estado: "FIRMADO",
    },
    {
      id: "stage-2",
      actorId: "usr-carlos-02",
      stageName: "ETAPA 2 — Revisión",
      subLevelName: "Nivel 1 — Revisión técnica",
      actorName: "Ing. Carlos López, Mg.",
      actorCargo: "Responsable de revisión técnica",
      actorRole: "revisor",
      estado: "DEVUELTO",
    },
    {
      id: "stage-3",
      actorId: "usr-patricia-03",
      stageName: "ETAPA 3 — Validación final",
      subLevelName: "Validación y Aprobación",
      actorName: "Ing. Patricia Salazar, Mg.",
      actorCargo: "Coordinadora de Comisión / Autoridad",
      actorRole: "validador",
      estado: "PENDIENTE",
    },
  ],
  fechaUltimaActualizacion: "06/09/2026 11:30",
  mensajeDevolucion:
    "Ajustar el cronograma y recursos en la sección de ponencias magistrales, y especificar medios de verificación definitivos antes de reenviar.",
};

export const INITIAL_INFORME_ARTIFACT: DocumentArtifact = {
  id: "art-inf-titulacion-v1-r1",
  documentType: "INFORME",
  titulo: "Informe de seguimiento de actividades de titulación",
  formalVersion: "1.0",
  reviewRound: 1,
  pageCount: 3,
  generatedAt: "07/09/2026 10:00",
  generatedBy: "Ing. Andrea Pérez, Mg.",
  grupo: "Unidad de Titulación",
  periodo: "Julio – Diciembre 2026",
  unidadAcademica: "FISEI – UTA",
  elaborador: {
    id: "usr-andrea-01",
    nombre: "Ing. Andrea Pérez, Mg.",
    cargo: "Docente elaborador",
    email: "andrea.perez@uta.edu.ec",
  },
  informeData: {
    introduccion: "El presente informe institucional detalla el avance y resultados de las jornadas técnicas y procesos de seguimiento curricular en la Unidad de Titulación durante el período Julio – Diciembre 2026.",
    desarrollo: "Se realizaron revisiones periódicas de los proyectos de grado, talleres de actualización metodológica y coordinación con los tribunales de sustentación para asegurar el cumplimiento del cronograma académico institucional.",
    resultados: "Se registró la aprobación de anteproyectos con cumplimiento de los estándares de calidad académica y vinculación con líneas de investigación de la FISEI.",
    observaciones: "Se recomienda mantener la articulación con los laboratorios de cómputo para futuras convocatorias.",
    documentoRelacionado: "Plan de Trabajo — Unidad de Titulación — Versión 1.0",
  },
  tieneAnexos: "si",
  anexos: [
    {
      id: 1,
      nombre: "Registro de avance y actas de seguimiento de titulación",
      archivo: "actas_seguimiento_titulacion_2026.pdf",
      tamano: "850 KB",
    },
  ],
  signatures: [],
};

export const INITIAL_INFORME_MASTER: DocumentMasterState = {
  id: "doc-inf-titulacion-2026",
  codigo: "INF-FISEI-2026-012",
  nombre: "Informe de seguimiento de actividades de titulación",
  documentType: "INFORME",
  grupo: "Unidad de Titulación",
  periodo: "Julio – Diciembre 2026",
  formalVersion: "1.0",
  reviewRound: 1,
  documentState: "BORRADOR",
  finalValidatorId: "usr-patricia-03",
  finalValidatorName: "Ing. Patricia Salazar, Mg.",
  currentArtifact: INITIAL_INFORME_ARTIFACT,
  artifactHistory: [],
  observations: [],
  flowStages: FLOW_STAGES_INICIAL,
  fechaUltimaActualizacion: "07/09/2026 10:00",
  documentoRelacionadoId: "doc-plan-titulacion-2026",
  documentoRelacionadoTitulo: "Plan de Trabajo — Unidad de Titulación — Versión 1.0",
};

export const INITIAL_PLAN_TITULACION_MASTER: DocumentMasterState = {
  id: "doc-plan-titulacion-2026",
  codigo: "PT-FISEI-2026-001",
  nombre: "Plan de Trabajo: Unidad de Titulación",
  documentType: "PLAN_TRABAJO",
  grupo: "Unidad de Titulación",
  periodo: "Julio – Diciembre 2026",
  formalVersion: "1.0",
  reviewRound: 1,
  documentState: "VALIDADO",
  operationalState: "EN EJECUCIÓN",
  finalValidatorId: "usr-patricia-03",
  finalValidatorName: "Ing. Patricia Salazar, Mg.",
  currentArtifact: {
    ...INITIAL_ARTIFACT,
    id: "art-plan-titulacion-v1",
    titulo: "Plan de Trabajo: Unidad de Titulación",
    grupo: "Unidad de Titulación",
    signatures: [
      {
        actorId: "usr-andrea-01",
        actor: "Ing. Andrea Pérez, Mg.",
        cargo: "Docente elaborador",
        role: "docente",
        fecha: "05/09/2026",
        hora: "09:00",
        ubicacion: "Página 4 — Firmas de Responsabilidad: Elaborado por",
      },
      {
        actorId: "usr-carlos-02",
        actor: "Ing. Carlos López, Mg.",
        cargo: "Responsable de revisión técnica",
        role: "revisor",
        fecha: "06/09/2026",
        hora: "10:30",
        ubicacion: "Página 4 — Firmas de Responsabilidad: Revisado por",
      },
      {
        actorId: "usr-patricia-03",
        actor: "Ing. Patricia Salazar, Mg.",
        cargo: "Coordinadora de Comisión / Autoridad",
        role: "validador",
        fecha: "06/09/2026",
        hora: "15:00",
        ubicacion: "Página 4 — Firmas de Responsabilidad: Validado por",
      },
    ],
  },
  artifactHistory: [],
  observations: [],
  flowStages: [
    {
      id: "stage-1",
      actorId: "usr-andrea-01",
      stageName: "ETAPA 1 — Elaboración",
      actorName: "Ing. Andrea Pérez, Mg.",
      actorCargo: "Docente elaborador",
      actorRole: "docente",
      estado: "FIRMADO",
    },
    {
      id: "stage-2",
      actorId: "usr-carlos-02",
      stageName: "ETAPA 2 — Revisión",
      subLevelName: "Nivel 1 — Revisión técnica",
      actorName: "Ing. Carlos López, Mg.",
      actorCargo: "Responsable de revisión técnica",
      actorRole: "revisor",
      estado: "APROBADO",
    },
    {
      id: "stage-3",
      actorId: "usr-patricia-03",
      stageName: "ETAPA 3 — Validación final",
      subLevelName: "Validación y Aprobación",
      actorName: "Ing. Patricia Salazar, Mg.",
      actorCargo: "Coordinadora de Comisión / Autoridad",
      actorRole: "validador",
      estado: "FIRMADO",
    },
  ],
  fechaUltimaActualizacion: "06/09/2026 15:00",
};

export const INITIAL_DOCUMENTS_LIST: DocumentMasterState[] = [
  INITIAL_PLAN_TITULACION_MASTER,
  INITIAL_DOCUMENT_MASTER,
  INITIAL_INFORME_MASTER,
];



