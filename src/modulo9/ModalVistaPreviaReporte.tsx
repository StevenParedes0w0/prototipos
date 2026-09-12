import React, { useState } from "react";
import { ReportePlanItem, TipoReporteGenerar, FormatoReporte } from "./types";

interface ModalVistaPreviaReporteProps {
  isOpen: boolean;
  plan: ReportePlanItem | null;
  tipo: TipoReporteGenerar;
  formato: FormatoReporte;
  onClose: () => void;
}

export default function ModalVistaPreviaReporte({
  isOpen,
  plan,
  tipo,
  formato,
  onClose,
}: ModalVistaPreviaReporteProps) {
  const [toastDescarga, setToastDescarga] = useState<string | null>(null);

  if (!isOpen || !plan) return null;

  const triggerDownloadDemo = (tipoArchivo: "PDF" | "Excel") => {
    setToastDescarga(`Simulación: Archivo '${plan.nombre.replace(/\s+/g, "_")}.${tipoArchivo === "PDF" ? "pdf" : "xlsx"}' descargado (DEMO).`);
    setTimeout(() => {
      setToastDescarga(null);
    }, 3500);
  };

  const getTipoTitulo = () => {
    switch (tipo) {
      case "resumen_plan":
        return "REPORTE DE ESTADO Y RESUMEN DOCUMENTAL";
      case "actividades_evidencias":
        return "REPORTE DETALLADO DE ACTIVIDADES Y EVIDENCIAS";
      case "historial_validacion":
        return "REPORTE DE TRAZABILIDAD Y VALIDACIÓN TÉCNICA";
      default:
        return "REPORTE DE PLAN DE TRABAJO";
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15, 23, 42, 0.7)",
        backdropFilter: "blur(3px)",
        zIndex: 1200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        fontFamily: "'DM Sans', sans-serif",
      }}
      onClick={onClose}
    >
      {/* Toast de descarga simulada */}
      {toastDescarga && (
        <div
          style={{
            position: "fixed",
            bottom: 30,
            right: 30,
            background: "#0f2f56",
            color: "#ffffff",
            padding: "12px 20px",
            borderRadius: 8,
            boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
            zIndex: 1500,
            fontSize: 13,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 10,
            border: "1px solid #38bdf8",
          }}
        >
          <span>📥</span>
          {toastDescarga}
        </div>
      )}

      <div
        style={{
          background: "#f1f5f9",
          borderRadius: 12,
          width: 860,
          maxWidth: "100%",
          maxHeight: "92vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
          border: "1px solid #cbd5e1",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Barra superior de herramientas */}
        <div
          style={{
            padding: "12px 20px",
            background: "#0f2f56",
            color: "#ffffff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 16 }}>📄</span>
            <span style={{ fontSize: 13, fontWeight: 700 }}>
              Vista previa de documento institucional A4 ({formato})
            </span>
            <span
              style={{
                fontSize: 10.5,
                fontWeight: 800,
                background: "#b45309",
                color: "#ffffff",
                padding: "2px 6px",
                borderRadius: 4,
                letterSpacing: "0.05em",
              }}
            >
              SIMULACIÓN DEMO
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              onClick={() => triggerDownloadDemo("PDF")}
              style={{
                background: "#1a4f8a",
                color: "#ffffff",
                border: "none",
                borderRadius: 6,
                padding: "6px 12px",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <span>⬇ PDF — DEMO</span>
            </button>
            <button
              onClick={() => triggerDownloadDemo("Excel")}
              style={{
                background: "#166534",
                color: "#ffffff",
                border: "none",
                borderRadius: 6,
                padding: "6px 12px",
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <span>⬇ Excel — DEMO</span>
            </button>
            <button
              onClick={onClose}
              style={{
                background: "transparent",
                border: "none",
                color: "#94a3b8",
                fontSize: 18,
                cursor: "pointer",
                padding: "2px 8px",
              }}
              title="Cerrar vista previa"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Contenedor de Hoja A4 simulada */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px 20px", display: "flex", justifyContent: "center" }}>
          <div
            style={{
              width: "100%",
              maxWidth: 780,
              background: "#ffffff",
              boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
              border: "1px solid #e2e8f0",
              padding: "40px 48px",
              boxSizing: "border-box",
              position: "relative",
            }}
          >
            {/* Marca de agua DEMO sutil */}
            <div
              style={{
                position: "absolute",
                top: "45%",
                left: 0,
                width: "100%",
                textAlign: "center",
                transform: "rotate(-30deg)",
                fontSize: 42,
                fontWeight: 900,
                color: "rgba(148, 163, 184, 0.09)",
                pointerEvents: "none",
                userSelect: "none",
                letterSpacing: "0.18em",
              }}
            >
              VISTA PREVIA — DEMO
            </div>

            {/* Encabezado Institucional */}
            <div
              style={{
                borderBottom: "2px solid #0f2f56",
                paddingBottom: 16,
                marginBottom: 24,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div>
                <div style={{ fontSize: 15, fontWeight: 900, color: "#0f2f56", letterSpacing: "0.04em", textTransform: "uppercase" }}>
                  Universidad Técnica de Ambato
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#b91c1c", marginTop: 2 }}>
                  Facultad de Ingeniería en Sistemas, Electrónica e Industrial (FISEI)
                </div>
                <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>
                  Gestión Documental Académica
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#475569" }}>Fecha de generación:</div>
                <div style={{ fontSize: 11, color: "#1e293b", fontWeight: 600 }}>07/09/2026 — 11:30</div>
              </div>
            </div>

            {/* Título del reporte */}
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#0f2f56", letterSpacing: "0.03em" }}>
                {getTipoTitulo()}
              </div>
              <div style={{ fontSize: 12.5, color: "#64748b", marginTop: 4 }}>
                {plan.nombre} • Versión formal {plan.version}
              </div>
            </div>

            {/* 1. Información General */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#0f2f56", borderBottom: "1px solid #cbd5e1", paddingBottom: 4, marginBottom: 10, textTransform: "uppercase" }}>
                1. Información General
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 20px", fontSize: 12 }}>
                <div><strong style={{ color: "#475569" }}>Docente responsable: </strong>{plan.docente}</div>
                <div><strong style={{ color: "#475569" }}>Grupo institucional: </strong>{plan.grupo}</div>
                <div><strong style={{ color: "#475569" }}>Período académico: </strong>{plan.periodo}</div>
                <div><strong style={{ color: "#475569" }}>Estado del Plan: </strong>
                  <span style={{ fontWeight: 700, color: plan.estado === "EN EJECUCIÓN" ? "#166534" : "#b45309" }}>
                    {plan.estado}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Resumen Documental (CANTIDADES REALES, NO SOLO %) */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#0f2f56", borderBottom: "1px solid #cbd5e1", paddingBottom: 4, marginBottom: 10, textTransform: "uppercase" }}>
                2. Resumen Documental Cuantitativo
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, textAlign: "center" }}>
                <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", padding: "10px", borderRadius: 6 }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "#1e293b" }}>{plan.actividadesTotal}</div>
                  <div style={{ fontSize: 10.5, color: "#64748b", fontWeight: 600, marginTop: 2 }}>Actividades totales</div>
                </div>
                <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "10px", borderRadius: 6 }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "#166534" }}>{plan.actividadesCompletas} / {plan.actividadesTotal}</div>
                  <div style={{ fontSize: 10.5, color: "#15803d", fontWeight: 600, marginTop: 2 }}>Con evidencias completas</div>
                </div>
                <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", padding: "10px", borderRadius: 6 }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "#1e40af" }}>{plan.evidenciasCargadas} / {plan.evidenciasRequeridas}</div>
                  <div style={{ fontSize: 10.5, color: "#1d4ed8", fontWeight: 600, marginTop: 2 }}>Evidencias cargadas</div>
                </div>
                <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", padding: "10px", borderRadius: 6 }}>
                  <div style={{ fontSize: 18, fontWeight: 800, color: "#166534" }}>{plan.evidenciasValidadas} / {plan.evidenciasRequeridas}</div>
                  <div style={{ fontSize: 10.5, color: "#15803d", fontWeight: 600, marginTop: 2 }}>Evidencias validadas</div>
                </div>
              </div>
            </div>

            {/* 3. Matriz de Actividades y Estado Documental */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#0f2f56", borderBottom: "1px solid #cbd5e1", paddingBottom: 4, marginBottom: 10, textTransform: "uppercase" }}>
                3. Matriz de Actividades y Estado de Evidencias
              </div>

              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                <thead>
                  <tr style={{ background: "#f1f5f9", borderBottom: "1.5px solid #cbd5e1", color: "#334155" }}>
                    <th style={{ padding: "7px 8px", textAlign: "left" }}>Actividad</th>
                    <th style={{ padding: "7px 8px", textAlign: "center" }}>Vigencia</th>
                    <th style={{ padding: "7px 8px", textAlign: "center" }}>Medios</th>
                    <th style={{ padding: "7px 8px", textAlign: "center" }}>Cargados</th>
                    <th style={{ padding: "7px 8px", textAlign: "center" }}>Validados</th>
                    <th style={{ padding: "7px 8px", textAlign: "right" }}>Estado Documental</th>
                  </tr>
                </thead>
                <tbody>
                  {(plan.actividades && plan.actividades.length > 0 ? plan.actividades : [
                    { id: "1", nombre: "Seguimiento al avance de trabajos de titulación", desde: "02/09/2026", hasta: "18/09/2026", mediosTotal: 2, mediosCargados: 2, mediosValidados: 1, estadoDocumental: "OBSERVADA" },
                    { id: "2", nombre: "Difusión de normativa interna de titulación", desde: "01/09/2026", hasta: "03/09/2026", mediosTotal: 1, mediosCargados: 1, mediosValidados: 1, estadoDocumental: "EVIDENCIA VALIDADA" },
                    { id: "3", nombre: "Revisión de planes de grado cohorte 2025", desde: "15/08/2026", hasta: "28/08/2026", mediosTotal: 2, mediosCargados: 2, mediosValidados: 2, estadoDocumental: "EVIDENCIA VALIDADA" },
                  ]).map((act: any, idx: number) => (
                    <tr key={idx} style={{ borderBottom: "1px solid #e2e8f0" }}>
                      <td style={{ padding: "8px", fontWeight: 600, color: "#1e293b" }}>{act.nombre}</td>
                      <td style={{ padding: "8px", textAlign: "center", color: "#64748b" }}>{act.desde} - {act.hasta}</td>
                      <td style={{ padding: "8px", textAlign: "center", fontWeight: 700 }}>{act.mediosTotal}</td>
                      <td style={{ padding: "8px", textAlign: "center", color: act.mediosCargados === act.mediosTotal ? "#166534" : "#b45309", fontWeight: 700 }}>
                        {act.mediosCargados}
                      </td>
                      <td style={{ padding: "8px", textAlign: "center", color: act.mediosValidados === act.mediosTotal ? "#166534" : "#64748b", fontWeight: 700 }}>
                        {act.mediosValidados}
                      </td>
                      <td style={{ padding: "8px", textAlign: "right" }}>
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            padding: "2px 6px",
                            borderRadius: 4,
                            background:
                              act.estadoDocumental === "EVIDENCIA VALIDADA" ? "#dcfce7" :
                              act.estadoDocumental === "OBSERVADA" ? "#fee2e2" :
                              act.estadoDocumental === "VALIDACIÓN PENDIENTE" ? "#e0f2fe" : "#f1f5f9",
                            color:
                              act.estadoDocumental === "EVIDENCIA VALIDADA" ? "#166534" :
                              act.estadoDocumental === "OBSERVADA" ? "#991b1b" :
                              act.estadoDocumental === "VALIDACIÓN PENDIENTE" ? "#0369a1" : "#475569",
                          }}
                        >
                          {act.estadoDocumental}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 4. Observaciones y Trazabilidad */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#0f2f56", borderBottom: "1px solid #cbd5e1", paddingBottom: 4, marginBottom: 10, textTransform: "uppercase" }}>
                4. Observaciones Técnicas Registradas
              </div>
              <div style={{ background: "#fff5f5", border: "1px solid #fecaca", borderRadius: 6, padding: "10px 14px", fontSize: 11.5, color: "#7f1d1d" }}>
                <strong>Observación vigente (Acta — 07/09/2026 — 10:28):</strong> Falta la firma de constancia de asistencia y sello del tutor. Revisor: Ing. Carlos López, Mg.
              </div>
            </div>

            {/* Pie institucional */}
            <div style={{ borderTop: "1px solid #cbd5e1", paddingTop: 14, fontSize: 10, color: "#94a3b8", display: "flex", justifyContent: "space-between" }}>
              <span>Documento institucional de consulta y seguimiento • FISEI UTA</span>
              <span>Página 1 de 1</span>
            </div>
          </div>
        </div>

        {/* Footer con acciones */}
        <div
          style={{
            padding: "12px 20px",
            background: "#ffffff",
            borderTop: "1px solid #e2e8f0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 12, color: "#64748b" }}>
            Los reportes representan el estado documental fáctico a la fecha del sistema (07/09/2026).
          </span>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "7px 18px",
              borderRadius: 6,
              background: "#475569",
              color: "#ffffff",
              border: "none",
              fontSize: 12.5,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Cerrar vista previa
          </button>
        </div>
      </div>
    </div>
  );
}

