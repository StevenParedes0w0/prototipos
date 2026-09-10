import React, { useState } from "react";
import { DocumentObservation } from "./types";

interface ModalDevolverDocumentalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmarDevolucion: (motivo: string) => void;
  tituloDocumento?: string;
  grupo?: string;
  formalVersion?: string;
  reviewRound?: number;
  observacionesActivas: DocumentObservation[];
}

export default function ModalDevolverDocumental({
  isOpen,
  onClose,
  onConfirmarDevolucion,
  tituloDocumento = "Plan de Trabajo",
  grupo = "Comisión de Eventos Académicos",
  formalVersion = "1.0",
  reviewRound = 1,
  observacionesActivas,
}: ModalDevolverDocumentalProps) {
  const [motivo, setMotivo] = useState(
    "Por favor, revise las observaciones registradas y realice las correcciones requeridas antes de reenviar el documento."
  );

  if (!isOpen) return null;

  const hasObservations = observacionesActivas.length > 0;
  const hasMotivo = motivo.trim().length > 0;
  // Regla funcional del prototipo: requerir al menos una observación activa o motivo general antes de confirmar la devolución
  const canDevolver = hasObservations || hasMotivo;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15, 47, 86, 0.48)",
        zIndex: 400,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
        backdropFilter: "blur(2px)",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 14,
          width: 540,
          maxWidth: "100%",
          boxShadow: "0 24px 60px rgba(0,0,0,0.22)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          border: "1px solid #e2e8f0",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px 16px",
            borderBottom: "1px solid #e2e8f0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 9,
                background: "#fef3c7",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#92400e",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 14 4 9 9 4" />
                <path d="M20 20v-7a4 4 0 0 0-4-4H4" />
              </svg>
            </div>
            <div>
              <h2 style={{ fontSize: 17, fontWeight: 800, color: "#1e2a3a", fontFamily: "'DM Sans', sans-serif" }}>
                Devolver documento
              </h2>
              <div style={{ fontSize: 12, color: "#6b7a8d" }}>
                Versión formal {formalVersion} — Ronda {reviewRound}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#94a3b8",
              fontSize: 18,
              padding: 4,
            }}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
          <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.55 }}>
            El documento será devuelto al elaborador para corrección. La devolución <b>no aplica firma electrónica</b> y detiene el flujo hasta la corrección formal.
          </p>

          {/* Document Summary */}
          <div
            style={{
              background: "#f8fafc",
              borderRadius: 8,
              padding: "10px 14px",
              border: "1px solid #e2e8f0",
              fontSize: 12.5,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div>
              <span style={{ color: "#64748b" }}>Documento: </span>
              <span style={{ fontWeight: 600, color: "#1e2a3a" }}>{tituloDocumento}</span>
            </div>
            <div>
              <span style={{ color: "#64748b" }}>Grupo: </span>
              <span style={{ fontWeight: 600, color: "#1e2a3a" }}>{grupo}</span>
            </div>
          </div>

          {/* Active Observations section */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <label className="form-label" style={{ fontSize: 12.5, margin: 0 }}>
                Observaciones activas a remitir ({observacionesActivas.length})
              </label>
              <span style={{ fontSize: 11, color: "#64748b" }}>Página y detalle</span>
            </div>

            {observacionesActivas.length === 0 ? (
              <div
                style={{
                  padding: "12px 14px",
                  borderRadius: 8,
                  background: "#fffbeb",
                  border: "1px solid #fde68a",
                  fontSize: 12.5,
                  color: "#92400e",
                }}
              >
                No hay observaciones puntuales registradas en las páginas. Ingrese un motivo general en el campo inferior para justificar la devolución.
              </div>
            ) : (
              <div
                style={{
                  maxHeight: 160,
                  overflowY: "auto",
                  border: "1px solid #e2e8f0",
                  borderRadius: 8,
                  background: "#fff",
                }}
              >
                {observacionesActivas.map((obs, idx) => (
                  <div
                    key={obs.id}
                    style={{
                      padding: "10px 12px",
                      borderBottom: idx < observacionesActivas.length - 1 ? "1px solid #f1f5f9" : "none",
                      fontSize: 12,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2 }}>
                      <span
                        style={{
                          fontWeight: 700,
                          color: "#1a4f8a",
                          textTransform: "uppercase",
                          fontSize: 10.5,
                        }}
                      >
                        Página {obs.pagina} {obs.seccion ? `— ${obs.seccion}` : ""}
                      </span>
                      <span style={{ color: "#94a3b8", fontSize: 10.5 }}>{obs.revisor}</span>
                    </div>
                    <div style={{ color: "#334155", lineHeight: 1.4 }}>"{obs.texto}"</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Motivo general */}
          <div>
            <label className="form-label required" style={{ fontSize: 12.5, marginBottom: 5 }}>
              Instrucciones / Motivo de devolución para el docente
            </label>
            <textarea
              className="form-textarea"
              rows={3}
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Indique las instrucciones de corrección para el docente..."
              style={{ fontSize: 13, minHeight: 75 }}
            />
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "14px 24px",
            borderTop: "1px solid #e2e8f0",
            background: "#f8fafc",
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
          }}
        >
          <button className="btn btn-ghost" onClick={onClose}>
            Cancelar
          </button>
          <button
            className="btn btn-secondary"
            disabled={!canDevolver}
            onClick={() => {
              onConfirmarDevolucion(motivo);
              onClose();
            }}
            style={{
              background: "#d97706",
              border: "none",
              color: "#fff",
              fontWeight: 700,
              minWidth: 180,
              justifyContent: "center",
            }}
          >
            CONFIRMAR DEVOLUCIÓN
          </button>
        </div>
      </div>
    </div>
  );
}
