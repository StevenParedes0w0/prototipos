import { useState, useEffect, useCallback } from "react";
import {
  DocumentMasterState,
  DocumentArtifact,
  DocumentObservation,
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
  FECHA_SISTEMA,
  INITIAL_DOCUMENT_MASTER,
  INITIAL_DOCUMENTS_LIST,
  MATRIZ_INICIAL_DOC,
  JUSTIFICACION_INICIAL,
  OBJETIVO_INICIAL,
  FLOW_STAGES_INICIAL,
} from "./mockDataDocument";

const STORAGE_KEY = "fisei_documents_collection_v6";

export function useDocumentEngine(onAuditLog?: (tipoEvento: string, objeto: string, accion: string, descripcion: string, usuario: string, rol: string) => void) {
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

  const [selectedDocId, setSelectedDocId] = useState<string>(() => {
    return documents[0]?.id || INITIAL_DOCUMENT_MASTER.id;
  });

  const docMaster = documents.find((d) => d.id === selectedDocId) || documents[0] || INITIAL_DOCUMENT_MASTER;

  const saveState = useCallback((nextState: DocumentMasterState) => {
    setDocuments((prevDocs) => {
      const exists = prevDocs.some((d) => d.id === nextState.id);
      const nextDocs = exists
        ? prevDocs.map((d) => (d.id === nextState.id ? nextState : d))
        : [...prevDocs, nextState];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextDocs));
      } catch (e) {
        console.error("Error saving documents to storage", e);
      }
      return nextDocs;
    });
  }, []);

  const mutateDocument = useCallback((targetDocId: string, updater: (doc: DocumentMasterState) => DocumentMasterState): DocumentMasterState | null => {
    let nextDoc: DocumentMasterState | null = null;
    setDocuments(prevDocs => {
      const doc = prevDocs.find(d => d.id === targetDocId);
      if (!doc) return prevDocs;
      nextDoc = updater(doc);
      const nextDocs = prevDocs.map(d => d.id === targetDocId ? nextDoc! : d);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextDocs));
      } catch (e) {
        console.error("Error saving documents to storage", e);
      }
      return nextDocs;
    });
    return nextDoc;
  }, []);

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
        actividadesInforme?: any[];
      }
    ) => {
      const nowHora = "09:00";
      const nowStr = `${FECHA_SISTEMA} ${nowHora}`;
      const grupo = datosBasicos?.grupo || (tipo === "INFORME" ? "Unidad de Titulación" : "Comisión de Eventos Académicos");
      const carrera = datosBasicos?.carrera || "Ingeniería de Software";
      const periodo = datosBasicos?.periodo || "Julio – Diciembre 2026";
      const titulo = datosBasicos?.titulo || (tipo === "INFORME" ? `Informe de actividades — ${grupo}` : `Plan de Trabajo: ${grupo}`);
      const normalizedTitulo = tipo === "INFORME" ? normalizeInformeTitle(titulo) : titulo;
      const id = tipo === "INFORME" ? `doc-inf-${Date.now()}` : `doc-plan-${Date.now()}`;
      const codigo = tipo === "INFORME" ? `INF-FISEI-2026-${Math.floor(100 + Math.random() * 900)}` : `PT-FISEI-2026-${Math.floor(100 + Math.random() * 900)}`;
      const codigoFormatoOficial = tipo === "INFORME" ? "UTA-SGC-A-2-1-P7-T2" : "UTA-SGC-A-2-1-P7-T1";

      const pageCount = 5;
      const pages: import("./types").DocumentPage[] = Array.from({ length: pageCount }).map((_, i) => {
        const isPenultimate = tipo === "INFORME" && i === pageCount - 2;
        const isLast = i === pageCount - 1;
        return { 
          id: `page-${i+1}`, 
          type: "standard",
          signatureSlots: tipo === "INFORME" 
            ? (isPenultimate ? [
                { role: "docente", action: "ELABORADO_POR", label: "Elaborado por" },
                { role: "revisor", action: "REVISADO_POR", label: "Revisado por" }
              ] : isLast ? [
                { role: "validador", action: "VALIDADO_POR", label: "Validado por" }
              ] : [])
            : (isLast ? [
                { role: "docente", action: "ELABORADO_POR", label: "Elaborado por" },
                { role: "revisor", action: "REVISADO_POR", label: "Revisado por" },
                { role: "validador", action: "VALIDADO_POR", label: "Validado por" }
              ] : [])
        };
      });
      const derivedSignatureSlots = pages.flatMap((p, i) => 
        (p.signatureSlots || []).map(s => ({ ...s, pageIndex: i + 1, pageNumber: i + 1 }))
      ) as any[];

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
            fecha: FECHA_SISTEMA,
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
        finalValidatorId: "usr-patricia-03",
        finalValidatorName: "Ing. Patricia Salazar, Mg.",
        currentArtifact: newArtifact,
        artifactHistory: [],
        observations: [],
        flowStages: FLOW_STAGES_INICIAL.map((st) => ({
          ...st,
          actionLabel: st.actorRole === "docente" ? "ELABORADO_POR" : st.actorRole === "revisor" ? "REVISADO_POR" : "VALIDADO_POR",
        })),
        fechaUltimaActualizacion: nowStr,
        documentoRelacionadoId: datosBasicos?.documentoRelacionadoId,
        documentoRelacionadoTitulo: datosBasicos?.documentoRelacionadoTitulo,
      };

      setDocuments((prev) => {
        const next = [newDoc, ...prev];
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch (e) {
          console.error("Error saving new document", e);
        }
        return next;
      });
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
    [onAuditLog]
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
      actividadesInforme?: any[];
      desarrolloTextoLibre?: string;
      conclusiones: string;
      oportunidadesMejora: string;
      aplicaRegistroContactos: boolean;
      contactosDelegacion?: any[];
      tieneAnexos: "si" | "no" | null;
      anexos: AnexoDoc[];
      introduccion?: string;
      desarrollo?: string;
      resultados?: string;
      observaciones?: string;
      documentoRelacionado?: string;
    }) => {
      const nowHora = "10:15";
      const nowStr = `${FECHA_SISTEMA} ${nowHora}`;

      const nextDoc = mutateDocument(targetDocId, (docMaster: DocumentMasterState): DocumentMasterState => {
        const isRegen = docMaster.reviewRound > 1 || docMaster.documentState === "EN CORRECCIÓN";
        const carrera = datos.carrera || docMaster.carrera || "Ingeniería de Software";
        
        const pageCount = 5;
        const pages: import("./types").DocumentPage[] = Array.from({ length: pageCount }).map((_, i) => {
          const isPenultimate = i === pageCount - 2;
          const isLast = i === pageCount - 1;
          return {
            id: `page-${i+1}`,
            type: "standard",
            signatureSlots: isPenultimate ? [
              { role: "docente", action: "ELABORADO_POR", label: "Elaborado por" },
              { role: "revisor", action: "REVISADO_POR", label: "Revisado por" }
            ] : isLast ? [
              { role: "validador", action: "VALIDADO_POR", label: "Validado por" }
            ] : []
          };
        });
        const derivedSignatureSlots = pages.flatMap((p, i) => 
          (p.signatureSlots || []).map(s => ({ ...s, pageIndex: i + 1, pageNumber: i + 1 }))
        ) as any[];

        const newArtifact: DocumentArtifact = {
          id: `art-inf-${docMaster.id}-v${docMaster.formalVersion.replace(".", "_")}-r${docMaster.reviewRound}-${Date.now()}`,
          documentType: "INFORME",
          codigoFormatoOficial: "UTA-SGC-A-2-1-P7-T2",
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
            actividadesInforme: datos.actividadesInforme || [],
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
              descripcion: "Generación del documento formal de Informe",
              fecha: FECHA_SISTEMA,
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
    }) => {
      const nowHora = "10:15";
      const nowStr = `${FECHA_SISTEMA} ${nowHora}`;
      const matriz = datos.matriz && datos.matriz.length > 0 ? datos.matriz : MATRIZ_INICIAL_DOC;
      const pageCount = Math.max(5, Math.min(8, Math.ceil((matriz.length + 3) / 2)));

      const nextDoc = mutateDocument(targetDocId, (docMaster: DocumentMasterState): DocumentMasterState => {
        const pages = Array.from({ length: pageCount }).map((_, i) => {
          const isPenultimate = docMaster.documentType === "INFORME" && i === pageCount - 2;
          const isLast = i === pageCount - 1;
          return {
            id: `page-${i+1}`,
            type: "standard",
            signatureSlots: docMaster.documentType === "INFORME" 
              ? (isPenultimate ? [
                  { role: "docente", action: "ELABORADO_POR", label: "Elaborado por" },
                  { role: "revisor", action: "REVISADO_POR", label: "Revisado por" }
                ] : isLast ? [
                  { role: "validador", action: "VALIDADO_POR", label: "Validado por" }
                ] : [])
              : (isLast ? [
                  { role: "docente", action: "ELABORADO_POR", label: "Elaborado por" },
                  { role: "revisor", action: "REVISADO_POR", label: "Revisado por" },
                  { role: "validador", action: "VALIDADO_POR", label: "Validado por" }
                ] : [])
          };
        });
        const derivedSignatureSlots = pages.flatMap((p, i) => 
          (p.signatureSlots || []).map(s => ({ ...s, pageIndex: i + 1, pageNumber: i + 1 }))
        ) as any[];

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
          justificacion: datos.justificacion || JUSTIFICACION_INICIAL,
          objetivo: datos.objetivo || OBJETIVO_INICIAL,
          matriz,
          tieneAnexos: datos.tieneAnexos,
          anexos: datos.anexos || [],
          signatures: [],
          signatureSlots: derivedSignatureSlots,
          historialCambios: [
            {
              version: docMaster.formalVersion,
              descripcion: "Generación del documento formal de Plan de Trabajo",
              fecha: FECHA_SISTEMA,
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
    (targetDocId: string, certFile: string, ubicacion: string = "Página 4") => {
      const nowHora = "10:30";
      
      mutateDocument(targetDocId, (docMaster: DocumentMasterState): DocumentMasterState => {
        const signature: DocumentSignature = {
          actorId: "usr-andrea-01",
          actor: "Ing. Andrea Pérez, Mg.",
          cargo: "Docente elaborador",
          role: "docente",
          fecha: FECHA_SISTEMA,
          hora: nowHora,
          ubicacion,
          hashCertificado: "SHA256:4a8f9c2d1e7b6a3f9e8d2c1a5b4e7f9a8c6e3b2d1",
          algoritmo: "RSA-4096 / SHA-256 (Mecanismo sujeto a integración institucional)",
        };

        const updatedSignatures = [
          ...docMaster.currentArtifact.signatures.filter((s) => s.role !== "docente"),
          signature,
        ];

        const updatedArtifact: DocumentArtifact = {
          ...docMaster.currentArtifact,
          signatures: updatedSignatures,
        };

        const updatedFlow = docMaster.flowStages.map((st) =>
          st.id === "stage-1" ? { ...st, estado: "FIRMADO" as const, signature } : st
        );

        return {
          ...docMaster,
          documentState: "FIRMADO POR ELABORADOR",
          currentArtifact: updatedArtifact,
          flowStages: updatedFlow,
          fechaUltimaActualizacion: `${FECHA_SISTEMA} ${nowHora}`,
        };
      });

      onAuditLog?.(
        "DOCUMENTO FIRMADO",
        "Documento",
        "DOCUMENTO FIRMADO",
        `Firma electrónica estampada por Ing. Andrea Pérez, Mg. en posición "${ubicacion}"`,
        "Ing. Andrea Pérez, Mg.",
        "Docente"
      );
    },
    [mutateDocument, onAuditLog]
  );

  const enviarARevision = useCallback((targetDocId: string) => {
    const nowHora = "10:35";
    const nextDoc = mutateDocument(targetDocId, (docMaster: DocumentMasterState): DocumentMasterState => {
      const updatedFlow = docMaster.flowStages.map((st) => {
        if (st.id === "stage-1") return { ...st, estado: "FIRMADO" as const };
        if (st.id === "stage-2") return { ...st, estado: "EN_CURSO" as const };
        return st;
      });

      return {
        ...docMaster,
        documentState: "EN REVISIÓN",
        flowStages: updatedFlow,
        fechaUltimaActualizacion: `${FECHA_SISTEMA} ${nowHora}`,
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
    (targetDocId: string, pagina: number, texto: string, seccion: string = "", tipo: "general" | "seccion" = "seccion", revisor: string = "Ing. Carlos López, Mg.") => {
      const nowHora = "10:45";
      let newObs: DocumentObservation | undefined;

      mutateDocument(targetDocId, (docMaster: DocumentMasterState): DocumentMasterState => {
        newObs = {
          id: Date.now(),
          documentoId: docMaster.id,
          formalVersion: docMaster.formalVersion,
          ronda: docMaster.reviewRound,
          pagina,
          revisor,
          cargo: "Responsable de revisión técnica",
          fecha: `${FECHA_SISTEMA} — ${nowHora}`,
          texto: texto.trim(),
          estado: "activa",
          tipo,
          seccion: tipo === "seccion" ? (seccion || `Página ${pagina}`) : "General",
        };

        return {
          ...docMaster,
          observations: [...docMaster.observations, newObs],
          fechaUltimaActualizacion: `${FECHA_SISTEMA} ${nowHora}`,
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
      const nowHora = "10:55";
      const nextDoc = mutateDocument(targetDocId, (docMaster: DocumentMasterState): DocumentMasterState => {
        const updatedFlow = docMaster.flowStages.map((st) => {
          if (st.id === "stage-2") return { ...st, estado: "DEVUELTO" as const };
          return st;
        });

        return {
          ...docMaster,
          documentState: "DEVUELTO",
          mensajeDevolucion: motivo,
          flowStages: updatedFlow,
          fechaUltimaActualizacion: `${FECHA_SISTEMA} ${nowHora}`,
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
    const nowHora = "11:05";
    const nextDoc = mutateDocument(targetDocId, (docMaster: DocumentMasterState): DocumentMasterState => ({
      ...docMaster,
      documentState: "EN CORRECCIÓN",
      fechaUltimaActualizacion: `${FECHA_SISTEMA} ${nowHora}`,
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
    const nowHora = "11:20";
    const nowStr = `${FECHA_SISTEMA} ${nowHora}`;

    const nextDoc = mutateDocument(targetDocId, (docMaster: DocumentMasterState): DocumentMasterState => {
      const nextRound = docMaster.reviewRound + 1;
      const updatedHistory = [...docMaster.artifactHistory, docMaster.currentArtifact];

      const historifiedObs = docMaster.observations.map((o) => ({
        ...o,
        estado: "historica" as const,
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

  const aprobarYFirmarRevisor = useCallback(
    (
      targetDocId: string,
      revisorNombre: string = "Ing. Carlos López, Mg.",
      revisorCargo: string = "Responsable de revisión técnica",
      ubicacion: string = "Página 4"
    ) => {
      const nowHora = "11:35";
      
      const nextDoc = mutateDocument(targetDocId, (docMaster: DocumentMasterState): DocumentMasterState => {
        const currentRevisorStage = docMaster.flowStages.find((s) => s.actorName === revisorNombre);
        const revisorId = currentRevisorStage?.actorId || "usr-revisor";

        const signature: DocumentSignature = {
          actorId: revisorId,
          actor: revisorNombre,
          cargo: revisorCargo,
          role: "revisor",
          fecha: FECHA_SISTEMA,
          hora: nowHora,
          ubicacion,
          hashCertificado: "SHA256:7c9e1a3b5d7f2e4a6c8b0e2d4f6a8b0c2e4a6c8b0",
          algoritmo: "RSA-4096 / SHA-256 (Mecanismo sujeto a integración institucional)",
        };

        const updatedSignatures = [
          ...docMaster.currentArtifact.signatures.filter((s) => s.actor !== revisorNombre),
          signature,
        ];

        const updatedArtifact: DocumentArtifact = {
          ...docMaster.currentArtifact,
          signatures: updatedSignatures,
        };

        const updatedFlow = docMaster.flowStages.map((st) => {
          if (st.actorName === revisorNombre || st.id === "stage-2") return { ...st, estado: "APROBADO" as const, signature };
          if (st.id === "stage-3" || st.actorRole === "validador") return { ...st, estado: "EN_CURSO" as const };
          return st;
        });

        return {
          ...docMaster,
          documentState: "EN VALIDACIÓN FINAL",
          currentArtifact: updatedArtifact,
          flowStages: updatedFlow,
          fechaUltimaActualizacion: `${FECHA_SISTEMA} ${nowHora}`,
        };
      });

      if (nextDoc) {
        onAuditLog?.(
          "DOCUMENTO APROBADO",
          nextDoc.nombre,
          "DOCUMENTO APROBADO",
          `Revisión técnica aprobada y firmada por ${revisorNombre} (v${nextDoc.formalVersion} / Ronda ${nextDoc.reviewRound})`,
          revisorNombre,
          "Revisor"
        );
      }
    },
    [mutateDocument, onAuditLog]
  );

  const validarYFirmarFinal = useCallback(
    (
      targetDocId: string,
      validadorNombre: string = "Ing. Patricia Salazar, Mg.",
      validadorCargo: string = "Coordinadora de Unidad",
      ubicacion: string = "Página 5"
    ) => {
      const nowHora = "11:50";
      
      const nextDoc = mutateDocument(targetDocId, (docMaster: DocumentMasterState): DocumentMasterState => {
        const validadorStage = docMaster.flowStages.find((s) => s.actorName === validadorNombre || s.actorRole === "validador");
        const validadorId = validadorStage?.actorId || "usr-patricia-03";

        const signature: DocumentSignature = {
          actorId: validadorId,
          actor: validadorNombre,
          cargo: validadorCargo,
          role: "validador",
          fecha: FECHA_SISTEMA,
          hora: nowHora,
          ubicacion,
          hashCertificado: "SHA256:9b1d3f5a7c9e1b3d5f7a9c1e3b5d7f9a1c3e5b7d9",
          algoritmo: "RSA-4096 / SHA-256 (Mecanismo sujeto a integración institucional)",
        };

        const updatedSignatures = [
          ...docMaster.currentArtifact.signatures.filter((s) => s.actor !== validadorNombre),
          signature,
        ];

        const updatedArtifact: DocumentArtifact = {
          ...docMaster.currentArtifact,
          signatures: updatedSignatures,
        };

        const updatedFlow = docMaster.flowStages.map((st) => {
          if (st.actorName === validadorNombre || st.id === "stage-3" || st.actorRole === "validador") {
            return { ...st, estado: "FIRMADO" as const, signature };
          }
          return st;
        });

        return {
          ...docMaster,
          documentState: "VALIDADO",
          operationalState: docMaster.documentType === "PLAN_TRABAJO" ? "EN EJECUCIÓN" : undefined,
          finalValidatorId: validadorId,
          finalValidatorName: validadorNombre,
          currentArtifact: updatedArtifact,
          flowStages: updatedFlow,
          fechaUltimaActualizacion: `${FECHA_SISTEMA} ${nowHora}`,
        };
      });

      if (nextDoc) {
        onAuditLog?.(
          "VALIDACIÓN FINAL REALIZADA",
          nextDoc.nombre,
          "VALIDACIÓN FINAL REALIZADA",
          `Validación final completada exitosamente por ${validadorNombre}. Documento pasa a estado VALIDADO.`,
          validadorNombre,
          "Validador"
        );
      }
    },
    [mutateDocument, onAuditLog]
  );

  const restablecerDemo = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setDocuments(INITIAL_DOCUMENTS_LIST);
    setSelectedDocId(INITIAL_DOCUMENTS_LIST[0]?.id || INITIAL_DOCUMENT_MASTER.id);
  }, []);

  return {
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
