import { Eye, History, Search } from "../components/icons";
import { TableActionButton } from "../components/TableActionButton";
import React, { useState } from "react";
import { AuditoriaEvento } from "./types";
import { FiltrosAuditoria } from "./useAuditoriaState";

interface AuditoriaViewProps {
  eventos: AuditoriaEvento[];
  totalEventosCount: number;
  filtros: FiltrosAuditoria;
  setFiltro: (campo: keyof FiltrosAuditoria, valor: string) => void;
  limpiarFiltros: () => void;
  metricas: {
    eventosHoy: number;
    planesHoy: number;
    evidenciasHoy: number;
    adminHoy: number;
  };
  onSelectEvento: (ev: AuditoriaEvento) => void;
  onOpenTrazabilidad: (objetoId?: string, tipoObjeto?: string) => void;
}

export default function AuditoriaView({
  eventos,
  totalEventosCount,
  filtros,
  setFiltro,
  limpiarFiltros,
  metricas,
  onSelectEvento,
  onOpenTrazabilidad,
}: AuditoriaViewProps) {
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 10;

  // Paginación simple
  const totalPaginas = Math.ceil(eventos.length / itemsPorPagina) || 1;
  const inicioIdx = (paginaActual - 1) * itemsPorPagina;
  const eventosPaginados = eventos.slice(inicioIdx, inicioIdx + itemsPorPagina);

  const hayFiltrosActivos =
    Boolean(filtros.busqueda) ||
    Boolean(filtros.fechaDesde) ||
    Boolean(filtros.fechaHasta) ||
    Boolean(filtros.usuario) ||
    Boolean(filtros.rol) ||
    Boolean(filtros.modulo) ||
    Boolean(filtros.tipoEvento) ||
    Boolean(filtros.grupo);

  const getRolBadgeStyle = (rol: string) => {
    switch (rol) {
      case "Docente":
        return { bg: "#dbeafe", text: "#1e40af", border: "#bfdbfe" };
      case "Revisor":
        return { bg: "#dcfce7", text: "#166534", border: "#bbf7d0" };
      case "Administrador":
        return { bg: "#f3e8ff", text: "#6b21a8", border: "#e9d5ff" };
      default:
        return { bg: "#f1f5f9", text: "#475569", border: "#e2e8f0" };
    }
  };

  const getModuloBadgeStyle = (modulo: string) => {
    switch (modulo) {
      case "Planes de Trabajo":
        return { bg: "#eff6ff", text: "#1d4ed8" };
      case "Evidencias":
        return { bg: "#ecfdf5", text: "#047857" };
      case "Administración":
      case "Usuarios":
      case "Períodos":
        return { bg: "#faf5ff", text: "#7e22ce" };
      default:
        return { bg: "#f8fafc", text: "#334155" };
    }
  };

  return (
    <div style={{ padding: "28px 32px", maxWidth: 1300, margin: "0 auto", fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24, flexWrap: "wrap", gap: 16 }}>
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
              MÓDULO DE GOBERNANZA
            </span>
            <span style={{ fontSize: 12, color: "#64748b" }}>Fecha del sistema: 07/09/2026</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1e293b", margin: 0, letterSpacing: "-0.02em" }}>
            Auditoría Institucional
          </h1>
          <p style={{ fontSize: 14, color: "#64748b", marginTop: 4, marginBottom: 0 }}>
            Consulte la trazabilidad de las acciones realizadas dentro del sistema.
          </p>
        </div>

        {/* Action button */}
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button
            onClick={() => onOpenTrazabilidad("plan-comision-eventos", "Plan")}
            style={{
              background: "#1a4f8a",
              color: "#ffffff",
              border: "none",
              borderRadius: 8,
              padding: "9px 16px",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            <History aria-hidden="true" style={{width:15,height:15}}/> CONSULTAR TRAZABILIDAD POR OBJETO
          </button>
        </div>
      </div>

      {/* Tarjetas de Métricas Institucionales */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 16, marginBottom: 24 }}>
        {/* EVENTOS HOY */}
        <div
          style={{
            background: "#ffffff",
            padding: "18px 20px",
            borderRadius: 10,
            border: "1px solid #e2e8f0",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}
        >
          <div style={{ fontSize: 11.5, fontWeight: 700, color: "#64748b", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Eventos hoy
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 4 }}>
            <span style={{ fontSize: 30, fontWeight: 800, color: "#1e293b", lineHeight: 1.1 }}>
              {metricas.eventosHoy}
            </span>
            <span style={{ fontSize: 12, color: "#64748b" }}>registros totales</span>
          </div>
        </div>

        {/* ACCIONES DE PLANES */}
        <div
          style={{
            background: "#ffffff",
            padding: "18px 20px",
            borderRadius: 10,
            border: "1px solid #e2e8f0",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}
        >
          <div style={{ fontSize: 11.5, fontWeight: 700, color: "#1d4ed8", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Acciones de planes
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 4 }}>
            <span style={{ fontSize: 30, fontWeight: 800, color: "#1d4ed8", lineHeight: 1.1 }}>
              {metricas.planesHoy}
            </span>
            <span style={{ fontSize: 12, color: "#64748b" }}>acciones hoy</span>
          </div>
        </div>

        {/* ACCIONES DE EVIDENCIAS */}
        <div
          style={{
            background: "#ffffff",
            padding: "18px 20px",
            borderRadius: 10,
            border: "1px solid #e2e8f0",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}
        >
          <div style={{ fontSize: 11.5, fontWeight: 700, color: "#047857", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Acciones de evidencias
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 4 }}>
            <span style={{ fontSize: 30, fontWeight: 800, color: "#047857", lineHeight: 1.1 }}>
              {metricas.evidenciasHoy}
            </span>
            <span style={{ fontSize: 12, color: "#64748b" }}>cargas y validaciones</span>
          </div>
        </div>

        {/* CAMBIOS ADMINISTRATIVOS */}
        <div
          style={{
            background: "#ffffff",
            padding: "18px 20px",
            borderRadius: 10,
            border: "1px solid #e2e8f0",
            boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
          }}
        >
          <div style={{ fontSize: 11.5, fontWeight: 700, color: "#7e22ce", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Cambios administrativos
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 4 }}>
            <span style={{ fontSize: 30, fontWeight: 800, color: "#7e22ce", lineHeight: 1.1 }}>
              {metricas.adminHoy}
            </span>
            <span style={{ fontSize: 12, color: "#64748b" }}>configuraciones</span>
          </div>
        </div>
      </div>

      {/* Panel de Filtros Interactivos */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: 10,
          border: "1px solid #e2e8f0",
          padding: "18px 20px",
          marginBottom: 20,
          boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#334155", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Filtros de Auditoría Institucional
          </div>
          {hayFiltrosActivos && (
            <button
              onClick={limpiarFiltros}
              style={{
                background: "none",
                border: "none",
                color: "#dc2626",
                fontSize: 12.5,
                fontWeight: 600,
                cursor: "pointer",
                padding: "2px 6px",
              }}
            >
              ✕ LIMPIAR FILTROS
            </button>
          )}
        </div>

        {/* Grid de Controles de Filtros */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
          {/* Búsqueda */}
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 4 }}>
              Buscar
            </label>
            <input
              type="text"
              placeholder="Buscar acción, objeto..."
              value={filtros.busqueda}
              onChange={(e) => {
                setFiltro("busqueda", e.target.value);
                setPaginaActual(1);
              }}
              style={{
                width: "100%",
                padding: "7px 10px",
                fontSize: 12.5,
                border: "1.5px solid #cbd5e1",
                borderRadius: 6,
                boxSizing: "border-box",
                outline: "none",
              }}
            />
          </div>

          {/* Fecha desde */}
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 4 }}>
              Fecha desde
            </label>
            <input
              type="text"
              placeholder="DD/MM/AAAA"
              value={filtros.fechaDesde}
              onChange={(e) => {
                setFiltro("fechaDesde", e.target.value);
                setPaginaActual(1);
              }}
              style={{
                width: "100%",
                padding: "7px 10px",
                fontSize: 12.5,
                border: "1.5px solid #cbd5e1",
                borderRadius: 6,
                boxSizing: "border-box",
                outline: "none",
              }}
            />
          </div>

          {/* Fecha hasta */}
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 4 }}>
              Fecha hasta
            </label>
            <input
              type="text"
              placeholder="DD/MM/AAAA"
              value={filtros.fechaHasta}
              onChange={(e) => {
                setFiltro("fechaHasta", e.target.value);
                setPaginaActual(1);
              }}
              style={{
                width: "100%",
                padding: "7px 10px",
                fontSize: 12.5,
                border: "1.5px solid #cbd5e1",
                borderRadius: 6,
                boxSizing: "border-box",
                outline: "none",
              }}
            />
          </div>

          {/* Módulo */}
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 4 }}>
              Módulo
            </label>
            <select
              value={filtros.modulo}
              onChange={(e) => {
                setFiltro("modulo", e.target.value);
                setPaginaActual(1);
              }}
              style={{
                width: "100%",
                padding: "7px 10px",
                fontSize: 12.5,
                border: "1.5px solid #cbd5e1",
                borderRadius: 6,
                background: "#ffffff",
                boxSizing: "border-box",
              }}
            >
              <option value="">Todos los módulos</option>
              <option value="Planes de Trabajo">Planes de Trabajo</option>
              <option value="Actividades">Actividades</option>
              <option value="Evidencias">Evidencias</option>
              <option value="Usuarios">Usuarios</option>
              <option value="Grupos">Grupos</option>
              <option value="Períodos">Períodos</option>
              <option value="Catálogos">Catálogos</option>
              <option value="Flujos">Flujos</option>
              <option value="Feriados">Feriados</option>
              <option value="Plantillas">Plantillas</option>
              <option value="Administración">Administración</option>
            </select>
          </div>

          {/* Usuario (Caso G) */}
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 4 }}>
              Usuario
            </label>
            <select
              value={filtros.usuario}
              onChange={(e) => {
                setFiltro("usuario", e.target.value);
                setPaginaActual(1);
              }}
              style={{
                width: "100%",
                padding: "7px 10px",
                fontSize: 12.5,
                border: "1.5px solid #cbd5e1",
                borderRadius: 6,
                background: "#ffffff",
                boxSizing: "border-box",
              }}
            >
              <option value="">Todos los usuarios</option>
              <option value="Andrea Pérez">Ing. Andrea Pérez, Mg.</option>
              <option value="Carlos López">Ing. Carlos López, Mg.</option>
              <option value="Laura Medina">Ing. Laura Medina, Mg.</option>
            </select>
          </div>

          {/* Rol */}
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 4 }}>
              Rol
            </label>
            <select
              value={filtros.rol}
              onChange={(e) => {
                setFiltro("rol", e.target.value);
                setPaginaActual(1);
              }}
              style={{
                width: "100%",
                padding: "7px 10px",
                fontSize: 12.5,
                border: "1.5px solid #cbd5e1",
                borderRadius: 6,
                background: "#ffffff",
                boxSizing: "border-box",
              }}
            >
              <option value="">Todos los roles</option>
              <option value="Docente">Docente</option>
              <option value="Revisor">Revisor</option>
              <option value="Administrador">Administrador</option>
            </select>
          </div>

          {/* Tipo de evento */}
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 4 }}>
              Tipo de evento
            </label>
            <select
              value={filtros.tipoEvento}
              onChange={(e) => {
                setFiltro("tipoEvento", e.target.value);
                setPaginaActual(1);
              }}
              style={{
                width: "100%",
                padding: "7px 10px",
                fontSize: 12.5,
                border: "1.5px solid #cbd5e1",
                borderRadius: 6,
                background: "#ffffff",
                boxSizing: "border-box",
              }}
            >
              <option value="">Todos los tipos</option>
              <option value="Creación">Creación</option>
              <option value="Modificación">Modificación</option>
              <option value="Envío">Envío</option>
              <option value="Revisión">Revisión</option>
              <option value="Devolución">Devolución</option>
              <option value="Aprobación">Aprobación</option>
              <option value="Firma">Firma</option>
              <option value="Carga">Carga</option>
              <option value="Reemplazo">Reemplazo</option>
              <option value="Observación">Observación</option>
              <option value="Validación">Validación</option>
              <option value="Activación">Activación</option>
              <option value="Asignación">Asignación</option>
              <option value="Cambio de configuración">Cambio de configuración</option>
            </select>
          </div>

          {/* Grupo institucional */}
          <div>
            <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 4 }}>
              Grupo institucional
            </label>
            <select
              value={filtros.grupo}
              onChange={(e) => {
                setFiltro("grupo", e.target.value);
                setPaginaActual(1);
              }}
              style={{
                width: "100%",
                padding: "7px 10px",
                fontSize: 12.5,
                border: "1.5px solid #cbd5e1",
                borderRadius: 6,
                background: "#ffffff",
                boxSizing: "border-box",
              }}
            >
              <option value="">Todos los grupos</option>
              <option value="Unidad de Titulación">Unidad de Titulación</option>
              <option value="Comisión de Eventos Académicos">Comisión de Eventos Académicos</option>
              <option value="Comisión de Prácticas Preprofesionales">Comisión de Prácticas Preprofesionales</option>
              <option value="Comisión Académica">Comisión Académica</option>
              <option value="Facultad FISEI">Facultad FISEI</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla de Auditoría Institucional */}
      <div
        style={{
          background: "#ffffff",
          borderRadius: 10,
          border: "1px solid #e2e8f0",
          overflow: "hidden",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#f8fafc", borderBottom: "1.5px solid #e2e8f0" }}>
                <th style={{ padding: "12px 16px", fontWeight: 700, color: "#475569", fontSize: 11, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                  FECHA / HORA
                </th>
                <th style={{ padding: "12px 16px", fontWeight: 700, color: "#475569", fontSize: 11, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                  USUARIO
                </th>
                <th style={{ padding: "12px 16px", fontWeight: 700, color: "#475569", fontSize: 11, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                  ROL
                </th>
                <th style={{ padding: "12px 16px", fontWeight: 700, color: "#475569", fontSize: 11, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                  MÓDULO
                </th>
                <th style={{ padding: "12px 16px", fontWeight: 700, color: "#475569", fontSize: 11, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                  ACCIÓN
                </th>
                <th style={{ padding: "12px 16px", fontWeight: 700, color: "#475569", fontSize: 11, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                  OBJETO
                </th>
                <th style={{ padding: "12px 16px", fontWeight: 700, color: "#475569", fontSize: 11, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                  GRUPO
                </th>
                <th style={{ padding: "12px 16px", fontWeight: 700, color: "#475569", fontSize: 11, letterSpacing: "0.05em", textTransform: "uppercase", textAlign: "center" }}>
                  DETALLE
                </th>
              </tr>
            </thead>
            <tbody>
              {eventosPaginados.length === 0 ? (
                /* Pantalla 05 — Estado Vacío */
                <tr>
                  <td colSpan={8} style={{ padding: "48px 24px", textAlign: "center" }}>
                    <Search aria-hidden="true" style={{width:32,height:32,color:"#94a3b8",margin:"0 auto 8px"}}/>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#334155", marginBottom: 6 }}>
                      No se encontraron eventos con los filtros seleccionados
                    </div>
                    <div style={{ fontSize: 13, color: "#64748b", marginBottom: 16 }}>
                      Intente modificando o restableciendo los criterios de búsqueda.
                    </div>
                    <button
                      onClick={limpiarFiltros}
                      style={{
                        background: "#1a4f8a",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: 6,
                        padding: "8px 16px",
                        fontSize: 12.5,
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      LIMPIAR FILTROS
                    </button>
                  </td>
                </tr>
              ) : (
                eventosPaginados.map((ev) => {
                  const rolBadge = getRolBadgeStyle(ev.rol);
                  const modBadge = getModuloBadgeStyle(ev.modulo);

                  return (
                    <tr
                      key={ev.id}
                      style={{
                        borderBottom: "1px solid #f1f5f9",
                        transition: "background 0.15s ease",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background = "#f8fafc";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background = "#ffffff";
                      }}
                    >
                      {/* Fecha / Hora */}
                      <td style={{ padding: "14px 16px", whiteSpace: "nowrap" }}>
                        <div style={{ fontWeight: 600, color: "#1e293b" }}>{ev.fechaHora}</div>
                      </td>

                      {/* Usuario */}
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ fontWeight: 600, color: "#1e293b" }}>{ev.usuario}</div>
                      </td>

                      {/* Rol */}
                      <td style={{ padding: "14px 16px" }}>
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            padding: "2px 8px",
                            borderRadius: 4,
                            background: rolBadge.bg,
                            color: rolBadge.text,
                            border: `1px solid ${rolBadge.border}`,
                          }}
                        >
                          {ev.rol}
                        </span>
                      </td>

                      {/* Módulo */}
                      <td style={{ padding: "14px 16px" }}>
                        <span
                          style={{
                            fontSize: 11.5,
                            fontWeight: 700,
                            padding: "2px 8px",
                            borderRadius: 4,
                            background: modBadge.bg,
                            color: modBadge.text,
                          }}
                        >
                          {ev.modulo}
                        </span>
                      </td>

                      {/* Acción */}
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ fontWeight: 700, color: "#0f2f56", fontSize: 12.5 }}>
                          {ev.accion}
                        </div>
                      </td>

                      {/* Objeto */}
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ color: "#334155", fontWeight: 500 }}>{ev.objeto}</div>
                      </td>

                      {/* Grupo */}
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ color: "#64748b", fontSize: 12 }}>{ev.grupo}</div>
                      </td>

                      {/* Detalle */}
                      <td style={{ padding: "14px 16px", textAlign: "center" }}>
                        <TableActionButton
                          title="Ver detalle"
                          icon={Eye}
                          onClick={() => onSelectEvento(ev)}
                        />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / Paginación */}
        <div
          style={{
            padding: "12px 20px",
            background: "#f8fafc",
            borderTop: "1px solid #e2e8f0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          <div style={{ fontSize: 12.5, color: "#64748b" }}>
            Mostrando <strong>{eventosPaginados.length}</strong> de <strong>{eventos.length}</strong> eventos registrados
            {totalEventosCount !== eventos.length && ` (filtrados de un total de ${totalEventosCount})`}
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button
              onClick={() => setPaginaActual((p) => Math.max(p - 1, 1))}
              disabled={paginaActual === 1}
              style={{
                background: "#ffffff",
                border: "1px solid #cbd5e1",
                borderRadius: 6,
                padding: "5px 12px",
                fontSize: 12,
                fontWeight: 600,
                color: paginaActual === 1 ? "#94a3b8" : "#334155",
                cursor: paginaActual === 1 ? "default" : "pointer",
              }}
            >
              ← Anterior
            </button>

            <span style={{ fontSize: 12, color: "#475569", fontWeight: 600 }}>
              Página {paginaActual} de {totalPaginas}
            </span>

            <button
              onClick={() => setPaginaActual((p) => Math.min(p + 1, totalPaginas))}
              disabled={paginaActual >= totalPaginas}
              style={{
                background: "#ffffff",
                border: "1px solid #cbd5e1",
                borderRadius: 6,
                padding: "5px 12px",
                fontSize: 12,
                fontWeight: 600,
                color: paginaActual >= totalPaginas ? "#94a3b8" : "#334155",
                cursor: paginaActual >= totalPaginas ? "default" : "pointer",
              }}
            >
              Siguiente →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
