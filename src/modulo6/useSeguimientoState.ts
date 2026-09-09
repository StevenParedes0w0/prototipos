import { useState, useCallback, useMemo, useEffect } from "react";
import { ActividadEjecucion, MedioVerificacion, EstadoActividad, EstadoEvidencia, EventoAuditoria } from "../modulo5/types";
import { DOCENTE_ACTUAL, FECHA_SISTEMA_STR, HORA_SISTEMA_STR, FECHA_HORA_SISTEMA, getDiasRestantes } from "../modulo5/useActividadesState";
import { ACTIVIDADES_SEGUIMIENTO_INICIALES, REVISOR_ACTUAL, GRUPOS_ASIGNADOS_REVISOR } from "./mockDataSeguimiento";
import { ItemEvidenciaRevisor, ResumenBandejaRevisor, ItemSeguimientoPlan, ResumenSeguimientoGlobal } from "./types";

const STORAGE_KEY = "fisei_modulo6_actividades_v1";
const NOTIFICACIONES_STORAGE_KEY = "fisei_modulo6_notificaciones_v1";

// ─── Permisos a nivel de código (RN-07, RN-16) ────────────────────────────────

export function puedeGestionarEvidencia(usuario: string, actividad: ActividadEjecucion): boolean {
  const esResponsable = actividad.responsables.includes(usuario);
  const dias = getDiasRestantes(actividad.hasta);
  const plazoVencido = actividad.estado === "VENCIDA" || dias < 0;
  return esResponsable && !plazoVencido;
}

export function puedeRevisarEvidencia(revisor: string, actividad: ActividadEjecucion): boolean {
  // Un revisor solo puede consultar evidencias correspondientes a grupos que tenga asignados (RN-11)
  return GRUPOS_ASIGNADOS_REVISOR.includes(actividad.grupo);
}

// ─── Estado Centralizado ──────────────────────────────────────────────────────

export interface NotificacionItem {
  id: string;
  icono: string;
  texto: string;
  detalle: string;
  hora: string;
  tipo: "warning" | "success" | "danger" | "info";
  leida?: boolean;
}

