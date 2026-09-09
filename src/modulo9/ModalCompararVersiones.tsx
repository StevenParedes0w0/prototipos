import React from "react";
import { PlanHistorico } from "./types";

interface ModalCompararVersionesProps {
  isOpen: boolean;
  plan: PlanHistorico | null;
  onClose: () => void;
}

export default function ModalCompararVersiones({
  isOpen,
  plan,
  onClose,
}: ModalCompararVersionesProps) {
  if (!isOpen || !plan) return null;

  const v1 = plan.versiones.find(v => v.version === "1.0") || plan.versiones[0];
  const v2 = plan.versiones.find(v => v.version === "2.0") || plan.versiones[1] || plan.versiones[0];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15, 23, 42, 0.65)",
        backdropFilter: "blur(2px)",
        zIndex: 1300,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        fontFamily: "'DM Sans', sans-serif",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#ffffff",
          borderRadius: 12,
          width: 760,
          maxWidth: "100%",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
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
              VERSIONAMIENTO FORMAL DEMO
            </span>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: "#1e293b", margin: "4px 0 0" }}>
              Comparar versiones del Plan de Trabajo
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

        {/* Banner Institucional de Regla */}
        <div
          style={{
            background: "#eff6ff",
            borderBottom: "1px solid #bfdbfe",
            padding: "12px 24px",
            fontSize: 12.5,
            color: "#1e40af",
            lineHeight: 1.5,
          }}
        >
          ℹ <strong>Principio de versionamiento institucional:</strong> La Versión 2.0 fue creada formalmente mediante <strong>Decisión institucional DEMO</strong> para la actualización formal del cronograma institucional. <em>La corrección por devolución de observaciones no genera una nueva versión formal.</em>
        </div>

        {/* Body */}
        <div style={{ padding: "20px 24px", overflowY: "auto", flex: 1 }}>
          {/* Metadatos de versiones */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
            {/* Columna Versión 1.0 */}
            <div
              style={{
                background: "#f8fafc",
                border: "1.5px solid #cbd5e1",
                borderRadius: 8,
                padding: "14px 16px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: "#1e293b" }}>Versión 1.0</span>
                <span style={{ fontSize: 11, background: "#e2e8f0", color: "#475569", padding: "1px 6px", borderRadius: 4, fontWeight: 700 }}>
                  BASE
                </span>
              </div>
              <div style={{ fontSize: 12, color: "#64748b" }}>
                <strong>Fecha:</strong> {v1.fecha}
              </div>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                <strong>Origen:</strong> {v1.origen}
              </div>
              <div style={{ fontSize: 11.5, color: "#334155", marginTop: 8, fontStyle: "italic" }}>
                "{v1.descripcion}"
              </div>
            </div>

            {/* Columna Versión 2.0 */}
            <div
              style={{
                background: "#f0fdf4",
                border: "1.5px solid #86efac",
                borderRadius: 8,
                padding: "14px 16px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: "#166534" }}>Versión 2.0</span>
                <span style={{ fontSize: 11, background: "#dcfce7", color: "#15803d", padding: "1px 6px", borderRadius: 4, fontWeight: 700 }}>
                  VIGENTE FINAL
                </span>
              </div>
              <div style={{ fontSize: 12, color: "#64748b" }}>
                <strong>Fecha:</strong> {v2.fecha}
              </div>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                <strong>Aprobado por:</strong> {v2.aprobadoPor}
              </div>
              <div style={{ fontSize: 11.5, color: "#15803d", marginTop: 8, fontStyle: "italic" }}>
                "{v2.descripcion}"
              </div>
            </div>
          </div>

          {/* Tabla comparativa de cambios */}
          <div>
            <h3 style={{ fontSize: 13, fontWeight: 800, color: "#1e293b", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 10 }}>
              Matriz comparativa de modificaciones formales:
            </h3>

            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ background: "#f1f5f9", borderBottom: "1.5px solid #cbd5e1", color: "#334155" }}>
                  <th style={{ padding: "8px 10px", textAlign: "left", width: "30%" }}>Elemento modificado</th>
                  <th style={{ padding: "8px 10px", textAlign: "left", width: "35%" }}>Versión 1.0 (Anterior)</th>
                  <th style={{ padding: "8px 10px", textAlign: "left", width: "35%", color: "#15803d" }}>Versión 2.0 (Actualizada)</th>
                </tr>
              </thead>
              <tbody>
                {(v2.cambios || [
                  { campo: "Cronograma de Actividad 6", v1: "01/05/2026 al 15/05/2026", v2: "10/05/2026 al 30/05/2026" },
                  { campo: "Recursos asignados", v1: "Aula 204 y laboratorio estándar", v2: "Auditorio FISEI y streaming UTA" },
                ]).map((c, idx) => (
                  <tr key={idx} style={{ borderBottom: "1px solid #e2e8f0" }}>
                    <td style={{ padding: "10px", fontWeight: 700, color: "#1e293b" }}>{c.campo}</td>
                    <td style={{ padding: "10px", color: "#64748b", background: "#fafafa" }}>{c.v1}</td>
                    <td style={{ padding: "10px", color: "#166534", background: "#f0fdf4", fontWeight: 600 }}>{c.v2}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "8px 18px",
              borderRadius: 6,
              border: "1px solid #cbd5e1",
              background: "#ffffff",
              color: "#334155",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Cerrar comparación
          </button>
        </div>
      </div>
    </div>
  );
}

