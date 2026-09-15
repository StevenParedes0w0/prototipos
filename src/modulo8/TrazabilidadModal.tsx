import React, { useState } from "react";
import { TrazabilidadObjeto } from "./types";
import {
  TRAZABILIDAD_PLAN_EVENTOS,
  TRAZABILIDAD_EVIDENCIA_ACTA,
  TRAZABILIDAD_USUARIO_ANDREA,
} from "./mockDataAuditoria";
import { ClipboardList, Info, Paperclip, User } from "../components/icons";

interface TrazabilidadModalProps {
  objetoInicial: TrazabilidadObjeto | null;
  onClose: () => void;
}

export default function TrazabilidadModal({
  objetoInicial,
  onClose,
}: TrazabilidadModalProps) {
  // Permitir alternar entre los objetos demo para pruebas
  const [activeTab, setActiveTab] = useState<"plan" | "evidencia" | "usuario">(() => {
    if (objetoInicial?.tipo === "Evidencia") return "evidencia";
    if (objetoInicial?.tipo === "Usuario") return "usuario";
    return "plan";
  });

  if (!objetoInicial) return null;

  const objetoActivo =
    activeTab === "evidencia"
      ? TRAZABILIDAD_EVIDENCIA_ACTA
      : activeTab === "usuario"
      ? TRAZABILIDAD_USUARIO_ANDREA
      : TRAZABILIDAD_PLAN_EVENTOS;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(15, 23, 42, 0.55)",
        backdropFilter: "blur(3px)",
        zIndex: 1200,
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
          width: 780,
          maxWidth: "96vw",
          maxHeight: "90vh",
          background: "#ffffff",
          borderRadius: 12,
          boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 26px",
            borderBottom: "1px solid #e2e8f0",
            background: "#f8fafc",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  background: "#1a4f8a",
                  color: "#ffffff",
                  padding: "2px 8px",
                  borderRadius: 4,
                }}
              >
                TRAZABILIDAD INSTITUCIONAL
              </span>
              <span style={{ fontSize: 12, color: "#64748b" }}>Ciclo de Vida Completo</span>
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", margin: 0 }}>
              {objetoActivo.titulo}
            </h2>
            <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>
              {objetoActivo.subtitulo}
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: 22,
              color: "#64748b",
              cursor: "pointer",
              padding: 4,
              borderRadius: 4,
              lineHeight: 1,
            }}
            title="Cerrar ventana"
          >
            ✕
          </button>
        </div>

        {/* Object Switcher Tabs (Plan vs Evidencia vs Usuario) */}
        <div
          style={{
            display: "flex",
            gap: 8,
            padding: "12px 26px",
            background: "#ffffff",
            borderBottom: "1px solid #f1f5f9",
          }}
        >
          <button
            onClick={() => setActiveTab("plan")}
            style={{
              background: activeTab === "plan" ? "#e0f2fe" : "#f8fafc",
              color: activeTab === "plan" ? "#0369a1" : "#475569",
              border: activeTab === "plan" ? "1px solid #7dd3fc" : "1px solid #e2e8f0",
              borderRadius: 6,
              padding: "6px 14px",
              fontSize: 12.5,
              fontWeight: activeTab === "plan" ? 700 : 500,
              cursor: "pointer",
            }}
          >
            <ClipboardList aria-hidden="true" style={{width:15,height:15,display:"inline",verticalAlign:"text-bottom",marginRight:5}}/> Plan de Trabajo (Caso I)
          </button>
          <button
            onClick={() => setActiveTab("evidencia")}
            style={{
              background: activeTab === "evidencia" ? "#dcfce7" : "#f8fafc",
              color: activeTab === "evidencia" ? "#166534" : "#475569",
              border: activeTab === "evidencia" ? "1px solid #86efac" : "1px solid #e2e8f0",
              borderRadius: 6,
              padding: "6px 14px",
              fontSize: 12.5,
              fontWeight: activeTab === "evidencia" ? 700 : 500,
              cursor: "pointer",
            }}
          >
            <Paperclip aria-hidden="true" style={{width:15,height:15,display:"inline",verticalAlign:"text-bottom",marginRight:5}}/> Evidencia: Acta v1.0 → v2.0 (Caso J)
          </button>
          <button
            onClick={() => setActiveTab("usuario")}
            style={{
              background: activeTab === "usuario" ? "#f3e8ff" : "#f8fafc",
              color: activeTab === "usuario" ? "#6b21a8" : "#475569",
              border: activeTab === "usuario" ? "1px solid #d8b4fe" : "1px solid #e2e8f0",
              borderRadius: 6,
              padding: "6px 14px",
              fontSize: 12.5,
              fontWeight: activeTab === "usuario" ? 700 : 500,
              cursor: "pointer",
            }}
          >
            <User aria-hidden="true" style={{width:15,height:15,display:"inline",verticalAlign:"text-bottom",marginRight:5}}/> Historial Usuario (Andrea Pérez)
          </button>
        </div>

        {/* Timeline Body */}
        <div style={{ padding: "24px 26px", flex: 1, overflowY: "auto", background: "#f8fafc" }}>
          {/* Note regarding versioning and compliance */}
          {activeTab === "plan" && (
            <div
              style={{
                background: "#eff6ff",
                border: "1px solid #bfdbfe",
                borderRadius: 8,
                padding: "10px 14px",
                fontSize: 12.5,
                color: "#1e40af",
                marginBottom: 20,
              }}
            >
              <Info aria-hidden="true" style={{width:14,height:14,display:"inline",verticalAlign:"text-bottom",marginRight:4}}/> <strong>Regla institucional:</strong> La devolución con observaciones y la posterior subsanación NO incrementan automáticamente la versión formal (se mantiene v1.0).
            </div>
          )}

          {activeTab === "evidencia" && (
            <div
              style={{
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                borderRadius: 8,
                padding: "10px 14px",
                fontSize: 12.5,
                color: "#15803d",
                marginBottom: 20,
              }}
            >
              <Info aria-hidden="true" style={{width:14,height:14,display:"inline",verticalAlign:"text-bottom",marginRight:4}}/> <strong>Historial de versiones:</strong> La sustitución de una evidencia observada genera una nueva versión de la evidencia (v2.0), que deberá ser validada nuevamente.
            </div>
          )}

          {activeTab === "usuario" && (
            <div
              style={{
                background: "#faf5ff",
                border: "1px solid #e9d5ff",
                borderRadius: 8,
                padding: "10px 14px",
                fontSize: 12.5,
                color: "#6b21a8",
                marginBottom: 20,
              }}
            >
              <Info aria-hidden="true" style={{width:14,height:14,display:"inline",verticalAlign:"text-bottom",marginRight:4}}/> <strong>Consulta administrativa:</strong> Registro cronológico de acciones del usuario para propósitos de trazabilidad institucional. No representa métricas de productividad ni evaluación.
            </div>
          )}

          {/* Vertical Timeline Items */}
          <div style={{ position: "relative", paddingLeft: 28 }}>
            {/* Continuous vertical line */}
            <div
              style={{
                position: "absolute",
                top: 10,
                bottom: 10,
                left: 11,
                width: 2,
                background: "#cbd5e1",
              }}
            />

            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {objetoActivo.hitos.map((hito, idx) => (
                <div key={hito.id} style={{ position: "relative" }}>
                  {/* Circle Node */}
                  <div
                    style={{
                      position: "absolute",
                      top: 12,
                      left: -28,
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      background: idx === objetoActivo.hitos.length - 1 ? "#10b981" : "#1a4f8a",
                      border: "3px solid #ffffff",
                      boxShadow: "0 0 0 2px #94a3b8",
                      transform: "translateX(4px)",
                    }}
                  />

                  {/* Card */}
                  <div
                    style={{
                      background: "#ffffff",
                      borderRadius: 8,
                      border: "1px solid #e2e8f0",
                      padding: "14px 18px",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 4 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 13.5, fontWeight: 700, color: "#0f172a" }}>
                          {hito.hito}
                        </span>
                        {hito.badge && (
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 700,
                              padding: "2px 8px",
                              borderRadius: 4,
                              background: hito.badgeColor?.bg ?? "#f1f5f9",
                              color: hito.badgeColor?.text ?? "#334155",
                              border: `1px solid ${hito.badgeColor?.border ?? "#cbd5e1"}`,
                            }}
                          >
                            {hito.badge}
                          </span>
                        )}
                      </div>

                      <div style={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}>
                        {hito.fechaHora}
                      </div>
                    </div>

                    <div style={{ fontSize: 12.5, color: "#475569", marginBottom: 6 }}>
                      <strong>Responsable:</strong> {hito.usuario} ({hito.rol})
                    </div>

                    <p style={{ fontSize: 13, color: "#334155", margin: 0, lineHeight: 1.5 }}>
                      {hito.detalle}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "14px 26px",
            background: "#ffffff",
            borderTop: "1px solid #e2e8f0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ fontSize: 12, color: "#64748b" }}>
            Total de hitos registrados: <strong>{objetoActivo.hitos.length}</strong>
          </div>

          <button
            onClick={onClose}
            style={{
              background: "#1a4f8a",
              color: "#ffffff",
              border: "none",
              borderRadius: 6,
              padding: "8px 18px",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Cerrar trazabilidad
          </button>
        </div>
      </div>
    </div>
  );
}
