import { advanceStage, flowFromConfiguration } from "./workflow";
import { buildDocumentPages, getSignatureSlots } from "./pagination";
import { useState, useCallback, useRef } from "react";
import {
  DocumentMasterState,
  DocumentArtifact,
  DocumentObservation,
  DocumentObservationAnchor,
  DocumentSignature,
  DocumentType,
  ActividadMatrizDoc,
  AnexoDoc,
  InformeDataDoc,
} from "./types";

export function normalizeInformeTitle(titulo: string): string {
  if (!titulo) return "";
  return titulo.replace(/^INFORME DE:\s*/i, "").trim().toUpperCase();
}
import {
  INITIAL_DOCUMENT_MASTER,
  INITIAL_DOCUMENTS_LIST,
  MATRIZ_INICIAL_DOC,
  JUSTIFICACION_INICIAL,
  OBJETIVO_INICIAL,
  FLOW_STAGES_INICIAL,
} from "./mockDataDocument";

const documentDate = () => new Date().toLocaleDateString("es-EC", {timeZone:"America/Guayaquil",day:"2-digit",month:"2-digit",year:"numeric"});

const STORAGE_KEY = "fisei_documents_collection_v6";

export function useDocumentEngine(onAuditLog?: (tipoEvento: string, objeto: string, accion: string, descripcion: string, usuario: string, rol: string) => void, configuration?: {flujos: import("../modulo7/types").FlujoGrupo[]; usuarios: import("../modulo7/types").UsuarioAdmin[]}) {
  const [documents, setDocuments] = useState<DocumentMasterState[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error("Error loading documents from storage", e);
    }
    return INITIAL_DOCUMENTS_LIST;
  });

  const documentsRef = useRef(documents);
  const [sessionUser,setSessionUser] = useState({id:"usr-andrea-01",nombre:"Ing. Andrea Pérez, Mg."});
  const sessionRef = useRef(sessionUser);
  const simularSesionDemo = useCallback((id:string, nombre:string) => {sessionRef.current={id,nombre};setSessionUser(sessionRef.current);}, []);


  const [selectedDocId, setSelectedDocId] = useState<string>(() => {
    return documents[0]?.id || INITIAL_DOCUMENT_MASTER.id;
  });

  const docMaster = documents.find((d) => d.id === selectedDocId) || documents[0] || INITIAL_DOCUMENT_MASTER;

  const commitDocuments = useCallback((next: DocumentMasterState[]) => {
    documentsRef.current = next;
    setDocuments(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); }
    catch (error) { console.error("Error saving documents", error); }
  }, []);

  const saveState = useCallback((next: DocumentMasterState) => {
    const previous = documentsRef.current;
    commitDocuments(previous.some(d => d.id === next.id) ? previous.map(d => d.id === next.id ? next : d) : [...previous, next]);
  }, [commitDocuments]);

  const mutateDocument = useCallback((targetDocId: string, updater: (doc: DocumentMasterState) => DocumentMasterState): DocumentMasterState | null => {
    const previous = documentsRef.current;
    const target = previous.find(d => d.id === targetDocId);
    if (!target) return null;
    const next = updater(target);
    if (next !== target) commitDocuments(previous.map(d => d.id === targetDocId ? next : d));
    return next;
  }, [commitDocuments]);

  const seleccionarDocumento = useCallback((id: string) => {
    setSelectedDocId(id);
  }, []);

  const crearNuevoDocumento = useCallback(
    (
      tipo: DocumentType,
      datosBasicos?: {
        grupo?: string;
        carrera?: string;
        periodo?: string;
        titulo?: string;
        informeOrigen?: "DERIVADO_PLAN" | "INDEPENDIENTE";
        documentoRelacionadoId?: string;
        documentoRelacionadoTitulo?: string;
        antecedentes?: string;
        actividadesInforme?: import("./types").ActividadInformeDoc[];
      }
    ) => {
      const nowHora = new Date().toLocaleTimeString("es-EC", {hour:"2-digit",minute:"2-digit",timeZone:"America/Guayaquil"});
      const nowStr = `${documentDate()} ${nowHora}`;
      const grupo = datosBasicos?.grupo || (tipo === "INFORME" ? "Unidad de Titulación" : "Comisión de Eventos Académicos");
      const carrera = datosBasicos?.carrera || "Ingeniería de Software";
      const periodo = datosBasicos?.periodo || "Julio – Diciembre 2026";
      const titulo = datosBasicos?.titulo || (tipo === "INFORME" ? `Informe de actividades — ${grupo}` : `Plan de Trabajo: ${grupo}`);
      const normalizedTitulo = tipo === "INFORME" ? normalizeInformeTitle(titulo) : titulo;
      const id = tipo === "INFORME" ? `doc-inf-${Date.now()}` : `doc-plan-${Date.now()}`;
      const codigo = tipo === "INFORME" ? `INF-FISEI-2026-${Math.floor(100 + Math.random() * 900)}` : `PT-FISEI-2026-${Math.floor(100 + Math.random() * 900)}`;
      const codigoFormatoOficial = tipo === "INFORME" ? "UTA-SGC-A-2-1-P7-T2" : "UTA-SGC-A-2-1-P7-T1";

      const relatedPlan=datosBasicos?.documentoRelacionadoId ? documentsRef.current.find(d => d.id === datosBasicos.documentoRelacionadoId && d.documentType === "PLAN_TRABAJO") : undefined;
      const configuredFlow=configuration?.flujos.find(f => f.grupoNombre === grupo);
      const initialFlow=(relatedPlan?.flowStages || (configuredFlow && configuration ? flowFromConfiguration(configuredFlow,configuration.usuarios) : FLOW_STAGES_INICIAL)).map(stage => ({...stage,estado:"PENDIENTE" as const,signature:undefined}));
      const pages = buildDocumentPages(tipo, datosBasicos?.actividadesInforme?.length || 0, initialFlow);
      const pageCount = pages.length;
      const derivedSignatureSlots = getSignatureSlots(pages);

      const newArtifact: DocumentArtifact = {
        id: `art-${id}-v1_0-r1`,
        documentType: tipo,
        codigoFormatoOficial,
        titulo: normalizedTitulo,
        formalVersion: "1.0",
        reviewRound: 1,
        pageCount,
        pages,
        generatedAt: nowStr,
        generatedBy: "Ing. Andrea Pérez, Mg.",
        grupo,
        carrera,
        periodo,
        unidadAcademica: "Facultad de Ingeniería en Sistemas, Electrónica e Industrial",
        elaborador: {
          id: "usr-andrea-01",
          nombre: "Ing. Andrea Pérez, Mg.",
          cargo: "Docente elaborador",
          email: "andrea.perez@uta.edu.ec",
        },
        justificacion: tipo === "PLAN_TRABAJO" ? JUSTIFICACION_INICIAL : undefined,
        objetivo: tipo === "PLAN_TRABAJO" ? OBJETIVO_INICIAL : undefined,
        matriz: tipo === "PLAN_TRABAJO" ? MATRIZ_INICIAL_DOC : undefined,
        informeData: tipo === "INFORME" ? {
          informeOrigen: datosBasicos?.informeOrigen || "DERIVADO_PLAN",
          relatedPlanId: datosBasicos?.documentoRelacionadoId,
          relatedPlanTitulo: datosBasicos?.documentoRelacionadoTitulo,
          antecedentes: datosBasicos?.antecedentes || "En cumplimiento a la planificación institucional aprobada para el período académico.",
          actividadesInforme: datosBasicos?.actividadesInforme || [],
          conclusiones: "Se ejecutaron las actividades programadas conforme a los estándares de calidad académica.",
          oportunidadesMejora: "Fortalecer la coordinación y optimización de medios de verificación.",
          aplicaRegistroContactos: false,
          contactosDelegacion: [],
          introduccion: "El presente informe institucional documenta las actividades ejecutadas.",
          desarrollo: "Se detallan los procesos desarrollados y el seguimiento efectuado durante el período académico.",
          resultados: "Se registraron avances significativos en los compromisos establecidos.",
          observaciones: "Se recomienda mantener la articulación institucional.",
          documentoRelacionado: datosBasicos?.documentoRelacionadoTitulo,
        } : undefined,
        tieneAnexos: "no",
        anexos: [],
        signatures: [],
        signatureSlots: derivedSignatureSlots,
        historialCambios: [
          {
            version: "1.0",
            descripcion: `Elaboración inicial de ${tipo === "INFORME" ? "Informe" : "Plan de Trabajo"}`,
            fecha: documentDate(),
          },
        ],
      };

      const newDoc: DocumentMasterState = {
        id,
        codigo,
        codigoFormatoOficial,
        nombre: titulo,
        documentType: tipo,
        grupo,
        carrera,
        periodo,
        formalVersion: "1.0",
        reviewRound: 1,
        documentState: "BORRADOR",
        finalActionLabel: "VALIDADO_POR",

        currentArtifact: newArtifact,
        artifactHistory: [],
        observations: [],
        flowStages: initialFlow,
        draftCreatedAt: new Date().toISOString(),
        fechaUltimaActualizacion: nowStr,
        documentoRelacionadoId: datosBasicos?.documentoRelacionadoId,
        documentoRelacionadoTitulo: datosBasicos?.documentoRelacionadoTitulo,
      };

      commitDocuments([newDoc, ...documentsRef.current]);
      setSelectedDocId(id);

      onAuditLog?.(
        "DOCUMENTO CREADO",
        titulo,
        "DOCUMENTO CREADO",
        `Borrador inicial creado (${tipo === "INFORME" ? "Informe" : "Plan de Trabajo"} — ${grupo})`,
        "Ing. Andrea Pérez, Mg.",
        "Docente"
      );

      return newDoc;
    },
    [onAuditLog, commitDocuments, configuration]
  );

  const generarArtefactoInforme = useCallback(
    (targetDocId: string, datos: {
      titulo: string;
      grupo: string;
      carrera?: string;
      periodo: string;
      informeOrigen?: "DERIVADO_PLAN" | "INDEPENDIENTE";
      relatedPlanId?: string;
      relatedPlanTitulo?: string;
      antecedentes: string;
      actividadesInforme?: import("./types").ActividadInformeDoc[];
      desarrolloTextoLibre?: string;
      conclusiones: string;
      oportunidadesMejora: string;
      aplicaRegistroContactos: boolean;
      contactosDelegacion?: import("./types").ContactoDelegacionDoc[];
      tieneAnexos: "si" | "no" | null;
      anexos: AnexoDoc[];
      introduccion?: string;
      desarrollo?: string;
      resultados?: string;
      observaciones?: string;
      documentoRelacionado?: string;
    }) => {
      const nowHora = new Date().toLocaleTimeString("es-EC", {hour:"2-digit",minute:"2-digit",timeZone:"America/Guayaquil"});
      const nowStr = `${documentDate()} ${nowHora}`;

      const nextDoc = mutateDocument(targetDocId, (docMaster: DocumentMasterState): DocumentMasterState => {
        const isRegen = docMaster.reviewRound > 1 || docMaster.documentState === "EN CORRECCIÓN";
        const carrera = datos.carrera || docMaster.carrera || "Ingeniería de Software";
        
        if (docMaster.documentType !== "INFORME" || docMaster.currentArtifact.signatures.length || datos.actividadesInforme?.some(a => !Number.isFinite(a.porcentajeEjecucion) || a.porcentajeEjecucion < 0 || a.porcentajeEjecucion > 100)) return docMaster;
        const relatedPlan=datos.informeOrigen === "DERIVADO_PLAN" ? documentsRef.current.find(d => d.id === datos.relatedPlanId && d.documentType === "PLAN_TRABAJO") : undefined;
        if (datos.informeOrigen === "DERIVADO_PLAN" && !relatedPlan) return docMaster;
        const activities=relatedPlan ? (relatedPlan.currentArtifact.matriz || []).map(activity => {
          const execution=datos.actividadesInforme?.find(a => a.id === activity.id);
          return {id:activity.id,actividad:activity.nombre,mediosVerificacion:activity.medios.join("; "),porcentajeEjecucion:execution?.porcentajeEjecucion ?? 0,observaciones:execution?.observaciones || ""};
        }) : [];
        const pages = buildDocumentPages("INFORME", activities.length, docMaster.flowStages);
        const pageCount = pages.length;
        const derivedSignatureSlots = getSignatureSlots(pages);

        const newArtifact: DocumentArtifact = {
          id: `art-inf-${docMaster.id}-v${docMaster.formalVersion.replace(".", "_")}-r${docMaster.reviewRound}-${Date.now()}`,
          documentType: "INFORME",
          codigoFormatoOficial: "UTA-SGC-A-2-1-P7-T2",
          elaborationFinalizedAt: docMaster.currentArtifact.elaborationFinalizedAt,
          titulo: normalizeInformeTitle(datos.titulo || docMaster.nombre),
          formalVersion: docMaster.formalVersion,
          reviewRound: docMaster.reviewRound,
          pageCount,
          pages,
          generatedAt: nowStr,
          generatedBy: "Ing. Andrea Pérez, Mg.",
          grupo: datos.grupo || docMaster.grupo,
          carrera,
          periodo: datos.periodo || docMaster.periodo,
          unidadAcademica: "Facultad de Ingeniería en Sistemas, Electrónica e Industrial",
          elaborador: {
            id: "usr-andrea-01",
            nombre: "Ing. Andrea Pérez, Mg.",
            cargo: "Docente elaborador",
            email: "andrea.perez@uta.edu.ec",
          },
          informeData: {
            informeOrigen: datos.informeOrigen || "DERIVADO_PLAN",
            relatedPlanId: datos.relatedPlanId,
            relatedPlanTitulo: datos.relatedPlanTitulo || datos.documentoRelacionado,
            antecedentes: datos.antecedentes || datos.introduccion || "En cumplimiento a la planificación institucional.",
            actividadesInforme: activities,
            desarrolloTextoLibre: datos.desarrolloTextoLibre,
            conclusiones: datos.conclusiones || "Se cumplieron los objetivos previstos.",
            oportunidadesMejora: datos.oportunidadesMejora || "Continuar con el seguimiento periódico.",
            aplicaRegistroContactos: datos.aplicaRegistroContactos || false,
            contactosDelegacion: datos.contactosDelegacion || [],
            introduccion: datos.antecedentes || datos.introduccion || "",
            desarrollo: datos.desarrolloTextoLibre || datos.desarrollo || "",
            resultados: datos.conclusiones || datos.resultados || "",
            observaciones: datos.oportunidadesMejora || datos.observaciones,
            documentoRelacionado: datos.relatedPlanTitulo || datos.documentoRelacionado,
          },
          tieneAnexos: datos.tieneAnexos,
          anexos: datos.anexos || [],
          signatures: [],
        signatureSlots: derivedSignatureSlots,
          historialCambios: [
            {
              version: docMaster.formalVersion,
              descripcion: "Elaboración inicial del Informe",
              fecha: documentDate(),
            },
          ],
        };

        return {
          ...docMaster,
          nombre: datos.titulo || docMaster.nombre,
          grupo: datos.grupo || docMaster.grupo,
          carrera,
          periodo: datos.periodo || docMaster.periodo,
          codigoFormatoOficial: "UTA-SGC-A-2-1-P7-T2",
          documentState: docMaster.documentState === "BORRADOR" ? "LISTO PARA FIRMA" : docMaster.documentState,
          currentArtifact: newArtifact,
          fechaUltimaActualizacion: nowStr,
          documentoRelacionadoId: datos.relatedPlanId || docMaster.documentoRelacionadoId,
          documentoRelacionadoTitulo: datos.relatedPlanTitulo || datos.documentoRelacionado || docMaster.documentoRelacionadoTitulo,
        };
      });

      if (nextDoc) {
        const isRegen = nextDoc.reviewRound > 1 || nextDoc.documentState === "EN CORRECCIÓN";
        const eventType = isRegen ? "DOCUMENTO REGENERADO" : "DOCUMENTO GENERADO";
        onAuditLog?.(
          eventType,
          nextDoc.nombre,
          eventType,
          `Artefacto formal de Informe generado (Versión formal ${nextDoc.formalVersion} — Ronda ${nextDoc.reviewRound})`,
          "Ing. Andrea Pérez, Mg.",
          "Docente"
        );
        return nextDoc.currentArtifact;
      }
    },
    [mutateDocument, onAuditLog]
  );

  const generarArtefacto = useCallback(
    (targetDocId: string, datos: {
      justificacion: string;
      objetivo: string;
      matriz: ActividadMatrizDoc[];
      tieneAnexos: "si" | "no" | null;
      anexos: AnexoDoc[];
      fuente?: string;
    }) => {
      const nowHora = new Date().toLocaleTimeString("es-EC", {hour:"2-digit",minute:"2-digit",timeZone:"America/Guayaquil"});
      const nowStr = `${documentDate()} ${nowHora}`;
      const matriz = datos.matriz;


      const nextDoc = mutateDocument(targetDocId, (docMaster: DocumentMasterState): DocumentMasterState => {
        if (docMaster.documentType !== "PLAN_TRABAJO" || docMaster.currentArtifact.signatures.length || matriz.length === 0 || matriz.some(a => !a.desde || !a.hasta || a.desde > a.hasta || !a.responsables.length || !a.recursos.length || !a.medios.length || [...a.recursos,...a.medios].some(v => !v.trim()))) return docMaster;
        const pages = buildDocumentPages("PLAN_TRABAJO", matriz.length, docMaster.flowStages);
        const pageCount = pages.length;
        const derivedSignatureSlots = getSignatureSlots(pages);

        const newArtifact: DocumentArtifact = {
          id: `art-plan-fisei-v${docMaster.formalVersion.replace(".", "_")}-r${docMaster.reviewRound}-${Date.now()}`,
          documentType: docMaster.documentType || "PLAN_TRABAJO",
          codigoFormatoOficial: "UTA-SGC-A-2-1-P7-T1",
          formalVersion: docMaster.formalVersion,
          reviewRound: docMaster.reviewRound,
          pageCount: pageCount,
          pages: pages,
          generatedAt: nowStr,
          generatedBy: "Ing. Andrea Pérez, Mg.",
          grupo: docMaster.grupo,
          carrera: docMaster.carrera || "Ingeniería de Software",
          periodo: docMaster.periodo,
          unidadAcademica: "Facultad de Ingeniería en Sistemas, Electrónica e Industrial",
          elaborador: {
            id: "usr-andrea-01",
            nombre: "Ing. Andrea Pérez, Mg.",
            cargo: "Docente elaborador",
            email: "andrea.perez@uta.edu.ec",
          },
          fuente: datos.fuente || "",
          elaborationFinalizedAt: docMaster.currentArtifact.elaborationFinalizedAt,
          justificacion: datos.justificacion,
          objetivo: datos.objetivo,
          matriz,
          tieneAnexos: datos.tieneAnexos,
          anexos: datos.anexos || [],
          signatures: [],
          signatureSlots: derivedSignatureSlots,
          historialCambios: [
            {
              version: docMaster.formalVersion,
              descripcion: "Elaboración del Plan de Trabajo",
              fecha: documentDate(),
            },
          ],
        };

        return {
          ...docMaster,
          codigoFormatoOficial: "UTA-SGC-A-2-1-P7-T1",
          documentState: docMaster.documentState === "BORRADOR" ? "LISTO PARA FIRMA" : docMaster.documentState,
          currentArtifact: newArtifact,
          fechaUltimaActualizacion: nowStr,
        };
      });

      if (nextDoc) {
        const isRegen = nextDoc.reviewRound > 1 || nextDoc.documentState === "EN CORRECCIÓN";
        const eventType = isRegen ? "DOCUMENTO REGENERADO" : "DOCUMENTO GENERADO";
        onAuditLog?.(
          eventType,
          "Plan de Trabajo — Comisión de Eventos Académicos",
          eventType,
          `Artefacto formal generado (Versión formal ${nextDoc.formalVersion} — Ronda de revisión ${nextDoc.reviewRound})`,
          "Ing. Andrea Pérez, Mg.",
          "Docente"
        );
        return nextDoc.currentArtifact;
      }
    },
    [mutateDocument, onAuditLog]
  );

  const firmarComoElaborador = useCallback(
    (targetDocId: string, certFile: string, ubicacion: string = "") => {
      const nowHora = new Date().toLocaleTimeString("es-EC", {hour:"2-digit",minute:"2-digit",timeZone:"America/Guayaquil"});
      
      let didSign = false;
      mutateDocument(targetDocId, (docMaster: DocumentMasterState): DocumentMasterState => {
        if (sessionRef.current.id !== docMaster.currentArtifact.elaborador.id || docMaster.documentState !== "LISTO PARA FIRMA" || !docMaster.flowStages.some(st => st.actorRole === "docente" && st.actorId === sessionRef.current.id)) return docMaster;
        const slot=docMaster.currentArtifact.signatureSlots?.find(s => s.role === "docente");
        if(!slot || !/\.(p12|pfx)$/i.test(certFile)) return docMaster;
        didSign = true;
        const signature: DocumentSignature = {
          stageId:docMaster.flowStages.find(s => s.actorRole === "docente")?.id,
          actorId: "usr-andrea-01",
          actor: "Ing. Andrea Pérez, Mg.",
          cargo: "Docente elaborador",
          role: "docente",
          fecha: documentDate(),
          hora: nowHora,
          ubicacion: `Página ${slot.pageNumber || slot.pageIndex} — ${slot.label}`,

        };

        const updatedSignatures = [
          ...docMaster.currentArtifact.signatures.filter((s) => s.role !== "docente"),
          signature,
        ];

        const updatedArtifact: DocumentArtifact = {
          ...docMaster.currentArtifact,
          elaborationFinalizedAt: docMaster.currentArtifact.elaborationFinalizedAt || documentDate(),
          historialCambios: [{version: docMaster.formalVersion, descripcion: docMaster.documentType === "PLAN_TRABAJO" ? "Elaboración del Plan de Trabajo" : "Elaboración inicial del Informe", fecha: docMaster.currentArtifact.elaborationFinalizedAt || documentDate()}],
          signatures: updatedSignatures,
        };

        const elaborationIndex = docMaster.flowStages.findIndex(st => st.actorRole === "docente");
        const updatedFlow = docMaster.flowStages.map((st, index) =>
          index === elaborationIndex ? { ...st, estado: "FIRMADO" as const, signature } : index === elaborationIndex + 1 ? {...st, estado: "EN_CURSO" as const} : st
        );

        return {
          ...docMaster,
          documentState: "EN REVISIÓN",
          currentArtifact: updatedArtifact,
          flowStages: updatedFlow,
          fechaUltimaActualizacion: `${documentDate()} ${nowHora}`,
        };
      });

      if (didSign) onAuditLog?.(
        "DOCUMENTO FIRMADO",
        "Documento",
        "DOCUMENTO FIRMADO",
        `Firma electrónica estampada por Ing. Andrea Pérez, Mg. en posición "${ubicacion}"`,
        "Ing. Andrea Pérez, Mg.",
        "Docente"
      );
      return didSign;
    },
    [mutateDocument, onAuditLog]
  );

  const enviarARevision = useCallback((targetDocId: string) => {
    const nowHora = new Date().toLocaleTimeString("es-EC", {hour:"2-digit",minute:"2-digit",timeZone:"America/Guayaquil"});
    const nextDoc = mutateDocument(targetDocId, (docMaster: DocumentMasterState): DocumentMasterState => {
      if (docMaster.documentState !== "FIRMADO POR ELABORADOR") return docMaster;
      const updatedFlow = docMaster.flowStages.map((st) => {
        if (st.id === "stage-1") return { ...st, estado: "FIRMADO" as const };
        if (st.id === "stage-2") return { ...st, estado: "EN_CURSO" as const };
        return st;
      });

      return {
        ...docMaster,
        documentState: "EN REVISIÓN",
        flowStages: updatedFlow,
        fechaUltimaActualizacion: `${documentDate()} ${nowHora}`,
      };
    });

    if (nextDoc) {
      onAuditLog?.(
        "DOCUMENTO ENVIADO A REVISIÓN",
        nextDoc.nombre,
        "DOCUMENTO ENVIADO A REVISIÓN",
        `Documento formal v${nextDoc.formalVersion} (Ronda ${nextDoc.reviewRound}) enviado a Nivel 1 — Revisión técnica`,
        "Ing. Andrea Pérez, Mg.",
        "Docente"
      );
    }
  }, [mutateDocument, onAuditLog]);

  const agregarObservacion = useCallback(
    (targetDocId: string, pagina: number, texto: string, seccion: string = "", tipo: "general" | "seccion" = "seccion", revisor: string = "Ing. Carlos López, Mg.", anchor?: DocumentObservationAnchor) => {
      const nowHora = new Date().toLocaleTimeString("es-EC", {hour:"2-digit",minute:"2-digit",timeZone:"America/Guayaquil"});
      let newObs: DocumentObservation | undefined;

      mutateDocument(targetDocId, (docMaster: DocumentMasterState): DocumentMasterState => {
        const stage=docMaster.flowStages.find(s => s.estado === "EN_CURSO" && s.actorName === revisor);
        if (!stage || stage.actorId !== sessionRef.current.id || !["EN REVISIÓN","EN VALIDACIÓN FINAL"].includes(docMaster.documentState) || !texto.trim() || pagina < 1 || pagina > (docMaster.currentArtifact.pages?.length || docMaster.currentArtifact.pageCount)) return docMaster;
        if(anchor && (anchor.pageNumber !== pagina || ![anchor.x,anchor.y,anchor.width,anchor.height].every(Number.isFinite) || anchor.x < 0 || anchor.y < 0 || anchor.width <= 0 || anchor.height <= 0 || anchor.x+anchor.width > 1.000001 || anchor.y+anchor.height > 1.000001)) return docMaster;
        newObs = {
          id: Date.now(),
          documentoId: docMaster.id,
          formalVersion: docMaster.formalVersion,
          ronda: docMaster.reviewRound,
          pagina,
          anchor,
          revisor,
          cargo: "Responsable de revisión técnica",
          fecha: `${documentDate()} — ${nowHora}`,
          texto: texto.trim(),
          estado: "activa",
          tipo,
          seccion: tipo === "seccion" ? (seccion || `Página ${pagina}`) : "General",
        };

        return {
          ...docMaster,
          observations: [...docMaster.observations, newObs],
          fechaUltimaActualizacion: `${documentDate()} ${nowHora}`,
        };
      });

      if (newObs) {
        onAuditLog?.(
          "OBSERVACIÓN REGISTRADA",
          "Documento",
          "OBSERVACIÓN REGISTRADA",
          `Observación registrada en Página ${pagina} por ${revisor}: "${texto.slice(0, 60)}..."`,
          revisor,
          "Revisor"
        );
      }
      return newObs;
    },
    [mutateDocument, onAuditLog]
  );

  const editarObservacion = useCallback(
    (targetDocId: string, id: number, nuevoTexto: string) => {
      mutateDocument(targetDocId, (docMaster: DocumentMasterState): DocumentMasterState => {
        const nextObs = docMaster.observations.map((o) =>
          o.id === id && o.estado === "activa" ? { ...o, texto: nuevoTexto.trim() } : o
        );
        return { ...docMaster, observations: nextObs };
      });
    },
    [mutateDocument]
  );

  const eliminarObservacion = useCallback(
    (targetDocId: string, id: number) => {
      mutateDocument(targetDocId, (docMaster: DocumentMasterState): DocumentMasterState => {
        const nextObs = docMaster.observations.filter((o) => o.id !== id);
        return { ...docMaster, observations: nextObs };
      });
    },
    [mutateDocument]
  );

  const devolverDocumento = useCallback(
    (targetDocId: string, revisor: string = "Ing. Carlos López, Mg.", motivo: string = "Por favor, revise las observaciones registradas y realice las correcciones requeridas antes de reenviar el documento.") => {
      const nowHora = new Date().toLocaleTimeString("es-EC", {hour:"2-digit",minute:"2-digit",timeZone:"America/Guayaquil"});
      const nextDoc = mutateDocument(targetDocId, (docMaster: DocumentMasterState): DocumentMasterState => {
        const updatedFlow = docMaster.flowStages.map((st) => {
          if (st.estado === "EN_CURSO") return { ...st, estado: "DEVUELTO" as const };
          return st;
        });

        return {
          ...docMaster,
          documentState: "DEVUELTO",
          mensajeDevolucion: motivo,
          flowStages: updatedFlow,
          fechaUltimaActualizacion: `${documentDate()} ${nowHora}`,
        };
      });

      if (nextDoc) {
        onAuditLog?.(
          "DOCUMENTO DEVUELTO",
          nextDoc.nombre,
          "DOCUMENTO DEVUELTO",
          `Documento devuelto al elaborador con ${nextDoc.observations.filter((o) => o.estado === "activa").length} observaciones activas. Motivo: "${motivo}"`,
          revisor,
          "Revisor"
        );
      }
    },
    [mutateDocument, onAuditLog]
  );

  const iniciarCorreccion = useCallback((targetDocId: string) => {
    const nowHora = new Date().toLocaleTimeString("es-EC", {hour:"2-digit",minute:"2-digit",timeZone:"America/Guayaquil"});
    const nextDoc = mutateDocument(targetDocId, (docMaster: DocumentMasterState): DocumentMasterState => ({
      ...docMaster,
      documentState: "EN CORRECCIÓN",
      fechaUltimaActualizacion: `${documentDate()} ${nowHora}`,
    }));

    if (nextDoc) {
      onAuditLog?.(
        "CORRECCIÓN INICIADA",
        nextDoc.nombre,
        "CORRECCIÓN INICIADA",
        `Docente elaborador inició la sesión de corrección (v${nextDoc.formalVersion} / Ronda ${nextDoc.reviewRound})`,
        "Ing. Andrea Pérez, Mg.",
        "Docente"
      );
    }
  }, [mutateDocument, onAuditLog]);

  const prepararNuevaRonda = useCallback((targetDocId: string) => {
    const nowHora = new Date().toLocaleTimeString("es-EC", {hour:"2-digit",minute:"2-digit",timeZone:"America/Guayaquil"});
    const nowStr = `${documentDate()} ${nowHora}`;

    const nextDoc = mutateDocument(targetDocId, (docMaster: DocumentMasterState): DocumentMasterState => {
      if (docMaster.documentState !== "EN CORRECCIÓN") return docMaster;
      const nextRound = docMaster.reviewRound + 1;
      const updatedHistory = [...docMaster.artifactHistory, docMaster.currentArtifact];

      const historifiedObs = docMaster.observations.map((o) => ({
        ...o,
        estado: o.estado === "resuelta" ? "historica" as const : o.estado,
      }));

      const cleanArtifact: DocumentArtifact = {
        ...docMaster.currentArtifact,
        id: `art-plan-fisei-v${docMaster.formalVersion.replace(".", "_")}-r${nextRound}-${Date.now()}`,
        formalVersion: docMaster.formalVersion,
        reviewRound: nextRound,
        generatedAt: nowStr,
        signatures: [],
        signatureSlots: docMaster.currentArtifact.signatureSlots,
      };

      const resetFlow = docMaster.flowStages.map((stage, i) => ({
        ...stage,
        estado: i === 0 ? ("PENDIENTE" as const) : ("PENDIENTE" as const),
        signature: undefined,
      }));

      return {
        ...docMaster,
        reviewRound: nextRound,
        documentState: "LISTO PARA FIRMA",
        currentArtifact: cleanArtifact,
        artifactHistory: updatedHistory,
        observations: historifiedObs,
        flowStages: resetFlow,
        fechaUltimaActualizacion: nowStr,
        mensajeDevolucion: undefined,
      };
    });

    if (nextDoc) {
      onAuditLog?.(
        "NUEVA RONDA INICIADA",
        nextDoc.nombre,
        "NUEVA RONDA INICIADA",
        `Iniciada Ronda de revisión ${nextDoc.reviewRound} para la Versión formal ${nextDoc.formalVersion}. Requiere nueva firma de elaborador.`,
        "Ing. Andrea Pérez, Mg.",
        "Docente"
      );
      return nextDoc;
    }
  }, [mutateDocument, onAuditLog]);

  const firmarEtapa = useCallback((targetDocId: string, actor: string, cargo: string, ubicacion: string, role: "revisor" | "validador") => {
    const result=mutateDocument(targetDocId, doc => {
      const stage=doc.flowStages.find(s => s.estado === "EN_CURSO" && s.actorName === actor && s.actorRole === role);
      if (!stage?.actorId || stage.actorId !== sessionRef.current.id || stage.actionMode === "APPROVE_ONLY" || !["EN REVISIÓN","EN VALIDACIÓN FINAL"].includes(doc.documentState) || doc.observations.some(o => o.estado === "activa")) return doc;
      const slot=doc.currentArtifact.signatureSlots?.find(s => s.stageId === stage.id) || doc.currentArtifact.signatureSlots?.find(s => s.role === role);
      if (!slot) return doc;
      const signature: DocumentSignature={stageId:stage.id,actorId:stage.actorId,actor,cargo,role,fecha:documentDate(),hora:new Date().toLocaleTimeString("es-EC"),ubicacion:ubicacion || `Página ${slot.pageNumber || slot.pageIndex} — ${slot.label}`};
      const next=advanceStage(doc,stage,signature);
      return {...next,fechaUltimaActualizacion:`${signature.fecha} ${signature.hora}`,finalValidatorId:next.documentState === "VALIDADO" ? stage.actorId : doc.finalValidatorId,finalValidatorName:next.documentState === "VALIDADO" ? actor : doc.finalValidatorName};
    });
    if(result) onAuditLog?.("DOCUMENTO FIRMADO",result.nombre,"APROBACIÓN DE ETAPA",`Etapa atendida por ${actor}`,actor,role);
  },[mutateDocument,onAuditLog]);

  const aprobarYFirmarRevisor = useCallback((targetDocId:string, actor="Ing. Carlos López, Mg.", cargo="Responsable de revisión técnica", ubicacion="") => firmarEtapa(targetDocId,actor,cargo,ubicacion,"revisor"),[firmarEtapa]);
  const validarYFirmarFinal = useCallback((targetDocId:string, actor="Ing. Patricia Salazar, Mg.", cargo="Coordinadora de Unidad", ubicacion="") => firmarEtapa(targetDocId,actor,cargo,ubicacion,"validador"),[firmarEtapa]);
  const aprobarSinFirma = useCallback((targetDocId:string, stageId:string) => mutateDocument(targetDocId, doc => {
    const stage=doc.flowStages.find(s => s.id === stageId && s.estado === "EN_CURSO" && s.actionMode === "APPROVE_ONLY");
    if (!stage || doc.observations.some(o => o.estado === "activa") || !["EN REVISIÓN","EN VALIDACIÓN FINAL"].includes(doc.documentState)) return doc;
    return advanceStage(doc,stage);
  }),[mutateDocument]);
  const configurarFlujoDocumento = useCallback((targetDocId:string, stages:import("./types").FlowStageNode[]) => mutateDocument(targetDocId, doc => doc.documentState !== "BORRADOR" ? doc : {...doc,flowStages:stages}),[mutateDocument]);

  const resolverObservacion = useCallback((targetDocId: string, observationId: number) => mutateDocument(targetDocId, doc => doc.documentState !== "EN CORRECCIÓN" ? doc : {...doc, observations:doc.observations.map(o => o.id === observationId && o.estado === "activa" ? {...o,estado:"resuelta"} : o)}), [mutateDocument]);

  const actualizarDatosBasicos = useCallback((targetDocId: string, datos: {grupo: string; periodo: string}) => mutateDocument(targetDocId, doc => doc.currentArtifact.signatures.length ? doc : {...doc, ...datos, nombre:doc.documentType === "PLAN_TRABAJO" ? `Plan de Trabajo — ${datos.grupo}` : doc.nombre, currentArtifact:{...doc.currentArtifact,...datos}}), [mutateDocument]);

  const restablecerDemo = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    commitDocuments(structuredClone(INITIAL_DOCUMENTS_LIST));
    setSelectedDocId(INITIAL_DOCUMENTS_LIST[0]?.id || INITIAL_DOCUMENT_MASTER.id);
  }, []);

  return {
    simularSesionDemo,
    currentUser: sessionRef.current,
    aprobarSinFirma,
    configurarFlujoDocumento,
    resolverObservacion,
    actualizarDatosBasicos,
    documents,
    selectedDocId,
    docMaster,
    currentArtifact: docMaster.currentArtifact,
    observations: docMaster.observations,
    flowStages: docMaster.flowStages,
    seleccionarDocumento,
    crearNuevoDocumento,
    generarArtefacto,
    generarArtefactoInforme,
    firmarComoElaborador,
    enviarARevision,
    agregarObservacion,
    editarObservacion,
    eliminarObservacion,
    devolverDocumento,
    iniciarCorreccion,
    prepararNuevaRonda,
    aprobarYFirmarRevisor,
    validarYFirmarFinal,
    restablecerDemo,
  };
}
