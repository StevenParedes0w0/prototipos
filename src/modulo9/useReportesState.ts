// Módulo 9 — Hook de Estado para Reportes, Históricos y Cierre de Período
import { useState, useMemo } from "react";
import {
  ReportePlanItem,
  PlanHistorico,
  PeriodoResumenCierre,
  FiltrosReportes,
  TipoReporteGenerar,
  FormatoReporte,
} from "./types";
import {
  REPORTES_PLANES_ACTUALES,
  PLANES_HISTORICOS_DEMO,
  PERIODOS_INICIALES,
} from "./mockDataReportes";

const FILTROS_INICIALES: FiltrosReportes = {
  periodo: "Julio – Diciembre 2026",
  grupo: "",
  docente: "",
  plan: "",
  estado: "",
  busqueda: "",
};

export function useReportesState(userRole: "docente" | "revisor" | "admin" = "docente") {
  const [planesActuales] = useState<ReportePlanItem[]>(REPORTES_PLANES_ACTUALES);
  const [planesHistoricos] = useState<PlanHistorico[]>(PLANES_HISTORICOS_DEMO);
  const [periodos, setPeriodos] = useState<PeriodoResumenCierre[]>(PERIODOS_INICIALES);
  const [filtros, setFiltros] = useState<FiltrosReportes>(FILTROS_INICIALES);

  // Navegación interna dentro de reportes
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [selectedHistoricoId, setSelectedHistoricoId] = useState<string | null>(null);
  const [subView, setSubView] = useState<"resumen" | "detalle" | "historico" | "detalleHistorico">("resumen");

  // Modales
  const [modalGenerarOpen, setModalGenerarOpen] = useState(false);
  const [modalVistaPreviaOpen, setModalVistaPreviaOpen] = useState(false);
  const [planParaReporte, setPlanParaReporte] = useState<ReportePlanItem | null>(null);
  const [configReporteGenerado, setConfigReporteGenerado] = useState<{
    plan: ReportePlanItem;
    tipo: TipoReporteGenerar;
    formato: FormatoReporte;
  } | null>(null);

  const [modalCompararVersionesOpen, setModalCompararVersionesOpen] = useState(false);
  const [modalConfirmarCierreOpen, setModalConfirmarCierreOpen] = useState(false);
  const [periodoParaCierre, setPeriodoParaCierre] = useState<PeriodoResumenCierre | null>(null);

  // Manejo de filtros
  const setFiltro = (campo: keyof FiltrosReportes, valor: string) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }));
  };

  const limpiarFiltros = () => {
    setFiltros(FILTROS_INICIALES);
  };

  // Filtrado según el rol
  const planesPorRol = useMemo(() => {
    if (userRole === "docente") {
      return planesActuales.filter(p => p.docente.includes("Andrea Pérez"));
    }
    if (userRole === "revisor") {
      // Carlos López solo tiene asignada la "Unidad de Titulación"
      return planesActuales.filter(p => p.grupo === "Unidad de Titulación");
    }
    // Administrador: todos los grupos
    return planesActuales;
  }, [planesActuales, userRole]);

  // Filtrado reactivo de planes actuales
  const planesFiltrados = useMemo(() => {
    return planesPorRol.filter(p => {
      if (filtros.periodo && p.periodo !== filtros.periodo) return false;
      if (filtros.grupo && p.grupo !== filtros.grupo) return false;
      if (filtros.docente && !p.docente.toLowerCase().includes(filtros.docente.toLowerCase())) return false;
      if (filtros.estado && p.estado !== filtros.estado) return false;
      if (filtros.busqueda.trim()) {
        const q = filtros.busqueda.toLowerCase();
        const match =
          p.nombre.toLowerCase().includes(q) ||
          p.grupo.toLowerCase().includes(q) ||
          p.docente.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [planesPorRol, filtros]);

  // Planes históricos accesibles para Consulta Histórica institucional
  const historicosFiltrados = useMemo(() => {
    // En la Consulta Histórica institucional DEMO, se proveen todos los planes cerrados
    // disponibles para auditoría y consulta. ConsultaHistoricaView gestiona internamente
    // el filtrado por período cerrado seleccionado y término de búsqueda.
    return planesHistoricos;
  }, [planesHistoricos]);

  // Plan actual seleccionado para detalle
  const selectedPlan = useMemo(() => {
    return planesActuales.find(p => p.id === selectedPlanId) || null;
  }, [planesActuales, selectedPlanId]);

  // Plan histórico seleccionado
  const selectedHistorico = useMemo(() => {
    return planesHistoricos.find(p => p.id === selectedHistoricoId) || null;
  }, [planesHistoricos, selectedHistoricoId]);

  // Acción: Iniciar generación de reporte (abre modal selector)
  const handleOpenGenerarReporte = (plan: ReportePlanItem) => {
    setPlanParaReporte(plan);
    setModalGenerarOpen(true);
  };

  // Acción: Confirmar generación y abrir vista previa A4
  const handleConfirmGenerar = (tipo: TipoReporteGenerar, formato: FormatoReporte) => {
    if (!planParaReporte) return;
    setConfigReporteGenerado({
      plan: planParaReporte,
      tipo,
      formato,
    });
    setModalGenerarOpen(false);
    setModalVistaPreviaOpen(true);
  };

  // Acción: Cierre administrativo simulado de período (Admin)
  const handleCerrarPeriodo = (periodoId: string) => {
    setPeriodos(prev =>
      prev.map(per => {
        if (per.id === periodoId) {
          return {
            ...per,
            estado: "CERRADO",
            fechaCierre: "Simulación DEMO",
            cerradoPor: "Simulación Administrativa — DEMO",
            planesFinalizados: per.planesTotal,
            planesEnEjecucion: 0,
          };
        }
        return per;
      })
    );
    setModalConfirmarCierreOpen(false);
    setPeriodoParaCierre(null);
  };

  // Acción: Restablecer escenario DEMO a estado inicial
  const handleRestablecerDemo = () => {
    setPeriodos(PERIODOS_INICIALES);
    setPeriodoParaCierre(null);
    setModalConfirmarCierreOpen(false);
  };

  return {
    filtros,
    setFiltro,
    limpiarFiltros,
    planesFiltrados,
    historicosFiltrados,
    selectedPlan,
    setSelectedPlanId,
    selectedHistorico,
    setSelectedHistoricoId,
    subView,
    setSubView,
    // Modales de reporte
    modalGenerarOpen,
    setModalGenerarOpen,
    modalVistaPreviaOpen,
    setModalVistaPreviaOpen,
    planParaReporte,
    configReporteGenerado,
    handleOpenGenerarReporte,
    handleConfirmGenerar,
    // Comparación de versiones
    modalCompararVersionesOpen,
    setModalCompararVersionesOpen,
    // Cierre de períodos
    periodos,
    modalConfirmarCierreOpen,
    setModalConfirmarCierreOpen,
    periodoParaCierre,
    setPeriodoParaCierre,
    handleCerrarPeriodo,
    handleRestablecerDemo,
  };
}
