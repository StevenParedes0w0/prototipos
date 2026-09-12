import { buildDocumentPages, getSignatureSlots } from "../documentEngine/pagination";
import React, { useState } from "react";
import { useDocumentEngine } from "../documentEngine/useDocumentEngine";
import {
  ActividadInformeDoc,
  AnexoDoc,
  ContactoDelegacionDoc,
  DocumentArtifact,
} from "../documentEngine/types";
import {
  CARRERAS_USUARIO_ANDREA,
  FECHA_SISTEMA,
} from "../documentEngine/mockDataDocument";
import DocumentPdfPageViewer from "../documentEngine/DocumentPdfPageViewer";
import ModalFirmaDocumental from "../documentEngine/ModalFirmaDocumental";

interface WizardInformeViewProps {
  docEngine: ReturnType<typeof useDocumentEngine>;
  onFinish: () => void;
  onCancel: () => void;
}

const AI_OPTIONS_ANTECEDENTES = [
  "Enfocar en cumplimiento de objetivos del Plan de Trabajo",
  "Redacción formal institucional según lineamientos FISEI",
  "Resumen ejecutivo del período académico",
];

const AI_OPTIONS_CONCLUSIONES = [
  "Resaltar porcentaje global de cumplimiento y logros",
  "Destacar impacto académico y formación técnica",
  "Enfatizar participación estudiantil y docente",
];

const AI_OPTIONS_OPORTUNIDADES = [
  "Optimizar la disponibilidad y reserva de laboratorios",
  "Fortalecer la articulación previa con tribunales de grado",
  "Digitalización y automatización de medios de verificación",
];

