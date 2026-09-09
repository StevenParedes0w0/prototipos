// Módulo 8 — Hook de Estado para Auditoría y Trazabilidad Institucional
import { useState, useMemo } from "react";
import { AuditoriaEvento, ModuloAuditoria, TipoEventoAuditoria, TrazabilidadObjeto } from "./types";
import {
  AUDITORIA_EVENTOS_DEMO,
  TRAZABILIDAD_PLAN_EVENTOS,
  TRAZABILIDAD_EVIDENCIA_ACTA,
  TRAZABILIDAD_USUARIO_ANDREA,
} from "./mockDataAuditoria";

export interface FiltrosAuditoria {
  fechaDesde: string;
  fechaHasta: string;
  usuario: string;
  rol: string;
  modulo: string;
  tipoEvento: string;
  grupo: string;
  busqueda: string;
}

const FILTROS_INICIALES: FiltrosAuditoria = {
  fechaDesde: "",
  fechaHasta: "",
  usuario: "",
  rol: "",
  modulo: "",
  tipoEvento: "",
  grupo: "",
  busqueda: "",
};

export function useAuditoriaState() {
  const [eventos] = useState<AuditoriaEvento[]>(AUDITORIA_EVENTOS_DEMO);
  const [filtros, setFiltros] = useState<FiltrosAuditoria>(FILTROS_INICIALES);
  const [eventoSeleccionado, setEventoSeleccionado] = useState<AuditoriaEvento | null>(null);
  const [trazabilidadModal, setTrazabilidadModal] = useState<TrazabilidadObjeto | null>(null);

  // Actualizar un filtro individual
  const setFiltro = (campo: keyof FiltrosAuditoria, valor: string) => {
    setFiltros((prev) => ({ ...prev, [campo]: valor }));
  };

  // Limpiar todos los filtros
  const limpiarFiltros = () => {
    setFiltros(FILTROS_INICIALES);
  };

  // Filtrado reactivo en memoria
  const eventosFiltrados = useMemo(() => {
    return eventos.filter((ev) => {
      // Búsqueda general por texto (objeto, acción, descripción, usuario)
      if (filtros.busqueda.trim()) {
        const query = filtros.busqueda.toLowerCase();
        const coincide =
          ev.objeto.toLowerCase().includes(query) ||
          ev.accion.toLowerCase().includes(query) ||
          ev.usuario.toLowerCase().includes(query) ||
          ev.descripcion.toLowerCase().includes(query) ||
          ev.grupo.toLowerCase().includes(query);
        if (!coincide) return false;
      }

      // Filtro de Usuario
      if (filtros.usuario && !ev.usuario.toLowerCase().includes(filtros.usuario.toLowerCase())) {
        return false;
      }

      // Filtro de Rol
      if (filtros.rol && ev.rol !== filtros.rol) {
        return false;
      }

      // Filtro de Módulo
      if (filtros.modulo && ev.modulo !== filtros.modulo) {
        return false;
      }

      // Filtro de Tipo de evento
      if (filtros.tipoEvento && ev.tipoEvento !== filtros.tipoEvento) {
        return false;
      }

      // Filtro de Grupo
      if (filtros.grupo && !ev.grupo.toLowerCase().includes(filtros.grupo.toLowerCase())) {
        return false;
      }

      return true;
    });
  }, [eventos, filtros]);

  // Métricas calculadas para la fecha de referencia "07/09/2026"
  const metricas = useMemo(() => {
    const hoyEventos = eventos.filter((e) => e.fecha === "07/09/2026");
    const planesHoy = hoyEventos.filter((e) => e.modulo === "Planes de Trabajo").length;
    const evidenciasHoy = hoyEventos.filter((e) => e.modulo === "Evidencias").length;
    const adminHoy = hoyEventos.filter(
      (e) => e.modulo === "Administración" || e.modulo === "Usuarios" || e.modulo === "Períodos"
    ).length;

    return {
      eventosHoy: hoyEventos.length, // 18
      planesHoy,                    // 7
      evidenciasHoy,                // 8
      adminHoy,                     // 3
    };
  }, [eventos]);

  // Abrir trazabilidad según el objeto o tipo
  const abrirTrazabilidadPorId = (objetoId?: string, tipoObjeto?: string) => {
    if (objetoId === "plan-comision-eventos" || tipoObjeto === "Plan") {
      setTrazabilidadModal(TRAZABILIDAD_PLAN_EVENTOS);
    } else if (objetoId === "evidencia-acta-ut" || tipoObjeto === "Evidencia") {
      setTrazabilidadModal(TRAZABILIDAD_EVIDENCIA_ACTA);
    } else if (objetoId === "user-andrea" || tipoObjeto === "Usuario") {
      setTrazabilidadModal(TRAZABILIDAD_USUARIO_ANDREA);
    } else {
      // Default: fallback al plan de trabajo
      setTrazabilidadModal(TRAZABILIDAD_PLAN_EVENTOS);
    }
  };

  return {
    eventos: eventosFiltrados,
    totalEventosCount: eventos.length,
    filtros,
    setFiltro,
    limpiarFiltros,
    metricas,
    eventoSeleccionado,
    setEventoSeleccionado,
    trazabilidadModal,
    setTrazabilidadModal,
    abrirTrazabilidadPorId,
    // Objetos de trazabilidad predeterminados disponibles
    trazabilidadPlan: TRAZABILIDAD_PLAN_EVENTOS,
    trazabilidadEvidencia: TRAZABILIDAD_EVIDENCIA_ACTA,
    trazabilidadUsuario: TRAZABILIDAD_USUARIO_ANDREA,
  };
}
