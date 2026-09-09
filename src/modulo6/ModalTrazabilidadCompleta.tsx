import React from "react";
import { MedioVerificacion, ActividadEjecucion } from "../modulo5/types";

interface ModalTrazabilidadCompletaProps {
  medio: MedioVerificacion;
  actividad: ActividadEjecucion;
  onClose: () => void;
}

export default function ModalTrazabilidadCompleta({
  medio,
  actividad,
  onClose,
}: ModalTrazabilidadCompletaProps) {
  const eventos = medio.eventosAuditoria || [];

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(15,35,60,0.65)",
      zIndex: 650,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 16,
    }}>
      <div style={{
        background: "#fff",
        borderRadius: 12,
        width: 640,
        maxWidth: "100%",
        maxHeight: "90vh",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
        border: "1px solid #e2e8f0",
        overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{
          padding: "18px 24px",
          background: "#0f2f56",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: "50%",
              background: "rgba(255,255,255,0.12)", color: "#8ab8d8",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "#fff", margin: 0, fontFamily: "'DM Sans',sans-serif" }}>
                Trazabilidad y Auditoría de Evidencia
              </h2>
              <p style={{ fontSize: 12, color: "#8ab8d8", margin: 0 }}>
                Registro inmutable de versiones, cargas, observaciones y validaciones.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#8ab8d8", fontSize: 20, padding: 4 }}
          >
            ✕
          </button>
        </div>

        {/* Activity & Medio Context */}
        <div style={{
          padding: "14px 24px",
          background: "#f8fafc",
          borderBottom: "1px solid #e2e8f0",
          fontSize: 12.5,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 10,
          flexShrink: 0,
        }}>
          <div>
            <div style={{ color: "#64748b", fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>Medio / Actividad</div>
            <div style={{ fontWeight: 700, color: "#1e2a3a", fontSize: 13.5 }}>
              {medio.nombre.toUpperCase()} — <span style={{ color: "#1a4f8a" }}>{actividad.nombre}</span>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <span style={{
              fontSize: 11.5,
              fontWeight: 700,
              padding: "3px 9px",
              borderRadius: 99,
              background: medio.estado === "VALIDADA" ? "#dcfce7" : medio.estado === "OBSERVADA" ? "#fee2e2" : "#fef3c7",
              color: medio.estado === "VALIDADA" ? "#166534" : medio.estado === "OBSERVADA" ? "#991b1b" : "#92400e",
            }}>
              {medio.estado}
            </span>
          </div>
        </div>

        {/* Timeline Content */}
        <div style={{ padding: "24px", overflowY: "auto", flex: 1 }}>
          {/* Versions summary cards */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 10 }}>
              Historial de Versiones del Documento
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {medio.historialVersiones.map((v) => (
                <div
                  key={v.version}
                  style={{
                    background: v.vigente ? "#f0fdf4" : "#f8fafc",
                    border: `1.5px solid ${v.vigente ? "#bbf7d0" : "#e2e8f0"}`,
                    borderRadius: 8,
                    padding: "12px 16px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{
                        fontSize: 12, fontWeight: 800,
                        background: v.vigente ? "#166534" : "#64748b",
                        color: "#fff", padding: "1px 7px", borderRadius: 4,
                      }}>
                        v{v.version}.0
                      </span>
                      <strong style={{ fontSize: 13, color: "#1e2a3a" }}>
                        {v.nombreArchivo}
                      </strong>
                      <span style={{ fontSize: 11.5, color: "#64748b" }}>({v.tamano})</span>
                    </div>

                    <span style={{
                      fontSize: 11, fontWeight: 700,
                      padding: "2px 8px", borderRadius: 4,
                      background: v.vigente ? "#dcfce7" : "#f1f5f9",
                      color: v.vigente ? "#166534" : "#64748b",
                    }}>
                      {v.vigente ? "VIGENTE" : "SUSTITUIDA"}
                    </span>
                  </div>

                  <div style={{ fontSize: 12, color: "#64748b", display: "flex", gap: 12, flexWrap: "wrap" }}>
                    <span>Cargado: <strong>{v.fechaCarga}</strong> por {v.cargadoPor}</span>
                    {v.estadoRevision && (
                      <span>• Estado: <strong style={{
                        color: v.estadoRevision === "VALIDADA" ? "#166534" : v.estadoRevision === "OBSERVADA" ? "#991b1b" : "#92400e"
                      }}>{v.estadoRevision}</strong></span>
                    )}
                  </div>

                  {v.observacion && (
                    <div style={{
                      marginTop: 8,
                      background: "#fff5f5",
                      border: "1px solid #fecaca",
                      borderRadius: 6,
                      padding: "8px 12px",
                      fontSize: 12,
                      color: "#991b1b",
                    }}>
                      <strong>Observación de revisión:</strong> “{v.observacion}”
                    </div>
                  )}

                  {v.motivoReemplazo && (
                    <div style={{
                      marginTop: 8,
                      background: "#f1f5f9",
                      borderRadius: 6,
                      padding: "6px 12px",
                      fontSize: 11.5,
                      color: "#475569",
                    }}>
                      <strong>Motivo de reemplazo:</strong> {v.motivoReemplazo}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Chronological Audit Events */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 12 }}>
              Registro Cronológico de Eventos
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {eventos.length === 0 ? (
                <div style={{ color: "#94a3b8", fontSize: 13, fontStyle: "italic" }}>
                  No se registran eventos adicionales de auditoría.
                </div>
              ) : (
                eventos.map((ev, i) => {
                  const colorMap = {
                    CARGA: { bg: "#eff6ff", border: "#bfdbfe", text: "#1e40af" },
                    REEMPLAZO: { bg: "#fef3c7", border: "#fde68a", text: "#92400e" },
                    OBSERVACION: { bg: "#fee2e2", border: "#fecaca", text: "#991b1b" },
                    VALIDACION: { bg: "#dcfce7", border: "#bbf7d0", text: "#166534" },
                  };
                  const c = colorMap[ev.tipo] || colorMap.CARGA;

                  return (
                    <div
                      key={ev.id || i}
                      style={{
                        display: "flex",
                        gap: 12,
                        alignItems: "flex-start",
                        position: "relative",
                      }}
                    >
                      {/* Badge marker */}
                      <div style={{
                        width: 24, height: 24, borderRadius: "50%",
                        background: c.bg, border: `1.5px solid ${c.border}`,
                        color: c.text, display: "flex", alignItems: "center",
                        justifyContent: "center", fontSize: 11, fontWeight: 800,
                        flexShrink: 0, marginTop: 2,
                      }}>
                        {i + 1}
                      </div>

                      {/* Details box */}
                      <div style={{
                        flex: 1,
                        background: "#fff",
                        border: "1px solid #e2e8f0",
                        borderRadius: 8,
                        padding: "10px 14px",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                          <span style={{ fontSize: 13, fontWeight: 700, color: "#1e2a3a" }}>
                            {ev.titulo}
                          </span>
                          <span style={{ fontSize: 11, color: "#94a3b8" }}>
                            {ev.fecha} — {ev.hora}
                          </span>
                        </div>
                        <div style={{ fontSize: 12, color: "#64748b", marginBottom: 4 }}>
                          Registrado por: <strong style={{ color: "#334155" }}>{ev.usuario}</strong> • Versión: <strong>v{ev.version}.0</strong>
                        </div>
                        {ev.descripcion && (
                          <div style={{ fontSize: 12, color: "#475569" }}>
                            {ev.descripcion}
                          </div>
                        )}
                        {ev.observacionTexto && (
                          <div style={{
                            marginTop: 6,
                            background: "#fff5f5",
                            border: "1px solid #fecaca",
                            borderRadius: 4,
                            padding: "6px 10px",
                            fontSize: 11.5,
                            color: "#991b1b",
                            fontStyle: "italic",
                          }}>
                            “{ev.observacionTexto}”
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: "12px 24px",
          background: "#f8fafc",
          borderTop: "1px solid #e2e8f0",
          display: "flex",
          justifyContent: "flex-end",
          flexShrink: 0,
        }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={onClose}
          >
            Cerrar auditoría
          </button>
        </div>
      </div>
    </div>
  );
}