export default function WizardInformeView({
  docEngine,
  onFinish,
  onCancel,
}: WizardInformeViewProps) {
  const { documents, crearNuevoDocumento, generarArtefactoInforme, firmarComoElaborador, enviarARevision } = docEngine;

  const [step, setStep] = useState<number>(1);
  const [createdDocId, setCreatedDocId] = useState<string | null>(null);
  const [maxReached, setMaxReached] = useState<number>(1);

  // Obtener planes disponibles del usuario para derivación
  const planesDisponibles = documents.filter(
    (d) => d.documentType === "PLAN_TRABAJO"
  );
  const defaultPlan = planesDisponibles[0];

  // Paso 1: Información General
  const [unidadAcademica] = useState("Facultad de Ingeniería en Sistemas, Electrónica e Industrial");
  const [carrera, setCarrera] = useState<string>(CARRERAS_USUARIO_ANDREA[0]);
  const [grupo, setGrupo] = useState("Unidad de Titulación");
  const [periodo, setPeriodo] = useState("Julio – Diciembre 2026");
  const [fecha] = useState(() => new Date().toLocaleDateString("es-EC"));
  const [titulo, setTitulo] = useState("Informe de seguimiento de actividades de titulación");
  const [informeOrigen, setInformeOrigen] = useState<"DERIVADO_PLAN" | "INDEPENDIENTE">("DERIVADO_PLAN");
  const [selectedPlanId, setSelectedPlanId] = useState<string>(defaultPlan?.id || "");

  // Helper para extraer actividades de un plan
  const getActividadesFromPlan = (planId: string): ActividadInformeDoc[] => {
    const targetPlan = documents.find((d) => d.id === planId);
    if (!targetPlan || !targetPlan.currentArtifact.matriz) return [];
    return targetPlan.currentArtifact.matriz.map((m, idx) => ({
      id: m.id,
      actividad: m.nombre,
      mediosVerificacion: (m.medios && m.medios.length > 0) ? m.medios.join("; ") : "Registro institucional",
      porcentajeEjecucion: 100,
      observaciones: "Actividad ejecutada en su totalidad conforme al cronograma.",
    }));
  };

  // Paso 2: Antecedentes
  const [antecedentes, setAntecedentes] = useState<string>(
    "En cumplimiento a la planificación académica aprobada en el Plan de Trabajo de la Unidad de Titulación correspondiente al período académico Julio – Diciembre 2026, se presenta el presente informe de avance, gestión y cumplimiento de actividades institucionales."
  );

  // Paso 3: Desarrollo de actividades
  const [actividadesInforme, setActividadesInforme] = useState<ActividadInformeDoc[]>(() => {
    return defaultPlan ? getActividadesFromPlan(defaultPlan.id) : [];
  });
  const [desarrolloTextoLibre, setDesarrolloTextoLibre] = useState<string>(
    "Durante el presente período académico se ejecutaron actividades emergentes y procesos de gestión no programados en atención a requerimientos institucionales de la facultad."
  );

  // Paso 4: Conclusiones y Oportunidades
  const [conclusiones, setConclusiones] = useState<string>(
    "Se ejecutaron satisfactoriamente las jornadas de revisión, asesoría metodológica y sustentación con un alto índice de cumplimiento del cronograma planificado."
  );
  const [oportunidadesMejora, setOportunidadesMejora] = useState<string>(
    "Fortalecer la articulación previa con los laboratorios de cómputo y coordinar con mayor antelación las agendas de los tribunales de grado."
  );

  // Paso 5: Registro de contactos y gestiones
  const [aplicaRegistroContactos, setAplicaRegistroContactos] = useState<boolean>(false);
  const [contactosDelegacion, setContactosDelegacion] = useState<ContactoDelegacionDoc[]>([
    {
      id: 1,
      nombreDelegacion: "Visita Técnica y Vinculación con Empresas de Software",
      ciudadPaisInstitucion: "Quito, Ecuador — Centro de Innovación Tecnológica",
      entidadPersonaContacto: "Ing. Marco Silva (Director de Operaciones)",
      datosContacto: "msilva@techinnovacion.ec · +593 99 876 5432",
      temaProposito: "Gestión de plazas de prácticas preprofesionales para estudiantes de la FISEI",
      acuerdoSeguimiento: "Convenio marco en revisión legal; entrega de nómina de estudiantes en octubre 2026.",
    },
  ]);

  // Paso 6: Anexos
  const [tieneAnexos, setTieneAnexos] = useState<"si" | "no">("no");
  const [anexos, setAnexos] = useState<AnexoDoc[]>([]);

  // Modales & AI
  const [aiMenuField, setAiMenuField] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiModalData, setAiModalData] = useState<{ field: string; original: string; suggestion: string } | null>(null);
  const [showFirmaModal, setShowFirmaModal] = useState(false);
  const [isSigned, setIsSigned] = useState(false);

  // Cambio de Plan seleccionado
  const handleSelectPlan = (planId: string) => {
    setSelectedPlanId(planId);
    const targetPlan = documents.find((d) => d.id === planId);
    if (targetPlan) {
      setGrupo(targetPlan.grupo);
      setTitulo(`Informe de actividades — ${targetPlan.grupo}`);
      setAntecedentes(
        `En cumplimiento a la planificación académica aprobada en el Plan de Trabajo: ${targetPlan.nombre} (Versión ${targetPlan.formalVersion}) correspondiente al período académico ${targetPlan.periodo}, se presenta el informe de avance y resultados de las actividades ejecutadas.`
      );
      setActividadesInforme(getActividadesFromPlan(planId));
    }
  };

  // AI handler
  const handleTriggerAi = (field: string, option: string) => {
    setAiMenuField(null);
    setAiLoading(true);
    setTimeout(() => {
      setAiLoading(false);
      let original = "";
      let suggestion = "";

      if (field === "antecedentes") {
        original = antecedentes;
        suggestion = `${antecedentes} En estricto apego a los estándares institucionales de calidad académica (${option.toLowerCase()}), se sistematizan los respaldos documentales y medios de verificación generados durante el período.`;
      } else if (field === "conclusiones") {
        original = conclusiones;
        suggestion = `${conclusiones} Asimismo, se verificó que el 100% de los entregables cuentan con validación técnica y respaldo en las actas oficiales de la FISEI.`;
      } else {
        original = oportunidadesMejora;
        suggestion = `${oportunidadesMejora} Se propone además implementar un cronograma unificado de seguimiento para optimizar la trazabilidad de las actividades del próximo ciclo académico.`;
      }

      setAiModalData({ field, original, suggestion });
    }, 600);
  };

  const handleApplyAi = () => {
    if (!aiModalData) return;
    if (aiModalData.field === "antecedentes") setAntecedentes(aiModalData.suggestion);
    else if (aiModalData.field === "conclusiones") setConclusiones(aiModalData.suggestion);
    else if (aiModalData.field === "oportunidades") setOportunidadesMejora(aiModalData.suggestion);
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

  // Construir artefacto para Previsualización (Paso 7)
  const selectedPlanDoc = documents.find((d) => d.id === selectedPlanId);
  const relatedPlanTitulo = informeOrigen === "DERIVADO_PLAN" ? (selectedPlanDoc?.nombre || `Plan de Trabajo — ${grupo}`) : undefined;
  const previewFlow = selectedPlanDoc?.flowStages || docEngine.flowStages;
  const previewPages = buildDocumentPages("INFORME", informeOrigen === "DERIVADO_PLAN" ? actividadesInforme.length : 0, previewFlow);
  const previewPageCount = previewPages.length;
  const previewSignatureSlots = getSignatureSlots(previewPages);

  const normalizeInformeTitle = (t: string) => t.replace(/^INFORME DE:\s*/i, "");

  const previewArtifact: DocumentArtifact = {
    id: "art-informe-preview",
    documentType: "INFORME",
    codigoFormatoOficial: "UTA-SGC-A-2-1-P7-T2",
    titulo: normalizeInformeTitle(titulo),
    formalVersion: "1.0",
    reviewRound: 1,
    pageCount: previewPageCount,
    pages: previewPages,
    signatureSlots: previewSignatureSlots,
    generatedAt: `${fecha} 09:30`,
    generatedBy: "Ing. Andrea Pérez, Mg.",
    grupo,
    carrera,
    periodo,
    unidadAcademica,
    elaborador: {
      id: "usr-andrea-01",
      nombre: "Ing. Andrea Pérez, Mg.",
      cargo: "Docente elaborador",
      email: "andrea.perez@uta.edu.ec",
    },
    informeData: {
      informeOrigen,
      relatedPlanId: informeOrigen === "DERIVADO_PLAN" ? selectedPlanId : undefined,
      relatedPlanTitulo,
      antecedentes,
      actividadesInforme: informeOrigen === "DERIVADO_PLAN" ? actividadesInforme : [],
      desarrolloTextoLibre: informeOrigen === "INDEPENDIENTE" ? desarrolloTextoLibre : undefined,
      conclusiones,
      oportunidadesMejora,
      aplicaRegistroContactos,
      contactosDelegacion: aplicaRegistroContactos ? contactosDelegacion : [],
      introduccion: antecedentes,
      desarrollo: informeOrigen === "INDEPENDIENTE" ? desarrolloTextoLibre : "Se detallan las actividades en la matriz institucional.",
      resultados: conclusiones,
      observaciones: oportunidadesMejora,
      documentoRelacionado: relatedPlanTitulo,
    },
    tieneAnexos: tieneAnexos,
    anexos: tieneAnexos === "si" ? anexos : [],
    signatures: isSigned
      ? [
          {
            actorId: "usr-andrea-01",
            actor: "Ing. Andrea Pérez, Mg.",
            cargo: "Docente elaborador",
            role: "docente",
            fecha: FECHA_SISTEMA,
            hora: "10:30",
            ubicacion: `Página ${previewSignatureSlots.find(s => s.role === "docente")?.pageNumber || "no disponible"} — Firmas de Responsabilidad: Elaborado por`,
          },
        ]
      : [],
    historialCambios: [
      {
        version: "1.0",
        descripcion: "Elaboración inicial del Informe",
        fecha: FECHA_SISTEMA,
      },
    ],
  };

  const handleFirmarDocumento = (certFile: string, ubicacion: string) => {
    let targetId = createdDocId;
    if (!targetId) {
      const newDoc = crearNuevoDocumento("INFORME", {
        grupo,
        carrera,
        periodo,
        titulo,
        informeOrigen,
        documentoRelacionadoId: informeOrigen === "DERIVADO_PLAN" ? selectedPlanId : undefined,
        documentoRelacionadoTitulo: relatedPlanTitulo,
        antecedentes,
      });
      targetId = newDoc.id;
      setCreatedDocId(newDoc.id);
    }

    // Generar artefacto formal en motor
    generarArtefactoInforme(targetId, {
      titulo,
      grupo,
      carrera,
      periodo,
      informeOrigen,
      relatedPlanId: informeOrigen === "DERIVADO_PLAN" ? selectedPlanId : undefined,
      relatedPlanTitulo,
      antecedentes,
      actividadesInforme: informeOrigen === "DERIVADO_PLAN" ? actividadesInforme : [],
      desarrolloTextoLibre: informeOrigen === "INDEPENDIENTE" ? desarrolloTextoLibre : undefined,
      conclusiones,
      oportunidadesMejora,
      aplicaRegistroContactos,
      contactosDelegacion: aplicaRegistroContactos ? contactosDelegacion : [],
      tieneAnexos,
      anexos: tieneAnexos === "si" ? anexos : [],
    });

    if (!firmarComoElaborador(targetId, certFile, ubicacion)) return;
    setIsSigned(true);
    setShowFirmaModal(false);
    enviarARevision(targetId);
    onFinish();
  };

  const handleEnviarARevision = () => {
    if (createdDocId) enviarARevision(createdDocId);
    onFinish();
  };

  const stepLabels = [
    { num: 1, label: "Información General" },
    { num: 2, label: "Antecedentes" },
    { num: 3, label: "Desarrollo de Actividades" },
    { num: 4, label: "Conclusiones y Oportunidades" },
    { num: 5, label: "Registro de Contactos" },
    { num: 6, label: "Anexos" },
    { num: 7, label: "Previsualización" },
    { num: 8, label: "Firma y Finalización" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#f8fafc" }}>
      {/* Modal Firma Documental */}
      <ModalFirmaDocumental
        isOpen={showFirmaModal}
        onClose={() => setShowFirmaModal(false)}
        onFirmar={handleFirmarDocumento}
        tituloDocumento={`Informe: ${titulo}`}
        grupo={grupo}
        formalVersion="1.0"
        reviewRound={1}
        actorNombre="Ing. Andrea Pérez, Mg."
        actorCargo="Docente elaborador"
        ubicacionSugerida={`Página ${previewSignatureSlots.find(s => s.role === "docente")?.pageNumber || "no disponible"} — Elaborado por`}
        accionTexto="FIRMAR Y FINALIZAR"
      />

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
                <div style={{ fontSize: 11, fontWeight: 700, color: "#1a4f8a", textTransform: "uppercase", marginBottom: 4 }}>
                  Versión Mejorada
                </div>
                <div style={{ fontSize: 13, color: "#1e2a3a", background: "#eff6ff", border: "1.5px solid #93c5fd", borderRadius: 8, padding: "12px 14px", lineHeight: 1.6 }}>
                  {aiModalData.suggestion}
                </div>
              </div>
            </div>
            <div style={{ padding: "14px 22px", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <button className="btn btn-ghost" onClick={() => setAiModalData(null)}>
                Descartar
              </button>
              <button className="btn btn-primary" style={{ background: "#1a4f8a", border: "none" }} onClick={handleApplyAi}>
                Aplicar Sugerencia
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Header & Stepper */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "24px 24px" }}>
        <div style={{ maxWidth: 1150, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 12 }}>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1e2a3a", margin: "0 0 4px", fontFamily: "'DM Sans', sans-serif" }}>Crear Informe</h1>
              <div style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>Formato UTA-SGC-A-2-1-P7-T2</div>
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#1a4f8a" }}>
              Paso {step} de 8
            </div>
          </div>
          
          {/* Progress bar */}
          <div style={{ width: "100%", height: 6, background: "#e2e8f0", borderRadius: 3, overflow: "hidden", marginBottom: 10 }}>
            <div style={{ width: `${(step / 8) * 100}%`, height: "100%", background: "#1a4f8a", transition: "width 0.3s ease" }} />
          </div>
          
          <div style={{ fontSize: 14, fontWeight: 700, color: "#1e2a3a", marginBottom: 28 }}>
            {stepLabels.find(s => s.num === step)?.label}
          </div>

          {/* Stepper Grid */}
          <div className="stepper-grid" style={{ display: "grid", gap: "16px 24px" }}>
            {stepLabels.map((s) => (
              <div
                key={s.num}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  cursor: s.num <= maxReached ? "pointer" : "default",
                  opacity: s.num <= maxReached ? 1 : 0.45,
                }}
                onClick={() => {
                  if (s.num <= maxReached) setStep(s.num);
                }}
              >
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    background: step === s.num ? "#1a4f8a" : s.num < step ? "#16a34a" : "#f1f5f9",
                    color: step === s.num || s.num < step ? "#fff" : "#64748b",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: 11,
                    flexShrink: 0
                  }}
                >
                  {s.num < step ? "✓" : s.num}
                </div>
                <div style={{ fontSize: 12.5, fontWeight: step === s.num ? 700 : 500, color: step === s.num ? "#1a4f8a" : "#475569", lineHeight: 1.3 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
          <style>{`
            .stepper-grid { grid-template-columns: repeat(4, 1fr); }
            @media (max-width: 999px) { .stepper-grid { grid-template-columns: repeat(2, 1fr); } }
          `}</style>
        </div>
      </div>

      {/* Content Area */}
      <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>
        <div style={{ maxWidth: step === 7 ? "100%" : 1000, margin: "0 auto", transition: "max-width 0.3s ease" }}>
          
          {/* PASO 1: INFORMACIÓN GENERAL */}
          {step === 1 && (
            <div>
              <div style={{ marginBottom: 18 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#1a4f8a", background: "#dbeafe", padding: "2px 8px", borderRadius: 4, textTransform: "uppercase" }}>
                  Paso 1 de 8 · Formato Oficial UTA-SGC-A-2-1-P7-T2
                </span>
                <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1e2a3a", margin: "6px 0 2px", fontFamily: "'DM Sans', sans-serif" }}>
                  Información General del Informe
                </h1>
                <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
                  Defina los datos institucionales, la carrera académica y el origen del informe.
                </p>
              </div>

              <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0", padding: "22px", display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <label className="form-label required">Unidad Académica / Administrativa</label>
                    <input className="form-input" value={unidadAcademica} disabled style={{ background: "#f8fafc" }} />
                  </div>

                  <div>
                    <label className="form-label required">Carrera</label>
                    <select
                      className="form-select"
                      value={carrera}
                      onChange={(e) => setCarrera(e.target.value)}
                    >
                      {CARRERAS_USUARIO_ANDREA.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <span style={{ fontSize: 11, color: "#64748b", marginTop: 3, display: "block" }}>
                      Carreras institucionales vinculadas al docente elaborador.
                    </span>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
                  <div>
                    <label className="form-label required">Informe de (Título institucional)</label>
                    <input
                      className="form-input"
                      value={titulo}
                      onChange={(e) => setTitulo(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="form-label required">Período Académico</label>
                    <input className="form-input" value={periodo} onChange={(e) => setPeriodo(e.target.value)} />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <label className="form-label required">Grupo Institucional / Comisión</label>
                    <input className="form-input" value={grupo} onChange={(e) => setGrupo(e.target.value)} />
                  </div>
                  <div>
                    <label className="form-label required">Fecha de Elaboración</label>
                    <input className="form-input" value={fecha} readOnly title="La fecha se consolida al finalizar la elaboración" />
                  </div>
                </div>

                {/* Origen del Informe */}
                <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: 16 }}>
                  <label className="form-label required">Origen del Informe</label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 6 }}>
                    <label
                      style={{
                        border: `2px solid ${informeOrigen === "DERIVADO_PLAN" ? "#1a4f8a" : "#e2e8f0"}`,
                        borderRadius: 8,
                        padding: "12px 14px",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 10,
                        cursor: "pointer",
                        background: informeOrigen === "DERIVADO_PLAN" ? "#eff6ff" : "#fff",
                      }}
                    >
                      <input
                        type="radio"
                        name="origen"
                        checked={informeOrigen === "DERIVADO_PLAN"}
                        onChange={() => setInformeOrigen("DERIVADO_PLAN")}
                        style={{ marginTop: 2, accentColor: "#1a4f8a" }}
                      />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#1e2a3a" }}>
                          Derivado de un Plan de Trabajo
                        </div>
                        <div style={{ fontSize: 11.5, color: "#64748b", marginTop: 2 }}>
                          Importa automáticamente las actividades y medios de verificación planificados.
                        </div>
                      </div>
                    </label>

                    <label
                      style={{
                        border: `2px solid ${informeOrigen === "INDEPENDIENTE" ? "#1a4f8a" : "#e2e8f0"}`,
                        borderRadius: 8,
                        padding: "12px 14px",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 10,
                        cursor: "pointer",
                        background: informeOrigen === "INDEPENDIENTE" ? "#eff6ff" : "#fff",
                      }}
                    >
                      <input
                        type="radio"
                        name="origen"
                        checked={informeOrigen === "INDEPENDIENTE"}
                        onChange={() => setInformeOrigen("INDEPENDIENTE")}
                        style={{ marginTop: 2, accentColor: "#1a4f8a" }}
                      />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#1e2a3a" }}>
                          Informe independiente
                        </div>
                        <div style={{ fontSize: 11.5, color: "#64748b", marginTop: 2 }}>
                          Para gestiones, comisiones o actividades no planificadas previamente.
                        </div>
                      </div>
                    </label>
                  </div>

                  {informeOrigen === "DERIVADO_PLAN" && (
                    <div style={{ marginTop: 14, background: "#f8fafc", padding: "14px 16px", borderRadius: 8, border: "1px solid #e2e8f0" }}>
                      <label className="form-label required">Plan de Trabajo Relacionado</label>
                      <select
                        className="form-select"
                        value={selectedPlanId}
                        onChange={(e) => handleSelectPlan(e.target.value)}
                      >
                        {planesDisponibles.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.nombre} — {p.periodo} (v{p.formalVersion})
                          </option>
                        ))}
                      </select>
                      <span style={{ fontSize: 11.5, color: "#1a4f8a", marginTop: 4, display: "block", fontWeight: 600 }}>
                        ✓ Las actividades y medios de verificación se sincronizarán desde este Plan.
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* PASO 2: ANTECEDENTES */}
          {step === 2 && (
            <div>
              <div style={{ marginBottom: 18 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#1a4f8a", background: "#dbeafe", padding: "2px 8px", borderRadius: 4, textTransform: "uppercase" }}>
                  Paso 2 de 8 · Sección 1
                </span>
                <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1e2a3a", margin: "6px 0 2px", fontFamily: "'DM Sans', sans-serif" }}>
                  1. Antecedentes
                </h1>
                <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
                  Redacte la fundamentación y contexto institucional del informe.
                </p>
              </div>

              <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0", padding: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <label className="form-label required" style={{ margin: 0, fontSize: 14 }}>
                    Texto de Antecedentes
                  </label>
                  <div style={{ position: "relative" }}>
                    <button
                      className="btn btn-secondary btn-xs"
                      style={{ color: "#1a4f8a", background: "#eff6ff", border: "1px solid #bfdbfe" }}
                      onClick={() => setAiMenuField(aiMenuField === "antecedentes" ? null : "antecedentes")}
                    >
                      ✨ Mejorar redacción
                    </button>
                    {aiMenuField === "antecedentes" && (
                      <div style={{ position: "absolute", right: 0, top: "100%", background: "#fff", borderRadius: 8, boxShadow: "0 10px 30px rgba(0,0,0,0.15)", border: "1px solid #e2e8f0", zIndex: 10, width: 260, marginTop: 4 }}>
                        {AI_OPTIONS_ANTECEDENTES.map((opt) => (
                          <button
                            key={opt}
                            onClick={() => handleTriggerAi("antecedentes", opt)}
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
                  rows={6}
                  value={antecedentes}
                  onChange={(e) => setAntecedentes(e.target.value)}
                  placeholder="Redacte los antecedentes..."
                />
              </div>
            </div>
          )}

          {/* PASO 3: DESARROLLO DE ACTIVIDADES */}
          {step === 3 && (
            <div>
              <div style={{ marginBottom: 18 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#1a4f8a", background: "#dbeafe", padding: "2px 8px", borderRadius: 4, textTransform: "uppercase" }}>
                  Paso 3 de 8 · Sección 2
                </span>
                <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1e2a3a", margin: "6px 0 2px", fontFamily: "'DM Sans', sans-serif" }}>
                  2. Desarrollo de Actividades
                </h1>
                <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
                  {informeOrigen === "DERIVADO_PLAN"
                    ? "Complete el porcentaje de ejecución y las observaciones para cada actividad derivada del Plan de Trabajo."
                    : "Redacte el desarrollo detallado de las actividades realizadas."}
                </p>
              </div>

              {informeOrigen === "DERIVADO_PLAN" ? (
                <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0", overflow: "hidden" }}>
                  <div style={{ padding: "14px 18px", background: "#f8fafc", borderBottom: "1px solid #e2e8f0", fontSize: 12.5, color: "#475569" }}>
                    Tabla 1: Cumplimiento y porcentaje de ejecución de actividades planificadas
                  </div>
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th style={{ width: "30%" }}>Actividades</th>
                        <th style={{ width: "30%" }}>Medios de Verificación</th>
                        <th style={{ width: "15%" }}>% Ejecución (0-100)</th>
                        <th style={{ width: "25%" }}>Observaciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {actividadesInforme.map((act, idx) => (
                        <tr key={act.id}>
                          <td style={{ fontSize: 12.5, fontWeight: 600, color: "#1e2a3a" }}>
                            {act.actividad}
                          </td>
                          <td style={{ fontSize: 12, color: "#475569" }}>
                            {act.mediosVerificacion}
                          </td>
                          <td>
                            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                              <input
                                type="number"
                                min={0}
                                max={100}
                                className="form-input"
                                style={{ width: 70, textAlign: "center", padding: "4px 6px" }}
                                value={act.porcentajeEjecucion}
                                onChange={(e) => {
                                  const val = Math.max(0, Math.min(100, parseInt(e.target.value) || 0));
                                  const next = [...actividadesInforme];
                                  next[idx].porcentajeEjecucion = val;
                                  setActividadesInforme(next);
                                }}
                              />
                              <span style={{ fontSize: 12, fontWeight: 700, color: "#64748b" }}>%</span>
                            </div>
                          </td>
                          <td>
                            <input
                              className="form-input"
                              style={{ fontSize: 12 }}
                              value={act.observaciones}
                              onChange={(e) => {
                                const next = [...actividadesInforme];
                                next[idx].observaciones = e.target.value;
                                setActividadesInforme(next);
                              }}
                              placeholder="Observaciones de avance..."
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0", padding: "20px" }}>
                  <label className="form-label required">Desarrollo de actividades ejecutadas</label>
                  <textarea
                    className="form-textarea"
                    rows={8}
                    value={desarrolloTextoLibre}
                    onChange={(e) => setDesarrolloTextoLibre(e.target.value)}
                    placeholder="Detalle las actividades desarrolladas..."
                  />
                </div>
              )}
            </div>
          )}

          {/* PASO 4: CONCLUSIONES Y OPORTUNIDADES */}
          {step === 4 && (
            <div>
              <div style={{ marginBottom: 18 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#1a4f8a", background: "#dbeafe", padding: "2px 8px", borderRadius: 4, textTransform: "uppercase" }}>
                  Paso 4 de 8 · Secciones 3 y 4
                </span>
                <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1e2a3a", margin: "6px 0 2px", fontFamily: "'DM Sans', sans-serif" }}>
                  Conclusiones y Oportunidades de Mejora
                </h1>
                <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
                  Establezca los logros alcanzados y las recomendaciones para futuros períodos.
                </p>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                {/* 3. Conclusiones */}
                <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0", padding: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <label className="form-label required" style={{ margin: 0, fontSize: 14 }}>
                      3. Conclusiones
                    </label>
                    <div style={{ position: "relative" }}>
                      <button
                        className="btn btn-ghost btn-xs"
                        style={{ color: "#1a4f8a", background: "#eff6ff", border: "1px solid #bfdbfe" }}
                        onClick={() => setAiMenuField(aiMenuField === "conclusiones" ? null : "conclusiones")}
                      >
                        ✨ Mejorar redacción
                      </button>
                      {aiMenuField === "conclusiones" && (
                        <div style={{ position: "absolute", right: 0, top: "100%", background: "#fff", borderRadius: 8, boxShadow: "0 10px 30px rgba(0,0,0,0.15)", border: "1px solid #e2e8f0", zIndex: 10, width: 260, marginTop: 4 }}>
                          {AI_OPTIONS_CONCLUSIONES.map((opt) => (
                            <button
                              key={opt}
                              onClick={() => handleTriggerAi("conclusiones", opt)}
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
                    value={conclusiones}
                    onChange={(e) => setConclusiones(e.target.value)}
                  />
                </div>

                {/* 4. Oportunidades de mejora */}
                <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0", padding: "20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                    <label className="form-label required" style={{ margin: 0, fontSize: 14 }}>
                      4. Oportunidades de Mejora
                    </label>
                    <div style={{ position: "relative" }}>
                      <button
                        className="btn btn-ghost btn-xs"
                        style={{ color: "#1a4f8a", background: "#eff6ff", border: "1px solid #bfdbfe" }}
                        onClick={() => setAiMenuField(aiMenuField === "oportunidades" ? null : "oportunidades")}
                      >
                        ✨ Mejorar redacción
                      </button>
                      {aiMenuField === "oportunidades" && (
                        <div style={{ position: "absolute", right: 0, top: "100%", background: "#fff", borderRadius: 8, boxShadow: "0 10px 30px rgba(0,0,0,0.15)", border: "1px solid #e2e8f0", zIndex: 10, width: 260, marginTop: 4 }}>
                          {AI_OPTIONS_OPORTUNIDADES.map((opt) => (
                            <button
                              key={opt}
                              onClick={() => handleTriggerAi("oportunidades", opt)}
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
                    value={oportunidadesMejora}
                    onChange={(e) => setOportunidadesMejora(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* PASO 5: REGISTRO DE CONTACTOS Y GESTIONES */}
          {step === 5 && (
            <div>
              <div style={{ marginBottom: 18 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#1a4f8a", background: "#dbeafe", padding: "2px 8px", borderRadius: 4, textTransform: "uppercase" }}>
                  Paso 5 de 8 · Sección 5
                </span>
                <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1e2a3a", margin: "6px 0 2px", fontFamily: "'DM Sans', sans-serif" }}>
                  5. Registro de Contactos y Gestiones de la Delegación
                </h1>
                <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
                  Indique si el informe contempla visitas técnicas, comisiones externas o contactos interinstitucionales.
                </p>
              </div>

              <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0", padding: "20px" }}>
                <div style={{ marginBottom: 16 }}>
                  <label className="form-label required">
                    ¿Este Informe corresponde a una delegación, visita técnica, comisión u otro caso que requiera registrar contactos?
                  </label>
                  <div style={{ display: "flex", gap: 18, marginTop: 8 }}>
                    <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                      <input
                        type="radio"
                        name="contactosRadio"
                        checked={aplicaRegistroContactos === true}
                        onChange={() => setAplicaRegistroContactos(true)}
                        style={{ accentColor: "#1a4f8a" }}
                      />
                      <span style={{ fontSize: 13, fontWeight: 600 }}>Sí, registrar contactos y gestiones</span>
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                      <input
                        type="radio"
                        name="contactosRadio"
                        checked={aplicaRegistroContactos === false}
                        onChange={() => setAplicaRegistroContactos(false)}
                        style={{ accentColor: "#1a4f8a" }}
                      />
                      <span style={{ fontSize: 13, fontWeight: 600 }}>No (Se marcará como: No aplica en el documento oficial)</span>
                    </label>
                  </div>
                </div>

                {aplicaRegistroContactos && (
                  <div style={{ marginTop: 18, borderTop: "1px solid #e2e8f0", paddingTop: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#1e2a3a" }}>
                        Tabla de Contactos y Gestiones Registradas
                      </div>
                      <button
                        className="btn btn-secondary btn-xs"
                        onClick={() => {
                          const newRow: ContactoDelegacionDoc = {
                            id: Date.now(),
                            nombreDelegacion: "",
                            ciudadPaisInstitucion: "",
                            entidadPersonaContacto: "",
                            datosContacto: "",
                            temaProposito: "",
                            acuerdoSeguimiento: "",
                          };
                          setContactosDelegacion([...contactosDelegacion, newRow]);
                        }}
                      >
                        + Agregar Contacto / Gestión
                      </button>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                      {contactosDelegacion.map((c, idx) => (
                        <div key={c.id} style={{ background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: 8, padding: "14px", position: "relative" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                            <span style={{ fontSize: 12, fontWeight: 700, color: "#1a4f8a" }}>Contacto #{idx + 1}</span>
                            {contactosDelegacion.length > 1 && (
                              <button
                                style={{ background: "none", border: "none", color: "#ef4444", fontSize: 11, cursor: "pointer", fontWeight: 700 }}
                                onClick={() => setContactosDelegacion(contactosDelegacion.filter((item) => item.id !== c.id))}
                              >
                                ✕ Eliminar
                              </button>
                            )}
                          </div>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                            <input
                              className="form-input"
                              placeholder="Nombre o propósito de la delegación"
                              style={{ fontSize: 12 }}
                              value={c.nombreDelegacion}
                              onChange={(e) => {
                                const next = [...contactosDelegacion];
                                next[idx].nombreDelegacion = e.target.value;
                                setContactosDelegacion(next);
                              }}
                            />
                            <input
                              className="form-input"
                              placeholder="Ciudad, país o institución"
                              style={{ fontSize: 12 }}
                              value={c.ciudadPaisInstitucion}
                              onChange={(e) => {
                                const next = [...contactosDelegacion];
                                next[idx].ciudadPaisInstitucion = e.target.value;
                                setContactosDelegacion(next);
                              }}
                            />
                            <input
                              className="form-input"
                              placeholder="Entidad y persona de contacto"
                              style={{ fontSize: 12 }}
                              value={c.entidadPersonaContacto}
                              onChange={(e) => {
                                const next = [...contactosDelegacion];
                                next[idx].entidadPersonaContacto = e.target.value;
                                setContactosDelegacion(next);
                              }}
                            />
                            <input
                              className="form-input"
                              placeholder="Datos de contacto (email, teléfono)"
                              style={{ fontSize: 12 }}
                              value={c.datosContacto}
                              onChange={(e) => {
                                const next = [...contactosDelegacion];
                                next[idx].datosContacto = e.target.value;
                                setContactosDelegacion(next);
                              }}
                            />
                            <input
                              className="form-input"
                              placeholder="Tema o propósito de la reunión"
                              style={{ fontSize: 12 }}
                              value={c.temaProposito}
                              onChange={(e) => {
                                const next = [...contactosDelegacion];
                                next[idx].temaProposito = e.target.value;
                                setContactosDelegacion(next);
                              }}
                            />
                            <input
                              className="form-input"
                              placeholder="Acuerdo y seguimiento establecido"
                              style={{ fontSize: 12 }}
                              value={c.acuerdoSeguimiento}
                              onChange={(e) => {
                                const next = [...contactosDelegacion];
                                next[idx].acuerdoSeguimiento = e.target.value;
                                setContactosDelegacion(next);
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* PASO 6: ANEXOS */}
          {step === 6 && (
            <div>
              <div style={{ marginBottom: 18 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#1a4f8a", background: "#dbeafe", padding: "2px 8px", borderRadius: 4, textTransform: "uppercase" }}>
                  Paso 6 de 8 · Sección 6
                </span>
                <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1e2a3a", margin: "6px 0 2px", fontFamily: "'DM Sans', sans-serif" }}>
                  6. Anexos
                </h1>
                <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
                  Adjunte documentación complementaria de soporte si corresponde.
                </p>
              </div>

              <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e2e8f0", padding: "20px" }}>
                <label className="form-label required">¿El informe incluye anexos de soporte?</label>
                <div style={{ display: "flex", gap: 18, margin: "8px 0 16px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                    <input
                      type="radio"
                      name="anexosRadio"
                      checked={tieneAnexos === "si"}
                      onChange={() => setTieneAnexos("si")}
                      style={{ accentColor: "#1a4f8a" }}
                    />
                    <span style={{ fontSize: 13, fontWeight: 600 }}>Sí, adjuntar anexos</span>
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                    <input
                      type="radio"
                      name="anexosRadio"
                      checked={tieneAnexos === "no"}
                      onChange={() => {
                        setTieneAnexos("no");
                        setAnexos([]);
                      }}
                      style={{ accentColor: "#1a4f8a" }}
                    />
                    <span style={{ fontSize: 13, fontWeight: 600 }}>No (Se mostrará como: No aplica en el documento oficial)</span>
                  </label>
                </div>

                {tieneAnexos === "si" && (
                  <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                      <span style={{ fontSize: 12.5, fontWeight: 700, color: "#1e2a3a" }}>Lista de Archivos Adjuntos</span>
                      <button
                        className="btn btn-secondary btn-xs"
                        onClick={() => {
                          const newAnexo: AnexoDoc = {
                            id: Date.now(),
                            nombre: "Documento de respaldo adicional",
                            archivo: `anexo_${Date.now()}.pdf`,
                            tamano: "750 KB",
                          };
                          setAnexos([...anexos, newAnexo]);
                        }}
                      >
                        + Adjuntar Archivo
                      </button>
                    </div>

                    {anexos.length === 0 ? (
                      <div style={{ background: "#f8fafc", padding: "16px", textAlign: "center", color: "#64748b", borderRadius: 6 }}>
                        Haga clic en "+ Adjuntar Archivo" para agregar documentación.
                      </div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {anexos.map((anexo, idx) => (
                          <div key={anexo.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 6, padding: "8px 12px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <span style={{ fontSize: 16 }}>📎</span>
                              <div>
                                <input
                                  className="form-input"
                                  style={{ fontSize: 12, padding: "2px 6px", width: 280 }}
                                  value={anexo.nombre}
                                  onChange={(e) => {
                                    const next = [...anexos];
                                    next[idx].nombre = e.target.value;
                                    setAnexos(next);
                                  }}
                                />
                                <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>
                                  {anexo.archivo} · {anexo.tamano}
                                </div>
                              </div>
                            </div>
                            <button
                              style={{ background: "none", border: "none", color: "#ef4444", fontSize: 11, cursor: "pointer", fontWeight: 700 }}
                              onClick={() => setAnexos(anexos.filter((a) => a.id !== anexo.id))}
                            >
                              Eliminar
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* PASO 7: PREVISUALIZACIÓN OFICIAL T2 */}
          {step === 7 && (
            <div>
              <div style={{ marginBottom: 14 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#1a4f8a", background: "#dbeafe", padding: "2px 8px", borderRadius: 4, textTransform: "uppercase" }}>
                  Paso 7 de 8 · Previsualización Oficial
                </span>
                <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1e2a3a", margin: "4px 0 2px", fontFamily: "'DM Sans', sans-serif" }}>
                  Formato Oficial UTA-SGC-A-2-1-P7-T2
                </h1>
                <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
                  Verifique la diagramación completa, portada institucional, tablas y control de cambios antes de firmar.
                </p>
              </div>

              <div style={{ height: 600, border: "1px solid #cbd5e1", borderRadius: 8, overflow: "hidden" }}>
                <DocumentPdfPageViewer
                  artifact={previewArtifact}
                  formalVersion="1.0"
                  reviewRound={1}
                  documentState={isSigned ? "FIRMADO POR ELABORADOR" : "BORRADOR"}
                  observations={[]}
                  flowStages={previewFlow}
                  currentUser={{
                    nombre: "Ing. Andrea Pérez, Mg.",
                    cargo: "Docente elaborador",
                    role: "docente",
                  }}
                  onOpenFirmar={() => setShowFirmaModal(true)}
                  onOpenDevolver={() => {}}
                  onAddObservacion={() => {}}
                  readOnly={true}
                />
              </div>
            </div>
          )}

          {/* PASO 8: FIRMA Y ENVÍO */}
          {step === 8 && (
            <div>
              <div style={{ marginBottom: 18 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#1a4f8a", background: "#dbeafe", padding: "2px 8px", borderRadius: 4, textTransform: "uppercase" }}>
                  Paso 8 de 8 · Firma y Finalización
                </span>
                <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1e2a3a", margin: "6px 0 2px", fontFamily: "'DM Sans', sans-serif" }}>
                  Firma y Finalización
                </h1>
                <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
                  Estampe su firma electrónica de responsabilidad y despache el informe a la bandeja del revisor técnico.
                </p>
              </div>

              <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", padding: "28px", display: "flex", flexDirection: "column", gap: 20 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: "18px 22px" }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#1a4f8a", textTransform: "uppercase" }}>
                      Documento Listo para Firma
                    </div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: "#1e2a3a", marginTop: 2 }}>
                      {titulo}
                    </div>
                    <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                      Formato Nº: UTA-SGC-A-2-1-P7-T2 · Versión 1.0 (Ronda 1) · {carrera}
                    </div>
                  </div>

                  {isSigned ? (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#dcfce7", color: "#166534", border: "1px solid #bbf7d0", padding: "6px 14px", borderRadius: 999, fontSize: 12, fontWeight: 800 }}>
                      ✓ FIRMADO ELECTRÓNICAMENTE
                    </span>
                  ) : (
                    <button
                      className="btn btn-primary"
                      style={{ background: "#1a4f8a", border: "none", padding: "10px 18px", fontSize: 13, fontWeight: 700 }}
                      onClick={() => setShowFirmaModal(true)}
                    >
                      FIRMAR Y FINALIZAR
                    </button>
                  )}
                </div>

                {isSigned && (
                  <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 8, padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#1e40af" }}>
                        Firma registrada exitosamente por Ing. Andrea Pérez, Mg.
                      </div>
                      <div style={{ fontSize: 12, color: "#475569", marginTop: 2 }}>
                        El documento puede ser remitido formalmente a la etapa de Revisión Técnica.
                      </div>
                    </div>
                    <button
                      className="btn btn-primary"
                      onClick={handleEnviarARevision}
                      style={{ background: "#16a34a", border: "none", padding: "10px 20px", fontSize: 13.5, fontWeight: 800 }}
                    >
                      VOLVER A MIS DOCUMENTOS
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Wizard Footer Toolbar */}
      <div style={{ padding: "14px 28px", borderTop: "1px solid #e2e8f0", background: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <button className="btn btn-ghost" onClick={onCancel}>
          Cancelar
        </button>

        <div style={{ display: "flex", gap: 10 }}>
          {step > 1 && (
            <button className="btn btn-secondary" onClick={handlePrevStep}>
              ← Anterior
            </button>
          )}

          {step < 8 && (
            <button className="btn btn-primary" style={{ background: "#1a4f8a", border: "none" }} onClick={handleNextStep}>
              Siguiente →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
