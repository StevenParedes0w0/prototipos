import React, { useRef, useEffect } from "react";
import { NotificacionItem } from "./types";

interface NotificacionesDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  notificaciones: NotificacionItem[];
  noLeidasCount: number;
  onMarcarLeida: (id: string) => void;
  onMarcarTodasLeidas: () => void;
  onNavigateToAll: () => void;
  onSelectAction: (notif: NotificacionItem) => void;
}

export default function NotificacionesDropdown({
  isOpen,
  onClose,
  notificaciones,
  noLeidasCount,
  onMarcarLeida,
  onMarcarTodasLeidas,
  onNavigateToAll,
  onSelectAction,
}: NotificacionesDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const ultimasNotificaciones = notificaciones.slice(0, 5);

  return (
    <div
      ref={dropdownRef}
      style={{
        position: "absolute",
        top: 48,
        right: -10,
        width: 380,
        maxWidth: "92vw",
        background: "#ffffff",
        borderRadius: 10,
        boxShadow: "0 10px 30px -5px rgba(15, 23, 42, 0.18), 0 0 0 1px rgba(15, 23, 42, 0.08)",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "14px 18px",
          borderBottom: "1px solid #e2e8f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#f8fafc",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#1e293b" }}>Notificaciones</span>
          {noLeidasCount > 0 && (
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                background: "#fee2e2",
                color: "#b91c1c",
                padding: "1px 7px",
                borderRadius: 99,
              }}
            >
              {noLeidasCount} no leída{noLeidasCount > 1 ? "s" : ""}
            </span>
          )}
        </div>
        {noLeidasCount > 0 && (
          <button
            onClick={onMarcarTodasLeidas}
            style={{
              background: "none",
              border: "none",
              color: "#1a4f8a",
              fontSize: 11.5,
              fontWeight: 600,
              cursor: "pointer",
              padding: "2px 6px",
              borderRadius: 4,
            }}
            title="Marcar todas como leídas"
          >
            Marcar todas leídas
          </button>
        )}
      </div>

      {/* List */}
      <div style={{ maxHeight: 380, overflowY: "auto" }}>
        {ultimasNotificaciones.length === 0 ? (
          <div style={{ padding: "32px 20px", textAlign: "center", color: "#64748b" }}>
            <div style={{ fontSize: 24, marginBottom: 8, color: "#94a3b8" }}>🔔</div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>No tiene notificaciones pendientes</div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>
              Las novedades institucionales se mostrarán aquí.
            </div>
          </div>
        ) : (
          ultimasNotificaciones.map((n) => {
            const isUnread = !n.leida;
            return (
              <div
                key={n.id}
                onClick={() => {
                  if (isUnread) onMarcarLeida(n.id);
                  onSelectAction(n);
                  onClose();
                }}
                style={{
                  padding: "12px 18px",
                  borderBottom: "1px solid #f1f5f9",
                  background: isUnread ? "#f0f7ff" : "#ffffff",
                  cursor: "pointer",
                  transition: "background 0.15s ease",
                  display: "flex",
                  gap: 12,
                  alignItems: "flex-start",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = isUnread ? "#e5f0fc" : "#f8fafc";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = isUnread ? "#f0f7ff" : "#ffffff";
                }}
              >
                {/* Status dot */}
                <div style={{ paddingTop: 4, flexShrink: 0 }}>
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: isUnread ? "#2563eb" : "transparent",
                    }}
                  />
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 6 }}>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: isUnread ? 700 : 600,
                        color: isUnread ? "#0f172a" : "#334155",
                        lineHeight: 1.3,
                      }}
                    >
                      {n.titulo}
                    </span>
                    <span style={{ fontSize: 11, color: "#94a3b8", flexShrink: 0 }}>{n.tiempoRelativo}</span>
                  </div>

                  <p
                    style={{
                      fontSize: 12,
                      color: "#475569",
                      marginTop: 3,
                      marginBottom: 6,
                      lineHeight: 1.4,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {n.mensaje}
                  </p>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                    <span
                      style={{
                        fontSize: 11,
                        color: "#64748b",
                        background: isUnread ? "#dbeafe" : "#f1f5f9",
                        padding: "2px 7px",
                        borderRadius: 4,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        maxWidth: "60%",
                      }}
                    >
                      {n.objetoRelacionado.grupo || n.objetoRelacionado.nombre}
                    </span>

                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#1a4f8a",
                        display: "flex",
                        alignItems: "center",
                        gap: 3,
                      }}
                    >
                      {n.objetoRelacionado.accionLabel} →
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "10px 16px",
          background: "#f8fafc",
          borderTop: "1px solid #e2e8f0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <button
          onClick={() => {
            onMarcarTodasLeidas();
          }}
          disabled={noLeidasCount === 0}
          style={{
            background: "none",
            border: "none",
            color: noLeidasCount === 0 ? "#94a3b8" : "#475569",
            fontSize: 11.5,
            fontWeight: 600,
            cursor: noLeidasCount === 0 ? "default" : "pointer",
            padding: "4px 6px",
          }}
        >
          MARCAR TODAS COMO LEÍDAS
        </button>

        <button
          onClick={() => {
            onNavigateToAll();
            onClose();
          }}
          style={{
            background: "#1a4f8a",
            color: "#ffffff",
            border: "none",
            borderRadius: 6,
            fontSize: 11.5,
            fontWeight: 700,
            cursor: "pointer",
            padding: "6px 12px",
            transition: "background 0.15s ease",
          }}
        >
          VER TODAS LAS NOTIFICACIONES
        </button>
      </div>
    </div>
  );
}
