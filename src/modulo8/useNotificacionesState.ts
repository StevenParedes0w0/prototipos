// Módulo 8 — Hook de Estado para Notificaciones por Rol
import { useState, useMemo } from "react";
import { NotificacionItem } from "./types";
import {
  NOTIFICACIONES_DOCENTE,
  NOTIFICACIONES_REVISOR,
  NOTIFICACIONES_ADMIN,
} from "./mockDataAuditoria";

export function useNotificacionesState(userRole: "docente" | "revisor" | "admin") {
  const [notificacionesDocente, setNotificacionesDocente] = useState<NotificacionItem[]>(NOTIFICACIONES_DOCENTE);
  const [notificacionesRevisor, setNotificacionesRevisor] = useState<NotificacionItem[]>(NOTIFICACIONES_REVISOR);
  const [notificacionesAdmin, setNotificacionesAdmin] = useState<NotificacionItem[]>(NOTIFICACIONES_ADMIN);

  // Seleccionar notificaciones según el rol activo
  const notificacionesActuales = useMemo(() => {
    if (userRole === "admin") return notificacionesAdmin;
    if (userRole === "revisor") return notificacionesRevisor;
    return notificacionesDocente;
  }, [userRole, notificacionesAdmin, notificacionesRevisor, notificacionesDocente]);

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
  };
}
