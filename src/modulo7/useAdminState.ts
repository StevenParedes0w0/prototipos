// Módulo 7 — Hook de Estado de Administración y Configuración Institucional
import { useState, useCallback, useEffect } from "react";
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
  RolEnGrupo,
  TipoGrupoInstitucional,
  RolSistema,
  EtapaFlujo,
  UnidadInstitucional,
  TipoUnidadInstitucional,
  PlantillaSeccionConfig,
} from "./types";
import {
  USUARIOS_ADMIN_INICIALES,
  GRUPOS_ADMIN_INICIALES,
  PERIODOS_ADMIN_INICIALES,
  ACTIVIDADES_CATALOGO_INICIALES,
  RECURSOS_CATALOGO_INICIALES,
  MEDIOS_CATALOGO_INICIALES,
  FLUJOS_INICIALES,
  FERIADOS_INICIALES,
  PLANTILLAS_INICIALES,
  UNIDADES_INSTITUCIONALES_INICIALES,
} from "./mockDataAdmin";

const ADMIN_DEMO_STORAGE_KEY = "fisei_admin_configuration_v2";

function readDemoConfiguration(): { unidades: UnidadInstitucional[]; plantillas: PlantillaDocumental[] } {
  try {
    const parsed = JSON.parse(localStorage.getItem(ADMIN_DEMO_STORAGE_KEY) || "null");
    if (parsed && Array.isArray(parsed.unidades) && Array.isArray(parsed.plantillas) && parsed.plantillas.every((p: PlantillaDocumental) => Array.isArray(p.configuracion))) {
      return {
        unidades: parsed.unidades,
        plantillas: parsed.plantillas.map((plantilla: PlantillaDocumental) => ({
          ...plantilla,
          configuracion: plantilla.configuracion.map(section => ({
            ...section,
            bloqueada: section.id === "header" || section.id === "footer",
            activa: section.estado === "REQUERIDA" ? true : section.activa,
          })),
        })),
      };
    }
  } catch { /* La configuración DEMO dañada se restablece con los fixtures. */ }
  return { unidades: structuredClone(UNIDADES_INSTITUCIONALES_INICIALES), plantillas: structuredClone(PLANTILLAS_INICIALES) };
}

