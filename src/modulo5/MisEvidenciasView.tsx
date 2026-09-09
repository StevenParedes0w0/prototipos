import React, { useState, useMemo } from "react";
import { ActividadEjecucion, MedioVerificacion } from "./types";
import { DOCENTE_ACTUAL } from "./useActividadesState";
import VisorPdfModal from "./VisorPdfModal";
import ModalCargaEvidencia from "./ModalCargaEvidencia";
import ModalReemplazarEvidencia from "./ModalReemplazarEvidencia";

interface MisEvidenciasViewProps {
  actividades: ActividadEjecucion[];
  onCargarEvidencia: (actividadId: string, medioId: string, archivo: { nombre: string; tamano: string }) => void;
  onReemplazarEvidencia: (actividadId: string, medioId: string, archivo: { nombre: string; tamano: string }, motivo?: string) => void;
  onNavigateToActividad: (actividadId: string) => void;
}

export default function MisEvidenciasView({
  actividades,
  onCargarEvidencia,
  onReemplazarEvidencia,
  onNavigateToActividad,
}: MisEvidenciasViewProps) {
  const [filtroAlcance, setFiltroAlcance] = useState<"mis" | "todas">("mis");
  const [filtroPeriodo, setFiltroPeriodo] = useState("Julio – Diciembre 2026");
  const [filtroPlan, setFiltroPlan] = useState("Todos los planes");
  const [filtroGrupo, setFiltroGrupo] = useState("Todos");
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [filtroMedio, setFiltroMedio] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");

  // Modal states
  const [activeItem, setActiveItem] = useState<{
    actividad: ActividadEjecucion;
    medio: MedioVerificacion;
  } | null>(null);
  const [modalType, setModalType] = useState<"ver" | "cargar" | "reemplazar" | null>(null);

  // Flattened evidence items across all activities
  const evidenciasList = useMemo(() => {
    const items: Array<{
      actividad: ActividadEjecucion;
      medio: MedioVerificacion;
    }> = [];

    actividades.forEach((act) => {
      act.medios.forEach((m) => {
        items.push({
          actividad: act,
          medio: m,
        });
      });
    });

    return items;
  }, [actividades]);

  // Filtered evidence items
  const evidenciasFiltradas = useMemo(() => {
    return evidenciasList.filter(({ actividad, medio }) => {
      // Regla de responsable
      if (filtroAlcance === "mis" && !actividad.responsables.includes(DOCENTE_ACTUAL)) return false;

      if (filtroPeriodo !== "Todos los períodos" && actividad.periodo !== filtroPeriodo) return false;
      if (filtroPlan !== "Todos los planes" && actividad.planNombre !== filtroPlan) return false;
      if (filtroGrupo !== "Todos" && actividad.grupo !== filtroGrupo) return false;

      // Estado filter (PENDIENTE, CARGADA, PLAZO VENCIDO)
      if (filtroEstado !== "Todos") {
        if (filtroEstado === "PLAZO VENCIDO" && medio.estado !== "PLAZO VENCIDO") return false;
        if (filtroEstado === "CARGADA" && medio.estado !== "CARGADA") return false;
        if (filtroEstado === "PENDIENTE" && medio.estado !== "PENDIENTE") return false;
      }

      // Medio filter
      if (filtroMedio !== "Todos" && medio.nombre.toLowerCase() !== filtroMedio.toLowerCase()) return false;

      // Search query
      if (busqueda) {
        const q = busqueda.toLowerCase();
        const match =
          actividad.nombre.toLowerCase().includes(q) ||
          medio.nombre.toLowerCase().includes(q) ||
          (medio.archivoVigente?.nombre.toLowerCase().includes(q) ?? false);
        if (!match) return false;
      }

      return true;
    });
  }, [evidenciasList, filtroPeriodo, filtroPlan, filtroGrupo, filtroEstado, filtroMedio, busqueda]);

  const estadoBadgeStyle: Record<string, { bg: string; color: string; dot: string }> = {
    "CARGADA":       { bg: "#dcfce7", color: "#166534", dot: "#22c55e" },
    "PENDIENTE":     { bg: "#fef3c7", color: "#92400e", dot: "#f59e0b" },
    "PLAZO VENCIDO": { bg: "#fee2e2", color: "#991b1b", dot: "#ef4444" },
  };

  return (
    <div style={{ padding: "28px", maxWidth: 1200, margin: "0 auto" }}>
      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#64748b", marginBottom: 12 }}>
        <span>Inicio</span>
        <span style={{ color: "#cbd5e1" }}>/</span>
        <span style={{ color: "#1e2a3a", fontWeight: 600 }}>Evidencias</span>
      </div>

      {/* Header */}
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1e2a3a", fontFamily: "'DM Sans',sans-serif", margin: "0 0 4px" }}>
          Mis Evidencias
        </h1>
        <p style={{ fontSize: 13.5, color: "#6b7a8d", margin: 0 }}>
          Consulte los medios de verificación requeridos y los archivos cargados en sus actividades.
        </p>
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
            <option value="mis">Solo mis evidencias asignadas</option>
            <option value="todas">Todas las del Plan (General)</option>
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
          <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>Grupo:</span>
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
            <option>CARGADA</option>
            <option>PENDIENTE</option>
            <option>PLAZO VENCIDO</option>
          </select>
        </div>

        {/* Medio de verificación */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>Medio:</span>
          <select
            className="form-select"
            style={{ width: "auto", fontSize: 12.5, padding: "5px 28px 5px 10px" }}
            value={filtroMedio}
            onChange={(e) => setFiltroMedio(e.target.value)}
          >
            <option>Todos</option>
            <option>Informe</option>
            <option>Acta</option>
            <option>Certificado</option>
            <option>Resolución</option>
            <option>Oficio</option>
            <option>Registro fotográfico</option>
          </select>
        </div>

        {/* Busqueda */}
        <div style={{ flex: 1, minWidth: 180, display: "flex", alignItems: "center" }}>
          <input
            type="text"
            className="form-input"
            placeholder="Buscar..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{ fontSize: 12.5, padding: "5px 12px" }}
          />
        </div>
      </div>

      {/* Evidencias Table */}
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
              <th>Medio</th>
              <th>Plan / Grupo</th>
              <th>Fecha límite</th>
              <th>Archivo</th>
              <th>Estado</th>
              <th style={{ textAlign: "right" }}>Acción</th>
            </tr>
          </thead>
          <tbody>
            {evidenciasFiltradas.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "36px 0", color: "#94a3b8" }}>
                  No se encontraron evidencias registradas con los filtros seleccionados.
                </td>
              </tr>
            ) : (
              evidenciasFiltradas.map(({ actividad, medio }) => {
                const isCargada = medio.estado === "CARGADA" && medio.archivoVigente;
                const isVencida = medio.estado === "PLAZO VENCIDO" || actividad.estado === "VENCIDA";
                const badgeState = isCargada ? "CARGADA" : isVencida ? "PLAZO VENCIDO" : "PENDIENTE";
                const sBadge = estadoBadgeStyle[badgeState];

                return (
                  <tr key={`${actividad.id}-${medio.id}`}>
                    {/* Actividad */}
                    <td style={{ maxWidth: 300 }}>
                      <div
                        onClick={() => onNavigateToActividad(actividad.id)}
                        style={{
                          fontWeight: 700,
                          color: "#1a4f8a",
                          fontSize: 13,
                          cursor: "pointer",
                          marginBottom: 2,
                        }}
                        title="Ver ficha de actividad"
                      >
                        {actividad.nombre}
                      </div>
                      <div style={{ fontSize: 11, color: "#64748b" }}>
                        {actividad.categoria}
                      </div>
                    </td>

                    {/* Medio */}
                    <td>
                      <span style={{
                        fontWeight: 700,
                        fontSize: 12.5,
                        color: "#1e2a3a",
                        background: "#f1f5f9",
                        padding: "2px 8px",
                        borderRadius: 4,
                      }}>
                        {medio.nombre}
                      </span>
                    </td>

                    {/* Plan / Grupo */}
                    <td style={{ fontSize: 12.5, color: "#334155" }}>
                      {actividad.grupo}
                    </td>

                    {/* Fecha límite */}
                    <td style={{ fontSize: 12, color: isVencida ? "#991b1b" : "#475569", whiteSpace: "nowrap" }}>
                      {actividad.fechaLimiteExacta}
                    </td>

                    {/* Archivo */}
                    <td style={{ maxWidth: 220 }}>
                      {isCargada ? (
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ color: "#dc2626", fontWeight: 700, fontSize: 10 }}>[PDF]</span>
                          <span style={{ fontSize: 12.5, color: "#1e40af", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {medio.archivoVigente?.nombre}
                          </span>
                        </div>
                      ) : (
                        <span style={{ color: "#94a3b8", fontSize: 13 }}>—</span>
                      )}
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
                        {badgeState}
                      </span>
                    </td>

                    {/* Accion */}
                    <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                      {isCargada ? (
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => {
                            setActiveItem({ actividad, medio });
                            setModalType("ver");
                          }}
                        >
                          VER
                        </button>
                      ) : isVencida ? (
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => onNavigateToActividad(actividad.id)}
                          style={{ color: "#991b1b" }}
                        >
                          VER AVISO
                        </button>
                      ) : !actividad.responsables.includes(DOCENTE_ACTUAL) ? (
                        <span style={{
                          fontSize: 11.5,
                          fontWeight: 600,
                          color: "#64748b",
                          background: "#f1f5f9",
                          padding: "4px 8px",
                          borderRadius: 4,
                        }}>
                          Solo lectura
                        </span>
                      ) : (
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => {
                            setActiveItem({ actividad, medio });
                            setModalType("cargar");
                          }}
                        >
                          CARGAR
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {activeItem && modalType === "ver" && (
        <VisorPdfModal
          actividad={activeItem.actividad}
          medio={activeItem.medio}
          onClose={() => {
            setActiveItem(null);
            setModalType(null);
          }}
          onOpenReemplazar={() => setModalType("reemplazar")}
        />
      )}

      {activeItem && modalType === "cargar" && (
        <ModalCargaEvidencia
          actividad={activeItem.actividad}
          medio={activeItem.medio}
          onClose={() => {
            setActiveItem(null);
            setModalType(null);
          }}
          onCargar={(archivo) => {
            onCargarEvidencia(activeItem.actividad.id, activeItem.medio.id, archivo);
            setActiveItem(null);
            setModalType(null);
          }}
        />
      )}

      {activeItem && modalType === "reemplazar" && (
        <ModalReemplazarEvidencia
          actividad={activeItem.actividad}
          medio={activeItem.medio}
          onClose={() => {
            setActiveItem(null);
            setModalType(null);
          }}
          onReemplazar={(archivo, motivo) => {
            onReemplazarEvidencia(activeItem.actividad.id, activeItem.medio.id, archivo, motivo);
            setActiveItem(null);
            setModalType(null);
          }}
        />
      )}
    </div>
  );
}
