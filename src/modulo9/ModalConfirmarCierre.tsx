import React, { useState } from "react";
import { PeriodoResumenCierre } from "./types";
import { AlertTriangle, Info } from "./icons";

interface ModalConfirmarCierreProps {
  isOpen: boolean;
  periodo: PeriodoResumenCierre | null;
  onClose: () => void;
  onConfirmar: (periodoId: string) => void;
}

export default function ModalConfirmarCierre({
  isOpen,
  periodo,
  onClose,
  onConfirmar,
}: ModalConfirmarCierreProps) {
  const [confirmCheck, setConfirmCheck] = useState(false);

  if (!isOpen || !periodo) return null;

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
          width: 500,
          maxWidth: "100%",
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
            borderBottom: "1px solid #fed7aa",
            background: "#fff7ed",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: "50%",
                background: "#ffedd5",
                color: "#c2410c",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
              }}
            >
              <AlertTriangle aria-hidden="true" className="w-6 h-6"/>
            </div>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: "#9a3412", margin: 0 }}>
                Simular Cierre de Período — DEMO
              </h2>
              <div style={{ fontSize: 12, color: "#c2410c", marginTop: 2 }}>
                Simulación administrativa del proceso de cierre
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: 18,
              cursor: "pointer",
              color: "#9a3412",
            }}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "20px 24px" }}>
          <p style={{ fontSize: 13.5, color: "#334155", lineHeight: 1.55, margin: "0 0 16px" }}>
            Esta acción cambiará el período a estado <strong>CERRADO</strong> dentro del escenario de demostración y habilitará la consulta de sus Planes de Trabajo y evidencias en <strong>modo solo lectura</strong>.
          </p>

          {/* Resumen del Período */}
          <div
            style={{
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: 8,
              padding: "14px 16px",
              marginBottom: 16,
              fontSize: 12.5,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ color: "#64748b" }}>Período a cerrar:</span>
              <strong style={{ color: "#0f172a" }}>{periodo.nombre}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ color: "#64748b" }}>Planes registrados:</span>
              <span style={{ fontWeight: 700, color: "#0f172a" }}>{periodo.planesTotal}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ color: "#64748b" }}>Planes finalizados / en ejecución:</span>
              <span style={{ fontWeight: 700, color: "#166534" }}>
                {periodo.planesFinalizados} finalizados • {periodo.planesEnEjecucion} en ejecución
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#64748b" }}>Pendientes documentales:</span>
              <span style={{ fontWeight: 700, color: "#c2410c" }}>
                {periodo.evidenciasPendientes + periodo.evidenciasObservadas} elementos pendientes
              </span>
            </div>
          </div>

          {/* Advertencia institucional */}
          <div
            style={{
              background: "#fffbeb",
              border: "1px solid #fde68a",
              borderRadius: 8,
              padding: "10px 14px",
              fontSize: 12,
              color: "#92400e",
              marginBottom: 20,
              lineHeight: 1.5,
            }}
          >
            <Info aria-hidden="true" className="w-3 h-3 inline mr-1"/> <strong>Nota institucional:</strong> La reapertura de períodos no se representa en este prototipo debido a que el procedimiento institucional correspondiente aún no ha sido definido dentro de los requerimientos confirmados.
          </div>

          {/* Checkbox de confirmación */}
          <label
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 10,
              fontSize: 12.5,
              color: "#1e293b",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={confirmCheck}
              onChange={(e) => setConfirmCheck(e.target.checked)}
              style={{ marginTop: 2 }}
            />
            <span>Confirmo que esta acción corresponde a una simulación administrativa de cierre del período.</span>
          </label>
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
            disabled={!confirmCheck}
            onClick={() => onConfirmar(periodo.id)}
            style={{
              padding: "8px 20px",
              borderRadius: 6,
              border: "none",
              background: confirmCheck ? "#c2410c" : "#cbd5e1",
              color: "#ffffff",
              fontSize: 13,
              fontWeight: 700,
              cursor: confirmCheck ? "pointer" : "not-allowed",
              boxShadow: confirmCheck ? "0 1px 3px rgba(0,0,0,0.15)" : "none",
            }}
          >
            CERRAR PERÍODO — DEMO
          </button>
        </div>
      </div>
    </div>
  );
}