export function useSeguimientoState() {
  const [actividades, setActividades] = useState<ActividadEjecucion[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {}
    return ACTIVIDADES_SEGUIMIENTO_INICIALES;
  });

  const [notificaciones, setNotificaciones] = useState<NotificacionItem[]>(() => {
    try {
      const raw = localStorage.getItem(NOTIFICACIONES_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return [
      {
        id: "noti-1",
        icono: "clock",
        texto: "Una actividad vence en 11 días.",
        detalle: "Seguimiento al avance de trabajos de titulación",
        hora: "07/09/2026, 09:14",
        tipo: "warning",
      },
      {
        id: "noti-2",
        icono: "alert",
        texto: "Su evidencia 'Informe' fue observada por Ing. Carlos López, Mg.",
        detalle: "Revisión de planes de grado cohorte 2025",
        hora: "04/09/2026, 10:20",
        tipo: "danger",
      },
      {
        id: "noti-3",
        icono: "check",
        texto: "Su evidencia 'Informe' fue validada.",
        detalle: "Difusión de normativa interna de titulación",
        hora: "03/09/2026, 11:30",
        tipo: "success",
      },
    ];
  });

  // Guardar en localStorage con manejo seguro de excepciones
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(actividades));
    } catch {}
  }, [actividades]);

  useEffect(() => {
    try {
      localStorage.setItem(NOTIFICACIONES_STORAGE_KEY, JSON.stringify(notificaciones));
    } catch {}
  }, [notificaciones]);

  // Selección de actividad y evidencia para el revisor
  const [evidenciaSeleccionada, setEvidenciaSeleccionada] = useState<{
    actividadId: string;
    medioId: string;
  } | null>(null);

  // Plan seleccionado para Detalle de Seguimiento
  const [planSeguimientoSeleccionadoId, setPlanSeguimientoSeleccionadoId] = useState<string | null>(null);

  // Recalcular estado de la actividad según reglas de evidencias cargadas
  const recalculateActividadEstado = (act: ActividadEjecucion): EstadoActividad => {
    // EVIDENCIAS COMPLETAS si todos sus medios requeridos tienen archivo cargado
    const todosTienenArchivo = act.medios.length > 0 && act.medios.every(m => !!m.archivoVigente);
    if (todosTienenArchivo) {
      return "EVIDENCIAS COMPLETAS";
    }
    if (act.estado === "VENCIDA") {
      return "VENCIDA";
    }
    const algunoCargado = act.medios.some(m => !!m.archivoVigente);
    if (algunoCargado) {
      return "EN CURSO";
    }
    return "PENDIENTE";
  };

  // ─── Operación: VALIDAR EVIDENCIA (Revisor) ─────────────────────────────────
  const validarEvidencia = useCallback((
    actividadId: string,
    medioId: string,
    revisor: string = REVISOR_ACTUAL
  ) => {
    setActividades(prev => {
      const act = prev.find(a => a.id === actividadId);
      if (!act) return prev;

      if (!puedeRevisarEvidencia(revisor, act)) {
        console.warn(`Operación denegada: ${revisor} no tiene asignado el grupo "${act.grupo}".`);
        return prev;
      }

      const fechaHora = FECHA_HORA_SISTEMA;

      return prev.map(item => {
        if (item.id !== actividadId) return item;

        const updatedMedios = item.medios.map(m => {
          if (m.id !== medioId) return m;

          const updatedVersiones = m.historialVersiones.map(v => {
            if (v.vigente) {
              return {
                ...v,
                estadoRevision: "VALIDADA" as const,
                revisadoPor: revisor,
                fechaRevision: fechaHora,
              };
            }
            return v;
          });

          const nuevoEvento: EventoAuditoria = {
            id: `ev-val-${Date.now()}`,
            tipo: "VALIDACION",
            titulo: "Evidencia Validada",
            descripcion: "Aprobación formal por el revisor institucional asignado.",
            usuario: revisor,
            fecha: FECHA_SISTEMA_STR,
            hora: HORA_SISTEMA_STR,
            version: m.archivoVigente ? (m.historialVersiones.find(v => v.vigente)?.version || 1) : 1,
          };

          return {
            ...m,
            estado: "VALIDADA" as EstadoEvidencia,
            estadoValidacion: "VALIDADA" as const,
            revisionActual: {
              revisadoPor: revisor,
              fechaRevision: fechaHora,
            },
            historialVersiones: updatedVersiones,
            eventosAuditoria: [...(m.eventosAuditoria || []), nuevoEvento],
          };
        });

        const updatedAct = {
          ...item,
          medios: updatedMedios,
        };
        updatedAct.estado = recalculateActividadEstado(updatedAct);
        return updatedAct;
      });
    });

    // Agregar notificación demo para el docente (RN-18)
    setNotificaciones(prev => [
      {
        id: `noti-val-${Date.now()}`,
        icono: "check",
        texto: `Su evidencia fue validada por ${revisor}.`,
        detalle: `Actividad: ${actividades.find(a => a.id === actividadId)?.nombre || "Actividad"}`,
        hora: `${FECHA_SISTEMA_STR}, ${HORA_SISTEMA_STR}`,
        tipo: "success",
      },
      ...prev,
    ]);
  }, [actividades]);

  // ─── Operación: OBSERVAR EVIDENCIA (Revisor) ────────────────────────────────
  const observarEvidencia = useCallback((
    actividadId: string,
    medioId: string,
    observacionTexto: string,
    revisor: string = REVISOR_ACTUAL
  ) => {
    if (!observacionTexto.trim()) {
      console.warn("Se requiere obligatoriamente registrar una observación.");
      return;
    }

    setActividades(prev => {
      const act = prev.find(a => a.id === actividadId);
      if (!act) return prev;

      if (!puedeRevisarEvidencia(revisor, act)) {
        console.warn(`Operación denegada: ${revisor} no tiene asignado el grupo "${act.grupo}".`);
        return prev;
      }

      const fechaHora = FECHA_HORA_SISTEMA;

      return prev.map(item => {
        if (item.id !== actividadId) return item;

        const updatedMedios = item.medios.map(m => {
          if (m.id !== medioId) return m;

          const updatedVersiones = m.historialVersiones.map(v => {
            if (v.vigente) {
              return {
                ...v,
                estadoRevision: "OBSERVADA" as const,
                revisadoPor: revisor,
                fechaRevision: fechaHora,
                observacion: observacionTexto,
              };
            }
            return v;
          });

          const nuevoEvento: EventoAuditoria = {
            id: `ev-obs-${Date.now()}`,
            tipo: "OBSERVACION",
            titulo: "Evidencia Observada",
            descripcion: "Observaciones registradas para corrección por el docente responsable.",
            usuario: revisor,
            fecha: FECHA_SISTEMA_STR,
            hora: HORA_SISTEMA_STR,
            version: m.archivoVigente ? (m.historialVersiones.find(v => v.vigente)?.version || 1) : 1,
            observacionTexto,
          };

          return {
            ...m,
            estado: "OBSERVADA" as EstadoEvidencia,
            estadoValidacion: "OBSERVADA" as const,
            revisionActual: {
              revisadoPor: revisor,
              fechaRevision: fechaHora,
              observacion: observacionTexto,
            },
            historialVersiones: updatedVersiones,
            eventosAuditoria: [...(m.eventosAuditoria || []), nuevoEvento],
          };
        });

        const updatedAct = {
          ...item,
          medios: updatedMedios,
        };
        updatedAct.estado = recalculateActividadEstado(updatedAct);
        return updatedAct;
      });
    });

    // Agregar notificación demo para el docente (RN-18)
    setNotificaciones(prev => [
      {
        id: `noti-obs-${Date.now()}`,
        icono: "alert",
        texto: `Su evidencia fue observada por ${revisor}.`,
        detalle: observacionTexto.slice(0, 85) + "...",
        hora: `${FECHA_SISTEMA_STR}, ${HORA_SISTEMA_STR}`,
        tipo: "danger",
      },
      ...prev,
    ]);
  }, [actividades]);

  // ─── Operación: REEMPLAZAR EVIDENCIA (Docente) ──────────────────────────────
  const reemplazarEvidencia = useCallback((
    actividadId: string,
    medioId: string,
    archivo: { nombre: string; tamano: string },
    motivo?: string
  ) => {
    setActividades(prev => {
      const act = prev.find(a => a.id === actividadId);
      if (!act) return prev;

      if (!puedeGestionarEvidencia(DOCENTE_ACTUAL, act)) {
        console.warn(`Operación denegada: ${DOCENTE_ACTUAL} no es responsable o el plazo finalizó.`);
        return prev;
      }

      const fechaHora = FECHA_HORA_SISTEMA;

      return prev.map(item => {
        if (item.id !== actividadId) return item;

        const updatedMedios = item.medios.map(m => {
          if (m.id !== medioId) return m;

          // Versión previa pasa a vigente: false conservando su estado histórico (RN-04, RN-05, RN-09)
          const historialPrevio = m.historialVersiones.map(v => ({ ...v, vigente: false }));
          const nuevaVersionNum = historialPrevio.length + 1;

          const nuevaVersion = {
            version: nuevaVersionNum,
            nombreArchivo: archivo.nombre,
            tamano: archivo.tamano,
            fechaCarga: fechaHora,
            cargadoPor: DOCENTE_ACTUAL,
            vigente: true,
            estadoRevision: "PENDIENTE DE VALIDACIÓN" as const,
            motivoReemplazo: motivo || "Actualización ordinaria dentro del plazo",
          };

          const nuevoEvento: EventoAuditoria = {
            id: `ev-reemp-${Date.now()}`,
            tipo: "REEMPLAZO",
            titulo: `Archivo reemplazado (v${nuevaVersionNum}.0)`,
            descripcion: motivo || "Actualización ordinaria dentro del plazo reglamentario.",
            usuario: DOCENTE_ACTUAL,
            fecha: FECHA_SISTEMA_STR,
            hora: HORA_SISTEMA_STR,
            version: nuevaVersionNum,
          };

          return {
            ...m,
            estado: "PENDIENTE DE VALIDACIÓN" as EstadoEvidencia,
            estadoValidacion: "PENDIENTE DE VALIDACIÓN" as const,
            archivoVigente: {
              nombre: archivo.nombre,
              tamano: archivo.tamano,
              fechaCarga: fechaHora,
              cargadoPor: DOCENTE_ACTUAL,
            },
            revisionActual: undefined, // Requiere ser revisada nuevamente (RN-05)
            historialVersiones: [...historialPrevio, nuevaVersion],
            eventosAuditoria: [...(m.eventosAuditoria || []), nuevoEvento],
          };
        });

        const updatedAct = {
          ...item,
          medios: updatedMedios,
        };
        updatedAct.estado = recalculateActividadEstado(updatedAct);
        return updatedAct;
      });
    });

    setNotificaciones(prev => [
      {
        id: `noti-reemp-${Date.now()}`,
        icono: "info",
        texto: "Evidencia reemplazada correctamente.",
        detalle: `Nueva versión enviada a revisión: ${archivo.nombre}`,
        hora: `${FECHA_SISTEMA_STR}, ${HORA_SISTEMA_STR}`,
        tipo: "info",
      },
      ...prev,
    ]);
  }, []);

  // ─── Operación: CARGAR EVIDENCIA (Docente) ──────────────────────────────────
  const cargarEvidencia = useCallback((
    actividadId: string,
    medioId: string,
    archivo: { nombre: string; tamano: string }
  ) => {
    setActividades(prev => {
      const act = prev.find(a => a.id === actividadId);
      if (!act) return prev;

      if (!puedeGestionarEvidencia(DOCENTE_ACTUAL, act)) {
        console.warn(`Operación denegada: ${DOCENTE_ACTUAL} no es responsable o el plazo finalizó.`);
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
            estadoRevision: "PENDIENTE DE VALIDACIÓN" as const,
          };

          const nuevoEvento: EventoAuditoria = {
            id: `ev-carga-${Date.now()}`,
            tipo: "CARGA",
            titulo: "Archivo cargado",
            descripcion: "Carga ordinaria del archivo de evidencia en formato PDF.",
            usuario: DOCENTE_ACTUAL,
            fecha: FECHA_SISTEMA_STR,
            hora: HORA_SISTEMA_STR,
            version: 1,
          };

          return {
            ...m,
            estado: "PENDIENTE DE VALIDACIÓN" as EstadoEvidencia,
            estadoValidacion: "PENDIENTE DE VALIDACIÓN" as const,
            archivoVigente: {
              nombre: archivo.nombre,
              tamano: archivo.tamano,
              fechaCarga: fechaHora,
              cargadoPor: DOCENTE_ACTUAL,
            },
            historialVersiones: [...m.historialVersiones, nuevaVersion],
            eventosAuditoria: [...(m.eventosAuditoria || []), nuevoEvento],
          };
        });

        const updatedAct = {
          ...item,
          medios: updatedMedios,
        };
        updatedAct.estado = recalculateActividadEstado(updatedAct);
        return updatedAct;
      });
    });
  }, []);

  // ─── Ítems aplanados para la bandeja del Revisor (RN-11: filtrado por grupos) ─
  const itemsBandejaRevisor = useMemo<ItemEvidenciaRevisor[]>(() => {
    const list: ItemEvidenciaRevisor[] = [];

    actividades.forEach(act => {
      // Regla RN-11: Solo grupos asignados al revisor
      if (!GRUPOS_ASIGNADOS_REVISOR.includes(act.grupo)) return;

      act.medios.forEach(m => {
        // Solo medios con archivo cargado requieren revisión o seguimiento
        if (!m.archivoVigente) return;

        list.push({
          actividadId: act.id,
          actividadNombre: act.nombre,
          planNombre: act.planNombre,
          grupo: act.grupo,
          docente: act.responsables[0] || DOCENTE_ACTUAL,
          responsables: act.responsables,
          recursos: act.recursos,
          desde: act.desde,
          hasta: act.hasta,
          medioId: m.id,
          medioNombre: m.nombre,
          archivoNombre: m.archivoVigente.nombre,
          archivoTamano: m.archivoVigente.tamano,
          version: m.historialVersiones.find(v => v.vigente)?.version || 1,
          fechaCarga: m.archivoVigente.fechaCarga,
          fechaLimite: act.fechaLimiteExacta,
          estado: (m.estado === "CARGADA" ? "PENDIENTE DE VALIDACIÓN" : m.estado) as EstadoEvidencia,
          observacionActual: m.revisionActual?.observacion,
          revisadoPor: m.revisionActual?.revisadoPor,
          fechaRevision: m.revisionActual?.fechaRevision,
          medio: m,
          actividad: act,
        });
      });
    });

    return list;
  }, [actividades]);

  // ─── Resumen numérico para tarjetas de la Bandeja del Revisor ────────────────
  const resumenBandeja = useMemo<ResumenBandejaRevisor>(() => {
    const pendientes = itemsBandejaRevisor.filter(
      item => item.estado === "PENDIENTE DE VALIDACIÓN" || item.estado === "CARGADA"
    ).length;

    const validadasHoy = itemsBandejaRevisor.filter(
      item => item.estado === "VALIDADA"
    ).length;

    const observadas = itemsBandejaRevisor.filter(
      item => item.estado === "OBSERVADA"
    ).length;

    const totalRevisadas = validadasHoy + observadas;

    return {
      pendientes,
      validadasHoy,
      observadas,
      totalRevisadas,
    };
  }, [itemsBandejaRevisor]);

  // ─── Resumen para Seguimiento Institucional de Planes ────────────────────────
  const planesSeguimiento = useMemo<ItemSeguimientoPlan[]>(() => {
    // Agrupar actividades por planNombre
    const map = new Map<string, ActividadEjecucion[]>();
    actividades.forEach(a => {
      const arr = map.get(a.planNombre) || [];
      arr.push(a);
      map.set(a.planNombre, arr);
    });

    const result: ItemSeguimientoPlan[] = [];

    map.forEach((acts, planNombre) => {
      const primerAct = acts[0];
      const planId = primerAct ? `plan-${primerAct.grupo.toLowerCase().replace(/\s+/g, "-")}` : "plan-1";
      const grupo = primerAct?.grupo || "Unidad de Titulación";
      const docente = primerAct?.responsables[0] || DOCENTE_ACTUAL;
      const periodo = primerAct?.periodo || "Julio – Diciembre 2026";

      const actividadesTotales = acts.length;
      const actividadesCompletas = acts.filter(a => a.estado === "EVIDENCIAS COMPLETAS").length;
      const actividadesEnCurso = acts.filter(a => a.estado === "EN CURSO").length;
      const actividadesPendientes = acts.filter(a => a.estado === "PENDIENTE").length;
      const actividadesVencidas = acts.filter(a => a.estado === "VENCIDA").length;

      let evidenciasRequeridas = 0;
      let evidenciasCargadas = 0;
      let evidenciasValidadas = 0;
      let evidenciasObservadas = 0;
      let evidenciasPendientesCarga = 0;

      acts.forEach(a => {
        a.medios.forEach(m => {
          evidenciasRequeridas += 1;
          if (m.archivoVigente) {
            evidenciasCargadas += 1;
          } else {
            evidenciasPendientesCarga += 1;
          }
          if (m.estado === "VALIDADA") {
            evidenciasValidadas += 1;
          } else if (m.estado === "OBSERVADA") {
            evidenciasObservadas += 1;
          }
        });
      });

      result.push({
        planId,
        planNombre,
        docente,
        grupo,
        periodo,
        version: "1.0",
        actividadesTotales,
        actividadesCompletas,
        actividadesEnCurso,
        actividadesPendientes,
        actividadesVencidas,
        evidenciasRequeridas,
        evidenciasCargadas,
        evidenciasValidadas,
        evidenciasObservadas,
        evidenciasPendientesCarga,
        actividades: acts,
      });
    });

    return result;
  }, [actividades]);

  // Resumen global para las tarjetas superiores de Seguimiento
  const resumenSeguimientoGlobal = useMemo<ResumenSeguimientoGlobal>(() => {
    let planesEnEjecucion = planesSeguimiento.length;
    let actividadesEnCurso = 0;
    let actividadesVencidas = 0;
    let evidenciasPendientesValidacion = 0;
    let evidenciasObservadas = 0;
    let evidenciasValidadas = 0;

    actividades.forEach(a => {
      if (a.estado === "EN CURSO") actividadesEnCurso++;
      if (a.estado === "VENCIDA") actividadesVencidas++;

      a.medios.forEach(m => {
        if (m.estado === "VALIDADA") evidenciasValidadas++;
        else if (m.estado === "OBSERVADA") evidenciasObservadas++;
        else if (m.archivoVigente && (m.estado === "PENDIENTE DE VALIDACIÓN" || m.estado === "CARGADA")) {
          evidenciasPendientesValidacion++;
        }
      });
    });

    return {
      planesEnEjecucion,
      actividadesEnCurso,
      actividadesVencidas,
      evidenciasPendientesValidacion,
      evidenciasObservadas,
      evidenciasValidadas,
    };
  }, [planesSeguimiento, actividades]);

  // Ítem de evidencia actualmente seleccionada para revisión detallada
  const itemEvidenciaActivo = useMemo<ItemEvidenciaRevisor | null>(() => {
    if (!evidenciaSeleccionada) return null;
    return itemsBandejaRevisor.find(
      it => it.actividadId === evidenciaSeleccionada.actividadId && it.medioId === evidenciaSeleccionada.medioId
    ) ?? null;
  }, [itemsBandejaRevisor, evidenciaSeleccionada]);

  const planSeguimientoActivo = useMemo(() => {
    if (!planSeguimientoSeleccionadoId) return null;
    return planesSeguimiento.find(p => p.planId === planSeguimientoSeleccionadoId) || null;
  }, [planesSeguimiento, planSeguimientoSeleccionadoId]);

  // Estado para navegación docente
  const [actividadSeleccionadaId, setActividadSeleccionadaId] = useState<string | null>(null);

  const actividadSeleccionada = useMemo(() => {
    if (!actividadSeleccionadaId) return null;
    return actividades.find(a => a.id === actividadSeleccionadaId) || null;
  }, [actividades, actividadSeleccionadaId]);

  // Resumen para Dashboard / Mis Actividades docente
  const resumen = useMemo(() => {
    const misActividades = actividades.filter(a => a.responsables.includes(DOCENTE_ACTUAL));
    const total = misActividades.length;
    const enCurso = misActividades.filter(a => a.estado === "EN CURSO").length;
    const pendientes = misActividades.filter(a => a.estado === "PENDIENTE").length;
    const completas = misActividades.filter(a => a.estado === "EVIDENCIAS COMPLETAS").length;
    const vencidas = misActividades.filter(a => a.estado === "VENCIDA").length;
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
    notificaciones,
    itemsBandejaRevisor,
    resumenBandeja,
    planesSeguimiento,
    resumenSeguimientoGlobal,
    evidenciaSeleccionada,
    setEvidenciaSeleccionada,
    itemEvidenciaActivo,
    planSeguimientoSeleccionadoId,
    setPlanSeguimientoSeleccionadoId,
    planSeguimientoActivo,
    validarEvidencia,
    observarEvidencia,
    reemplazarEvidencia,
    cargarEvidencia,
    // Docente navigation & metrics
    actividadSeleccionadaId,
    setActividadSeleccionadaId,
    actividadSeleccionada,
    resumen,
  };
}
