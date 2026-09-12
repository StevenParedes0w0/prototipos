import { useState, useMemo, useEffect, useRef } from "react";
import { ActividadEjecucion, ArchivoEvidenciaInput, MedioVerificacion, EventoAuditoria } from "../modulo5/types";
import { DOCENTE_ACTUAL, FECHA_SISTEMA_STR, HORA_SISTEMA_STR, FECHA_HORA_SISTEMA, plazoEvidenciaVencido, estadoActividadDesdeMedios } from "../modulo5/useActividadesState";
import { ACTIVIDADES_SEGUIMIENTO_INICIALES } from "./mockDataSeguimiento";
import { ItemEvidenciaRevisor, ItemSeguimientoPlan } from "./types";
import { DocumentMasterState } from "../documentEngine/types";
import { AuditLogger, NotificacionItem } from "../modulo8/types";
import { USUARIOS_ADMIN_INICIALES } from "../modulo7/mockDataAdmin";

const STORAGE_KEY = "fisei_modulo6_actividades_v2";
export interface SeguimientoOptions {
  documents?: DocumentMasterState[];
  currentUser?: { id: string; nombre: string };
  currentRole?: "docente" | "revisor" | "admin";
  reviewerGroupNames?: string[];
  closedPeriodNames?: string[];
  onAuditLog?: AuditLogger;
  onNotification?: (notificacion: NotificacionItem) => void;
}
export function esResponsableDeActividad(usuario: string | { id: string; nombre: string }, actividad: ActividadEjecucion): boolean {
  return typeof usuario === "string"
    ? actividad.responsables.includes(usuario)
    : actividad.responsableIds?.includes(usuario.id) ?? actividad.responsables.includes(usuario.nombre);
}
export function puedeGestionarEvidencia(usuario: string | { id: string; nombre: string }, actividad: ActividadEjecucion): boolean {
  return esResponsableDeActividad(usuario, actividad) && !plazoEvidenciaVencido(actividad);
}
export function puedeRevisarEvidencia(_revisor: string, actividad: ActividadEjecucion, grupos: string[] = []): boolean {
  return !actividad.soloLectura && grupos.includes(actividad.grupo);
}

// La matriz firmada es la fuente de ejecución; la evidencia conserva su propia historia.
export function sincronizarActividades(documents: DocumentMasterState[], anteriores: ActividadEjecucion[], closed: string[] = []): ActividadEjecucion[] {
  return documents.filter(d => d.documentType === "PLAN_TRABAJO" && (d.documentState === "VALIDADO" || d.documentState === "EN EJECUCIÓN" || d.operationalState === "EN EJECUCIÓN" || d.operationalState === "FINALIZADO"))
    .flatMap(doc => (doc.currentArtifact.matriz ?? []).map(matriz => {
      const previa = anteriores.find(a => a.planId === doc.id && a.sourceActivityId === matriz.id)
        ?? anteriores.find(a => !a.planId && a.grupo === doc.grupo && a.periodo === doc.periodo && a.nombre === matriz.nombre);
      const id = previa?.id ?? `${doc.id}-actividad-${matriz.id}`;
      const medios = matriz.medios.filter(m => m.trim()).map((nombre, i): MedioVerificacion => previa?.medios.find(m => m.nombre === nombre) ?? { id: `${id}-medio-${i + 1}`, nombre, estado: "PENDIENTE", historialVersiones: [] });
      const actividad: ActividadEjecucion = {
        id, planId: doc.id, planVersion: doc.formalVersion, docenteElaborador: doc.currentArtifact.elaborador.nombre,
        sourceActivityId: matriz.id, nombre: matriz.nombre, categoria: previa?.categoria ?? "Otra", tipo: previa?.tipo ?? "opcional",
        planNombre: doc.nombre, grupo: doc.grupo, periodo: doc.periodo, desde: matriz.desde, hasta: matriz.hasta,
        fechaLimiteExacta: `${matriz.hasta} — 23:59`, responsables: [...matriz.responsables], responsableIds: [...(matriz.responsableIds || [])], recursos: [...matriz.recursos], medios,
        soloLectura: closed.includes(doc.periodo) || doc.operationalState === "FINALIZADO", estado: "PENDIENTE",
      };
      return { ...actividad, estado: estadoActividadDesdeMedios(actividad) };
    }));
}

