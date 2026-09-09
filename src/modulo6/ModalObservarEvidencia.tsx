import React, { useState } from "react";
import { ItemEvidenciaRevisor } from "./types";

interface ModalObservarEvidenciaProps {
  item: ItemEvidenciaRevisor;
  onClose: () => void;
  onConfirmar: (observacion: string) => void;
}

export default function ModalObservarEvidencia({
  item,
  onClose,
  onConfirmar,
}: ModalObservarEvidenciaProps) {
  const [texto, setTexto] = useState(
    "El documento cargado no permite comprobar completamente el desarrollo de la actividad. Revise el contenido y vuelva a cargar la evidencia correspondiente."
  );
  const [error, setError] = useState<string | null>(null);

  const handleConfirmar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!texto.trim()) {
      setError("Debe ingresar obligatoriamente una observación justificada.");
      return;
    }
    onConfirmar(texto.trim());
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
        width: 560,
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
              background: "#fee2e2", color: "#991b1b",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "#1e2a3a", margin: 0, fontFamily: "'DM Sans',sans-serif" }}>
                Registrar observación
              </h2>
              <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>
                La evidencia será devuelta al docente para su correspondiente corrección.
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
        <form onSubmit={handleConfirmar} style={{ padding: "20px 24px" }}>
          {/* Metadata Card */}
          <div style={{
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: 8,
            padding: "12px 16px",
            marginBottom: 16,
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
                <span style={{ color: "#64748b", fontWeight: 600 }}>Versión actual: </span>
                <span style={{
                  background: "#e0f2fe", color: "#0369a1", padding: "1px 6px",
                  borderRadius: 4, fontWeight: 700, fontSize: 11,
                }}>
                  v{item.version}.0
                </span>
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <span style={{ color: "#64748b", fontWeight: 600 }}>Archivo: </span>
                <span style={{ color: "#dc2626", fontWeight: 600 }}>[PDF] {item.archivoNombre}</span>
              </div>
            </div>
          </div>

          {/* Textarea */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 700, color: "#1e2a3a", marginBottom: 6 }}>
              Observación justificada <span style={{ color: "#dc2626" }}>*</span>
            </label>
            <textarea
              className="form-input"
              rows={4}
              value={texto}
              onChange={(e) => {
                setTexto(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Describa con precisión los motivos por los cuales la evidencia no es admitida..."
              style={{ width: "100%", fontSize: 13, resize: "vertical", padding: "10px 12px", lineHeight: 1.5 }}
            />
            {error && (
              <div style={{ color: "#dc2626", fontSize: 12, marginTop: 4, fontWeight: 600 }}>
                {error}
              </div>
            )}
          </div>

          {/* Notice */}
          <div style={{
            background: "#fffbeb",
            border: "1.5px solid #fde68a",
            borderRadius: 8,
            padding: "12px 14px",
            marginBottom: 20,
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 1 }}>
              <path d="M10.29 3.86L1.82 18h20.36L10.29 3.86z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            <p style={{ fontSize: 12, color: "#92400e", margin: 0, lineHeight: 1.45 }}>
              <strong>Aviso normativo:</strong> La evidencia quedará registrada como observada. El docente podrá reemplazarla mientras el plazo ordinario permanezca vigente.
            </p>
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
              style={{ background: "#dc2626", color: "#fff", border: "none", fontWeight: 700 }}
            >
              CONFIRMAR OBSERVACIÓN
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
