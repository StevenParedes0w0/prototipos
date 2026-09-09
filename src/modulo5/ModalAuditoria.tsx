import React from "react";
import { ActividadEjecucion, MedioVerificacion } from "./types";

interface ModalAuditoriaProps {
  actividad: ActividadEjecucion;
  medio: MedioVerificacion;
  onClose: () => void;
}

export default function ModalAuditoria({
  actividad,
  medio,
  onClose,
}: ModalAuditoriaProps) {
  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(15,47,86,0.55)",
      zIndex: 400,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 16,
    }}>
      <div style={{
        background: "#fff",
        borderRadius: 12,
        width: 580,
        maxWidth: "100%",
        maxHeight: "85vh",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
        overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{
          padding: "18px 24px",
          borderBottom: "1px solid #e2e8f0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#fafbfc",
        }}>
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 800, color: "#1e2a3a", fontFamily: "'DM Sans',sans-serif", margin: 0 }}>
              Trazabilidad y Auditoría de Evidencia
            </h2>
            <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
              Medio de verificación: <strong style={{ color: "#1a4f8a" }}>{medio.nombre}</strong>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#94a3b8",
              fontSize: 20,
              padding: 4,
            }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
          {/* Activity info */}
          <div style={{ background: "#f8fafc", padding: "12px 14px", borderRadius: 8, border: "1px solid #e2e8f0", marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Actividad</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#1e2a3a" }}>{actividad.nombre}</div>
            <div style={{ fontSize: 11.5, color: "#64748b", marginTop: 4 }}>
              Plazo ordinario: {actividad.fechaLimiteExacta}
            </div>
          </div>

          <div style={{ fontSize: 13, fontWeight: 700, color: "#1e2a3a", marginBottom: 12 }}>
            Historial de versiones y registros ({medio.historialVersiones.length})
          </div>

          {medio.historialVersiones.length === 0 ? (
            <div style={{ textAlign: "center", padding: "30px 0", color: "#94a3b8", fontSize: 13 }}>
              No se han registrado cargas de archivo para este medio todavía.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {medio.historialVersiones.slice().reverse().map((ver, idx) => (
                <div
                  key={ver.version}
                  style={{
                    border: `1.5px solid ${ver.vigente ? "#bbf7d0" : "#e2e8f0"}`,
                    background: ver.vigente ? "#f0fdf4" : "#ffffff",
                    borderRadius: 8,
                    padding: "14px 16px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{
                        fontSize: 11,
                        fontWeight: 800,
                        background: ver.vigente ? "#166534" : "#64748b",
                        color: "#fff",
                        padding: "2px 7px",
                        borderRadius: 4,
                      }}>
                        v{ver.version}.0
                      </span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#1e2a3a" }}>
                        {ver.nombreArchivo}
                      </span>
                    </div>
                    {ver.vigente ? (
                      <span style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#166534",
                        background: "#dcfce7",
                        padding: "2px 8px",
                        borderRadius: 99,
                      }}>
                        ✓ VIGENTE
                      </span>
                    ) : (
                      <span style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: "#64748b",
                        background: "#f1f5f9",
                        padding: "2px 8px",
                        borderRadius: 99,
                      }}>
                        Sustituido
                      </span>
                    )}
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 12, color: "#475569", marginTop: 8 }}>
                    <div>
                      <span style={{ color: "#94a3b8" }}>Cargado por:</span> <strong>{ver.cargadoPor}</strong>
                    </div>
                    <div>
                      <span style={{ color: "#94a3b8" }}>Fecha y hora:</span> <strong>{ver.fechaCarga}</strong>
                    </div>
                    <div>
                      <span style={{ color: "#94a3b8" }}>Tamaño:</span> {ver.tamano}
                    </div>
                    {ver.motivoReemplazo && (
                      <div style={{ gridColumn: "1 / -1", background: "#f8fafc", padding: "6px 8px", borderRadius: 4, marginTop: 4 }}>
                        <span style={{ color: "#94a3b8" }}>Motivo de reemplazo:</span> <em>"{ver.motivoReemplazo}"</em>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: "14px 24px",
          borderTop: "1px solid #e2e8f0",
          display: "flex",
          justifyContent: "flex-end",
          background: "#fafbfc",
        }}>
          <button className="btn btn-ghost" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
