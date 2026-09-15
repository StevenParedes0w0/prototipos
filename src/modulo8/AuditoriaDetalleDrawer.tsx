import React from "react";
import { AuditoriaEvento } from "./types";
import { History, ShieldCheck } from "../components/icons";

interface AuditoriaDetalleDrawerProps {
  evento: AuditoriaEvento | null;
  onClose: () => void;
  onVerTrazabilidad: (objetoId?: string, tipoObjeto?: string) => void;
}

export default function AuditoriaDetalleDrawer({
  evento,
  onClose,
  onVerTrazabilidad,
}: AuditoriaDetalleDrawerProps) {
  if (!evento) return null;

  const hasStateChange = Boolean(evento.estadoAnterior && evento.estadoPosterior);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(15, 23, 42, 0.5)",
        backdropFilter: "blur(2px)",
        zIndex: 1100,
        display: "flex",
        justifyContent: "flex-end",
        fontFamily: "'DM Sans', sans-serif",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: 540,
          maxWidth: "92vw",
          height: "100%",
          background: "#ffffff",
          boxShadow: "-8px 0 30px rgba(0,0,0,0.15)",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid #e2e8f0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            background: "#f8fafc",
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
                  background: "#0f2f56",
                  color: "#ffffff",
                  padding: "2px 8px",
                  borderRadius: 4,
                }}
              >
                REGISTRO INMUTABLE
              </span>
            </div>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", margin: 0 }}>
              Detalle del Evento Institucional
            </h2>
            <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>
              {evento.modulo} • {evento.fechaHora}
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: 20,
              color: "#64748b",
              cursor: "pointer",
              padding: 4,
              borderRadius: 4,
              lineHeight: 1,
            }}
            title="Cerrar detalle"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: "24px", flex: 1, display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Acción Principal Banner */}
          <div
            style={{
              background: "#eff6ff",
              border: "1.5px solid #bfdbfe",
              borderRadius: 8,
              padding: "14px 16px",
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 700, color: "#1d4ed8", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Acción ejecutada
            </div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#1e3a8a", marginTop: 2 }}>
              {evento.accion}
            </div>
            <div style={{ fontSize: 13, color: "#2563eb", marginTop: 4, fontWeight: 500 }}>
              Objeto: {evento.objeto}
            </div>
          </div>

          {/* Grid de Metadatos Institucionales */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 14,
              background: "#f8fafc",
              padding: "16px",
              borderRadius: 8,
              border: "1px solid #e2e8f0",
            }}
          >
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Usuario</div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: "#1e293b", marginTop: 2 }}>{evento.usuario}</div>
            </div>

            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Rol</div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: "#1e293b", marginTop: 2 }}>{evento.rol}</div>
            </div>

            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Fecha y Hora</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b", marginTop: 2 }}>{evento.fechaHora}</div>
            </div>

            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Tipo de Evento</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b", marginTop: 2 }}>{evento.tipoEvento}</div>
            </div>

            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Grupo Institucional</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b", marginTop: 2 }}>{evento.grupo}</div>
            </div>

            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase" }}>Período Académico</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#1e293b", marginTop: 2 }}>{evento.periodo}</div>
            </div>
          </div>

          {/* Cambio de Estado (ANTES → DESPUÉS) */}
          {hasStateChange && (
            <div
              style={{
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: 8,
                padding: "16px",
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 700, color: "#475569", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Transición de Estado Institucional
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: "#64748b", fontWeight: 700, marginBottom: 4 }}>ESTADO ANTERIOR</div>
                  <span
                    style={{
                      background: "#f1f5f9",
                      color: "#475569",
                      padding: "6px 14px",
                      borderRadius: 6,
                      fontSize: 12.5,
                      fontWeight: 700,
                      border: "1px solid #cbd5e1",
                      display: "inline-block",
                    }}
                  >
                    {evento.estadoAnterior}
                  </span>
                </div>

                <div style={{ fontSize: 20, color: "#94a3b8", fontWeight: 800, marginTop: 12 }}>
                  →
                </div>

                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: "#15803d", fontWeight: 700, marginBottom: 4 }}>ESTADO POSTERIOR</div>
                  <span
                    style={{
                      background: "#dcfce7",
                      color: "#166534",
                      padding: "6px 14px",
                      borderRadius: 6,
                      fontSize: 12.5,
                      fontWeight: 700,
                      border: "1px solid #86efac",
                      display: "inline-block",
                    }}
                  >
                    {evento.estadoPosterior}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Información de Firma Electrónica (SIN DATOS SENSIBLES) */}
          {evento.firmaElectronicaInfo && (
            <div
              style={{
                background: "#f0fdf4",
                border: "1.5px solid #86efac",
                borderRadius: 8,
                padding: "16px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <ShieldCheck aria-hidden="true" style={{width:18,height:18}}/>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#166534" }}>
                  Documento firmado electrónicamente
                </span>
              </div>
              <div style={{ fontSize: 12.5, color: "#14532d", lineHeight: 1.5 }}>
                <div><strong>Firmante:</strong> {evento.firmaElectronicaInfo.firmante}</div>
                <div><strong>Documento:</strong> {evento.firmaElectronicaInfo.documento}</div>
                <div><strong>Fecha y Hora de Firma:</strong> {evento.firmaElectronicaInfo.fechaHora}</div>
                <div style={{ fontSize: 11, color: "#15803d", marginTop: 6, fontStyle: "italic" }}>
                  ✓ Firma electrónica verificada con sello institucional.
                </div>
              </div>
            </div>
          )}

          {/* Descripción Institucional Completa */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#475569", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Descripción Institucional
            </div>
            <div
              style={{
                fontSize: 13.5,
                color: "#1e293b",
                lineHeight: 1.6,
                background: "#f8fafc",
                padding: "14px 16px",
                borderRadius: 8,
                border: "1px solid #e2e8f0",
              }}
            >
              {evento.descripcion}
            </div>
          </div>
        </div>

        {/* Footer Actions (STRICTLY READ-ONLY, NO EDIT/DELETE) */}
        <div
          style={{
            padding: "16px 24px",
            borderTop: "1px solid #e2e8f0",
            background: "#f8fafc",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <button
            onClick={() => {
              onClose();
              onVerTrazabilidad(evento.objetoId, evento.tipoObjeto);
            }}
            style={{
              background: "#1a4f8a",
              color: "#ffffff",
              border: "none",
              borderRadius: 6,
              padding: "9px 16px",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <History aria-hidden="true" style={{width:15,height:15}}/> VER TRAZABILIDAD DEL OBJETO
          </button>

          <button
            onClick={onClose}
            style={{
              background: "#ffffff",
              border: "1px solid #cbd5e1",
              color: "#334155",
              borderRadius: 6,
              padding: "9px 16px",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
