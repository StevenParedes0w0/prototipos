import React, { useState } from "react";
import { useDocumentEngine } from "../documentEngine/useDocumentEngine";
import { AnexoDoc, DocumentMasterState } from "../documentEngine/types";
import DocumentPdfPageViewer from "../documentEngine/DocumentPdfPageViewer";
import ModalFirmaDocumental from "../documentEngine/ModalFirmaDocumental";

interface WizardInformeViewProps {
  docEngine: ReturnType<typeof useDocumentEngine>;
  onFinish: () => void;
  onCancel: () => void;
}

const AI_OPTIONS_INTRO = [
  "Redacción formal institucional",
  "Enfocada en cumplimiento de metas",
  "Resumen conciso y ejecutivo",
];

const AI_OPTIONS_DESARROLLO = [
  "Estructurar por fases cronológicas",
  "Resaltar coordinación y gestión técnica",
  "Enfatizar articulación con normativas FISEI",
];

const AI_OPTIONS_RESULTADOS = [
  "Cuantificar logros e indicadores",
  "Resumir impacto académico y formativo",
  "Destacar entregables y verificación",
];

export default function WizardInformeView({
  docEngine,
  onFinish,
  onCancel,
}: WizardInformeViewProps) {
  const [step, setStep] = useState<number>(1);
  const [maxReached, setMaxReached] = useState<number>(1);

  // Paso 1: Información General
  const [periodo, setPeriodo] = useState("Julio – Diciembre 2026");
  const [grupo, setGrupo] = useState("Unidad de Titulación");
  const [documentoRelacionado, setDocumentoRelacionado] = useState(
    "Plan de Trabajo — Unidad de Titulación — Versión 1.0"
  );
  const [titulo, setTitulo] = useState("Informe de seguimiento de actividades de titulación");
  const [fecha, setFecha] = useState("07/09/2026");

  // Paso 2: Contenido
  const [introduccion, setIntroduccion] = useState(
    "El presente informe institucional detalla el avance y resultados de las jornadas técnicas y procesos de seguimiento curricular en la Unidad de Titulación durante el período Julio – Diciembre 2026."
  );
  const [desarrollo, setDesarrollo] = useState(
    "Se realizaron revisiones periódicas de los anteproyectos de grado, talleres de actualización metodológica y coordinación con los tribunales de sustentación para asegurar el cumplimiento del cronograma académico institucional."
  );
  const [resultados, setResultados] = useState(
    "Se registró la aprobación de anteproyectos con cumplimiento de los estándares de calidad académica y vinculación con líneas de investigación de la FISEI."
  );
  const [observaciones, setObservaciones] = useState(
    "Se recomienda mantener la articulación con los laboratorios de cómputo para futuras convocatorias."
  );

  // Paso 3: Anexos
  const [tieneAnexos, setTieneAnexos] = useState<"si" | "no">("si");
  const [anexos, setAnexos] = useState<AnexoDoc[]>([
    {
      id: 1,
      nombre: "Registro de avance y actas de seguimiento de titulación",
      archivo: "actas_seguimiento_titulacion_2026.pdf",
      tamano: "850 KB",
    },
  ]);

  // Modales & AI
  const [aiMenuField, setAiMenuField] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiModalData, setAiModalData] = useState<{ field: string; original: string; suggestion: string } | null>(null);
  const [showFirmaModal, setShowFirmaModal] = useState(false);
  const [isSigned, setIsSigned] = useState(false);
  const [newDocId, setNewDocId] = useState<string | null>(null);

  // AI handler
  const handleTriggerAi = (field: string, option: string) => {
    setAiMenuField(null);
    setAiLoading(true);
    setTimeout(() => {
      setAiLoading(false);
      let original = "";
      let suggestion = "";

      if (field === "introduccion") {
        original = introduccion;
        suggestion = `${introduccion} En concordancia con los lineamientos académicos de la FISEI (${option.toLowerCase()}), se sistematizan las acciones estratégicas ejecutadas para optimizar el rendimiento y trazabilidad.`;
      } else if (field === "desarrollo") {
        original = desarrollo;
        suggestion = `${desarrollo} Asimismo, se dio estricto cumplimiento a los mecanismos de evaluación institucional con validación permanente de directores y tutores designados.`;
      } else {
        original = resultados;
        suggestion = `${resultados} Adicionalmente, el 100% de las metas planificadas cuentan con respaldo documental y medios de verificación archivados institucionalmente.`;
      }

      setAiModalData({ field, original, suggestion });
    }, 700);
  };

  const handleApplyAi = () => {
    if (!aiModalData) return;
    if (aiModalData.field === "introduccion") setIntroduccion(aiModalData.suggestion);
    else if (aiModalData.field === "desarrollo") setDesarrollo(aiModalData.suggestion);
    else if (aiModalData.field === "resultados") setResultados(aiModalData.suggestion);
    setAiModalData(null);
  };

  const handleNextStep = () => {
    const next = step + 1;
    setStep(next);
    if (next > maxReached) setMaxReached(next);
  };

  const handlePrevStep = () => {
    setStep((s) => Math.max(1, s - 1));
  };

  // Build artifact for Step 4 Preview
  const previewArtifact = {
    id: "art-informe-preview",
    documentType: "INFORME" as const,
    titulo,
    formalVersion: "1.0",
    reviewRound: 1,
    pageCount: 3,
    generatedAt: `${fecha} 09:30`,
    generatedBy: "Ing. Andrea Pérez, Mg.",
    grupo,
    periodo,
    unidadAcademica: "FISEI – UTA",
    elaborador: {
      id: "usr-andrea-01",
      nombre: "Ing. Andrea Pérez, Mg.",
      cargo: "Docente elaborador",
      email: "andrea.perez@uta.edu.ec",
    },
    informeData: {
      introduccion,
      desarrollo,
      resultados,
      observaciones,
      documentoRelacionado,
    },
    tieneAnexos,
    anexos: tieneAnexos === "si" ? anexos : [],
    signatures: isSigned
      ? [
          {
            actorId: "usr-andrea-01",
            actor: "Ing. Andrea Pérez, Mg.",
            cargo: "Docente elaborador",
            role: "docente" as const,
            fecha,
            hora: "10:15",
            ubicacion: "Página 3 — Firmas de Responsabilidad: Elaborado por",
          },
        ]
      : [],
  };

  const handleEjecutarFirmaElaborador = (certFile: string, ubicacion: string) => {
    // Generate new document in DocumentEngine
    const createdDoc = docEngine.crearNuevoDocumento("INFORME", {
      grupo,
      periodo,
      titulo,
      documentoRelacionadoTitulo: documentoRelacionado,
    });

    // Generate artifact
    docEngine.generarArtefactoInforme({
      titulo,
      grupo,
      periodo,
      documentoRelacionado,
      introduccion,
      desarrollo,
      resultados,
      observaciones,
      tieneAnexos,
      anexos: tieneAnexos === "si" ? anexos : [],
    });

    // Sign as elaborator
    docEngine.firmarComoElaborador(
      certFile || "andrea_perez_firma.p12",
      ubicacion || "Página 3 — Firmas de Responsabilidad: Elaborado por"
    );

    setIsSigned(true);
    setNewDocId(createdDoc.id);
    setShowFirmaModal(false);
    setStep(5);
  };

  const stepLabels = [
    { num: 1, label: "Información general" },
    { num: 2, label: "Contenido del Informe" },
    { num: 3, label: "Anexos institucionales" },
    { num: 4, label: "Previsualización formal (A4)" },
    { num: 5, label: "Firma y Envío" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#f8fafc" }}>
      {/* AI Loading Modal */}
      {aiLoading && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,47,86,0.35)",
            zIndex: 300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: "28px 36px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 14,
              boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                border: "3px solid #e2e8f0",
                borderTop: "3px solid #7c3aed",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
              }}
            />
            <div style={{ fontSize: 14, fontWeight: 700, color: "#1e2a3a" }}>Generando redacción con IA...</div>
            <div style={{ fontSize: 12, color: "#64748b" }}>Analizando estructura institucional FISEI</div>
          </div>
        </div>
      )}

      {/* AI Modal Comparison */}
      {aiModalData && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,47,86,0.45)",
            zIndex: 300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              width: 620,
              maxHeight: "80vh",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
            }}
          >
            <div style={{ padding: "18px 22px", borderBottom: "1px solid #e2e8f0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 18 }}>✨</span>
                <h3 style={{ fontSize: 16, fontWeight: 800, color: "#1e2a3a", margin: 0, fontFamily: "'DM Sans', sans-serif" }}>
                  Sugerencia de Redacción Asistida
                </h3>
              </div>
            </div>
            <div style={{ padding: "18px 22px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", marginBottom: 4 }}>
                  Texto Actual
                </div>
                <div style={{ fontSize: 12.5, color: "#475569", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 8, padding: "10px 12px" }}>
                  {aiModalData.original}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#7c3aed", textTransform: "uppercase", marginBottom: 4 }}>
                  Versión Mejorada
                </div>
                <div style={{ fontSize: 13, color: "#1e2a3a", background: "#f5f3ff", border: "1.5px solid #c4b5fd", borderRadius: 8, padding: "12px 14px", lineHeight: 1.6 }}>
                  {aiModalData.suggestion}
                </div>
              </div>
            </div>
            <div style={{ padding: "14px 22px", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button className="btn btn-ghost" onClick={() => setAiModalData(null)}>
                Descartar
              </button>
              <button className="btn btn-primary" style={{ background: "#7c3aed", border: "none" }} onClick={handleApplyAi}>
                Aplicar Sugerencia
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stepper Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "14px 28px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: 1000, margin: "0 auto" }}>
          {stepLabels.map((s, idx) => (
            <React.Fragment key={s.num}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  cursor: s.num <= maxReached ? "pointer" : "default",
                  opacity: s.num <= maxReached ? 1 : 0.45,
                }}
                onClick={() => {
                  if (s.num <= maxReached) setStep(s.num);
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    background: step === s.num ? "#1a4f8a" : s.num < step ? "#16a34a" : "#f1f5f9",
                    color: step === s.num || s.num < step ? "#fff" : "#64748b",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: 12,
                  }}
                >
                  {s.num < step ? "✓" : s.num}
                </div>
                <div style={{ fontSize: 12.5, fontWeight: step === s.num ? 700 : 500, color: step === s.num ? "#1a4f8a" : "#475569" }}>
                  {s.label}
                </div>
              </div>
              {idx < stepLabels.length - 1 && (
                <div style={{ flex: 1, height: 2, background: s.num < step ? "#16a34a" : "#e2e8f0", margin: "0 10px", maxWidth: 50 }} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          
          {/* PASO 1: INFORMACIÓN GENERAL */}
          {step === 1 && (
            <div>
              <div style={{ marginBottom: 18 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#7e22ce", background: "#f3e8ff", padding: "2px 8px", borderRadius: 4, textTransform: "uppercase" }}>
                  Paso 1 de 5 · Creación de Informe
                </span>
                <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1e2a3a", margin: "6px 0 2px", fontFamily: "'DM Sans', sans-serif" }}>
                  Información General del Informe
                </h1>
                <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
                  Defina el grupo institucional, período académico y documento de referencia para este informe.
                </p>
              </div>

              <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0", padding: "22px", display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <label className="form-label required">Período Académico</label>
                    <select className="form-select" value={periodo} onChange={(e) => setPeriodo(e.target.value)}>
                      <option>Julio – Diciembre 2026</option>
                      <option>Enero – Junio 2026</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label required">Grupo Institucional</label>
                    <select className="form-select" value={grupo} onChange={(e) => setGrupo(e.target.value)}>
                      <option>Unidad de Titulación</option>
                      <option>Comisión de Eventos Académicos</option>
                      <option>Club Académico de Software</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="form-label">Documento Relacionado / Plan de Trabajo Base (Opcional)</label>
                  <select
                    className="form-select"
                    value={documentoRelacionado}
                    onChange={(e) => setDocumentoRelacionado(e.target.value)}
                  >
                    <option value="">— Sin vinculación directa —</option>
                    <option value="Plan de Trabajo — Unidad de Titulación — Versión 1.0">
                      Plan de Trabajo — Unidad de Titulación — Versión 1.0 (EN EJECUCIÓN)
                    </option>
                    <option value="Plan de Trabajo — Comisión de Eventos Académicos — Versión 1.0">
                      Plan de Trabajo — Comisión de Eventos Académicos — Versión 1.0 (BORRADOR)
                    </option>
                  </select>
                  <div className="form-hint">
                    Vincular un Plan de Trabajo permite asociar este informe al seguimiento curricular de la facultad.
                  </div>
                </div>

                <div>
                  <label className="form-label required">Título del Informe</label>
                  <input
                    className="form-input"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    placeholder="Ej. Informe de seguimiento de actividades de titulación"
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <label className="form-label required">Fecha de Emisión</label>
                    <input className="form-input" value={fecha} onChange={(e) => setFecha(e.target.value)} />
                  </div>
                  <div>
                    <label className="form-label">Docente Elaborador</label>
                    <input className="form-input" value="Ing. Andrea Pérez, Mg." disabled style={{ background: "#f8fafc", color: "#64748b" }} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PASO 2: CONTENIDO */}
          {step === 2 && (
            <div>
              <div style={{ marginBottom: 18 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#7e22ce", background: "#f3e8ff", padding: "2px 8px", borderRadius: 4, textTransform: "uppercase" }}>
                    Paso 2 de 5 · Secciones del Informe
                  </span>
                  <span style={{ fontSize: 10.5, fontWeight: 800, color: "#92400e", background: "#fef3c7", padding: "2px 8px", borderRadius: 4 }}>
                    ESTRUCTURA DEMO
                  </span>
                </div>
                <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1e2a3a", margin: "6px 0 2px", fontFamily: "'DM Sans', sans-serif" }}>
                  Contenido del Informe
                </h1>
                <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 12px" }}>
                  Redacte la introducción, el desarrollo de actividades y los resultados obtenidos.
                </p>

                {/* Banner explicativo DEMO */}
                <div
                  style={{
                    background: "#fffbeb",
                    border: "1px solid #fde68a",
                    borderRadius: 8,
                    padding: "10px 14px",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <span style={{ fontSize: 16 }}>ℹ️</span>
                  <span style={{ fontSize: 12.5, color: "#92400e", lineHeight: 1.45 }}>
                    La estructura definitiva del Informe dependerá de la plantilla documental institucional que se establezca.
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                {/* Introducción */}
                <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0", padding: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <label className="form-label required" style={{ margin: 0, fontSize: 14 }}>
                      1. Introducción / Descripción
                    </label>
                    <div style={{ position: "relative" }}>
                      <button
                        className="btn btn-ghost btn-xs"
                        style={{ color: "#7c3aed", background: "#f5f3ff", border: "1px solid #ddd6fe" }}
                        onClick={() => setAiMenuField(aiMenuField === "introduccion" ? null : "introduccion")}
                      >
                        ✨ Mejorar redacción
                      </button>
                      {aiMenuField === "introduccion" && (
                        <div style={{ position: "absolute", right: 0, top: "100%", background: "#fff", borderRadius: 8, boxShadow: "0 10px 30px rgba(0,0,0,0.15)", border: "1px solid #e2e8f0", zIndex: 10, width: 230, marginTop: 4 }}>
                          {AI_OPTIONS_INTRO.map((opt) => (
                            <button
                              key={opt}
                              onClick={() => handleTriggerAi("introduccion", opt)}
                              style={{ display: "block", width: "100%", textAlign: "left", padding: "8px 12px", background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "#1e2a3a" }}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <textarea
                    className="form-textarea"
                    rows={3}
                    value={introduccion}
                    onChange={(e) => setIntroduccion(e.target.value)}
                  />
                </div>

                {/* Desarrollo */}
                <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0", padding: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <label className="form-label required" style={{ margin: 0, fontSize: 14 }}>
                      2. Desarrollo de Actividades / Gestión
                    </label>
                    <div style={{ position: "relative" }}>
                      <button
                        className="btn btn-ghost btn-xs"
                        style={{ color: "#7c3aed", background: "#f5f3ff", border: "1px solid #ddd6fe" }}
                        onClick={() => setAiMenuField(aiMenuField === "desarrollo" ? null : "desarrollo")}
                      >
                        ✨ Mejorar redacción
                      </button>
                      {aiMenuField === "desarrollo" && (
                        <div style={{ position: "absolute", right: 0, top: "100%", background: "#fff", borderRadius: 8, boxShadow: "0 10px 30px rgba(0,0,0,0.15)", border: "1px solid #e2e8f0", zIndex: 10, width: 250, marginTop: 4 }}>
                          {AI_OPTIONS_DESARROLLO.map((opt) => (
                            <button
                              key={opt}
                              onClick={() => handleTriggerAi("desarrollo", opt)}
                              style={{ display: "block", width: "100%", textAlign: "left", padding: "8px 12px", background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "#1e2a3a" }}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <textarea
                    className="form-textarea"
                    rows={4}
                    value={desarrollo}
                    onChange={(e) => setDesarrollo(e.target.value)}
                  />
                </div>

                {/* Resultados */}
                <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0", padding: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <label className="form-label required" style={{ margin: 0, fontSize: 14 }}>
                      3. Resultados Registrados
                    </label>
                    <div style={{ position: "relative" }}>
                      <button
                        className="btn btn-ghost btn-xs"
                        style={{ color: "#7c3aed", background: "#f5f3ff", border: "1px solid #ddd6fe" }}
                        onClick={() => setAiMenuField(aiMenuField === "resultados" ? null : "resultados")}
                      >
                        ✨ Mejorar redacción
                      </button>
                      {aiMenuField === "resultados" && (
                        <div style={{ position: "absolute", right: 0, top: "100%", background: "#fff", borderRadius: 8, boxShadow: "0 10px 30px rgba(0,0,0,0.15)", border: "1px solid #e2e8f0", zIndex: 10, width: 240, marginTop: 4 }}>
                          {AI_OPTIONS_RESULTADOS.map((opt) => (
                            <button
                              key={opt}
                              onClick={() => handleTriggerAi("resultados", opt)}
                              style={{ display: "block", width: "100%", textAlign: "left", padding: "8px 12px", background: "none", border: "none", cursor: "pointer", fontSize: 12, color: "#1e2a3a" }}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <textarea
                    className="form-textarea"
                    rows={3}
                    value={resultados}
                    onChange={(e) => setResultados(e.target.value)}
                  />
                </div>

                {/* Observaciones DEMO */}
                <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0", padding: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <label className="form-label" style={{ margin: 0, fontSize: 14 }}>
                      4. Observaciones y Recomendaciones
                    </label>
                    <span style={{ fontSize: 10.5, fontWeight: 700, color: "#92400e", background: "#fef3c7", padding: "2px 7px", borderRadius: 4 }}>
                      ESTRUCTURA PRELIMINAR DEMO
                    </span>
                  </div>
                  <textarea
                    className="form-textarea"
                    rows={2}
                    value={observaciones}
                    onChange={(e) => setObservaciones(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* PASO 3: ANEXOS */}
          {step === 3 && (
            <div>
              <div style={{ marginBottom: 18 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#7e22ce", background: "#f3e8ff", padding: "2px 8px", borderRadius: 4, textTransform: "uppercase" }}>
                  Paso 3 de 5 · Documentación de Soporte
                </span>
                <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1e2a3a", margin: "6px 0 2px", fontFamily: "'DM Sans', sans-serif" }}>
                  Anexos Institucionales
                </h1>
                <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
                  Adjunte evidencias o actas en formato PDF para complementar el informe.
                </p>
              </div>

              <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0", padding: "22px", display: "flex", flexDirection: "column", gap: 18 }}>
                <div>
                  <label className="form-label">¿Desea adjuntar anexos al informe?</label>
                  <div style={{ display: "flex", gap: 16, marginTop: 6 }}>
                    <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 13.5 }}>
                      <input
                        type="radio"
                        name="tieneAnexos"
                        checked={tieneAnexos === "si"}
                        onChange={() => setTieneAnexos("si")}
                        style={{ accentColor: "#1a4f8a" }}
                      />
                      Sí, adjuntar anexos
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 13.5 }}>
                      <input
                        type="radio"
                        name="tieneAnexos"
                        checked={tieneAnexos === "no"}
                        onChange={() => setTieneAnexos("no")}
                        style={{ accentColor: "#1a4f8a" }}
                      />
                      No adjuntar anexos
                    </label>
                  </div>
                </div>

                {tieneAnexos === "si" && (
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                      <h4 style={{ fontSize: 13.5, fontWeight: 700, color: "#1e2a3a", margin: 0 }}>
                        Archivos Adjuntos ({anexos.length})
                      </h4>
                      <button
                        className="btn btn-secondary btn-xs"
                        onClick={() => {
                          const newId = anexos.length + 1;
                          setAnexos([
                            ...anexos,
                            {
                              id: newId,
                              nombre: `Anexo complementario ${newId}`,
                              archivo: `evidencia_complementaria_${newId}.pdf`,
                              tamano: "1.1 MB",
                            },
                          ]);
                        }}
                      >
                        + Agregar Anexo Demo
                      </button>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {anexos.map((anexo, idx) => (
                        <div
                          key={anexo.id}
                          style={{
                            background: "#f8fafc",
                            border: "1px solid #e2e8f0",
                            borderRadius: 8,
                            padding: "10px 14px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: "#1e2a3a" }}>
                              Anexo {idx + 1}: {anexo.nombre}
                            </div>
                            <div style={{ fontSize: 11.5, color: "#64748b" }}>
                              {anexo.archivo} · {anexo.tamano}
                            </div>
                          </div>
                          <button
                            onClick={() => setAnexos(anexos.filter((a) => a.id !== anexo.id))}
                            style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", fontSize: 12 }}
                          >
                            Eliminar
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* PASO 4: PREVISUALIZACIÓN FORMAL (A4) */}
          {step === 4 && (
            <div style={{ height: "70vh" }}>
              <div style={{ marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#7e22ce", background: "#f3e8ff", padding: "2px 8px", borderRadius: 4, textTransform: "uppercase" }}>
                    Paso 4 de 5 · Validación Visual
                  </span>
                  <h1 style={{ fontSize: 20, fontWeight: 800, color: "#1e2a3a", margin: "4px 0 0", fontFamily: "'DM Sans', sans-serif" }}>
                    Previsualización Formal del Informe
                  </h1>
                </div>
                <button
                  className="btn btn-primary"
                  onClick={() => setShowFirmaModal(true)}
                  style={{ background: "#16a34a", border: "none" }}
                >
                  FIRMAR ELECTRÓNICAMENTE Y ENVIAR →
                </button>
              </div>

              <div style={{ height: "calc(100% - 60px)", border: "1px solid #cbd5e1", borderRadius: 8, overflow: "hidden" }}>
                <DocumentPdfPageViewer
                  artifact={previewArtifact}
                  formalVersion="1.0"
                  reviewRound={1}
                  documentState="BORRADOR"
                  observations={[]}
                  flowStages={docEngine.flowStages}
                  currentUser={{
                    nombre: "Ing. Andrea Pérez, Mg.",
                    cargo: "Docente elaborador",
                    role: "docente",
                  }}
                  onOpenFirmar={() => setShowFirmaModal(true)}
                  onOpenDevolver={() => {}}
                  onAddObservacion={() => {}}
                />
              </div>
            </div>
          )}

          {/* PASO 5: CONFIRMACIÓN Y ENVÍO */}
          {step === 5 && (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  background: "#dcfce7",
                  color: "#166534",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 32,
                  fontWeight: 800,
                  margin: "0 auto 18px",
                }}
              >
                ✓
              </div>
              <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1e2a3a", fontFamily: "'DM Sans', sans-serif", margin: "0 0 8px" }}>
                Informe Firmado y Enviado a Revisión
              </h1>
              <p style={{ fontSize: 14, color: "#64748b", maxWidth: 540, margin: "0 auto 24px", lineHeight: 1.6 }}>
                El informe <strong>"{titulo}"</strong> ha sido firmado electrónicamente por la docente elaboradora y transferido a la etapa de revisión técnica de la FISEI.
              </p>

              <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0", padding: "20px", maxWidth: 540, margin: "0 auto 28px", textAlign: "left" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontSize: 13 }}>
                  <div>
                    <span style={{ color: "#64748b" }}>Tipo:</span> <strong>Informe</strong>
                  </div>
                  <div>
                    <span style={{ color: "#64748b" }}>Versión:</span> <strong>Versión 1.0 (Ronda 1)</strong>
                  </div>
                  <div>
                    <span style={{ color: "#64748b" }}>Estado:</span> <span style={{ color: "#1e40af", fontWeight: 700 }}>EN REVISIÓN</span>
                  </div>
                  <div>
                    <span style={{ color: "#64748b" }}>Próximo Actor:</span> <strong>Ing. Carlos López, Mg.</strong>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
                <button className="btn btn-primary" onClick={onFinish}>
                  VOLVER A MIS DOCUMENTOS
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Wizard Footer */}
      {step < 5 && (
        <div
          style={{
            background: "#fff",
            borderTop: "1px solid #e2e8f0",
            padding: "14px 28px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            {step === 1 ? (
              <button className="btn btn-ghost" onClick={onCancel}>
                Cancelar
              </button>
            ) : (
              <button className="btn btn-ghost" onClick={handlePrevStep}>
                ← Anterior
              </button>
            )}
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            {step < 4 && (
              <button className="btn btn-primary" onClick={handleNextStep}>
                Continuar →
              </button>
            )}
            {step === 4 && (
              <button
                className="btn btn-primary"
                onClick={() => setShowFirmaModal(true)}
                style={{ background: "#16a34a", border: "none" }}
              >
                FIRMAR Y ENVIAR A REVISIÓN
              </button>
            )}
          </div>
        </div>
      )}

      {/* Modal Firma Documental */}
      {showFirmaModal && (
        <ModalFirmaDocumental
          isOpen={showFirmaModal}
          onClose={() => setShowFirmaModal(false)}
          tituloDocumento={titulo}
          grupo={grupo}
          formalVersion="1.0"
          reviewRound={1}
          actorNombre="Ing. Andrea Pérez, Mg."
          actorCargo="Docente elaborador"
          ubicacionSugerida="Página 3 — Firmas de Responsabilidad: Elaborado por"
          onFirmar={handleEjecutarFirmaElaborador}
        />
      )}
    </div>
  );
}
