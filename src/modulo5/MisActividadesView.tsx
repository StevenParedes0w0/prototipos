import React, { useState, useMemo } from "react";
import { ActividadEjecucion } from "./types";
import { DOCENTE_ACTUAL, getDiasRestantes } from "./useActividadesState";

interface MisActividadesViewProps {
  currentUserName?: string;

  actividades: ActividadEjecucion[];
  onSelectActividad: (id: string) => void;
  resumen: {
    total: number;
    enCurso: number;
    pendientes: number;
    completas: number;
    vencidas: number;
    pct: number;
  };
}

export default function MisActividadesView({
  currentUserName = DOCENTE_ACTUAL,
  actividades,
  onSelectActividad,
  resumen,
}: MisActividadesViewProps) {
  // Filters state — declared unconditionally at top
  const [filtroAlcance, setFiltroAlcance] = useState<"mis" | "todas">("mis");
  const [filtroPeriodo, setFiltroPeriodo] = useState("Julio – Diciembre 2026");
  const [filtroPlan, setFiltroPlan] = useState("Todos los planes");
  const [filtroGrupo, setFiltroGrupo] = useState("Todos");
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");

  // Priority sorting helper per prompt.md:
  // 1. actividades próximas a vencer
  // 2. actividades en curso
  // 3. pendientes
  // 4. vencidas
  // 5. evidencias completas
  const getPrioridadEstado = (act: ActividadEjecucion): number => {
    if (act.estado === "EN CURSO") {
      const dias = getDiasRestantes(act.hasta);
      if (dias <= 15) return 1; // Próximas a vencer (act-1 vence en 11 días)
      return 2;
    }
    if (act.estado === "PENDIENTE") return 3;
    if (act.estado === "VENCIDA") return 4;
    if (act.estado === "EVIDENCIAS COMPLETAS") return 5;
    return 6;
  };

  // Filtered & sorted activities
  const actividadesFiltradas = useMemo(() => {
    return actividades
      .filter((a) => {
        // Regla: Mis Actividades contiene únicamente actividades asignadas al docente autenticado
        if (filtroAlcance === "mis" && !a.responsables.includes(currentUserName)) return false;

        if (filtroPeriodo !== "Todos los períodos" && a.periodo !== filtroPeriodo) return false;
        if (filtroPlan !== "Todos los planes" && a.planNombre !== filtroPlan) return false;
        if (filtroGrupo !== "Todos" && a.grupo !== filtroGrupo) return false;
        if (filtroEstado !== "Todos" && a.estado !== filtroEstado) return false;
        if (busqueda) {
          const q = busqueda.toLowerCase();
          const match =
            a.nombre.toLowerCase().includes(q) ||
            a.grupo.toLowerCase().includes(q) ||
            a.categoria.toLowerCase().includes(q);
          if (!match) return false;
        }
        return true;
      })
      .sort((a, b) => getPrioridadEstado(a) - getPrioridadEstado(b));
  }, [actividades, currentUserName, filtroAlcance, filtroPeriodo, filtroPlan, filtroGrupo, filtroEstado, busqueda]);

  // Indicator text helper centralizado
  const getIndicadorPlazo = (act: ActividadEjecucion) => {
    if (act.estado === "VENCIDA") {
      return { texto: "Plazo vencido", bg: "#fee2e2", color: "#991b1b" };
    }
    if (act.estado === "EVIDENCIAS COMPLETAS") {
      return { texto: "Completado", bg: "#dcfce7", color: "#166534" };
    }
    const dias = getDiasRestantes(act.hasta);
    if (dias < 0) {
      return { texto: "Plazo vencido", bg: "#fee2e2", color: "#991b1b" };
    }
    if (dias === 0) {
      return { texto: "Vence hoy", bg: "#fee2e2", color: "#991b1b" };
    }
    if (dias === 1) {
      return { texto: "Falta 1 día", bg: "#fef3c7", color: "#92400e" };
    }
    return {
      texto: `Faltan ${dias} días`,
      bg: dias <= 15 ? "#fef3c7" : "#eff6ff",
      color: dias <= 15 ? "#92400e" : "#1e40af",
    };
  };

  const badgeEstadoStyle: Record<string, { bg: string; color: string; dot: string }> = {
    "EN CURSO":              { bg: "#dbeafe", color: "#1e40af", dot: "#3b82f6" },
    "EVIDENCIAS COMPLETAS": { bg: "#dcfce7", color: "#166534", dot: "#22c55e" },
    "PENDIENTE":            { bg: "#f1f5f9", color: "#475569", dot: "#94a3b8" },
    "VENCIDA":              { bg: "#fee2e2", color: "#991b1b", dot: "#ef4444" },
  };

  return (
    <div style={{ padding: "28px", maxWidth: 1200, margin: "0 auto" }}>
      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#64748b", marginBottom: 12 }}>
        <span>Inicio</span>
        <span style={{ color: "#cbd5e1" }}>/</span>
        <span style={{ color: "#1e2a3a", fontWeight: 600 }}>Mis Actividades</span>
      </div>

      {/* Header */}
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1e2a3a", fontFamily: "'DM Sans',sans-serif", margin: "0 0 4px" }}>
          Mis Actividades
        </h1>
        <p style={{ fontSize: 13.5, color: "#6b7a8d", margin: 0 }}>
          Consulte y gestione las actividades asignadas en sus Planes de Trabajo.
        </p>
      </div>

      {/* Summary Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: 14,
        marginBottom: 20,
      }}>
        {/* Total */}
        <div style={{
          background: "#fff",
          borderRadius: 10,
          border: "1px solid #e2e8f0",
          padding: "16px 18px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
        }}>
          <div style={{ fontSize: 12, color: "#64748b", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>
            Total Actividades
          </div>
          <div style={{ fontSize: 26, fontWeight: 800, color: "#1e2a3a", fontFamily: "'DM Sans',sans-serif", marginTop: 4 }}>
            {resumen.total}
          </div>
          <div style={{ fontSize: 11.5, color: "#94a3b8", marginTop: 2 }}>
            Asignadas al docente
          </div>
        </div>

        {/* En curso */}
        <div style={{
          background: "#fff",
          borderRadius: 10,
          border: "1.5px solid #bfdbfe",
          padding: "16px 18px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
        }}>
          <div style={{ fontSize: 12, color: "#1e40af", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>
            En curso
          </div>
          <div style={{ fontSize: 26, fontWeight: 800, color: "#1e40af", fontFamily: "'DM Sans',sans-serif", marginTop: 4 }}>
            {resumen.enCurso}
          </div>
          <div style={{ fontSize: 11.5, color: "#60a5fa", marginTop: 2 }}>
            En plazo de ejecución
          </div>
        </div>

        {/* Pendientes */}
        <div style={{
          background: "#fff",
          borderRadius: 10,
          border: "1px solid #e2e8f0",
          padding: "16px 18px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
        }}>
          <div style={{ fontSize: 12, color: "#475569", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.04em" }}>
            Pendientes
          </div>
          <div style={{ fontSize: 26, fontWeight: 800, color: "#475569", fontFamily: "'DM Sans',sans-serif", marginTop: 4 }}>
            {resumen.pendientes}
          </div>
          <div style={{ fontSize: 11.5, color: "#94a3b8", marginTop: 2 }}>
            Sin carga iniciada
          </div>
        </div>

        {/* Evidencias completas */}
        <div style={{
          background: "#fff",
          borderRadius: 10,
          border: "1.5px solid #bbf7d0",
          padding: "16px 18px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
        }}>
          <div style={{ fontSize: 12, color: "#166534", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>
            Evidencias completas
          </div>
          <div style={{ fontSize: 26, fontWeight: 800, color: "#166534", fontFamily: "'DM Sans',sans-serif", marginTop: 4 }}>
            {resumen.completas}
          </div>
          <div style={{ fontSize: 11.5, color: "#4ade80", marginTop: 2 }}>
            100% medios cargados
          </div>
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
        {/* Alcance / Asignación */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>Alcance:</span>
          <select
            className="form-select"
            style={{ width: "auto", fontSize: 12.5, padding: "5px 28px 5px 10px", fontWeight: 600, color: "#1a4f8a" }}
            value={filtroAlcance}
            onChange={(e) => setFiltroAlcance(e.target.value as "mis" | "todas")}
          >
            <option value="mis">Solo mis actividades asignadas</option>
            <option value="todas">Todas las del Plan (Vista general)</option>
          </select>
        </div>

        {/* Periodo */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>Período:</span>
          <select
            className="form-select"
            style={{ width: "auto", fontSize: 12.5, padding: "5px 28px 5px 10px" }}
            value={filtroPeriodo}
            onChange={(e) => setFiltroPeriodo(e.target.value)}
          >
            <option>Julio – Diciembre 2026</option>
            <option>Enero – Junio 2026</option>
            <option>Todos los períodos</option>
          </select>
        </div>

        {/* Plan */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>Plan:</span>
          <select
            className="form-select"
            style={{ width: "auto", fontSize: 12.5, padding: "5px 28px 5px 10px" }}
            value={filtroPlan}
            onChange={(e) => setFiltroPlan(e.target.value)}
          >
            <option>Todos los planes</option>
            <option>Plan de Trabajo — Unidad de Titulación</option>
          </select>
        </div>

        {/* Grupo */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>Grupo institucional:</span>
          <select
            className="form-select"
            style={{ width: "auto", fontSize: 12.5, padding: "5px 28px 5px 10px" }}
            value={filtroGrupo}
            onChange={(e) => setFiltroGrupo(e.target.value)}
          >
            <option>Todos</option>
            <option>Unidad de Titulación</option>
          </select>
        </div>

        {/* Estado */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>Estado:</span>
          <select
            className="form-select"
            style={{ width: "auto", fontSize: 12.5, padding: "5px 28px 5px 10px" }}
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
          >
            <option>Todos</option>
            <option>EN CURSO</option>
            <option>PENDIENTE</option>
            <option>EVIDENCIAS COMPLETAS</option>
            <option>VENCIDA</option>
          </select>
        </div>

        {/* Search */}
        <div style={{ flex: 1, minWidth: 200, display: "flex", alignItems: "center" }}>
          <input
            type="text"
            className="form-input"
            placeholder="Buscar actividad..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{ fontSize: 12.5, padding: "5px 12px" }}
          />
        </div>
      </div>

      {/* Activities Table */}
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
              <th>Actividad</th>
              <th>Plan / Grupo</th>
              <th>Desde</th>
              <th>Hasta</th>
              <th>Evidencias</th>
              <th>Estado</th>
              <th style={{ textAlign: "right" }}>Acción</th>
            </tr>
          </thead>
          <tbody>
            {actividadesFiltradas.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "36px 0", color: "#94a3b8" }}>
                  No se encontraron actividades con los filtros seleccionados.
                </td>
              </tr>
            ) : (
              actividadesFiltradas.map((act) => {
                const cargadas = act.medios.filter((m) => !!m.archivoVigente).length;
                const total = act.medios.length;
                const indicador = getIndicadorPlazo(act);
                const sBadge = badgeEstadoStyle[act.estado] || badgeEstadoStyle["PENDIENTE"];

                return (
                  <tr key={act.id}>
                    {/* Actividad */}
                    <td style={{ maxWidth: 320 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                        <span style={{ fontWeight: 700, color: "#1e2a3a", fontSize: 13.5 }}>
                          {act.nombre}
                        </span>
                        {!act.responsables.includes(currentUserName) && (
                          <span style={{
                            fontSize: 10.5,
                            fontWeight: 700,
                            color: "#64748b",
                            background: "#f1f5f9",
                            border: "1px solid #e2e8f0",
                            padding: "1px 6px",
                            borderRadius: 4,
                            whiteSpace: "nowrap",
                          }}>
                            Solo lectura
                          </span>
                        )}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 11, color: "#1d4ed8", fontWeight: 600 }}>
                          {act.categoria}
                        </span>
                        <span style={{ fontSize: 11, color: "#94a3b8" }}>•</span>
                        <span style={{ fontSize: 11, color: "#64748b" }}>
                          {act.tipo}
                        </span>
                        {!act.responsables.includes(currentUserName) && (
                          <>
                            <span style={{ fontSize: 11, color: "#94a3b8" }}>•</span>
                            <span style={{ fontSize: 11, color: "#b45309", fontWeight: 500 }}>
                              Resp: {act.responsables.join(", ")}
                            </span>
                          </>
                        )}
                      </div>
                    </td>

                    {/* Plan / Grupo */}
                    <td>
                      <div style={{ fontSize: 12.5, fontWeight: 600, color: "#334155" }}>
                        {act.planNombre}
                      </div>
                      <div style={{ fontSize: 11.5, color: "#64748b" }}>
                        {act.grupo}
                      </div>
                    </td>

                    {/* Desde */}
                    <td style={{ fontSize: 12.5, color: "#64748b", whiteSpace: "nowrap" }}>
                      {act.desde}
                    </td>

                    {/* Hasta + Indicador */}
                    <td style={{ whiteSpace: "nowrap" }}>
                      <div style={{ fontSize: 12.5, fontWeight: 600, color: act.estado === "VENCIDA" ? "#991b1b" : "#334155" }}>
                        {act.hasta}
                      </div>
                      {indicador && (
                        <div style={{
                          fontSize: 10.5,
                          fontWeight: 700,
                          color: indicador.color,
                          background: indicador.bg,
                          padding: "1px 6px",
                          borderRadius: 4,
                          display: "inline-block",
                          marginTop: 2,
                        }}>
                          {indicador.texto}
                        </div>
                      )}
                    </td>

                    {/* Evidencias */}
                    <td style={{ whiteSpace: "nowrap" }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: cargadas === total ? "#166534" : "#1a4f8a" }}>
                        {cargadas} de {total}
                      </div>
                      <div style={{ fontSize: 11, color: "#94a3b8" }}>
                        {cargadas === total ? "Completas" : "Pendientes"}
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
                        fontSize: 11.5,
                        fontWeight: 700,
                        background: sBadge.bg,
                        color: sBadge.color,
                        whiteSpace: "nowrap",
                      }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: sBadge.dot }} />
                        {act.estado}
                      </span>
                    </td>

                    {/* Accion */}
                    <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => onSelectActividad(act.id)}
                      >
                        VER ACTIVIDAD
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
