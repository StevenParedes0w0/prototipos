import React, { useState, useMemo } from "react";
import { ItemSeguimientoPlan, ResumenSeguimientoGlobal } from "./types";
import DetalleSeguimientoPlanView from "./DetalleSeguimientoPlanView";

interface SeguimientoPlanesViewProps {
  planes: ItemSeguimientoPlan[];
  resumenGlobal: ResumenSeguimientoGlobal;
}

export default function SeguimientoPlanesView({
  planes,
  resumenGlobal,
}: SeguimientoPlanesViewProps) {
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);

  // Filtros
  const [filtroPeriodo, setFiltroPeriodo] = useState("Julio – Diciembre 2026");
  const [filtroGrupo, setFiltroGrupo] = useState("Todos");
  const [filtroDocente, setFiltroDocente] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");

  const planesFiltrados = useMemo(() => {
    return planes.filter((p) => {
      if (filtroPeriodo !== "Todos" && p.periodo !== filtroPeriodo) return false;
      if (filtroGrupo !== "Todos" && p.grupo !== filtroGrupo) return false;
      if (filtroDocente !== "Todos" && !p.docente.includes(filtroDocente)) return false;
      if (busqueda) {
        const q = busqueda.toLowerCase();
        const match =
          p.planNombre.toLowerCase().includes(q) ||
          p.docente.toLowerCase().includes(q) ||
          p.grupo.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [planes, filtroPeriodo, filtroGrupo, filtroDocente, busqueda]);

  const planSeleccionado = useMemo(() => {
    if (!selectedPlanId) return null;
    return planes.find(p => p.planId === selectedPlanId) || null;
  }, [planes, selectedPlanId]);

  if (planSeleccionado) {
    return (
      <DetalleSeguimientoPlanView
        planItem={planSeleccionado}
        onBack={() => setSelectedPlanId(null)}
      />
    );
  }

  return (
    <div style={{ padding: "28px", maxWidth: 1240, margin: "0 auto" }}>
      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#64748b", marginBottom: 12 }}>
        <span>Inicio</span>
        <span style={{ color: "#cbd5e1" }}>/</span>
        <span style={{ color: "#1e2a3a", fontWeight: 600 }}>Seguimiento Institucional</span>
      </div>

      {/* Header */}
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1e2a3a", fontFamily: "'DM Sans',sans-serif", margin: "0 0 4px" }}>
          Seguimiento de Planes de Trabajo
        </h1>
        <p style={{ fontSize: 13.5, color: "#6b7a8d", margin: 0 }}>
          Supervisión consolidada del cumplimiento de actividades y estado de validación de evidencias institucionales.
        </p>
      </div>

      {/* Metric Cards (6 cards per prompt) */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: 14,
        marginBottom: 22,
      }}>
        {/* Planes en ejecución */}
        <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0", padding: "14px 16px" }}>
          <div style={{ fontSize: 11, color: "#64748b", fontWeight: 700, textTransform: "uppercase" }}>Planes en ejecución</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#1a4f8a", fontFamily: "'DM Sans',sans-serif", marginTop: 3 }}>
            {resumenGlobal.planesEnEjecucion}
          </div>
          <div style={{ fontSize: 11, color: "#94a3b8" }}>Período activo</div>
        </div>

        {/* Actividades en curso */}
        <div style={{ background: "#fff", borderRadius: 10, border: "1.5px solid #bfdbfe", padding: "14px 16px" }}>
          <div style={{ fontSize: 11, color: "#1e40af", fontWeight: 700, textTransform: "uppercase" }}>Actividades en curso</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#1e40af", fontFamily: "'DM Sans',sans-serif", marginTop: 3 }}>
            {resumenGlobal.actividadesEnCurso}
          </div>
          <div style={{ fontSize: 11, color: "#60a5fa" }}>En plazo de ejecución</div>
        </div>

        {/* Actividades vencidas */}
        <div style={{ background: "#fff", borderRadius: 10, border: "1.5px solid #fecaca", padding: "14px 16px" }}>
          <div style={{ fontSize: 11, color: "#991b1b", fontWeight: 700, textTransform: "uppercase" }}>Actividades vencidas</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#991b1b", fontFamily: "'DM Sans',sans-serif", marginTop: 3 }}>
            {resumenGlobal.actividadesVencidas}
          </div>
          <div style={{ fontSize: 11, color: "#f87171" }}>Plazo ordinario cerrado</div>
        </div>

        {/* Evidencias pendientes de validación */}
        <div style={{ background: "#fff", borderRadius: 10, border: "1.5px solid #fde68a", padding: "14px 16px" }}>
          <div style={{ fontSize: 11, color: "#92400e", fontWeight: 700, textTransform: "uppercase" }}>Pendientes validación</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#92400e", fontFamily: "'DM Sans',sans-serif", marginTop: 3 }}>
            {resumenGlobal.evidenciasPendientesValidacion}
          </div>
          <div style={{ fontSize: 11, color: "#b45309" }}>Archivos por evaluar</div>
        </div>

        {/* Evidencias observadas */}
        <div style={{ background: "#fff", borderRadius: 10, border: "1.5px solid #fecaca", padding: "14px 16px" }}>
          <div style={{ fontSize: 11, color: "#b91c1c", fontWeight: 700, textTransform: "uppercase" }}>Evidencias observadas</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#b91c1c", fontFamily: "'DM Sans',sans-serif", marginTop: 3 }}>
            {resumenGlobal.evidenciasObservadas}
          </div>
          <div style={{ fontSize: 11, color: "#ef4444" }}>Con observaciones</div>
        </div>

        {/* Evidencias validadas */}
        <div style={{ background: "#fff", borderRadius: 10, border: "1.5px solid #bbf7d0", padding: "14px 16px" }}>
          <div style={{ fontSize: 11, color: "#166534", fontWeight: 700, textTransform: "uppercase" }}>Evidencias validadas</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: "#166534", fontFamily: "'DM Sans',sans-serif", marginTop: 3 }}>
            {resumenGlobal.evidenciasValidadas}
          </div>
          <div style={{ fontSize: 11, color: "#22c55e" }}>Aprobadas formalmente</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div style={{
        background: "#fff",
        borderRadius: 10,
        border: "1px solid #e2e8f0",
        padding: "14px 18px",
        marginBottom: 16,
        display: "flex",
        gap: 12,
        flexWrap: "wrap",
        alignItems: "center",
      }}>
        {/* Período */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>Período:</span>
          <select
            className="form-select"
            style={{ width: "auto", fontSize: 12, padding: "5px 26px 5px 8px" }}
            value={filtroPeriodo}
            onChange={(e) => setFiltroPeriodo(e.target.value)}
          >
            <option>Julio – Diciembre 2026</option>
            <option>Todos</option>
          </select>
        </div>

        {/* Grupo */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>Grupo:</span>
          <select
            className="form-select"
            style={{ width: "auto", fontSize: 12, padding: "5px 26px 5px 8px" }}
            value={filtroGrupo}
            onChange={(e) => setFiltroGrupo(e.target.value)}
          >
            <option>Todos</option>
            <option>Unidad de Titulación</option>
            <option>Comisión de Vinculación</option>
          </select>
        </div>

        {/* Docente */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>Docente:</span>
          <select
            className="form-select"
            style={{ width: "auto", fontSize: 12, padding: "5px 26px 5px 8px" }}
            value={filtroDocente}
            onChange={(e) => setFiltroDocente(e.target.value)}
          >
            <option>Todos</option>
            <option>Ing. Andrea Pérez, Mg.</option>
            <option>Ing. Carlos López, Mg.</option>
            <option>Dr. Fernando Ramos, PhD.</option>
          </select>
        </div>

        {/* Búsqueda */}
        <div style={{ flex: 1, minWidth: 200 }}>
          <input
            type="text"
            className="form-input"
            placeholder="Buscar por plan, grupo o docente..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{ fontSize: 12, padding: "5px 12px" }}
          />
        </div>
      </div>

      {/* Table with Real Numbers & Progress */}
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
              <th>Docente / Responsable</th>
              <th>Grupo Institucional</th>
              <th>Plan de Trabajo</th>
              <th>Actividades Cumplidas</th>
              <th>Evidencias Cargadas</th>
              <th>Validadas</th>
              <th>Observadas</th>
              <th>Vencidas</th>
              <th style={{ textAlign: "right" }}>Acción</th>
            </tr>
          </thead>
          <tbody>
            {planesFiltrados.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: "center", padding: "36px 0", color: "#94a3b8" }}>
                  No se encontraron planes para los filtros seleccionados.
                </td>
              </tr>
            ) : (
              planesFiltrados.map((p) => {
                const pctActividades = Math.round((p.actividadesCompletas / p.actividadesTotales) * 100);
                const pctValidadas = p.evidenciasRequeridas > 0 ? Math.round((p.evidenciasValidadas / p.evidenciasRequeridas) * 100) : 0;

                return (
                  <tr key={p.planId}>
                    {/* Docente */}
                    <td style={{ fontWeight: 600, color: "#1e2a3a", fontSize: 13 }}>
                      {p.docente}
                    </td>

                    {/* Grupo */}
                    <td style={{ fontSize: 12, color: "#475569" }}>
                      {p.grupo}
                    </td>

                    {/* Plan */}
                    <td style={{ maxWidth: 220 }}>
                      <div style={{ fontWeight: 700, color: "#1a4f8a", fontSize: 13 }}>
                        {p.planNombre}
                      </div>
                      <div style={{ fontSize: 11, color: "#94a3b8" }}>
                        Período: {p.periodo}
                      </div>
                    </td>

                    {/* Actividades (cantidades reales + barra visual) */}
                    <td style={{ minWidth: 150 }}>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: "#1e2a3a", marginBottom: 3 }}>
                        {p.actividadesCompletas} de {p.actividadesTotales} actividades
                      </div>
                      <div style={{ width: 130, height: 6, background: "#e2e8f0", borderRadius: 99, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${pctActividades}%`, background: "#1a4f8a", borderRadius: 99 }} />
                      </div>
                      <div style={{ fontSize: 10.5, color: "#64748b", marginTop: 2 }}>{pctActividades}% con evidencias completas</div>
                    </td>

                    {/* Evidencias Cargadas */}
                    <td style={{ whiteSpace: "nowrap" }}>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: "#1e40af" }}>
                        {p.evidenciasCargadas} de {p.evidenciasRequeridas}
                      </div>
                      <div style={{ fontSize: 10.5, color: "#94a3b8" }}>
                        {p.evidenciasPendientesCarga > 0 ? `${p.evidenciasPendientesCarga} por cargar` : "100% cargadas"}
                      </div>
                    </td>

                    {/* Validadas (cantidades reales + barra visual) */}
                    <td style={{ minWidth: 140, whiteSpace: "nowrap" }}>
                      <div style={{ fontSize: 12.5, fontWeight: 700, color: "#166534", marginBottom: 3 }}>
                        {p.evidenciasValidadas} de {p.evidenciasRequeridas}
                      </div>
                      <div style={{ width: 110, height: 6, background: "#e2e8f0", borderRadius: 99, overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${pctValidadas}%`, background: "#16a34a", borderRadius: 99 }} />
                      </div>
                      <div style={{ fontSize: 10.5, color: "#15803d", marginTop: 2 }}>{pctValidadas}% validadas</div>
                    </td>

                    {/* Observadas */}
                    <td>
                      <span style={{
                        fontSize: 12, fontWeight: 700,
                        color: p.evidenciasObservadas > 0 ? "#991b1b" : "#64748b",
                        background: p.evidenciasObservadas > 0 ? "#fee2e2" : "#f1f5f9",
                        padding: "2px 8px", borderRadius: 4,
                      }}>
                        {p.evidenciasObservadas}
                      </span>
                    </td>

                    {/* Vencidas */}
                    <td>
                      <span style={{
                        fontSize: 12, fontWeight: 700,
                        color: p.actividadesVencidas > 0 ? "#991b1b" : "#64748b",
                        background: p.actividadesVencidas > 0 ? "#fee2e2" : "#f1f5f9",
                        padding: "2px 8px", borderRadius: 4,
                      }}>
                        {p.actividadesVencidas}
                      </span>
                    </td>

                    {/* Acción */}
                    <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setSelectedPlanId(p.planId)}
                        style={{ fontWeight: 700 }}
                      >
                        VER SEGUIMIENTO
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
