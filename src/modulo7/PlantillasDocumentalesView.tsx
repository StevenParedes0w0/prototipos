// Pantalla 13 — Plantillas Documentales
import React, { useState } from "react";
import { PlantillaDocumental } from "./types";
import { Eye, Pencil, Archive, CheckCircle2, History, GitBranch } from "../components/icons";
import { TableActionButton } from "../components/TableActionButton";

interface PlantillasDocumentalesViewProps {
  plantillas: PlantillaDocumental[];
}

const SECCIONES_PLAN_TRABAJO = [
  {
    num: "1",
    titulo: "Justificación",
    estado: "REQUERIDA",
    obligatoria: true,
    detalle: "Fundamentación y necesidad académica de la planificación.",
  },
  {
    num: "2",
    titulo: "Objetivo",
    estado: "REQUERIDO",
    obligatoria: true,
    detalle: "Objetivo general de la planificación.",
  },
  {
    num: "3",
    titulo: "Matriz de actividades",
    estado: "REQUERIDA",
    obligatoria: true,
    detalle: "Tabla 1.- Matriz de actividades con columnas: ACTIVIDADES, CRONOGRAMA (Desde, Hasta), RESPONSABLE, RECURSOS (humano, tecnológico, económico, material) y MEDIOS DE VERIFICACIÓN.",
  },
  {
    num: "4",
    titulo: "Anexos",
    estado: "OPCIONAL",
    obligatoria: false,
    detalle: "Documentación complementaria de soporte (si no aplica, se muestra 'No aplica.').",
  },
  {
    num: "—",
    titulo: "FIRMAS DE RESPONSABILIDAD",
    estado: "REQUERIDA",
    obligatoria: true,
    detalle: "Estructura de 4 columnas: ACCIONES, NOMBRE, CARGO, FIRMA (Elaborado por, Revisado por, Validado por / Aprobado por).",
  },
  {
    num: "—",
    titulo: "CONTROL DE HISTORIAL DE CAMBIOS",
    estado: "REQUERIDO",
    obligatoria: true,
    detalle: "Control de versiones formal: Versión, Descripción del Cambio, Fecha de Actualización.",
  },
];

const SECCIONES_INFORME_TECNICO = [
  {
    num: "1",
    titulo: "Antecedentes",
    estado: "REQUERIDA",
    obligatoria: true,
    detalle: "Contexto previo y referencia al plan de trabajo o delegación de origen.",
  },
  {
    num: "2",
    titulo: "Desarrollo de actividades",
    estado: "REQUERIDA",
    obligatoria: true,
    detalle: "Tabla 1.- Resultados de la matriz de actividades (Actividades, Medios de verificación, Porcentaje de ejecución, Observaciones) si deriva de plan, o desarrollo textual si es independiente.",
  },
  {
    num: "3",
    titulo: "Conclusiones",
    estado: "REQUERIDA",
    obligatoria: true,
    detalle: "Resultados y conclusiones alcanzadas.",
  },
  {
    num: "4",
    titulo: "Oportunidades de mejora",
    estado: "REQUERIDA",
    obligatoria: true,
    detalle: "Recomendaciones y oportunidades de optimización.",
  },
  {
    num: "5",
    titulo: "Registro de contactos y gestiones de la delegación",
    estado: "CONDICIONAL",
    obligatoria: false,
    detalle: "Estructura de delegación: Delegación, Ciudad/País/Institución, Contacto, Tema/Propósito y Acuerdo/Seguimiento (si no aplica, se muestra 'No aplica.').",
  },
  {
    num: "6",
    titulo: "Anexos",
    estado: "CONDICIONAL",
    obligatoria: false,
    detalle: "Documentación complementaria de soporte (si no aplica, se muestra 'No aplica.').",
  },
  {
    num: "—",
    titulo: "FIRMAS DE RESPONSABILIDAD",
    estado: "REQUERIDA",
    obligatoria: true,
    detalle: "Estructura de 4 columnas: ACCIONES, NOMBRE, CARGO, FIRMA (Elaborado por, Revisado por, Validado por / Aprobado por).",
  },
  {
    num: "—",
    titulo: "CONTROL DE HISTORIAL DE CAMBIOS",
    estado: "REQUERIDO",
    obligatoria: true,
    detalle: "Control de versiones formal: Versión, Descripción del Cambio, Fecha de Actualización.",
  },
];

