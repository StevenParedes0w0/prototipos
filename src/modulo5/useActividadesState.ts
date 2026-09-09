import { useState, useCallback, useMemo } from "react";
import { ActividadEjecucion, EstadoActividad } from "./types";
import { ACTIVIDADES_INICIALES } from "./mockData";

export const DOCENTE_ACTUAL = "Ing. Andrea Pérez, Mg.";

// Centralización temporal: única fuente temporal para todo el prototipo (07/09/2026)
export const FECHA_SISTEMA_STR = "07/09/2026";
export const HORA_SISTEMA_STR = "10:00";
export const FECHA_HORA_SISTEMA = `${FECHA_SISTEMA_STR} — ${HORA_SISTEMA_STR}`;
export const FECHA_SISTEMA = new Date(2026, 8, 7, 10, 0, 0); // 8 = Septiembre

export function parseFechaDMY(dmy: string): Date {
  const parts = dmy.split("/").map(Number);
  if (parts.length === 3) {
    return new Date(parts[2], parts[1] - 1, parts[0], 23, 59, 59);
  }
  return new Date();
}

export function getDiasRestantes(hastaDmy: string, fechaRef: Date = FECHA_SISTEMA): number {
  const fechaLimite = parseFechaDMY(hastaDmy);
  const diffMs = fechaLimite.getTime() - fechaRef.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

export function useActividadesState() {
  const [actividades, setActividades] = useState<ActividadEjecucion[]>(ACTIVIDADES_INICIALES);
  const [actividadSeleccionadaId, setActividadSeleccionadaId] = useState<string | null>(null);

  // Selected activity helper
  const actividadSeleccionada = useMemo(() => {
    if (!actividadSeleccionadaId) return null;
    return actividades.find(a => a.id === actividadSeleccionadaId) ?? null;
  }, [actividades, actividadSeleccionadaId]);

  // Recalculate activity state based on rules:
  // An activity is "EVIDENCIAS COMPLETAS" if all its medios are CARGADA.
  // If not, and deadline passed: "VENCIDA" (if not completed).
  // If not expired and some loaded: "EN CURSO".
  // If none loaded and not expired: "PENDIENTE".
  const recalculateActividadEstado = (act: ActividadEjecucion): EstadoActividad => {
    const todosCargados = act.medios.length > 0 && act.medios.every(m => m.estado === "CARGADA");
    if (todosCargados) {
      return "EVIDENCIAS COMPLETAS";
    }
    if (act.estado === "VENCIDA") {
      return "VENCIDA";
    }
    const algunoCargado = act.medios.some(m => m.estado === "CARGADA");
    if (algunoCargado) {
      return "EN CURSO";
    }
    return "PENDIENTE";
  };

  // Cargar evidencia - con autorización a nivel de operación
  const cargarEvidencia = useCallback((
    actividadId: string,
    medioId: string,
    archivo: { nombre: string; tamano: string }
  ) => {
    setActividades(prev => {
      const act = prev.find(a => a.id === actividadId);
      if (!act) return prev;

      // Autorización a nivel de operación
      if (!act.responsables.includes(DOCENTE_ACTUAL)) {
        console.warn(`Operación denegada: ${DOCENTE_ACTUAL} no es responsable de la actividad "${act.nombre}".`);
        return prev;
      }
      if (act.estado === "VENCIDA") {
        console.warn(`Operación bloqueada: la actividad "${act.nombre}" se encuentra vencida.`);
        return prev;
      }

      const fechaHora = FECHA_HORA_SISTEMA;

      return prev.map(item => {
        if (item.id !== actividadId) return item;

        const updatedMedios = item.medios.map(m => {
          if (m.id !== medioId) return m;

          const nuevaVersion = {
            version: (m.historialVersiones.length || 0) + 1,
            nombreArchivo: archivo.nombre,
            tamano: archivo.tamano,
            fechaCarga: fechaHora,
            cargadoPor: DOCENTE_ACTUAL,
            vigente: true,
          };

          return {
            ...m,
            estado: "CARGADA" as const,
            archivoVigente: {
              nombre: archivo.nombre,
              tamano: archivo.tamano,
              fechaCarga: fechaHora,
              cargadoPor: DOCENTE_ACTUAL,
            },
            historialVersiones: [...m.historialVersiones, nuevaVersion],
          };
        });

        const updatedAct: ActividadEjecucion = {
          ...item,
          medios: updatedMedios,
        };
        updatedAct.estado = recalculateActividadEstado(updatedAct);
        return updatedAct;
      });
    });
  }, []);

  // Reemplazar evidencia - con autorización a nivel de operación
  const reemplazarEvidencia = useCallback((
    actividadId: string,
    medioId: string,
    archivo: { nombre: string; tamano: string },
    motivo?: string
  ) => {
    setActividades(prev => {
      const act = prev.find(a => a.id === actividadId);
      if (!act) return prev;

      // Autorización a nivel de operación
      if (!act.responsables.includes(DOCENTE_ACTUAL)) {
        console.warn(`Operación denegada: ${DOCENTE_ACTUAL} no es responsable de la actividad "${act.nombre}".`);
        return prev;
      }
      if (act.estado === "VENCIDA") {
        console.warn(`Operación bloqueada: la actividad "${act.nombre}" se encuentra vencida.`);
        return prev;
      }

      const fechaHora = FECHA_HORA_SISTEMA;

      return prev.map(item => {
        if (item.id !== actividadId) return item;

        const updatedMedios = item.medios.map(m => {
          if (m.id !== medioId) return m;

          // Mark older versions as not active
          const historialPrevio = m.historialVersiones.map(v => ({ ...v, vigente: false }));
          const nuevaVersion = {
            version: historialPrevio.length + 1,
            nombreArchivo: archivo.nombre,
            tamano: archivo.tamano,
            fechaCarga: fechaHora,
            cargadoPor: DOCENTE_ACTUAL,
            vigente: true,
            motivoReemplazo: motivo || "Actualización ordinaria dentro del plazo",
          };

          return {
            ...m,
            estado: "CARGADA" as const,
            archivoVigente: {
              nombre: archivo.nombre,
              tamano: archivo.tamano,
              fechaCarga: fechaHora,
              cargadoPor: DOCENTE_ACTUAL,
            },
            historialVersiones: [...historialPrevio, nuevaVersion],
          };
        });

        const updatedAct: ActividadEjecucion = {
          ...item,
          medios: updatedMedios,
        };
        updatedAct.estado = recalculateActividadEstado(updatedAct);
        return updatedAct;
      });
    });
  }, []);

  // Summary counts para Mis Actividades (actividades asignadas a DOCENTE_ACTUAL)
  const resumen = useMemo(() => {
    const misActividades = actividades.filter(a => a.responsables.includes(DOCENTE_ACTUAL));
    const total = misActividades.length;
    const enCurso = misActividades.filter(a => a.estado === "EN CURSO").length;
    const pendientes = misActividades.filter(a => a.estado === "PENDIENTE").length;
    const completas = misActividades.filter(a => a.estado === "EVIDENCIAS COMPLETAS").length;
    const vencidas = misActividades.filter(a => a.estado === "VENCIDA").length;

    // El avance del Plan: actividades con evidencias completas / total asignadas
    const pct = total > 0 ? Math.round((completas / total) * 100) : 0;

    return {
      total,
      enCurso,
      pendientes,
      completas,
      vencidas,
      pct,
    };
  }, [actividades]);

  return {
    actividades,
    actividadSeleccionada,
    actividadSeleccionadaId,
    setActividadSeleccionadaId,
    cargarEvidencia,
    reemplazarEvidencia,
    resumen,
  };
}
