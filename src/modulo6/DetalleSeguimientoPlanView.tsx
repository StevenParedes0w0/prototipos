import React from "react";
import { ItemSeguimientoPlan } from "./types";
import { getActivityResponsibleDisplayLabel } from "../documentEngine/responsibleDisplay";

interface DetalleSeguimientoPlanViewProps {
  planItem: ItemSeguimientoPlan;
  onBack: () => void;
}

export default function DetalleSeguimientoPlanView({
  planItem,
  onBack,
}: DetalleSeguimientoPlanViewProps) {
  const badgeEstadoStyle: Record<string, { bg: string; color: string; dot: string }> = {
    "EN CURSO":              { bg: "#dbeafe", color: "#1e40af", dot: "#3b82f6" },
    "EVIDENCIAS COMPLETAS": { bg: "#dcfce7", color: "#166534", dot: "#22c55e" },
    "PENDIENTE":            { bg: "#f1f5f9", color: "#475569", dot: "#94a3b8" },
    "VENCIDA":              { bg: "#fee2e2", color: "#991b1b", dot: "#ef4444" },
  };

  return (
    <div style={{ padding: "28px", maxWidth: 1200, margin: "0 auto" }}>
      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#64748b", marginBottom: 14 }}>
        <button
          onClick={onBack}
          style={{ background: "none", border: "none", cursor: "pointer", color: "#1a4f8a", fontWeight: 600, padding: 0 }}
        >
          Seguimiento
        </button>
        <span style={{ color: "#cbd5e1" }}>/</span>
        <span style={{ color: "#1e2a3a", fontWeight: 600 }}>Detalle de Seguimiento</span>
      </div>

      {/* Header Card */}
      <div style={{
        background: "#fff",
        borderRadius: 12,
        border: "1px solid #e2e8f0",
        padding: "24px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
        marginBottom: 20,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12, marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#1a4f8a", marginBottom: 4 }}>
              Plan de Trabajo en Ejecución
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1e2a3a", fontFamily: "'DM Sans',sans-serif", margin: "0 0 6px" }}>
              {planItem.planNombre}
            </h1>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <span style={{
                background: "#dcfce7", color: "#166534", padding: "2px 8px",
                borderRadius: 4, fontWeight: 700, fontSize: 11,
              }}>
                EN EJECUCIÓN
              </span>
              <span style={{ fontSize: 12.5, color: "#64748b" }}>Grupo: <strong>{planItem.grupo}</strong></span>
              <span style={{ fontSize: 12.5, color: "#64748b" }}>Docente responsable general: <strong>{planItem.docente}</strong></span>
              <span style={{ fontSize: 12.5, color: "#64748b" }}>Período: {planItem.periodo}</span>
              <span style={{ fontSize: 12.5, color: "#64748b" }}>Versión {planItem.version}</span>
            </div>
          </div>

          <button
            onClick={onBack}
            className="btn btn-secondary btn-sm"
            style={{ display: "flex", alignItems: "center", gap: 6 }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
            Volver a Seguimiento
          </button>
        </div>

        {/* Resumen Métrico Desagregado */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          marginTop: 18,
          paddingTop: 18,
          borderTop: "1px solid #f1f5f9",
        }}>
          {/* Métricas de Actividades */}
          <div style={{ background: "#f8fafc", borderRadius: 8, padding: "14px 18px", border: "1px solid #e2e8f0" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#1e2a3a", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 10 }}>
              Resumen de Actividades ({planItem.actividadesTotales})
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, textAlign: "center" }}>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#166534" }}>{planItem.actividadesCompletas}</div>
                <div style={{ fontSize: 10.5, color: "#64748b" }}>Evidencias completas</div>
              </div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#1e40af" }}>{planItem.actividadesEnCurso}</div>
                <div style={{ fontSize: 10.5, color: "#64748b" }}>En ejecución</div>
              </div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#475569" }}>{planItem.actividadesPendientes}</div>
                <div style={{ fontSize: 10.5, color: "#64748b" }}>Pendientes</div>
              </div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#991b1b" }}>{planItem.actividadesVencidas}</div>
                <div style={{ fontSize: 10.5, color: "#64748b" }}>Vencidas</div>
              </div>
            </div>
          </div>

          {/* Métricas de Evidencias */}
          <div style={{ background: "#f8fafc", borderRadius: 8, padding: "14px 18px", border: "1px solid #e2e8f0" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#1e2a3a", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 10 }}>
              Resumen de Evidencias ({planItem.evidenciasRequeridas} requeridas)
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, textAlign: "center" }}>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#1e40af" }}>{planItem.evidenciasCargadas}</div>
                <div style={{ fontSize: 10.5, color: "#64748b" }}>Cargadas</div>
              </div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#166534" }}>{planItem.evidenciasValidadas}</div>
                <div style={{ fontSize: 10.5, color: "#64748b" }}>Validadas</div>
              </div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#991b1b" }}>{planItem.evidenciasObservadas}</div>
                <div style={{ fontSize: 10.5, color: "#64748b" }}>Observadas</div>
              </div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#92400e" }}>{planItem.evidenciasPendientesCarga}</div>
                <div style={{ fontSize: 10.5, color: "#64748b" }}>Pend. de carga</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activities Detailed List Table */}
      <div style={{
        background: "#fff",
        borderRadius: 10,
        border: "1px solid #e2e8f0",
        overflow: "hidden",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
      }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #e2e8f0", background: "#f8fafc" }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: "#1e2a3a", margin: 0 }}>
            Desglose de Actividades y Medios de Verificación
          </h2>
          <p style={{ fontSize: 11.5, color: "#64748b", margin: "2px 0 0" }}>
            Información en modo de solo lectura proveniente del Plan de Trabajo aprobado.
          </p>
        </div>

        <table className="data-table">
          <thead>
            <tr>
              <th>Actividad</th>
              <th>Rango de Ejecución</th>
              <th>Responsables</th>
              <th>Medios Requeridos</th>
              <th>Cargadas</th>
              <th>Validadas</th>
              <th>Estado Actividad</th>
            </tr>
          </thead>
          <tbody>
            {planItem.actividades.map((act) => {
              const requeridos = act.medios.length;
              const cargados = act.medios.filter(m => !!m.archivoVigente).length;
              const validados = act.medios.filter(m => m.estado === "VALIDADA").length;
              const sBadge = badgeEstadoStyle[act.estado] || badgeEstadoStyle["PENDIENTE"];

              return (
                <tr key={act.id}>
                  {/* Actividad */}
                  <td style={{ maxWidth: 280 }}>
                    <div style={{ fontWeight: 700, color: "#1e2a3a", fontSize: 13, marginBottom: 2 }}>
                      {act.nombre}
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <span style={{ fontSize: 11, color: "#1d4ed8", fontWeight: 600 }}>{act.categoria}</span>
                      <span style={{ fontSize: 11, color: "#94a3b8" }}>•</span>
                      <span style={{ fontSize: 11, color: "#64748b" }}>{act.tipo}</span>
                    </div>
                  </td>

                  {/* Rango */}
                  <td style={{ fontSize: 12, color: "#475569", whiteSpace: "nowrap" }}>
                    <div>{act.desde} al {act.hasta}</div>
                    <div style={{ fontSize: 10.5, color: "#94a3b8" }}>Límite: 23:59</div>
                  </td>

                  {/* Responsables */}
                  <td style={{ fontSize: 12, color: "#334155" }}>
                    {getActivityResponsibleDisplayLabel(act)}
                  </td>

                  {/* Medios Requeridos */}
                  <td>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: "#1a4f8a" }}>
                      {requeridos} medios
                    </div>
                    <div style={{ fontSize: 11, color: "#64748b" }}>
                      {act.medios.map(m => m.nombre).join(", ")}
                    </div>
                  </td>

                  {/* Cargadas */}
                  <td style={{ whiteSpace: "nowrap" }}>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: cargados === requeridos ? "#166534" : "#b45309" }}>
                      {cargados} de {requeridos}
                    </div>
                    <div style={{ fontSize: 10.5, color: "#94a3b8" }}>
                      {cargados === requeridos ? "100% recibidas" : "Incompletas"}
                    </div>
                  </td>

                  {/* Validadas */}
                  <td style={{ whiteSpace: "nowrap" }}>
                    <div style={{ fontSize: 12.5, fontWeight: 700, color: validados === requeridos ? "#166534" : "#1e40af" }}>
                      {validados} de {requeridos}
                    </div>
                    <div style={{ fontSize: 10.5, color: "#94a3b8" }}>
                      {validados === requeridos ? "100% aprobadas" : `${requeridos - validados} pendientes`}
                    </div>
                  </td>

                  {/* Estado */}
                  <td>
                    <span style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                      padding: "3px 9px",
                      borderRadius: 999,
                      fontSize: 11,
                      fontWeight: 700,
                      background: sBadge.bg,
                      color: sBadge.color,
                      whiteSpace: "nowrap",
                    }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: sBadge.dot }} />
                      {act.estado}
                    </span>
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