export default function PlantillasDocumentalesView({ plantillas }: PlantillasDocumentalesViewProps) {
  const [plantillaConfigurar, setPlantillaConfigurar] = useState<PlantillaDocumental | null>(null);
  const [plantillaVer, setPlantillaVer] = useState<PlantillaDocumental | null>(null);

  const isPlanTrabajo = plantillaConfigurar?.tipoDocumento === "Plan de Trabajo" || plantillaConfigurar?.version?.includes("T1");
  const isInforme = plantillaConfigurar?.tipoDocumento === "Informe" || plantillaConfigurar?.version?.includes("T2");

  return (
    <div style={{ padding: "28px", maxWidth: 1200, margin: "0 auto" }}>
      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#64748b", marginBottom: 8 }}>
        <span>Administración</span>
        <span style={{ color: "#cbd5e1" }}>/</span>
        <span style={{ color: "#1e2a3a", fontWeight: 600 }}>Plantillas documentales</span>
      </div>

      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1e2a3a", fontFamily: "'DM Sans',sans-serif", margin: "0 0 4px" }}>
          Plantillas documentales institucionales
        </h1>
        <p style={{ fontSize: 13.5, color: "#64748b", margin: 0 }}>
          Estructuras de formato oficial para Plan de Trabajo (UTA-SGC-A-2-1-P7-T1) e Informe (UTA-SGC-A-2-1-P7-T2).
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
              <th>Plantilla institucional</th>
              <th>Tipo de documento</th>
              <th>Formato oficial SGC</th>
              <th>Estado</th>
              <th>Última actualización</th>
              <th style={{ textAlign: "right" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {plantillas.map((p) => (
              <tr key={p.id}>
                <td>
                  <strong style={{ color: "#1e2a3a", fontSize: 13.5 }}>{p.nombre}</strong>
                </td>
                <td style={{ fontSize: 13, color: "#475569" }}>
                  {p.tipoDocumento}
                </td>
                <td>
                  <span style={{
                    fontSize: 11.5,
                    fontWeight: 700,
                    color: "#1a4f8a",
                    background: "#eff6ff",
                    padding: "2px 8px",
                    borderRadius: 4,
                  }}>
                    {p.version}
                  </span>
                </td>
                <td>
                  <span style={{
                    display: "inline-block",
                    padding: "3px 8px",
                    borderRadius: 99,
                    fontSize: 11.5,
                    fontWeight: 700,
                    background: p.estado === "ACTIVA" ? "#dcfce7" : "#f1f5f9",
                    color: p.estado === "ACTIVA" ? "#166534" : "#64748b",
                  }}>
                    {p.estado}
                  </span>
                </td>
                <td style={{ fontSize: 12.5, color: "#64748b" }}>
                  {p.ultimaActualizacion}
                </td>
                <td style={{ textAlign: "right" }}>
                  <div style={{ display: "inline-flex", gap: 6 }}>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setPlantillaVer(p)}
                    >
                      VER
                    </button>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => setPlantillaConfigurar(p)}
                    >
                      CONFIGURAR
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Configurar Secciones de Plantilla */}
      {plantillaConfigurar && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(15,35,60,0.65)",
          zIndex: 500,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
        }}>
          <div style={{
            background: "#fff",
            borderRadius: 12,
            width: 640,
            maxWidth: "100%",
            maxHeight: "90vh",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
            border: "1px solid #e2e8f0",
            overflow: "hidden",
          }}>
            <div style={{ padding: "18px 24px", borderBottom: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: 11.5, fontWeight: 700, color: "#1a4f8a", textTransform: "uppercase" }}>
                Estructura del formato oficial
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "#1e2a3a", margin: "2px 0 0" }}>
                {plantillaConfigurar.nombre} — Formato {plantillaConfigurar.version}
              </h2>
            </div>

            <div style={{ padding: "20px 24px", overflowY: "auto" }}>
              <div style={{
                background: "#f0fdf4",
                border: "1px solid #bbf7d0",
                borderRadius: 8,
                padding: "10px 14px",
                marginBottom: 16,
                fontSize: 12.5,
                color: "#166534",
                lineHeight: 1.5,
              }}>
                <strong>Estructura del formato:</strong> Esta configuración refleja fielmente las secciones y tablas normativas del documento institucional. Las versiones formales generadas por el sistema avanzan con su propio ciclo (1.0, 2.0, etc.).
              </div>

              {isPlanTrabajo ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                  {SECCIONES_PLAN_TRABAJO.map((sec) => (
                    <div
                      key={sec.num}
                      style={{
                        background: "#f8fafc",
                        border: "1px solid #e2e8f0",
                        borderRadius: 8,
                        padding: "12px 14px",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                        <strong style={{ fontSize: 13.5, color: "#1e2a3a" }}>
                          {sec.num}. {sec.titulo}
                        </strong>
                        <span style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: sec.obligatoria ? "#166534" : "#0284c7",
                          background: sec.obligatoria ? "#dcfce7" : "#e0f2fe",
                          padding: "2px 8px",
                          borderRadius: 4,
                        }}>
                          {sec.estado}
                        </span>
                      </div>
                      <p style={{ fontSize: 12, color: "#64748b", margin: 0, lineHeight: 1.5 }}>
                        {sec.detalle}
                      </p>
                    </div>
                  ))}
                </div>
              ) : isInforme ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                  {SECCIONES_INFORME_TECNICO.map((sec) => (
                    <div
                      key={sec.num}
                      style={{
                        background: "#f8fafc",
                        border: "1px solid #e2e8f0",
                        borderRadius: 8,
                        padding: "12px 14px",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                        <strong style={{ fontSize: 13.5, color: "#1e2a3a" }}>
                          {sec.num}. {sec.titulo}
                        </strong>
                        <span style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: sec.obligatoria ? "#166534" : "#0284c7",
                          background: sec.obligatoria ? "#dcfce7" : "#e0f2fe",
                          padding: "2px 8px",
                          borderRadius: 4,
                        }}>
                          {sec.estado}
                        </span>
                      </div>
                      <p style={{ fontSize: 12, color: "#64748b", margin: 0, lineHeight: 1.5 }}>
                        {sec.detalle}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                  {plantillaConfigurar.secciones.map((sec, i) => (
                    <div
                      key={i}
                      style={{
                        background: "#f8fafc",
                        border: "1px solid #e2e8f0",
                        borderRadius: 8,
                        padding: "10px 14px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#1e2a3a",
                      }}
                    >
                      <span>{sec}</span>
                      <span style={{ fontSize: 11, color: "#166534", background: "#dcfce7", padding: "2px 7px", borderRadius: 4 }}>
                        Requerida
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button
                  className="btn btn-secondary"
                  onClick={() => setPlantillaConfigurar(null)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Ver Plantilla */}
      {plantillaVer && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(15,35,60,0.65)",
          zIndex: 500,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 16,
        }}>
          <div style={{
            background: "#fff",
            borderRadius: 12,
            width: 520,
            maxWidth: "100%",
            boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
            border: "1px solid #e2e8f0",
            overflow: "hidden",
          }}>
            <div style={{ padding: "18px 24px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "#1e2a3a", margin: 0 }}>
                {plantillaVer.nombre}
              </h2>
              <span style={{ fontSize: 11.5, fontWeight: 700, color: "#166534", background: "#dcfce7", padding: "3px 8px", borderRadius: 99 }}>
                {plantillaVer.estado}
              </span>
            </div>

            <div style={{ padding: "20px 24px" }}>
              <div style={{ fontSize: 13, color: "#334155", marginBottom: 12 }}>
                Tipo: <strong>{plantillaVer.tipoDocumento}</strong> • Formato oficial SGC: <strong>{plantillaVer.version}</strong>
              </div>
              <div style={{ fontSize: 12.5, color: "#64748b", lineHeight: 1.6 }}>
                Esta plantilla define la estructura oficial que respetan los documentos emitidos en el sistema según las normas SGC de la Universidad Técnica de Ambato.
              </div>
            </div>

            <div style={{ padding: "14px 24px", borderTop: "1px solid #e2e8f0", background: "#f8fafc", display: "flex", justifyContent: "flex-end" }}>
              <button className="btn btn-secondary" onClick={() => setPlantillaVer(null)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
