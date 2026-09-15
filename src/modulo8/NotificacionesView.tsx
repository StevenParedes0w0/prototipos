import React, { useState, useMemo } from "react";
import { NotificacionItem, TipoNotificacion } from "./types";
import { Info } from "../components/icons";

interface NotificacionesViewProps {
  notificaciones: NotificacionItem[];
  noLeidasCount: number;
  onMarcarLeida: (id: string) => void;
  onToggleLeida: (id: string) => void;
  onMarcarTodasLeidas: () => void;
  onRestablecerDemo: () => void;
  onActionNavigate: (notif: NotificacionItem) => void;
}

export default function NotificacionesView({
  notificaciones,
  noLeidasCount,
  onMarcarLeida,
  onToggleLeida,
  onMarcarTodasLeidas,
  onRestablecerDemo,
  onActionNavigate,
}: NotificacionesViewProps) {
  const [tabFiltro, setTabFiltro] = useState<"todas" | "no_leidas" | "leidas">("todas");
  const [filtroTipo, setFiltroTipo] = useState<string>("TODOS");
  const [filtroPeriodo, setFiltroPeriodo] = useState<string>("Julio – Diciembre 2026");
  const [busqueda, setBusqueda] = useState<string>("");

  // Métricas
  const totalHoy = useMemo(() => {
    return notificaciones.filter((n) => n.fechaHora.includes("07/09/2026")).length;
  }, [notificaciones]);

  const totalEstaSemana = notificaciones.length;

  // Filtrado de lista
  const notificacionesFiltradas = useMemo(() => {
    return notificaciones.filter((n) => {
      // Filtro de pestaña
      if (tabFiltro === "no_leidas" && n.leida) return false;
      if (tabFiltro === "leidas" && !n.leida) return false;

      // Filtro de tipo
      if (filtroTipo !== "TODOS" && n.tipo !== filtroTipo) return false;

      // Búsqueda de texto
      if (busqueda.trim()) {
        const query = busqueda.toLowerCase();
        const coincide =
          n.titulo.toLowerCase().includes(query) ||
          n.mensaje.toLowerCase().includes(query) ||
          (n.objetoRelacionado.grupo && n.objetoRelacionado.grupo.toLowerCase().includes(query)) ||
          (n.objetoRelacionado.autor && n.objetoRelacionado.autor.toLowerCase().includes(query)) ||
          n.objetoRelacionado.nombre.toLowerCase().includes(query);
        if (!coincide) return false;
      }

      return true;
    });
  }, [notificaciones, tabFiltro, filtroTipo, busqueda]);

  const getTipoLabel = (tipo: TipoNotificacion): { label: string; color: string; bg: string } => {
    switch (tipo) {
      case "PLAN_DEVUELTO":
        return { label: "Plan devuelto", color: "#b91c1c", bg: "#fee2e2" };
      case "PLAN_APROBADO":
        return { label: "Plan aprobado", color: "#15803d", bg: "#dcfce7" };
      case "PLAN_PENDIENTE_REVISION":
        return { label: "Plan para revisión", color: "#0369a1", bg: "#e0f2fe" };
      case "PLAN_CORREGIDO":
        return { label: "Corrección recibida", color: "#b45309", bg: "#fef3c7" };
      case "ACTIVIDAD_PROXIMA":
        return { label: "Próxima a vencer", color: "#b45309", bg: "#fef3c7" };
      case "ACTIVIDAD_VENCE_HOY":
        return { label: "Vence hoy", color: "#b91c1c", bg: "#fee2e2" };
      case "PLAZO_VENCIDO":
        return { label: "Plazo vencido", color: "#991b1b", bg: "#fee2e2" };
      case "EVIDENCIA_CARGADA":
        return { label: "Evidencia nueva", color: "#0284c7", bg: "#e0f2fe" };
      case "EVIDENCIA_REEMPLAZADA":
        return { label: "Evidencia reemplazada", color: "#b45309", bg: "#fef3c7" };
      case "EVIDENCIA_OBSERVADA":
        return { label: "Evidencia observada", color: "#b91c1c", bg: "#fee2e2" };
      case "EVIDENCIA_VALIDADA":
        return { label: "Evidencia validada", color: "#15803d", bg: "#dcfce7" };
      case "ADMIN_GRUPO_SIN_FLUJO":
        return { label: "Alerta institucional", color: "#b45309", bg: "#fef3c7" };
      case "ADMIN_PERIODO_PREPARADO":
        return { label: "Período académico", color: "#4338ca", bg: "#e0e7ff" };
      case "ADMIN_CATALOGO_ACTUALIZADO":
        return { label: "Asignación a grupo", color: "#475569", bg: "#f1f5f9" };
      default:
        return { label: "Notificación", color: "#334155", bg: "#f1f5f9" };
    }
  };

  return (
    <div style={{ padding: "28px 32px", maxWidth: 1200, margin: "0 auto", fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1e293b", margin: 0, letterSpacing: "-0.02em" }}>
            Centro de Notificaciones
          </h1>
          <p style={{ fontSize: 14, color: "#64748b", marginTop: 4, marginBottom: 0 }}>
            Consulte las novedades y acciones relacionadas con sus Planes de Trabajo.
          </p>
        </div>

        {/* Acciones de cabecera */}
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {noLeidasCount > 0 && (
            <button
              onClick={onMarcarTodasLeidas}
              style={{
                background: "#ffffff",
                border: "1.5px solid #cbd5e1",
                color: "#1e293b",
                borderRadius: 8,
                padding: "8px 14px",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "#f8fafc";
                (e.currentTarget as HTMLElement).style.borderColor = "#94a3b8";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "#ffffff";
                (e.currentTarget as HTMLElement).style.borderColor = "#cbd5e1";
              }}
            >
              <span>✓✓</span> MARCAR TODAS COMO LEÍDAS
            </button>
          )}

          <button
            onClick={onRestablecerDemo}
            title="Restablecer valores iniciales del escenario DEMO"
            style={{
              background: "#f1f5f9",
              border: "1px solid #e2e8f0",
              color: "#64748b",
              borderRadius: 8,
              padding: "8px 12px",
              fontSize: 12.5,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            ↻ Restablecer DEMO
          </button>
        </div>
      </div>

      {/* Tarjetas de Métricas */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
        {/* NO LEÍDAS */}
        <div
          style={{
            background: "#ffffff",
            padding: "18px 20px",
            borderRadius: 10,
            border: "1px solid #e2e8f0",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          <span style={{ fontSize: 11.5, fontWeight: 700, color: "#64748b", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            No leídas
          </span>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ fontSize: 30, fontWeight: 800, color: noLeidasCount > 0 ? "#dc2626" : "#10b981", lineHeight: 1.1 }}>
              {noLeidasCount}
            </span>
            {noLeidasCount > 0 ? (
              <span style={{ fontSize: 12, color: "#dc2626", fontWeight: 600 }}>sin leer</span>
            ) : (
              <span style={{ fontSize: 12, color: "#10b981", fontWeight: 600 }}>al día</span>
            )}
          </div>
        </div>

        {/* HOY */}
        <div
          style={{
            background: "#ffffff",
            padding: "18px 20px",
            borderRadius: 10,
            border: "1px solid #e2e8f0",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          <span style={{ fontSize: 11.5, fontWeight: 700, color: "#64748b", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Hoy (07/09/2026)
          </span>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ fontSize: 30, fontWeight: 800, color: "#1e293b", lineHeight: 1.1 }}>{totalHoy}</span>
            <span style={{ fontSize: 12, color: "#64748b" }}>novedades registradas</span>
          </div>
        </div>

        {/* ESTA SEMANA */}
        <div
          style={{
            background: "#ffffff",
            padding: "18px 20px",
            borderRadius: 10,
            border: "1px solid #e2e8f0",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          <span style={{ fontSize: 11.5, fontWeight: 700, color: "#64748b", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Esta semana
          </span>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ fontSize: 30, fontWeight: 800, color: "#1e293b", lineHeight: 1.1 }}>{totalEstaSemana}</span>
            <span style={{ fontSize: 12, color: "#64748b" }}>notificaciones en historial</span>
          </div>
        </div>
      </div>

      {/* Barra de Filtros y Pestañas */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: 10,
          border: "1px solid #e2e8f0",
          padding: "14px 18px",
          marginBottom: 20,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 14,
        }}
      >
        {/* Pestañas: Todas | No leídas | Leídas */}
        <div style={{ display: "flex", gap: 6, background: "#f1f5f9", padding: 4, borderRadius: 8 }}>
          <button
            onClick={() => setTabFiltro("todas")}
            style={{
              background: tabFiltro === "todas" ? "#ffffff" : "transparent",
              color: tabFiltro === "todas" ? "#1e293b" : "#64748b",
              fontWeight: tabFiltro === "todas" ? 700 : 500,
              border: "none",
              borderRadius: 6,
              padding: "6px 14px",
              fontSize: 13,
              cursor: "pointer",
              boxShadow: tabFiltro === "todas" ? "0 1px 2px rgba(0,0,0,0.08)" : "none",
            }}
          >
            Todas ({notificaciones.length})
          </button>
          <button
            onClick={() => setTabFiltro("no_leidas")}
            style={{
              background: tabFiltro === "no_leidas" ? "#ffffff" : "transparent",
              color: tabFiltro === "no_leidas" ? "#dc2626" : "#64748b",
              fontWeight: tabFiltro === "no_leidas" ? 700 : 500,
              border: "none",
              borderRadius: 6,
              padding: "6px 14px",
              fontSize: 13,
              cursor: "pointer",
              boxShadow: tabFiltro === "no_leidas" ? "0 1px 2px rgba(0,0,0,0.08)" : "none",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            No leídas
            {noLeidasCount > 0 && (
              <span style={{ background: "#fee2e2", color: "#b91c1c", fontSize: 11, padding: "1px 6px", borderRadius: 99, fontWeight: 700 }}>
                {noLeidasCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setTabFiltro("leidas")}
            style={{
              background: tabFiltro === "leidas" ? "#ffffff" : "transparent",
              color: tabFiltro === "leidas" ? "#1e293b" : "#64748b",
              fontWeight: tabFiltro === "leidas" ? 700 : 500,
              border: "none",
              borderRadius: 6,
              padding: "6px 14px",
              fontSize: 13,
              cursor: "pointer",
              boxShadow: tabFiltro === "leidas" ? "0 1px 2px rgba(0,0,0,0.08)" : "none",
            }}
          >
            Leídas ({notificaciones.length - noLeidasCount})
          </button>
        </div>

        {/* Controles de Búsqueda, Tipo y Período */}
        <div style={{ display: "flex", gap: 10, flex: 1, justifyContent: "flex-end", minWidth: 280, flexWrap: "wrap" }}>
          <select
            value={filtroPeriodo}
            onChange={(e) => setFiltroPeriodo(e.target.value)}
            style={{
              border: "1.5px solid #cbd5e1",
              borderRadius: 8,
              padding: "7px 12px",
              fontSize: 13,
              color: "#334155",
              background: "#ffffff",
              cursor: "pointer",
            }}
          >
            <option value="Julio – Diciembre 2026">Período: Julio – Diciembre 2026</option>
          </select>

          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            style={{
              border: "1.5px solid #cbd5e1",
              borderRadius: 8,
              padding: "7px 12px",
              fontSize: 13,
              color: "#334155",
              background: "#ffffff",
              cursor: "pointer",
            }}
          >
            <option value="TODOS">Todos los tipos</option>
            <option value="PLAN_DEVUELTO">Planes devueltos</option>
            <option value="PLAN_APROBADO">Planes aprobados</option>
            <option value="PLAN_PENDIENTE_REVISION">Planes para revisión</option>
            <option value="EVIDENCIA_OBSERVADA">Evidencias observadas</option>
            <option value="EVIDENCIA_VALIDADA">Evidencias validadas</option>
            <option value="EVIDENCIA_CARGADA">Evidencias cargadas</option>
            <option value="ACTIVIDAD_PROXIMA">Actividades próximas a vencer</option>
          </select>

          <input
            type="text"
            placeholder="Buscar por título, grupo o autor..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{
              border: "1.5px solid #cbd5e1",
              borderRadius: 8,
              padding: "7px 14px",
              fontSize: 13,
              color: "#1e293b",
              width: 260,
              outline: "none",
            }}
          />
        </div>
      </div>

      {/* Lista Cronológica */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {notificacionesFiltradas.length === 0 ? (
          /* Pantalla 05 — Estado Vacío */
          <div
            style={{
              background: "#ffffff",
              borderRadius: 10,
              border: "1px dashed #cbd5e1",
              padding: "48px 24px",
              textAlign: "center",
            }}
          >
            <Info aria-hidden="true" style={{width:32,height:32,color:"#94a3b8",margin:"0 auto 12px"}}/>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#334155", margin: "0 0 6px" }}>
              No hay notificaciones en esta categoría
            </h3>
            <p style={{ fontSize: 13.5, color: "#64748b", margin: "0 0 16px" }}>
              No se encontraron elementos que coincidan con los filtros aplicados.
            </p>
            <button
              onClick={() => {
                setTabFiltro("todas");
                setFiltroTipo("TODOS");
                setBusqueda("");
              }}
              style={{
                background: "#1a4f8a",
                color: "#ffffff",
                border: "none",
                borderRadius: 6,
                padding: "8px 16px",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              VER TODAS LAS NOTIFICACIONES
            </button>
          </div>
        ) : (
          notificacionesFiltradas.map((n) => {
            const isUnread = !n.leida;
            const tipoBadge = getTipoLabel(n.tipo);

            return (
              <div
                key={n.id}
                style={{
                  background: isUnread ? "#f0f7ff" : "#ffffff",
                  borderRadius: 10,
                  border: isUnread ? "1.5px solid #bfdbfe" : "1px solid #e2e8f0",
                  padding: "18px 22px",
                  display: "flex",
                  gap: 16,
                  alignItems: "flex-start",
                  transition: "box-shadow 0.15s ease, background 0.15s ease",
                  boxShadow: isUnread ? "0 2px 6px rgba(37,99,235,0.06)" : "0 1px 2px rgba(0,0,0,0.03)",
                }}
              >
                {/* Status indicator dot */}
                <div style={{ paddingTop: 6, flexShrink: 0 }}>
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: isUnread ? "#2563eb" : "#cbd5e1",
                    }}
                    title={isUnread ? "No leída" : "Leída"}
                  />
                </div>

                {/* Content body */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  {/* Top line badges & timestamps */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 6 }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                      {/* Read status badge */}
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 800,
                          letterSpacing: "0.05em",
                          padding: "2px 8px",
                          borderRadius: 4,
                          background: isUnread ? "#2563eb" : "#e2e8f0",
                          color: isUnread ? "#ffffff" : "#64748b",
                        }}
                      >
                        {isUnread ? "NO LEÍDA" : "LEÍDA"}
                      </span>

                      {/* Notification type badge */}
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          padding: "2px 8px",
                          borderRadius: 4,
                          background: tipoBadge.bg,
                          color: tipoBadge.color,
                        }}
                      >
                        {tipoBadge.label}
                      </span>

                      {/* Grupo relacionado */}
                      {n.objetoRelacionado.grupo && (
                        <span style={{ fontSize: 12, color: "#475569", fontWeight: 600 }}>
                          • {n.objetoRelacionado.grupo}
                        </span>
                      )}
                    </div>

                    {/* Datetime institucional */}
                    <div style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 12, color: "#64748b" }}>
                      <span style={{ fontWeight: 600, color: "#334155" }}>{n.fechaHora}</span>
                      <span>({n.tiempoRelativo})</span>
                    </div>
                  </div>

                  {/* Title & Message */}
                  <h3
                    style={{
                      fontSize: 15.5,
                      fontWeight: isUnread ? 800 : 700,
                      color: isUnread ? "#0f172a" : "#1e293b",
                      margin: "0 0 6px",
                      lineHeight: 1.3,
                    }}
                  >
                    {n.titulo}
                  </h3>

                  <p style={{ fontSize: 13.5, color: "#334155", margin: "0 0 12px", lineHeight: 1.55 }}>
                    {n.mensaje}
                  </p>

                  {/* Metadata and Contextual Action */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flexWrap: "wrap",
                      gap: 12,
                      paddingTop: 10,
                      borderTop: isUnread ? "1px solid #dbeafe" : "1px solid #f1f5f9",
                    }}
                  >
                    <div style={{ fontSize: 12, color: "#64748b", display: "flex", gap: 14, flexWrap: "wrap" }}>
                      {n.objetoRelacionado.autor && (
                        <span>
                          <strong>Por:</strong> {n.objetoRelacionado.autor}
                        </span>
                      )}
                      <span>
                        <strong>Objeto:</strong> {n.objetoRelacionado.nombre}
                      </span>
                    </div>

                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      {/* Toggle read status button */}
                      <button
                        onClick={() => onToggleLeida(n.id)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#64748b",
                          fontSize: 12,
                          fontWeight: 500,
                          cursor: "pointer",
                          padding: "5px 8px",
                          borderRadius: 4,
                          textDecoration: "underline",
                        }}
                      >
                        {isUnread ? "Marcar como leída" : "Marcar como no leída"}
                      </button>

                      {/* Contextual navigation action */}
                      <button
                        onClick={() => {
                          if (isUnread) onMarcarLeida(n.id);
                          onActionNavigate(n);
                        }}
                        style={{
                          background: "#1a4f8a",
                          color: "#ffffff",
                          border: "none",
                          borderRadius: 6,
                          padding: "7px 14px",
                          fontSize: 12.5,
                          fontWeight: 700,
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          transition: "background 0.15s ease",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.background = "#153e6d";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.background = "#1a4f8a";
                        }}
                      >
                        [ {n.objetoRelacionado.accionLabel} ] →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
