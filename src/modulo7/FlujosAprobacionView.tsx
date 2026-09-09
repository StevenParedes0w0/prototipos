// Pantalla 10 — Flujos de Aprobación
import React from "react";
import { FlujoGrupo } from "./types";

interface FlujosAprobacionViewProps {
  flujos: FlujoGrupo[];
  onConfigurarFlujo: (grupoId: string) => void;
}

export default function FlujosAprobacionView({
  flujos,
  onConfigurarFlujo,
}: FlujosAprobacionViewProps) {
  return (
    <div style={{ padding: "28px", maxWidth: 1200, margin: "0 auto" }}>
      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#64748b", marginBottom: 8 }}>
        <span>Administración</span>
        <span style={{ color: "#cbd5e1" }}>/</span>
        <span style={{ color: "#1e2a3a", fontWeight: 600 }}>Flujos de aprobación</span>
      </div>

      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1e2a3a", fontFamily: "'DM Sans',sans-serif", margin: "0 0 4px" }}>
          Flujos de aprobación institucionales
        </h1>
        <p style={{ fontSize: 13.5, color: "#64748b", margin: 0 }}>
          Definición de etapas secuenciales, revisores por grupo y reglas de decisión para los Planes de Trabajo.
        </p>
      </div>

      {/* Tabla */}
      <div style={{
        background: "#fff",
        borderRadius: 10,
        border: "1px solid #e2e8f0",
        overflow: "hidden",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
      }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Grupo institucional</th>
              <th>Etapas configuradas</th>
              <th>Revisores asignados</th>
              <th>Estado</th>
              <th style={{ textAlign: "right" }}>Acción</th>
            </tr>
          </thead>
          <tbody>
            {flujos.map((f) => {
              const etapaRevision = f.etapas.find(e => e.tipoResponsable === "Revisores");
              return (
                <tr key={f.grupoId}>
                  <td>
                    <strong style={{ color: "#1e2a3a", fontSize: 14 }}>{f.grupoNombre}</strong>
                  </td>
                  <td>
                    <span style={{
                      fontSize: 12.5,
                      fontWeight: 700,
                      color: "#1a4f8a",
                      background: "#eff6ff",
                      padding: "3px 10px",
                      borderRadius: 99,
                    }}>
                      {f.etapas.length} etapas secuenciales
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: 13, color: "#475569" }}>
                      {etapaRevision?.revisoresNombres?.join(", ") || "No asignados"}
                    </span>
                  </td>
                  <td>
                    <span style={{
                      display: "inline-block",
                      padding: "3px 9px",
                      borderRadius: 999,
                      fontSize: 11.5,
                      fontWeight: 700,
                      background: f.estado === "CONFIGURADO" ? "#dcfce7" : "#fef3c7",
                      color: f.estado === "CONFIGURADO" ? "#166534" : "#92400e",
                    }}>
                      {f.estado}
                    </span>
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => onConfigurarFlujo(f.grupoId)}
                    >
                      CONFIGURAR
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
