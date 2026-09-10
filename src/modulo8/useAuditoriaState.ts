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

const AUDITORIA_STORAGE_KEY = "fisei_auditoria_custom_events";

export function useAuditoriaState() {
  const [eventos, setEventos] = useState<AuditoriaEvento[]>(() => {
    try {
      const saved = localStorage.getItem(AUDITORIA_STORAGE_KEY);
      if (saved) {
        const custom = JSON.parse(saved);
        if (Array.isArray(custom)) return [...custom, ...AUDITORIA_EVENTOS_DEMO];
      }
    } catch {}
    return AUDITORIA_EVENTOS_DEMO;
  });
  const [filtros, setFiltros] = useState<FiltrosAuditoria>(FILTROS_INICIALES);
  const [eventoSeleccionado, setEventoSeleccionado] = useState<AuditoriaEvento | null>(null);
  const [trazabilidadModal, setTrazabilidadModal] = useState<TrazabilidadObjeto | null>(null);

  const registrarEvento = (
    tipoEvento: string,
    objeto: string,
    accion: string,
    descripcion: string,
    usuario: string,
    rol: string
  ) => {
    const horaActual = new Date().toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit", hour12: false });
    const newEv: AuditoriaEvento = {
      id: `ev-${Date.now()}`,
      fechaHora: `07/09/2026 — ${horaActual}`,
      fecha: "07/09/2026",
      hora: horaActual,
      usuario,
      rol: (rol === "Docente" || rol === "Revisor" || rol === "Administrador" ? rol : "Docente"),
      modulo: "Planes de Trabajo",
      tipoEvento: (tipoEvento.includes("FIRMAD") ? "Firma" : tipoEvento.includes("DEVUELT") ? "Devolución" : tipoEvento.includes("APROBAD") ? "Aprobación" : tipoEvento.includes("OBSERV") ? "Observación" : "Modificación") as any,
      accion,
      objeto,
      grupo: "Comisión de Eventos Académicos",
      periodo: "Julio – Diciembre 2026",
      descripcion,
    };
    setEventos((prev) => {
      const updated = [newEv, ...prev];
      try {
        localStorage.setItem(AUDITORIA_STORAGE_KEY, JSON.stringify(updated.slice(0, 40)));
      } catch {}
      return updated;
    });
  };

  // Actualizar un filtro individual
  const setFiltro = (campo: keyof FiltrosAuditoria, valor: string) => {
    setFiltros((prev) => ({ ...prev, [campo]: valor }));
  };

  // Limpiar todos los filtros
  const limpiarFiltros = () => {
    setFiltros(FILTROS_INICIALES);
  };

function parseFechaToNum(f: string): number {
  if (!f) return 0;
  const clean = f.trim();
  if (clean.includes("-")) {
    const parts = clean.split("-");
    if (parts.length === 3) {
      return parseInt(parts[0] + parts[1].padStart(2, "0") + parts[2].padStart(2, "0"), 10);
    }
  }
  if (clean.includes("/")) {
    const parts = clean.split("/");
    if (parts.length === 3) {
      return parseInt(parts[2] + parts[1].padStart(2, "0") + parts[0].padStart(2, "0"), 10);
    }
  }
  return 0;
}

  // Filtrado reactivo en memoria
  const eventosFiltrados = useMemo(() => {
    return eventos.filter((ev) => {
      // Filtro de Fecha Desde
      if (filtros.fechaDesde.trim()) {
        const numDesde = parseFechaToNum(filtros.fechaDesde);
        const evNum = parseFechaToNum(ev.fecha);
        if (numDesde && evNum && evNum < numDesde) return false;
      }

      // Filtro de Fecha Hasta
      if (filtros.fechaHasta.trim()) {
        const numHasta = parseFechaToNum(filtros.fechaHasta);
        const evNum = parseFechaToNum(ev.fecha);
        if (numHasta && evNum && evNum > numHasta) return false;
      }

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
    registrarEvento,
    // Objetos de trazabilidad predeterminados disponibles
    trazabilidadPlan: TRAZABILIDAD_PLAN_EVENTOS,
    trazabilidadEvidencia: TRAZABILIDAD_EVIDENCIA_ACTA,
    trazabilidadUsuario: TRAZABILIDAD_USUARIO_ANDREA,
  };
}