export function useAdminState() {
  const initialConfiguration = useState(readDemoConfiguration)[0];
  const [usuarios, setUsuarios] = useState<UsuarioAdmin[]>(USUARIOS_ADMIN_INICIALES);
  const [grupos, setGrupos] = useState<GrupoInstitucional[]>(GRUPOS_ADMIN_INICIALES);
  const [periodos, setPeriodos] = useState<PeriodoAcademico[]>(PERIODOS_ADMIN_INICIALES);
  const [actividadesCatalogo, setActividadesCatalogo] = useState<ActividadCatalogo[]>(ACTIVIDADES_CATALOGO_INICIALES);
  const [recursos, setRecursos] = useState<RecursoCatalogo[]>(RECURSOS_CATALOGO_INICIALES);
  const [medios, setMedios] = useState<MedioVerificacionCatalogo[]>(MEDIOS_CATALOGO_INICIALES);
  const [flujos, setFlujos] = useState<FlujoGrupo[]>(FLUJOS_INICIALES);
  const [feriados, setFeriados] = useState<FeriadoItem[]>(FERIADOS_INICIALES);
  const [plantillas, setPlantillas] = useState<PlantillaDocumental[]>(initialConfiguration.plantillas);
  const [unidadesInstitucionales, setUnidadesInstitucionales] = useState<UnidadInstitucional[]>(initialConfiguration.unidades);

  useEffect(() => {
    try { localStorage.setItem(ADMIN_DEMO_STORAGE_KEY, JSON.stringify({ unidades: unidadesInstitucionales, plantillas })); } catch { /* El estado de sesión sigue disponible. */ }
  }, [unidadesInstitucionales, plantillas]);

  // ─── Gestión de Usuarios ──────────────────────────────────────────────────

  const toggleEstadoUsuario = useCallback((usuarioId: string) => {
    setUsuarios(prev => prev.map(u => {
      if (u.id !== usuarioId) return u;
      return { ...u, estado: u.estado === "ACTIVO" ? "INACTIVO" : "ACTIVO" };
    }));
  }, []);

  const crearUsuario = useCallback((data: {
    nombres: string;
    apellidos: string;
    correo: string;
    rol: RolSistema;
  }): { success: boolean; error?: string } => {
    if (!data.correo || !data.correo.includes("@uta.edu.ec")) {
      return { success: false, error: "El correo institucional debe ser válido (@uta.edu.ec)." };
    }
    if (!data.nombres.trim() || !data.apellidos.trim()) {
      return { success: false, error: "Los nombres y apellidos son obligatorios." };
    }

    const nuevo: UsuarioAdmin = {
      id: `usr-${Date.now()}`,
      nombres: data.nombres.trim(),
      apellidos: data.apellidos.trim(),
      nombreCompleto: `Ing. ${data.nombres.trim().split(" ")[0]} ${data.apellidos.trim().split(" ")[0]}, Mg.`,
      correo: data.correo.trim().toLowerCase(),
      rol: data.rol,
      estado: "ACTIVO",
      ultimoAcceso: "Nunca",
      grupos: [],
    };

    setUsuarios(prev => [nuevo, ...prev]);
    return { success: true };
  }, []);

  const asignarUsuarioAGrupo = useCallback((usuarioId: string, grupoId: string, rolEnGrupo: RolEnGrupo) => {
    const grupo = grupos.find(g => g.id === grupoId);
    if (!grupo) return { success: false, error: "Grupo no encontrado." };

    const usuario = usuarios.find(u => u.id === usuarioId);
    if (!usuario) return { success: false, error: "Usuario no encontrado." };

    // Validación: no duplicar usuario dentro del mismo grupo
    if (usuario.grupos.some(g => g.grupoId === grupoId)) {
      return { success: false, error: "El usuario ya pertenece a este grupo institucional." };
    }

    // Actualizar usuario
    setUsuarios(prev => prev.map(u => {
      if (u.id !== usuarioId) return u;
      return {
        ...u,
        grupos: [...u.grupos, { grupoId, grupoNombre: grupo.nombre, rolEnGrupo }],
      };
    }));

    // Actualizar grupo
    setGrupos(prev => prev.map(g => {
      if (g.id !== grupoId) return g;
      return {
        ...g,
        miembros: [
          ...g.miembros,
          {
            usuarioId,
            nombreCompleto: usuario.nombreCompleto,
            correo: usuario.correo,
            rolEnGrupo,
          },
        ],
      };
    }));

    return { success: true };
  }, [grupos, usuarios]);

  const quitarUsuarioDeGrupo = useCallback((usuarioId: string, grupoId: string) => {
    setUsuarios(prev => prev.map(u => {
      if (u.id !== usuarioId) return u;
      return {
        ...u,
        grupos: u.grupos.filter(g => g.grupoId !== grupoId),
      };
    }));

    setGrupos(prev => prev.map(g => {
      if (g.id !== grupoId) return g;
      return {
        ...g,
        miembros: g.miembros.filter(m => m.usuarioId !== usuarioId),
      };
    }));
  }, []);

  // ─── Gestión de Grupos Institucionales ────────────────────────────────────

  const crearGrupo = useCallback((data: {
    nombre: string;
    tipo: TipoGrupoInstitucional;
    descripcion: string;
  }): { success: boolean; error?: string } => {
    if (!data.nombre.trim()) {
      return { success: false, error: "El nombre del grupo es obligatorio." };
    }

    const nuevo: GrupoInstitucional = {
      id: `grp-${Date.now()}`,
      nombre: data.nombre.trim(),
      tipo: data.tipo,
      descripcion: data.descripcion.trim(),
      estado: "ACTIVO",
      flujoConfigurado: false,
      miembros: [],
      actividades: [],
    };

    setGrupos(prev => [...prev, nuevo]);
    return { success: true };
  }, []);

  const toggleObligatoriedadActividadGrupo = useCallback((grupoId: string, actividadId: string) => {
    setGrupos(prev => prev.map(g => {
      if (g.id !== grupoId) return g;
      return {
        ...g,
        actividades: g.actividades.map(a => {
          if (a.id !== actividadId) return a;
          return {
            ...a,
            obligatoriedad: a.obligatoriedad === "OBLIGATORIA" ? "OPCIONAL" : "OBLIGATORIA",
          };
        }),
      };
    }));
  }, []);

  // ─── Gestión de Períodos Académicos ───────────────────────────────────────

  const crearPeriodo = useCallback((data: {
    nombre: string;
    desde: string;
    hasta: string;
    ventanaElaboracionDesde: string;
    ventanaElaboracionHasta: string;
    ventanaRevisionDesde: string;
    ventanaRevisionHasta: string;
  }): { success: boolean; error?: string } => {
    if (!data.nombre.trim()) return { success: false, error: "El nombre del período es obligatorio." };
    if (!data.desde || !data.hasta) return { success: false, error: "Las fechas de inicio y fin son obligatorias." };
    if (new Date(data.hasta) < new Date(data.desde)) {
      return { success: false, error: "La fecha 'Hasta' no puede ser anterior a la fecha 'Desde'." };
    }
    if (data.ventanaElaboracionDesde && data.ventanaElaboracionHasta) {
      if (new Date(data.ventanaElaboracionHasta) < new Date(data.ventanaElaboracionDesde)) {
        return { success: false, error: "En la ventana de elaboración, 'Hasta' no puede ser anterior a 'Desde'." };
      }
    }
    if (data.ventanaRevisionDesde && data.ventanaRevisionHasta) {
      if (new Date(data.ventanaRevisionHasta) < new Date(data.ventanaRevisionDesde)) {
        return { success: false, error: "En la ventana de revisión, 'Hasta' no puede ser anterior a 'Desde'." };
      }
    }

    const nuevo: PeriodoAcademico = {
      id: `per-${Date.now()}`,
      nombre: data.nombre.trim(),
      desde: data.desde,
      hasta: data.hasta,
      ventanaElaboracionDesde: data.ventanaElaboracionDesde,
      ventanaElaboracionHasta: data.ventanaElaboracionHasta,
      ventanaRevisionDesde: data.ventanaRevisionDesde,
      ventanaRevisionHasta: data.ventanaRevisionHasta,
      estado: "BORRADOR",
    };

    setPeriodos(prev => [nuevo, ...prev]);
    return { success: true };
  }, []);

  // ─── Gestión de Catálogos (Actividades, Recursos, Medios) ─────────────────

  const agregarActividadCatalogo = useCallback((data: {
    nombre: string;
    descripcion: string;
    categoria: "POA" | "Plan de Mejoras" | "Acción de Mejora" | "Otra";
  }): { success: boolean; error?: string } => {
    if (!data.nombre.trim()) return { success: false, error: "El nombre de la actividad es obligatorio." };
    const nuevo: ActividadCatalogo = {
      id: `act-cat-${Date.now()}`,
      nombre: data.nombre.trim(),
      descripcion: data.descripcion.trim(),
      categoria: data.categoria,
      gruposAsociadosNombres: [],
      estado: "ACTIVO",
    };
    setActividadesCatalogo(prev => [...prev, nuevo]);
    return { success: true };
  }, []);

  const agregarRecurso = useCallback((nombre: string, descripcion: string): { success: boolean; error?: string } => {
    if (!nombre.trim()) return { success: false, error: "El nombre del recurso es obligatorio." };
    const nuevo: RecursoCatalogo = {
      id: `rec-${Date.now()}`,
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      estado: "ACTIVO",
      enUsoHistorico: false,
    };
    setRecursos(prev => [...prev, nuevo]);
    return { success: true };
  }, []);

  const toggleEstadoRecurso = useCallback((id: string) => {
    setRecursos(prev => prev.map(r => r.id === id ? { ...r, estado: r.estado === "ACTIVO" ? "INACTIVO" : "ACTIVO" } : r));
  }, []);

  const agregarMedio = useCallback((nombre: string, descripcion: string): { success: boolean; error?: string } => {
    if (!nombre.trim()) return { success: false, error: "El nombre del medio es obligatorio." };
    const nuevo: MedioVerificacionCatalogo = {
      id: `med-${Date.now()}`,
      nombre: nombre.trim(),
      descripcion: descripcion.trim(),
      formatoRequerido: "1 archivo PDF",
      estado: "ACTIVO",
      enUsoHistorico: false,
    };
    setMedios(prev => [...prev, nuevo]);
    return { success: true };
  }, []);

  const toggleEstadoMedio = useCallback((id: string) => {
    setMedios(prev => prev.map(m => m.id === id ? { ...m, estado: m.estado === "ACTIVO" ? "INACTIVO" : "ACTIVO" } : m));
  }, []);

  // ─── Flujos de Aprobación ─────────────────────────────────────────────────

  const actualizarEtapasFlujo = useCallback((grupoId: string, etapas: EtapaFlujo[]) => {
    setFlujos(prev => prev.map(f => {
      if (f.grupoId !== grupoId) return f;
      return {
        ...f,
        estado: "CONFIGURADO",
        etapas,
      };
    }));
  }, []);

  // ─── Feriados ─────────────────────────────────────────────────────────────

  const agregarFeriado = useCallback((data: {
    fecha: string;
    descripcion: string;
    tipo: "Feriado nacional" | "Feriado local" | "Receso institucional";
  }): { success: boolean; error?: string } => {
    if (!data.fecha) return { success: false, error: "La fecha del feriado es obligatoria." };
    if (!data.descripcion.trim()) return { success: false, error: "La descripción del feriado es obligatoria." };

    const nuevo: FeriadoItem = {
      id: `fer-${Date.now()}`,
      fecha: data.fecha,
      descripcion: data.descripcion.trim(),
      tipo: data.tipo,
      estado: "ACTIVO",
    };
    setFeriados(prev => [...prev, nuevo]);
    return { success: true };
  }, []);

  const toggleEstadoFeriado = useCallback((id: string) => {
    setFeriados(prev => prev.map(f => f.id === id ? { ...f, estado: f.estado === "ACTIVO" ? "INACTIVO" : "ACTIVO" } : f));
  }, []);

  const establecerEstadoPeriodoDemo = useCallback((id: string, estado: PeriodoAcademico["estado"]) => {
    setPeriodos(prev => prev.map(periodo => periodo.id === id ? { ...periodo, estado } : periodo));
  }, []);

  const restablecerPeriodosDemo = useCallback(() => setPeriodos(structuredClone(PERIODOS_ADMIN_INICIALES)), []);

  const guardarUnidadInstitucional = useCallback((data: { id?: string; nombre: string; tipo: TipoUnidadInstitucional; carreras: string[] }) => {
    if (!data.nombre.trim()) return { success: false, error: "El nombre de la unidad es obligatorio." };
    if (data.tipo === "ACADEMIC" && !data.carreras.some(c => c.trim())) return { success: false, error: "La unidad académica requiere al menos una carrera." };
    const generatedId = data.id || `unit-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
    const carreras = data.tipo === "ACADEMIC" ? data.carreras.filter(Boolean).map((nombre, index) => ({ id: `${generatedId}-career-${index}`, nombre: nombre.trim(), estado: "ACTIVO" as const })) : [];
    if (data.id) setUnidadesInstitucionales(prev => prev.map(unit => unit.id === data.id ? { ...unit, nombre: data.nombre.trim(), tipo: data.tipo, carreras } : unit));
    else setUnidadesInstitucionales(prev => [...prev, { id: generatedId, nombre: data.nombre.trim(), tipo: data.tipo, estado: "ACTIVO", carreras }]);
    return { success: true };
  }, []);

  const toggleEstadoUnidadInstitucional = useCallback((id: string) => {
    setUnidadesInstitucionales(prev => prev.map(unit => unit.id === id ? { ...unit, estado: unit.estado === "ACTIVO" ? "INACTIVO" : "ACTIVO" } : unit));
  }, []);

  const guardarConfiguracionPlantilla = useCallback((plantillaId: string, configuracion: PlantillaSeccionConfig[]) => {
    setPlantillas(prev => prev.map(p => p.id === plantillaId ? { ...p, configuracion: structuredClone(configuracion), ultimaActualizacion: new Date().toLocaleDateString("es-EC") } : p));
  }, []);

  const restaurarConfiguracionPlantilla = useCallback((plantillaId: string) => {
    const original = PLANTILLAS_INICIALES.find(p => p.id === plantillaId);
    if (original) setPlantillas(prev => prev.map(p => p.id === plantillaId ? structuredClone(original) : p));
  }, []);

  const restablecerDemo = useCallback(() => {
    setUnidadesInstitucionales(structuredClone(UNIDADES_INSTITUCIONALES_INICIALES));
    setPlantillas(structuredClone(PLANTILLAS_INICIALES));
    try { localStorage.removeItem(ADMIN_DEMO_STORAGE_KEY); localStorage.removeItem("fisei-informe-draft-v2"); } catch {}
  }, []);

  return {
    usuarios,
    grupos,
    periodos,
    actividadesCatalogo,
    recursos,
    medios,
    flujos,
    feriados,
    plantillas,
    unidadesInstitucionales,
    // Actions
    toggleEstadoUsuario,
    crearUsuario,
    asignarUsuarioAGrupo,
    quitarUsuarioDeGrupo,
    crearGrupo,
    toggleObligatoriedadActividadGrupo,
    crearPeriodo,
    agregarActividadCatalogo,
    agregarRecurso,
    toggleEstadoRecurso,
    agregarMedio,
    toggleEstadoMedio,
    actualizarEtapasFlujo,
    agregarFeriado,
    toggleEstadoFeriado,
    establecerEstadoPeriodoDemo,
    restablecerPeriodosDemo,
    guardarUnidadInstitucional,
    toggleEstadoUnidadInstitucional,
    guardarConfiguracionPlantilla,
    restaurarConfiguracionPlantilla,
    restablecerDemo,
  };
}
