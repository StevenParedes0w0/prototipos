import React, { useState } from "react";
import { ItemEvidenciaRevisor } from "./types";

interface ModalValidarEvidenciaProps {
  item: ItemEvidenciaRevisor;
  onClose: () => void;
  onConfirmar: () => void;
}

export default function ModalValidarEvidencia({
  item,
  onClose,
  onConfirmar,
}: ModalValidarEvidenciaProps) {
  const [confirmado, setConfirmado] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleValidar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmado) {
      setError("Debe marcar la casilla confirmando que ha revisado el archivo.");
      return;
    }
    onConfirmar();
  };

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
          background: "#fff",
          borderBottom: "1px solid #e2e8f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 34, height: 34, borderRadius: "50%",
              background: "#dcfce7", color: "#166534",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/>
              </svg>
            </div>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "#1e2a3a", margin: 0, fontFamily: "'DM Sans',sans-serif" }}>
                Validar evidencia
              </h2>
              <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>
                Aprobación formal del medio de verificación presentado.
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

        {/* Content */}
        <form onSubmit={handleValidar} style={{ padding: "20px 24px" }}>
          <p style={{ fontSize: 13.5, color: "#334155", margin: "0 0 16px", lineHeight: 1.5 }}>
            Confirme que ha revisado el archivo correspondiente a este medio de verificación y que cumple satisfactoriamente con la actividad planificada.
          </p>

          {/* Summary Box */}
          <div style={{
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: 8,
            padding: "14px 18px",
            marginBottom: 20,
            fontSize: 12.5,
          }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 16px" }}>
              <div>
                <span style={{ color: "#64748b", fontWeight: 600 }}>Actividad: </span>
                <strong style={{ color: "#1e2a3a" }}>{item.actividadNombre}</strong>
              </div>
              <div>
                <span style={{ color: "#64748b", fontWeight: 600 }}>Docente: </span>
                <strong style={{ color: "#1e2a3a" }}>{item.docente}</strong>
              </div>
              <div>
                <span style={{ color: "#64748b", fontWeight: 600 }}>Medio: </span>
                <strong style={{ color: "#1a4f8a" }}>{item.medioNombre}</strong>
              </div>
              <div>
                <span style={{ color: "#64748b", fontWeight: 600 }}>Versión: </span>
                <span style={{
                  background: "#dcfce7", color: "#166534", padding: "1px 6px",
                  borderRadius: 4, fontWeight: 700, fontSize: 11,
                }}>
                  v{item.version}.0
                </span>
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <span style={{ color: "#64748b", fontWeight: 600 }}>Archivo: </span>
                <span style={{ color: "#dc2626", fontWeight: 600 }}>[PDF] {item.archivoNombre}</span>
                <span style={{ color: "#94a3b8", marginLeft: 6 }}>({item.archivoTamano})</span>
              </div>
            </div>
          </div>

          {/* Checkbox */}
          <div style={{
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            borderRadius: 8,
            padding: "12px 14px",
            marginBottom: 20,
          }}>
            <label style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              cursor: "pointer",
              fontSize: 13,
              color: "#166534",
              fontWeight: 600,
            }}>
              <input
                type="checkbox"
                checked={confirmado}
                onChange={(e) => {
                  setConfirmado(e.target.checked);
                  if (error) setError(null);
                }}
                style={{ width: 16, height: 16, cursor: "pointer" }}
              />
              Confirmo que he revisado esta evidencia y apruebo su contenido.
            </label>
            {error && (
              <div style={{ color: "#dc2626", fontSize: 12, marginTop: 6, fontWeight: 600, paddingLeft: 26 }}>
                {error}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-sm"
              style={{ background: "#166534", color: "#fff", border: "none", fontWeight: 700 }}
            >
              VALIDAR EVIDENCIA
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