export function useSeguimientoState(options: SeguimientoOptions = {}) {
  const userName = options.currentUser?.nombre ?? DOCENTE_ACTUAL;
  const userId = options.currentUser?.id ?? "";
  const userRole = options.currentRole ?? "docente";
  const [almacenadas, setActividades] = useState<ActividadEjecucion[]>(() => {
    try { const saved: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
      if (Array.isArray(saved) && saved.every(a => a && typeof a.id === "string" && Array.isArray(a.medios) && Array.isArray(a.responsables))) return saved;
    } catch { /* DEMO recuperable */ }
    return structuredClone(ACTIVIDADES_SEGUIMIENTO_INICIALES);
  });
  const actividades = useMemo(() => options.documents
    ? sincronizarActividades(options.documents, almacenadas, options.closedPeriodNames)
    : almacenadas.map(a => ({ ...a, estado: estadoActividadDesdeMedios(a) })), [options.documents, options.closedPeriodNames, almacenadas]);
  const current = useRef(actividades); current.current = actividades;
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(actividades, (key, value) => key === "url" ? undefined : value)); } catch { /* Metadatos DEMO; el PDF seleccionado vive solo en la sesión. */ }
  }, [actividades]);
  const [actividadSeleccionadaId, setActividadSeleccionadaId] = useState<string | null>(null);
  const [evidenciaSeleccionada, setEvidenciaSeleccionada] = useState<{ actividadId: string; medioId: string } | null>(null);
  const [planSeguimientoSeleccionadoId, setPlanSeguimientoSeleccionadoId] = useState<string | null>(null);

  const emitir = (act: ActividadEjecucion, medio: MedioVerificacion, tipo: EventoAuditoria["tipo"], descripcion: string) => {
    options.onAuditLog?.(tipo, `${medio.nombre} — ${act.nombre}`, tipo, descripcion, userName, userRole === "docente" ? "Docente" : "Revisor", { modulo: "Evidencias", grupo: act.grupo, periodo: act.periodo, objetoId: `${act.id}/${medio.id}`, tipoObjeto: "Evidencia" });
    const revision = tipo === "VALIDACION" || tipo === "OBSERVACION";
    const doc = options.documents?.find(d => d.id === act.planId);
    const destinatarios = revision
      ? act.responsables.map(nombre => ({ id: USUARIOS_ADMIN_INICIALES.find(u => u.nombreCompleto === nombre)?.id ?? nombre, nombre }))
      : (doc?.flowStages.filter(s => s.actorRole !== "docente" && s.actorId).map(s => ({ id: s.actorId!, nombre: s.actorName })) ?? []);
    Array.from(new Map(destinatarios.map(d => [d.id, d])).values()).forEach(dest => options.onNotification?.({
      id: `notif-evi-${crypto.randomUUID()}`, destinatarioRol: revision ? "Docente" : "Revisor", destinatarioUsuarioId: dest.id,
      titulo: tipo === "OBSERVACION" ? "Evidencia observada" : tipo === "VALIDACION" ? "Evidencia validada" : "Evidencia pendiente de validación",
      mensaje: `${medio.nombre}: ${descripcion}`, fechaHora: FECHA_HORA_SISTEMA, tiempoRelativo: "Ahora · DEMO", leida: false,
      tipo: tipo === "OBSERVACION" ? "EVIDENCIA_OBSERVADA" : tipo === "VALIDACION" ? "EVIDENCIA_VALIDADA" : tipo === "REEMPLAZO" ? "EVIDENCIA_REEMPLAZADA" : "EVIDENCIA_CARGADA",
      objetoRelacionado: { tipo: "Evidencia", nombre: medio.nombre, grupo: act.grupo, autor: userName, accionLabel: revision ? "VER EVIDENCIA" : "REVISAR EVIDENCIA", accionDestino: revision ? "actividades" : "evidenciasValidar", actividadId: act.id, medioId: medio.id, modalDirecto: tipo === "OBSERVACION" ? "observacion" : tipo === "VALIDACION" ? "visor" : undefined },
    }));
  };
  const mutarMedio = (actividadId: string, medioId: string, tipo: EventoAuditoria["tipo"], archivo?: ArchivoEvidenciaInput, texto = ""): boolean => {
    const act = current.current.find(a => a.id === actividadId);
    const medio = act?.medios.find(m => m.id === medioId);
    if (!act || !medio) return false;
    const revision = tipo === "VALIDACION" || tipo === "OBSERVACION";
    if (revision) {
      if (userRole !== "revisor" || !puedeRevisarEvidencia(userName, act, options.reviewerGroupNames) || !medio.archivoVigente || medio.estado === "VALIDADA" || medio.estado === "OBSERVADA") return false;
      if (tipo === "OBSERVACION" && !texto.trim()) return false;
    } else {
      if (!puedeGestionarEvidencia({id:userId,nombre:userName}, act) || userRole !== "docente" || !archivo || !/\.pdf$/i.test(archivo.nombre) || (archivo.sizeBytes !== undefined && (archivo.sizeBytes <= 0 || archivo.sizeBytes > 10 * 1024 * 1024))) return false;
      if (tipo === "CARGA" ? !!medio.archivoVigente : !medio.archivoVigente) return false;
    }
    const version = revision ? (medio.historialVersiones.find(v => v.vigente)?.version ?? 1) : Math.max(0, ...medio.historialVersiones.map(v => v.version)) + 1;
    const estado = tipo === "VALIDACION" ? "VALIDADA" : tipo === "OBSERVACION" ? "OBSERVADA" : "PENDIENTE DE VALIDACIÓN";
    const descripcion = texto.trim() || (tipo === "REEMPLAZO" ? "Nueva versión; requiere nueva validación." : tipo === "CARGA" ? "PDF cargado para validación." : "Evidencia validada en el escenario DEMO.");
    const nuevoMedio: MedioVerificacion = {
      ...medio, estado, estadoValidacion: estado,
      archivoVigente: revision ? medio.archivoVigente : { nombre: archivo!.nombre, tamano: archivo!.tamano, url: archivo!.url, fechaCarga: FECHA_HORA_SISTEMA, cargadoPor: userName },
      revisionActual: revision ? { revisadoPor: userName, fechaRevision: FECHA_HORA_SISTEMA, observacion: tipo === "OBSERVACION" ? texto.trim() : undefined } : undefined,
      historialVersiones: revision
        ? medio.historialVersiones.map(v => v.vigente ? { ...v, estadoRevision: estado, revisadoPor: userName, fechaRevision: FECHA_HORA_SISTEMA, observacion: tipo === "OBSERVACION" ? texto.trim() : undefined } : v)
        : [...medio.historialVersiones.map(v => ({ ...v, vigente: false })), { version, nombreArchivo: archivo!.nombre, tamano: archivo!.tamano, url: archivo!.url, fechaCarga: FECHA_HORA_SISTEMA, cargadoPor: userName, vigente: true, estadoRevision: estado, motivoReemplazo: tipo === "REEMPLAZO" ? descripcion : undefined }],
      eventosAuditoria: [...(medio.eventosAuditoria ?? []), { id: crypto.randomUUID(), tipo, titulo: `${tipo} — v${version}.0`, descripcion, usuario: userName, fecha: FECHA_SISTEMA_STR, hora: HORA_SISTEMA_STR, version, observacionTexto: tipo === "OBSERVACION" ? texto.trim() : undefined }],
    };
    const siguiente = current.current.map(a => { if (a.id !== actividadId) return a; const next = { ...a, medios: a.medios.map(m => m.id === medioId ? nuevoMedio : m) }; return { ...next, estado: estadoActividadDesdeMedios(next) }; });
    current.current = siguiente; setActividades(siguiente); emitir(act, nuevoMedio, tipo, descripcion); return true;
  };
  const cargarEvidencia = (a: string, m: string, archivo: ArchivoEvidenciaInput) => mutarMedio(a, m, "CARGA", archivo);
  const reemplazarEvidencia = (a: string, m: string, archivo: ArchivoEvidenciaInput, motivo?: string) => mutarMedio(a, m, "REEMPLAZO", archivo, motivo);
  const validarEvidencia = (a: string, m: string) => mutarMedio(a, m, "VALIDACION");
  const observarEvidencia = (a: string, m: string, texto: string) => mutarMedio(a, m, "OBSERVACION", undefined, texto);
  const itemsBandejaRevisor = useMemo<ItemEvidenciaRevisor[]>(() => actividades.filter(a => puedeRevisarEvidencia(userName, a, options.reviewerGroupNames)).flatMap(act => act.medios.filter(m => m.archivoVigente).map(m => ({
    actividadId: act.id, actividadNombre: act.nombre, planNombre: act.planNombre, grupo: act.grupo, docente: act.docenteElaborador ?? act.responsables[0], responsables: act.responsables, recursos: act.recursos, desde: act.desde, hasta: act.hasta, medioId: m.id, medioNombre: m.nombre,
    archivoNombre: m.archivoVigente!.nombre, archivoTamano: m.archivoVigente!.tamano, version: m.historialVersiones.find(v => v.vigente)?.version ?? 1, fechaCarga: m.archivoVigente!.fechaCarga, fechaLimite: act.fechaLimiteExacta, estado: m.estado === "CARGADA" ? "PENDIENTE DE VALIDACIÓN" : m.estado,
    observacionActual: m.revisionActual?.observacion, revisadoPor: m.revisionActual?.revisadoPor, fechaRevision: m.revisionActual?.fechaRevision, medio: m, actividad: act,
  }))), [actividades, userName, options.reviewerGroupNames]);
  const resumenBandeja = { pendientes: itemsBandejaRevisor.filter(i => i.estado === "PENDIENTE DE VALIDACIÓN").length, validadasHoy: itemsBandejaRevisor.filter(i => i.estado === "VALIDADA" && i.fechaRevision?.startsWith(FECHA_SISTEMA_STR)).length, observadas: itemsBandejaRevisor.filter(i => i.estado === "OBSERVADA").length, totalRevisadas: itemsBandejaRevisor.filter(i => i.estado === "VALIDADA" || i.estado === "OBSERVADA").length };
  const planesSeguimiento = useMemo<ItemSeguimientoPlan[]>(() => {
    const grupos = new Map<string, ActividadEjecucion[]>();
    actividades.filter(a => userRole === "admin" || (options.reviewerGroupNames ?? []).includes(a.grupo)).forEach(a => { const key = a.planId ?? `${a.planNombre}/${a.periodo}/${a.docenteElaborador}`; grupos.set(key, [...(grupos.get(key) ?? []), a]); });
    return [...grupos].map(([planId, acts]) => { const a = acts[0]; const medios = acts.flatMap(x => x.medios); return { planId, planNombre: a.planNombre, docente: a.docenteElaborador ?? a.responsables[0], grupo: a.grupo, periodo: a.periodo, version: a.planVersion ?? "1.0", actividadesTotales: acts.length, actividadesCompletas: acts.filter(x => x.estado === "EVIDENCIAS COMPLETAS").length, actividadesEnCurso: acts.filter(x => x.estado === "EN CURSO").length, actividadesPendientes: acts.filter(x => x.estado === "PENDIENTE").length, actividadesVencidas: acts.filter(x => x.estado === "VENCIDA").length, evidenciasRequeridas: medios.length, evidenciasCargadas: medios.filter(m => m.archivoVigente).length, evidenciasValidadas: medios.filter(m => m.estado === "VALIDADA").length, evidenciasObservadas: medios.filter(m => m.estado === "OBSERVADA").length, evidenciasPendientesCarga: medios.filter(m => !m.archivoVigente).length, actividades: acts }; });
  }, [actividades, userRole, userName, options.reviewerGroupNames]);
  const resumenSeguimientoGlobal = { planesEnEjecucion: planesSeguimiento.length, actividadesEnCurso: planesSeguimiento.reduce((n,p) => n+p.actividadesEnCurso,0), actividadesVencidas: planesSeguimiento.reduce((n,p) => n+p.actividadesVencidas,0), evidenciasPendientesValidacion: itemsBandejaRevisor.filter(i => i.estado === "PENDIENTE DE VALIDACIÓN").length, evidenciasObservadas: planesSeguimiento.reduce((n,p) => n+p.evidenciasObservadas,0), evidenciasValidadas: planesSeguimiento.reduce((n,p) => n+p.evidenciasValidadas,0) };
  const mis = actividades.filter(a => esResponsableDeActividad({id:userId,nombre:userName}, a)); const completas = mis.filter(a => a.estado === "EVIDENCIAS COMPLETAS").length;
  const resumen = { total: mis.length, enCurso: mis.filter(a => a.estado === "EN CURSO").length, pendientes: mis.filter(a => a.estado === "PENDIENTE").length, completas, vencidas: mis.filter(a => a.estado === "VENCIDA").length, pct: mis.length ? Math.round(completas / mis.length * 100) : 0 };
  return { actividades, itemsBandejaRevisor, resumenBandeja, planesSeguimiento, resumenSeguimientoGlobal, evidenciaSeleccionada, setEvidenciaSeleccionada, itemEvidenciaActivo: itemsBandejaRevisor.find(i => i.actividadId === evidenciaSeleccionada?.actividadId && i.medioId === evidenciaSeleccionada?.medioId) ?? null, planSeguimientoSeleccionadoId, setPlanSeguimientoSeleccionadoId, planSeguimientoActivo: planesSeguimiento.find(p => p.planId === planSeguimientoSeleccionadoId) ?? null, validarEvidencia, observarEvidencia, reemplazarEvidencia, cargarEvidencia, actividadSeleccionadaId, setActividadSeleccionadaId, actividadSeleccionada: actividades.find(a => a.id === actividadSeleccionadaId) ?? null, resumen, restablecerDemo: () => setActividades(structuredClone(ACTIVIDADES_SEGUIMIENTO_INICIALES)) };
}
