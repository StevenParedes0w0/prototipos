import React, { useState, useMemo } from "react";
import { ActividadEjecucion, MedioVerificacion } from "./types";
import { DOCENTE_ACTUAL } from "./useActividadesState";
import VisorPdfModal from "./VisorPdfModal";
import ModalCargaEvidencia from "./ModalCargaEvidencia";
import ModalReemplazarEvidencia from "./ModalReemplazarEvidencia";
import ModalVerObservacionDocente from "../modulo6/ModalVerObservacionDocente";
import ModalTrazabilidadCompleta from "../modulo6/ModalTrazabilidadCompleta";
import { Eye, MessageSquare, RotateCcw, History } from "../components/icons";
import { TableActionButton } from "../components/TableActionButton";

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
  const [modalType, setModalType] = useState<"ver" | "cargar" | "reemplazar" | "observacion" | "trazabilidad" | null>(null);
  const [itemParaConfirmarReemplazo, setItemParaConfirmarReemplazo] = useState<{
    actividad: ActividadEjecucion;
    medio: MedioVerificacion;
  } | null>(null);

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

  // Helper to compute display validation status
  const getEstadoVisual = (medio: MedioVerificacion, actividad: ActividadEjecucion): "VALIDADA" | "OBSERVADA" | "PENDIENTE DE VALIDACIÓN" | "PLAZO VENCIDO" | "PENDIENTE DE CARGA" => {
    if (medio.estadoValidacion === "VALIDADA" || medio.estado === "VALIDADA") return "VALIDADA";
    if (medio.estadoValidacion === "OBSERVADA" || medio.estado === "OBSERVADA") return "OBSERVADA";
    if (medio.archivoVigente) return "PENDIENTE DE VALIDACIÓN";
    if (medio.estado === "PLAZO VENCIDO" || actividad.estado === "VENCIDA") return "PLAZO VENCIDO";
    return "PENDIENTE DE CARGA";
  };

  // Filtered evidence items
  const evidenciasFiltradas = useMemo(() => {
    return evidenciasList.filter(({ actividad, medio }) => {
      // Regla de responsable
      if (filtroAlcance === "mis" && !actividad.responsables.includes(DOCENTE_ACTUAL)) return false;

      if (filtroPeriodo !== "Todos los períodos" && actividad.periodo !== filtroPeriodo) return false;
      if (filtroPlan !== "Todos los planes" && actividad.planNombre !== filtroPlan) return false;
      if (filtroGrupo !== "Todos" && actividad.grupo !== filtroGrupo) return false;

      // Estado filter
      const estadoVis = getEstadoVisual(medio, actividad);
      if (filtroEstado !== "Todos") {
        if (filtroEstado === "VALIDADA" && estadoVis !== "VALIDADA") return false;
        if (filtroEstado === "OBSERVADA" && estadoVis !== "OBSERVADA") return false;
        if (filtroEstado === "PENDIENTE DE VALIDACIÓN" && estadoVis !== "PENDIENTE DE VALIDACIÓN") return false;
        if (filtroEstado === "PENDIENTE DE CARGA" && estadoVis !== "PENDIENTE DE CARGA") return false;
        if (filtroEstado === "PLAZO VENCIDO" && estadoVis !== "PLAZO VENCIDO") return false;
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
  }, [evidenciasList, filtroPeriodo, filtroPlan, filtroGrupo, filtroEstado, filtroMedio, busqueda, filtroAlcance]);

  const estadoBadgeStyle: Record<string, { bg: string; color: string; dot: string; icon?: string }> = {
    "VALIDADA":                 { bg: "#dcfce7", color: "#166534", dot: "#22c55e" },
    "OBSERVADA":                { bg: "#fee2e2", color: "#991b1b", dot: "#ef4444" },
    "PENDIENTE DE VALIDACIÓN":  { bg: "#fef3c7", color: "#92400e", dot: "#f59e0b" },
    "PENDIENTE DE CARGA":       { bg: "#f1f5f9", color: "#475569", dot: "#94a3b8" },
    "PLAZO VENCIDO":            { bg: "#fee2e2", color: "#991b1b", dot: "#ef4444" },
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
            <option>VALIDADA</option>
            <option>OBSERVADA</option>
            <option>PENDIENTE DE VALIDACIÓN</option>
            <option>PENDIENTE DE CARGA</option>
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
              <th style={{ textAlign: "right" }}>Acciones</th>
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
                const isCargada = Boolean(medio.archivoVigente);
                const isVencida = medio.estado === "PLAZO VENCIDO" || actividad.estado === "VENCIDA";
                const esResponsable = actividad.responsables.includes(DOCENTE_ACTUAL);
                const estadoVis = getEstadoVisual(medio, actividad);
                const sBadge = estadoBadgeStyle[estadoVis] || estadoBadgeStyle["PENDIENTE DE CARGA"];

                return (
                  <tr key={`${actividad.id}-${medio.id}`}>
                    {/* Actividad */}
                    <td style={{ maxWidth: 280 }}>
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
                    <td style={{ maxWidth: 200 }}>
                      {isCargada ? (
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ color: "#dc2626", fontWeight: 700, fontSize: 10 }}>[PDF]</span>
                          <span style={{ fontSize: 12.5, color: "#1e40af", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={medio.archivoVigente?.nombre}>
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
                        {estadoVis}
                      </span>
                    </td>

                    {/* Acciones */}
                    <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: 6, justifyContent: "flex-end" }}>
                        {isCargada && (
                          <TableActionButton
                            title="Ver documento PDF"
                            icon={Eye}
                            onClick={() => {
                              setActiveItem({ actividad, medio });
                              setModalType("ver");
                            }}
                          />
                        )}

                        {/* Botón ver observación si está observada */}
                        {estadoVis === "OBSERVADA" && (
                          <TableActionButton
                            title="Consultar la observación del revisor"
                            icon={MessageSquare}
                            variant="destructive"
                            onClick={() => {
                              setActiveItem({ actividad, medio });
                              setModalType("observacion");
                            }}
                          />
                        )}

                        {/* Reemplazar con flujo seguro según estado */}
                        {isCargada && !isVencida && esResponsable && (
                          <TableActionButton
                            title="Cargar nueva versión del archivo"
                            icon={RotateCcw}
                            onClick={() => {
                              if (estadoVis === "VALIDADA") {
                                setItemParaConfirmarReemplazo({ actividad, medio });
                              } else {
                                setActiveItem({ actividad, medio });
                                setModalType("reemplazar");
                              }
                            }}
                          />
                        )}

                        {/* Ver Trazabilidad / Auditoría */}
                        {isCargada && (
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => {
                              setActiveItem({ actividad, medio });
                              setModalType("trazabilidad");
                            }}
                            style={{
                              color: "#64748b",
                              padding: "4px 7px",
                            }}
                            title="Historial de versiones y trazabilidad de auditoría"
                          >
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                            </svg>
                          </button>
                        )}

                        {/* Casos sin archivo */}
                        {!isCargada && isVencida && (
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => onNavigateToActividad(actividad.id)}
                            style={{ color: "#991b1b" }}
                          >
                            VER AVISO
                          </button>
                        )}

                        {!isCargada && !isVencida && !esResponsable && (
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
                        )}

                        {!isCargada && !isVencida && esResponsable && (
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
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Advertencia de Reemplazo en Evidencia Validada */}
      {itemParaConfirmarReemplazo && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(15,35,60,0.65)",
          zIndex: 600,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
        }}>
          <div style={{
            background: "#fff",
            borderRadius: 12,
            width: 500,
            maxWidth: "100%",
            boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
            border: "1px solid #e2e8f0",
            overflow: "hidden",
          }}>
            <div style={{
              padding: "18px 24px",
              background: "#fffbeb",
              borderBottom: "1px solid #fef3c7",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}>
              <div style={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                background: "#fef3c7",
                color: "#b45309",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              </div>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: "#92400e", margin: 0 }}>
                  Advertencia de reemplazo
                </h3>
                <p style={{ fontSize: 12.5, color: "#b45309", margin: "2px 0 0" }}>
                  Evidencia formalmente validada
                </p>
              </div>
            </div>

            <div style={{ padding: "20px 24px" }}>
              <p style={{ fontSize: 13.5, color: "#334155", lineHeight: 1.6, margin: "0 0 14px" }}>
                Esta evidencia ya fue <strong>evaluada y validada favorablemente</strong> por el revisor institucional.
              </p>
              <div style={{
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: 8,
                padding: "12px 16px",
                fontSize: 12.5,
                color: "#475569",
                lineHeight: 1.55,
                marginBottom: 16,
              }}>
                <strong>Consecuencias del reemplazo:</strong>
                <ul style={{ margin: "6px 0 0", paddingLeft: 18 }}>
                  <li>La evidencia perderá la condición de <strong>VALIDADA</strong>.</li>
                  <li>La nueva versión pasará a estado <strong>PENDIENTE DE VALIDACIÓN</strong>.</li>
                  <li>El revisor institucional deberá evaluar nuevamente el archivo.</li>
                  <li>La acción quedará registrada en la pista de auditoría.</li>
                </ul>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button
                  className="btn btn-ghost"
                  onClick={() => setItemParaConfirmarReemplazo(null)}
                >
                  Cancelar
                </button>
                <button
                  className="btn btn-primary"
                  style={{ background: "#b45309", borderColor: "#b45309" }}
                  onClick={() => {
                    setActiveItem(itemParaConfirmarReemplazo);
                    setItemParaConfirmarReemplazo(null);
                    setModalType("reemplazar");
                  }}
                >
                  Continuar y reemplazar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Visor PDF */}
      {activeItem && modalType === "ver" && (
        <VisorPdfModal
          actividad={activeItem.actividad}
          medio={activeItem.medio}
          onClose={() => {
            setActiveItem(null);
            setModalType(null);
          }}
          onOpenReemplazar={() => {
            if (activeItem.medio.estadoValidacion === "VALIDADA" || activeItem.medio.estado === "VALIDADA") {
              setItemParaConfirmarReemplazo(activeItem);
              setModalType(null);
            } else {
              setModalType("reemplazar");
            }
          }}
        />
      )}

      {/* Modal Cargar */}
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

      {/* Modal Reemplazar */}
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

      {/* Modal Observación Docente */}
      {activeItem && modalType === "observacion" && (
        <ModalVerObservacionDocente
          medio={activeItem.medio}
          actividad={activeItem.actividad}
          puedeReemplazar={!activeItem.actividad.estado.includes("VENCIDA") && activeItem.actividad.responsables.includes(DOCENTE_ACTUAL)}
          onClose={() => {
            setActiveItem(null);
            setModalType(null);
          }}
          onReemplazar={() => {
            setModalType("reemplazar");
          }}
        />
      )}

      {/* Modal Trazabilidad Completa */}
      {activeItem && modalType === "trazabilidad" && (
        <ModalTrazabilidadCompleta
          medio={activeItem.medio}
          actividad={activeItem.actividad}
          onClose={() => {
            setActiveItem(null);
            setModalType(null);
          }}
        />
      )}
    </div>
  );
}
