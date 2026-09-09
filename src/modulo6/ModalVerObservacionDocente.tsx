import React from "react";
import { MedioVerificacion, ActividadEjecucion } from "../modulo5/types";

interface ModalVerObservacionDocenteProps {
  medio: MedioVerificacion;
  actividad: ActividadEjecucion;
  onClose: () => void;
  onReemplazar?: () => void;
  puedeReemplazar?: boolean;
}

export default function ModalVerObservacionDocente({
  medio,
  actividad,
  onClose,
  onReemplazar,
  puedeReemplazar = false,
}: ModalVerObservacionDocenteProps) {
  const versionObservada = medio.historialVersiones.find(v => v.estadoRevision === "OBSERVADA") 
    || medio.historialVersiones[medio.historialVersiones.length - 1];

  const revisor = medio.revisionActual?.revisadoPor || versionObservada?.revisadoPor || "Ing. Carlos López, Mg.";
  const fechaHora = medio.revisionActual?.fechaRevision || versionObservada?.fechaRevision || "04/09/2026 — 10:20";
  const textoObservacion = medio.revisionActual?.observacion 
    || versionObservada?.observacion 
    || "La evidencia presentada no permite verificar completamente el cumplimiento de la actividad. Revise el contenido y vuelva a cargar la evidencia correspondiente.";

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(15,35,60,0.65)",
      zIndex: 600,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 16,
    }}>
      <div style={{
        background: "#fff",
        borderRadius: 12,
        width: 540,
        maxWidth: "100%",
        boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
        border: "1px solid #e2e8f0",
        overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{
          padding: "18px 24px",
          background: "#fff5f5",
          borderBottom: "1.5px solid #fecaca",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: "50%",
              background: "#fee2e2", color: "#991b1b",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "#991b1b", margin: 0, fontFamily: "'DM Sans',sans-serif" }}>
                Observación del revisor
              </h2>
              <p style={{ fontSize: 12, color: "#7f1d1d", margin: 0 }}>
                Detalle formal de las observaciones registradas por la comisión.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", fontSize: 20, padding: 4 }}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "20px 24px" }}>
          {/* Metadata */}
          <div style={{
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: 8,
            padding: "14px 18px",
            marginBottom: 18,
            fontSize: 12.5,
          }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 14px" }}>
              <div>
                <span style={{ color: "#64748b", fontWeight: 600 }}>Actividad: </span>
                <strong style={{ color: "#1e2a3a" }}>{actividad.nombre}</strong>
              </div>
              <div>
                <span style={{ color: "#64748b", fontWeight: 600 }}>Medio: </span>
                <strong style={{ color: "#1a4f8a" }}>{medio.nombre}</strong>
              </div>
              <div>
                <span style={{ color: "#64748b", fontWeight: 600 }}>Revisor: </span>
                <strong style={{ color: "#1e2a3a" }}>{revisor}</strong>
              </div>
              <div>
                <span style={{ color: "#64748b", fontWeight: 600 }}>Fecha / Hora: </span>
                <strong style={{ color: "#1e2a3a" }}>{fechaHora}</strong>
              </div>
              <div>
                <span style={{ color: "#64748b", fontWeight: 600 }}>Versión evaluada: </span>
                <span style={{
                  background: "#fee2e2", color: "#991b1b", padding: "1px 6px",
                  borderRadius: 4, fontWeight: 700, fontSize: 11,
                }}>
                  v{versionObservada?.version || 1}.0
                </span>
              </div>
              <div>
                <span style={{ color: "#64748b", fontWeight: 600 }}>Plazo de entrega: </span>
                <span style={{ color: "#b45309", fontWeight: 600 }}>{actividad.fechaLimiteExacta}</span>
              </div>
            </div>
          </div>

          {/* Observation text */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 6 }}>
              Texto de la observación:
            </div>
            <div style={{
              background: "#fff",
              border: "1.5px solid #fca5a5",
              borderRadius: 8,
              padding: "14px 16px",
              fontSize: 13.5,
              color: "#1e293b",
              lineHeight: 1.55,
              fontStyle: "italic",
            }}>
              “{textoObservacion}”
            </div>
          </div>

          {/* Institutional note */}
          <div style={{
            background: "#eff6ff",
            border: "1px solid #bfdbfe",
            borderRadius: 8,
            padding: "10px 14px",
            marginBottom: 20,
            fontSize: 12,
            color: "#1e40af",
          }}>
            Puede sustituir el archivo cargado adjuntando una versión corregida mientras el plazo ordinario de la actividad permanezca vigente.
          </div>

          {/* Actions */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={onClose}
            >
              Cerrar
            </button>
            {puedeReemplazar && onReemplazar && (
              <button
                className="btn btn-sm"
                onClick={() => {
                  onClose();
                  onReemplazar();
                }}
                style={{ background: "#fef3c7", color: "#92400e", border: "1px solid #fde68a", fontWeight: 700 }}
              >
                REEMPLAZAR EVIDENCIA
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
