import React, { useState, useMemo } from "react";
import { ItemEvidenciaRevisor, ResumenBandejaRevisor } from "./types";

interface BandejaEvidenciasRevisorViewProps {
  items: ItemEvidenciaRevisor[];
  resumen: ResumenBandejaRevisor;
  onSelectEvidencia: (actividadId: string, medioId: string) => void;
}

export default function BandejaEvidenciasRevisorView({
  items,
  resumen,
  onSelectEvidencia,
}: BandejaEvidenciasRevisorViewProps) {
  // Filtros
  const [filtroPeriodo, setFiltroPeriodo] = useState("Julio – Diciembre 2026");
  const [filtroGrupo, setFiltroGrupo] = useState("Todos los grupos asignados");
  const [filtroDocente, setFiltroDocente] = useState("Todos");
  const [filtroPlan, setFiltroPlan] = useState("Todos");
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [filtroMedio, setFiltroMedio] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");

  // Estilos de badge por estado de evidencia
  const estadoBadgeStyle: Record<string, { bg: string; color: string; dot: string }> = {
    "VALIDADA":                { bg: "#dcfce7", color: "#166534", dot: "#22c55e" },
    "OBSERVADA":               { bg: "#fee2e2", color: "#991b1b", dot: "#ef4444" },
    "PENDIENTE DE VALIDACIÓN": { bg: "#fef3c7", color: "#92400e", dot: "#f59e0b" },
    "CARGADA":                 { bg: "#dbeafe", color: "#1e40af", dot: "#3b82f6" },
    "PLAZO VENCIDO":           { bg: "#fee2e2", color: "#991b1b", dot: "#ef4444" },
  };

  // Filtrado de ítems
  const itemsFiltrados = useMemo(() => {
    return items.filter((item) => {
      if (filtroPeriodo !== "Todos" && item.actividad.periodo !== filtroPeriodo) return false;
      if (filtroGrupo !== "Todos los grupos asignados" && item.grupo !== filtroGrupo) return false;
      if (filtroDocente !== "Todos" && !item.responsables.includes(filtroDocente)) return false;
      if (filtroPlan !== "Todos" && item.planNombre !== filtroPlan) return false;
      if (filtroMedio !== "Todos" && item.medioNombre.toLowerCase() !== filtroMedio.toLowerCase()) return false;

      if (filtroEstado !== "Todos") {
        if (filtroEstado === "PENDIENTE DE VALIDACIÓN") {
          if (item.estado !== "PENDIENTE DE VALIDACIÓN" && item.estado !== "CARGADA") return false;
        } else if (item.estado !== filtroEstado) {
          return false;
        }
      }

      if (busqueda) {
        const q = busqueda.toLowerCase();
        const match =
          item.actividadNombre.toLowerCase().includes(q) ||
          item.docente.toLowerCase().includes(q) ||
          item.archivoNombre.toLowerCase().includes(q) ||
          item.medioNombre.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });
  }, [items, filtroPeriodo, filtroGrupo, filtroDocente, filtroPlan, filtroEstado, filtroMedio, busqueda]);

  return (
    <div style={{ padding: "28px", maxWidth: 1240, margin: "0 auto" }}>
      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#64748b", marginBottom: 12 }}>
        <span>Inicio</span>
        <span style={{ color: "#cbd5e1" }}>/</span>
        <span>Revisión Institucional</span>
        <span style={{ color: "#cbd5e1" }}>/</span>
        <span style={{ color: "#1e2a3a", fontWeight: 600 }}>Evidencias por validar</span>
      </div>

      {/* Header */}
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1e2a3a", fontFamily: "'DM Sans',sans-serif", margin: "0 0 4px" }}>
          Evidencias por validar
        </h1>
        <p style={{ fontSize: 13.5, color: "#6b7a8d", margin: 0 }}>
          Revise las evidencias cargadas correspondientes a los grupos institucionales asignados.
        </p>
      </div>

      {/* Summary Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 14,
        marginBottom: 20,
      }}>
        {/* Pendientes de validación */}
        <div style={{
          background: "#fff",
          borderRadius: 10,
          border: "1.5px solid #fde68a",
          padding: "16px 18px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
        }}>
          <div style={{ fontSize: 11.5, color: "#92400e", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>
            Pendientes de validación
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#92400e", fontFamily: "'DM Sans',sans-serif", marginTop: 4 }}>
            {resumen.pendientes}
          </div>
          <div style={{ fontSize: 11.5, color: "#b45309", marginTop: 2 }}>
            Archivos cargados en espera
          </div>
        </div>

        {/* Validadas hoy */}
        <div style={{
          background: "#fff",
          borderRadius: 10,
          border: "1.5px solid #bbf7d0",
          padding: "16px 18px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
        }}>
          <div style={{ fontSize: 11.5, color: "#166534", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>
            Validadas hoy
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#166534", fontFamily: "'DM Sans',sans-serif", marginTop: 4 }}>
            {resumen.validadasHoy}
          </div>
          <div style={{ fontSize: 11.5, color: "#4ade80", marginTop: 2 }}>
            Aprobadas conforme a norma
          </div>
        </div>

        {/* Observadas */}
        <div style={{
          background: "#fff",
          borderRadius: 10,
          border: "1.5px solid #fecaca",
          padding: "16px 18px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
        }}>
          <div style={{ fontSize: 11.5, color: "#991b1b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>
            Observadas
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#991b1b", fontFamily: "'DM Sans',sans-serif", marginTop: 4 }}>
            {resumen.observadas}
          </div>
          <div style={{ fontSize: 11.5, color: "#f87171", marginTop: 2 }}>
            Requieren corrección docente
          </div>
        </div>

        {/* Total revisadas */}
        <div style={{
          background: "#fff",
          borderRadius: 10,
          border: "1px solid #e2e8f0",
          padding: "16px 18px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
        }}>
          <div style={{ fontSize: 11.5, color: "#64748b", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>
            Total revisadas
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#1e2a3a", fontFamily: "'DM Sans',sans-serif", marginTop: 4 }}>
            {resumen.totalRevisadas}
          </div>
          <div style={{ fontSize: 11.5, color: "#94a3b8", marginTop: 2 }}>
            Evaluadas por la comisión
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
          <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>Grupo asignado:</span>
          <select
            className="form-select"
            style={{ width: "auto", fontSize: 12, padding: "5px 26px 5px 8px" }}
            value={filtroGrupo}
            onChange={(e) => setFiltroGrupo(e.target.value)}
          >
            <option>Todos los grupos asignados</option>
            <option>Unidad de Titulación</option>
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
          </select>
        </div>

        {/* Medio */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>Medio:</span>
          <select
            className="form-select"
            style={{ width: "auto", fontSize: 12, padding: "5px 26px 5px 8px" }}
            value={filtroMedio}
            onChange={(e) => setFiltroMedio(e.target.value)}
          >
            <option>Todos</option>
            <option>Informe</option>
            <option>Acta</option>
            <option>Registro fotográfico</option>
          </select>
        </div>

        {/* Estado */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>Estado:</span>
          <select
            className="form-select"
            style={{ width: "auto", fontSize: 12, padding: "5px 26px 5px 8px" }}
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
          >
            <option>Todos</option>
            <option>PENDIENTE DE VALIDACIÓN</option>
            <option>VALIDADA</option>
            <option>OBSERVADA</option>
          </select>
        </div>

        {/* Search */}
        <div style={{ flex: 1, minWidth: 200, display: "flex", alignItems: "center" }}>
          <input
            type="text"
            className="form-input"
            placeholder="Buscar por actividad, docente o archivo..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{ fontSize: 12, padding: "5px 12px" }}
          />
        </div>
      </div>

      {/* Table */}
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
              <th>Docente</th>
              <th>Grupo</th>
              <th>Medio</th>
              <th>Archivo</th>
              <th>Cargado</th>
              <th>Fecha Límite</th>
              <th>Estado</th>
              <th style={{ textAlign: "right" }}>Acción</th>
            </tr>
          </thead>
          <tbody>
            {itemsFiltrados.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: "center", padding: "36px 0", color: "#94a3b8" }}>
                  No se encontraron evidencias pendientes de validación con los filtros seleccionados.
                </td>
              </tr>
            ) : (
              itemsFiltrados.map((item) => {
                const sBadge = estadoBadgeStyle[item.estado] || estadoBadgeStyle["PENDIENTE DE VALIDACIÓN"];

                return (
                  <tr key={`${item.actividadId}-${item.medioId}`}>
                    {/* Actividad */}
                    <td style={{ maxWidth: 220 }}>
                      <div style={{ fontWeight: 700, color: "#1e2a3a", fontSize: 13, marginBottom: 2 }}>
                        {item.actividadNombre}
                      </div>
                      <div style={{ fontSize: 11, color: "#1d4ed8", fontWeight: 600 }}>
                        {item.actividad.categoria}
                      </div>
                    </td>

                    {/* Docente */}
                    <td style={{ fontSize: 12.5, fontWeight: 600, color: "#334155", whiteSpace: "nowrap" }}>
                      {item.docente}
                    </td>

                    {/* Grupo */}
                    <td style={{ fontSize: 12, color: "#64748b" }}>
                      {item.grupo}
                    </td>

                    {/* Medio */}
                    <td>
                      <span style={{
                        fontSize: 12, fontWeight: 700, color: "#1a4f8a",
                        background: "#eff6ff", padding: "2px 7px", borderRadius: 4,
                      }}>
                        {item.medioNombre}
                      </span>
                    </td>

                    {/* Archivo */}
                    <td style={{ maxWidth: 190 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <span style={{ color: "#dc2626", fontWeight: 800, fontSize: 10 }}>[PDF]</span>
                        <span style={{ fontSize: 12, color: "#1e40af", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={item.archivoNombre}>
                          {item.archivoNombre}
                        </span>
                      </div>
                      <div style={{ fontSize: 10.5, color: "#94a3b8" }}>
                        v{item.version}.0 • {item.archivoTamano}
                      </div>
                    </td>

                    {/* Cargado */}
                    <td style={{ fontSize: 11.5, color: "#64748b", whiteSpace: "nowrap" }}>
                      {item.fechaCarga}
                    </td>

                    {/* Fecha Límite */}
                    <td style={{ fontSize: 11.5, color: "#475569", whiteSpace: "nowrap" }}>
                      {item.fechaLimite}
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
                        {item.estado}
                      </span>
                    </td>

                    {/* Acción */}
                    <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => onSelectEvidencia(item.actividadId, item.medioId)}
                        style={{ fontWeight: 700 }}
                      >
                        REVISAR
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
