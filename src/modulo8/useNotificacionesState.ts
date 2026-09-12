// Módulo 8 — Hook de Estado para Notificaciones por Rol
import { useState, useMemo } from "react";
import { NotificacionItem } from "./types";
import {
  NOTIFICACIONES_DOCENTE,
  NOTIFICACIONES_REVISOR,
  NOTIFICACIONES_ADMIN,
} from "./mockDataAuditoria";

export function useNotificacionesState(userRole: "docente" | "revisor" | "admin", currentUserId?: string) {
  const [notificacionesDocente, setNotificacionesDocente] = useState<NotificacionItem[]>(NOTIFICACIONES_DOCENTE);
  const [notificacionesRevisor, setNotificacionesRevisor] = useState<NotificacionItem[]>(NOTIFICACIONES_REVISOR);
  const [notificacionesAdmin, setNotificacionesAdmin] = useState<NotificacionItem[]>(NOTIFICACIONES_ADMIN);

  // Seleccionar notificaciones según el rol activo
  const notificacionesActuales = useMemo(() => {
    const source = userRole === "admin" ? notificacionesAdmin : userRole === "revisor" ? notificacionesRevisor : notificacionesDocente;
    if (!currentUserId) return source;
    const aliases: Record<string, string[]> = {
      "usr-andrea-01": ["usr-andrea-01", "docente-andrea", "usr-1"],
      "usr-carlos-02": ["usr-carlos-02", "revisor-carlos", "usr-2"],
      "usr-patricia-03": ["usr-patricia-03", "revisor-patricia", "usr-3"],
      "usr-laura-05": ["usr-laura-05", "admin-laura", "usr-5"],
    };
    const accepted = aliases[currentUserId] || [currentUserId];
    return source.filter(item => accepted.includes(item.destinatarioUsuarioId));
  }, [userRole, currentUserId, notificacionesAdmin, notificacionesRevisor, notificacionesDocente]);

  const agregarNotificacion = (item: NotificacionItem) => {
    const add = (prev: NotificacionItem[]) => prev.some(existing => existing.id === item.id) ? prev : [item, ...prev];
    if (item.destinatarioRol === "Administrador") setNotificacionesAdmin(add);
    else if (item.destinatarioRol === "Revisor") setNotificacionesRevisor(add);
    else setNotificacionesDocente(add);
  };

  // Contador de no leídas reactivo
  const noLeidasCount = useMemo(() => {
    return notificacionesActuales.filter((n) => !n.leida).length;
  }, [notificacionesActuales]);

  // Marcar una notificación como leída
  const marcarLeida = (id: string) => {
    const updateFn = (prev: NotificacionItem[]) =>
      prev.map((item) => (item.id === id ? { ...item, leida: true } : item));

    if (userRole === "admin") {
      setNotificacionesAdmin(updateFn);
    } else if (userRole === "revisor") {
      setNotificacionesRevisor(updateFn);
    } else {
      setNotificacionesDocente(updateFn);
    }
  };

  // Alternar estado de lectura (para pruebas de usuario)
  const toggleLeida = (id: string) => {
    const updateFn = (prev: NotificacionItem[]) =>
      prev.map((item) => (item.id === id ? { ...item, leida: !item.leida } : item));

    if (userRole === "admin") {
      setNotificacionesAdmin(updateFn);
    } else if (userRole === "revisor") {
      setNotificacionesRevisor(updateFn);
    } else {
      setNotificacionesDocente(updateFn);
    }
  };

  // Marcar todas las notificaciones del rol actual como leídas
  const marcarTodasLeidas = () => {
    const updateFn = (prev: NotificacionItem[]) =>
      prev.map((item) => ({ ...item, leida: true }));

    if (userRole === "admin") {
      setNotificacionesAdmin(updateFn);
    } else if (userRole === "revisor") {
      setNotificacionesRevisor(updateFn);
    } else {
      setNotificacionesDocente(updateFn);
    }
  };

  // Restablecer escenario demo para pruebas
  const restablecerDemo = () => {
    setNotificacionesDocente(NOTIFICACIONES_DOCENTE);
    setNotificacionesRevisor(NOTIFICACIONES_REVISOR);
    setNotificacionesAdmin(NOTIFICACIONES_ADMIN);
  };

  return {
    notificaciones: notificacionesActuales,
    noLeidasCount,
    marcarLeida,
    toggleLeida,
    marcarTodasLeidas,
    restablecerDemo,
    agregarNotificacion,
  };
}
