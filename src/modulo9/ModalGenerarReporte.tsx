import React, { useState } from "react";
import { ReportePlanItem, TipoReporteGenerar, FormatoReporte } from "./types";

interface ModalGenerarReporteProps {
  isOpen: boolean;
  plan: ReportePlanItem | null;
  onClose: () => void;
  onGenerar: (tipo: TipoReporteGenerar, formato: FormatoReporte) => void;
}

export default function ModalGenerarReporte({
  isOpen,
  plan,
  onClose,
  onGenerar,
}: ModalGenerarReporteProps) {
  const [tipo, setTipo] = useState<TipoReporteGenerar>("resumen_plan");
  const [formato, setFormato] = useState<FormatoReporte>("PDF");

  if (!isOpen || !plan) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15, 23, 42, 0.6)",
        backdropFilter: "blur(2px)",
        zIndex: 1100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        fontFamily: "'DM Sans', sans-serif",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#ffffff",
          borderRadius: 12,
          width: 520,
          maxWidth: "100%",
          boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
          border: "1px solid #e2e8f0",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "18px 24px",
            borderBottom: "1px solid #e2e8f0",
            background: "#f8fafc",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <span
              style={{
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                background: "#0f2f56",
                color: "#ffffff",
                padding: "2px 8px",
                borderRadius: 4,
              }}
            >
              GENERACIÓN DOCUMENTAL DEMO
            </span>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: "#1e293b", margin: "4px 0 0" }}>
              Generar reporte institucional
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: 20,
              cursor: "pointer",
              color: "#94a3b8",
            }}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "20px 24px" }}>
          {/* Plan Info */}
          <div
            style={{
              background: "#eff6ff",
              border: "1px solid #bfdbfe",
              borderRadius: 8,
              padding: "12px 16px",
              marginBottom: 20,
              fontSize: 13,
            }}
          >
            <div style={{ fontWeight: 700, color: "#1e40af" }}>{plan.nombre}</div>
            <div style={{ color: "#3b82f6", fontSize: 12, marginTop: 2 }}>
              {plan.grupo} • {plan.periodo} • Versión {plan.version}
            </div>
          </div>

          {/* Tipo de reporte */}
          <div style={{ marginBottom: 18 }}>
            <label style={{ display: "block", fontSize: 12.5, fontWeight: 700, color: "#334155", marginBottom: 8 }}>
              Tipo de reporte:
            </label>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { id: "resumen_plan", label: "Resumen del Plan de Trabajo", desc: "Consolidado de estado, totales documentales y cumplimiento" },
                { id: "actividades_evidencias", label: "Actividades y evidencias detalladas", desc: "Matriz completa con medios, fechas límite y estado documental" },
                { id: "historial_validacion", label: "Historial de validación técnica", desc: "Detalle de evidencias validadas y observaciones registradas" },
              ].map((opt) => (
                <label
                  key={opt.id}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                    padding: "10px 12px",
                    borderRadius: 8,
                    border: `1.5px solid ${tipo === opt.id ? "#1a4f8a" : "#e2e8f0"}`,
                    background: tipo === opt.id ? "#f0f7ff" : "#ffffff",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="radio"
                    name="tipoReporte"
                    checked={tipo === opt.id}
                    onChange={() => setTipo(opt.id as TipoReporteGenerar)}
                    style={{ marginTop: 2 }}
                  />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#1e293b" }}>{opt.label}</div>
                    <div style={{ fontSize: 11.5, color: "#64748b" }}>{opt.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Formato */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 12.5, fontWeight: 700, color: "#334155", marginBottom: 8 }}>
              Formato de salida:
            </label>
            <div style={{ display: "flex", gap: 12 }}>
              {(["PDF", "Excel"] as FormatoReporte[]).map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFormato(f)}
                  style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: 8,
                    border: `1.5px solid ${formato === f ? "#1a4f8a" : "#cbd5e1"}`,
                    background: formato === f ? "#0f2f56" : "#ffffff",
                    color: formato === f ? "#ffffff" : "#334155",
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  <span>{f === "PDF" ? "📄" : "📊"}</span>
                  {f} {f === "PDF" ? "(Vista previa institucional)" : "(Hoja de cálculo DEMO)"}
                </button>
              ))}
            </div>
          </div>

          {/* Nota institucional */}
          <div
            style={{
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: 8,
              padding: "10px 14px",
              fontSize: 12,
              color: "#64748b",
            }}
          >
            ℹ <strong>Demostración de prototipo:</strong> La generación presentará una vista previa institucional de alta fidelidad con opciones de descarga simuladas.
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
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "8px 16px",
              borderRadius: 6,
              border: "1px solid #cbd5e1",
              background: "#ffffff",
              color: "#475569",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => onGenerar(tipo, formato)}
            style={{
              padding: "8px 20px",
              borderRadius: 6,
              border: "none",
              background: "#1a4f8a",
              color: "#ffffff",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            GENERAR VISTA PREVIA — DEMO
          </button>
        </div>
      </div>
    </div>
  );
}

