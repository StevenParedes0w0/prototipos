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
import {
  FECHA_SISTEMA,
  INITIAL_DOCUMENT_MASTER,
  INITIAL_DOCUMENTS_LIST,
  MATRIZ_INICIAL_DOC,
  JUSTIFICACION_INICIAL,
  OBJETIVO_INICIAL,
  FLOW_STAGES_INICIAL,
} from "./mockDataDocument";

const STORAGE_KEY = "fisei_documents_collection_v4";

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

  const seleccionarDocumento = useCallback((id: string) => {
    setSelectedDocId(id);
  }, []);

  // Crear nuevo documento (Plan de Trabajo o Informe)
  const crearNuevoDocumento = useCallback(
    (tipo: DocumentType, datosBasicos?: { grupo?: string; periodo?: string; titulo?: string; documentoRelacionadoId?: string; documentoRelacionadoTitulo?: string }) => {
      const nowHora = "09:00";
      const nowStr = `${FECHA_SISTEMA} ${nowHora}`;
      const grupo = datosBasicos?.grupo || (tipo === "INFORME" ? "Unidad de Titulación" : "Comisión de Eventos Académicos");
      const periodo = datosBasicos?.periodo || "Julio – Diciembre 2026";
      const titulo = datosBasicos?.titulo || (tipo === "INFORME" ? `Informe de actividades — ${grupo}` : `Plan de Trabajo: ${grupo}`);
      const id = tipo === "INFORME" ? `doc-inf-${Date.now()}` : `doc-plan-${Date.now()}`;
      const codigo = tipo === "INFORME" ? `INF-FISEI-2026-${Math.floor(100 + Math.random() * 900)}` : `PT-FISEI-2026-${Math.floor(100 + Math.random() * 900)}`;

      const newArtifact: DocumentArtifact = {
        id: `art-${id}-v1_0-r1`,
        documentType: tipo,
        titulo,
        formalVersion: "1.0",
        reviewRound: 1,
        pageCount: tipo === "INFORME" ? 3 : 4,
        generatedAt: nowStr,
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
        justificacion: tipo === "PLAN_TRABAJO" ? JUSTIFICACION_INICIAL : undefined,
        objetivo: tipo === "PLAN_TRABAJO" ? OBJETIVO_INICIAL : undefined,
        matriz: tipo === "PLAN_TRABAJO" ? MATRIZ_INICIAL_DOC : undefined,
        informeData: tipo === "INFORME" ? {
          introduccion: "El presente informe institucional documenta las actividades ejecutadas en el marco de los objetivos planificados.",
          desarrollo: "Se detallan los procesos desarrollados, las reuniones de coordinación y el seguimiento efectuado durante el período académico.",
          resultados: "Se registraron avances significativos en los compromisos establecidos y articulados con la FISEI.",
          observaciones: "Se sugiere dar continuidad a los procesos iniciados.",
          documentoRelacionado: datosBasicos?.documentoRelacionadoTitulo,
        } : undefined,
        tieneAnexos: "no",
        anexos: [],
        signatures: [],
      };

      const newDoc: DocumentMasterState = {
        id,
        codigo,
        nombre: titulo,
        documentType: tipo,
        grupo,
        periodo,
        formalVersion: "1.0",
        reviewRound: 1,
        documentState: "BORRADOR",
        currentArtifact: newArtifact,
        artifactHistory: [],
        observations: [],
        flowStages: FLOW_STAGES_INICIAL,
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

  // 1b. Generar / Actualizar Artefacto de Informe
  const generarArtefactoInforme = useCallback(
    (datos: {
      titulo: string;
      grupo: string;
      periodo: string;
      documentoRelacionado?: string;
      introduccion: string;
      desarrollo: string;
      resultados: string;
      observaciones?: string;
      tieneAnexos: "si" | "no" | null;
      anexos: AnexoDoc[];
    }) => {
      const isRegen = docMaster.reviewRound > 1 || docMaster.documentState === "EN CORRECCIÓN";
      const nowHora = "10:15";
      const nowStr = `${FECHA_SISTEMA} ${nowHora}`;

      const newArtifact: DocumentArtifact = {
        id: `art-inf-${docMaster.id}-v${docMaster.formalVersion.replace(".", "_")}-r${docMaster.reviewRound}-${Date.now()}`,
        documentType: "INFORME",
        titulo: datos.titulo || docMaster.nombre,
        formalVersion: docMaster.formalVersion,
        reviewRound: docMaster.reviewRound,
        pageCount: 3,
        generatedAt: nowStr,
        generatedBy: "Ing. Andrea Pérez, Mg.",
        grupo: datos.grupo || docMaster.grupo,
        periodo: datos.periodo || docMaster.periodo,
        unidadAcademica: "FISEI – UTA",
        elaborador: {
          id: "usr-andrea-01",
          nombre: "Ing. Andrea Pérez, Mg.",
          cargo: "Docente elaborador",
          email: "andrea.perez@uta.edu.ec",
        },
        informeData: {
          introduccion: datos.introduccion,
          desarrollo: datos.desarrollo,
          resultados: datos.resultados,
          observaciones: datos.observaciones,
          documentoRelacionado: datos.documentoRelacionado,
        },
        tieneAnexos: datos.tieneAnexos,
        anexos: datos.anexos || [],
        signatures: [],
      };

      const nextState: DocumentMasterState = {
        ...docMaster,
        nombre: datos.titulo || docMaster.nombre,
        grupo: datos.grupo || docMaster.grupo,
        periodo: datos.periodo || docMaster.periodo,
        documentState: docMaster.documentState === "BORRADOR" ? "LISTO PARA FIRMA" : docMaster.documentState,
        currentArtifact: newArtifact,
        fechaUltimaActualizacion: nowStr,
        documentoRelacionadoTitulo: datos.documentoRelacionado,
      };

      saveState(nextState);

      const eventType = isRegen ? "DOCUMENTO REGENERADO" : "DOCUMENTO GENERADO";
      onAuditLog?.(
        eventType,
        nextState.nombre,
        eventType,
        `Artefacto formal de Informe generado (Versión formal ${docMaster.formalVersion} — Ronda ${docMaster.reviewRound})`,
        "Ing. Andrea Pérez, Mg.",
        "Docente"
      );

      return newArtifact;
    },
    [docMaster, onAuditLog, saveState]
  );


  // 1. Generar / Regenerar Artefacto desde Borrador
  const generarArtefacto = useCallback(
    (datos: {
      justificacion: string;
      objetivo: string;
      matriz: ActividadMatrizDoc[];
      tieneAnexos: "si" | "no" | null;
      anexos: AnexoDoc[];
    }) => {
      const isRegen = docMaster.reviewRound > 1 || docMaster.documentState === "EN CORRECCIÓN";
      const nowHora = "10:15";
      const nowStr = `${FECHA_SISTEMA} ${nowHora}`;
      const matriz = datos.matriz && datos.matriz.length > 0 ? datos.matriz : MATRIZ_INICIAL_DOC;
      const pageCount = Math.max(3, Math.min(8, Math.ceil((matriz.length + 3) / 2)));

      const newArtifact: DocumentArtifact = {
        id: `art-plan-fisei-v${docMaster.formalVersion.replace(".", "_")}-r${docMaster.reviewRound}-${Date.now()}`,
        documentType: docMaster.documentType || "PLAN_TRABAJO",
        formalVersion: docMaster.formalVersion,
        reviewRound: docMaster.reviewRound,
        pageCount: docMaster.currentArtifact.pageCount || pageCount,
        generatedAt: nowStr,
        generatedBy: "Ing. Andrea Pérez, Mg.",
        grupo: docMaster.grupo,
        periodo: docMaster.periodo,
        unidadAcademica: "FISEI – UTA",
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
      };

      const nextState: DocumentMasterState = {
        ...docMaster,
        documentState: docMaster.documentState === "BORRADOR" ? "LISTO PARA FIRMA" : docMaster.documentState,
        currentArtifact: newArtifact,
        fechaUltimaActualizacion: nowStr,
      };

      saveState(nextState);

      const eventType = isRegen ? "DOCUMENTO REGENERADO" : "DOCUMENTO GENERADO";
      onAuditLog?.(
        eventType,
        "Plan de Trabajo — Comisión de Eventos Académicos",
        eventType,
        `Artefacto formal generado (Versión formal ${docMaster.formalVersion} — Ronda de revisión ${docMaster.reviewRound})`,
        "Ing. Andrea Pérez, Mg.",
        "Docente"
      );

      return newArtifact;
    },
    [docMaster, onAuditLog, saveState]
  );

  // 2. Firma por Elaborador (Andrea Pérez)
  const firmarComoElaborador = useCallback(
    (certFile: string, ubicacion: string = "Página 4 — Firmas de Responsabilidad: Elaborado por") => {
      const nowHora = "10:30";
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

      const nextState: DocumentMasterState = {
        ...docMaster,
        documentState: "FIRMADO POR ELABORADOR",
        currentArtifact: updatedArtifact,
        flowStages: updatedFlow,
        fechaUltimaActualizacion: `${FECHA_SISTEMA} ${nowHora}`,
      };

      saveState(nextState);

      onAuditLog?.(
        "DOCUMENTO FIRMADO",
        "Plan de Trabajo — Comisión de Eventos Académicos",
        "DOCUMENTO FIRMADO",
        `Firma electrónica estampada por Ing. Andrea Pérez, Mg. en posición "${ubicacion}"`,
        "Ing. Andrea Pérez, Mg.",
        "Docente"
      );
    },
    [docMaster, onAuditLog, saveState]
  );

  // 3. Enviar a Revisión
  const enviarARevision = useCallback(() => {
    const nowHora = "10:35";
    const updatedFlow = docMaster.flowStages.map((st) => {
      if (st.id === "stage-1") return { ...st, estado: "FIRMADO" as const };
      if (st.id === "stage-2") return { ...st, estado: "EN_CURSO" as const };
      return st;
    });

    const nextState: DocumentMasterState = {
      ...docMaster,
      documentState: "EN REVISIÓN",
      flowStages: updatedFlow,
      fechaUltimaActualizacion: `${FECHA_SISTEMA} ${nowHora}`,
    };

    saveState(nextState);

    onAuditLog?.(
      "DOCUMENTO ENVIADO A REVISIÓN",
      "Plan de Trabajo — Comisión de Eventos Académicos",
      "DOCUMENTO ENVIADO A REVISIÓN",
      `Documento formal v${docMaster.formalVersion} (Ronda ${docMaster.reviewRound}) enviado a Nivel 1 — Revisión técnica`,
      "Ing. Andrea Pérez, Mg.",
      "Docente"
    );
  }, [docMaster, onAuditLog, saveState]);

  // 4. Registrar Observación
  const agregarObservacion = useCallback(
    (pagina: number, texto: string, seccion: string = "", tipo: "general" | "seccion" = "seccion", revisor: string = "Ing. Carlos López, Mg.") => {
      const nowHora = "10:45";
      const newObs: DocumentObservation = {
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

      const nextState: DocumentMasterState = {
        ...docMaster,
        observations: [...docMaster.observations, newObs],
        fechaUltimaActualizacion: `${FECHA_SISTEMA} ${nowHora}`,
      };

      saveState(nextState);

      onAuditLog?.(
        "OBSERVACIÓN REGISTRADA",
        "Plan de Trabajo — Comisión de Eventos Académicos",
        "OBSERVACIÓN REGISTRADA",
        `Observación registrada en Página ${pagina} por ${revisor}: "${texto.slice(0, 60)}..."`,
        revisor,
        "Revisor"
      );

      return newObs;
    },
    [docMaster, onAuditLog, saveState]
  );

  // 5. Editar Observación
  const editarObservacion = useCallback(
    (id: number, nuevoTexto: string) => {
      const nextObs = docMaster.observations.map((o) =>
        o.id === id && o.estado === "activa" ? { ...o, texto: nuevoTexto.trim() } : o
      );
      saveState({ ...docMaster, observations: nextObs });
    },
    [docMaster, saveState]
  );

  // 6. Eliminar Observación
  const eliminarObservacion = useCallback(
    (id: number) => {
      const nextObs = docMaster.observations.filter((o) => o.id !== id);
      saveState({ ...docMaster, observations: nextObs });
    },
    [docMaster, saveState]
  );

  // 7. Devolver Documento (Revisor) - Mantiene v1.0 y ronda actual (e.g. Ronda 1)
  const devolverDocumento = useCallback(
    (revisor: string = "Ing. Carlos López, Mg.", motivo: string = "Por favor, revise las observaciones registradas y realice las correcciones requeridas antes de reenviar el documento.") => {
      const nowHora = "10:55";
      const updatedFlow = docMaster.flowStages.map((st) => {
        if (st.id === "stage-2") return { ...st, estado: "DEVUELTO" as const };
        return st;
      });

      const nextState: DocumentMasterState = {
        ...docMaster,
        documentState: "DEVUELTO",
        mensajeDevolucion: motivo,
        flowStages: updatedFlow,
        fechaUltimaActualizacion: `${FECHA_SISTEMA} ${nowHora}`,
      };

      saveState(nextState);

      onAuditLog?.(
        "DOCUMENTO DEVUELTO",
        "Plan de Trabajo — Comisión de Eventos Académicos",
        "DOCUMENTO DEVUELTO",
        `Documento devuelto al elaborador con ${docMaster.observations.filter((o) => o.estado === "activa").length} observaciones activas. Motivo: "${motivo}"`,
        revisor,
        "Revisor"
      );
    },
    [docMaster, onAuditLog, saveState]
  );

  // 8. Iniciar Corrección (Andrea) - Sigue v1.0 y ronda actual (e.g. Ronda 1)
  const iniciarCorreccion = useCallback(() => {
    const nowHora = "11:05";
    const nextState: DocumentMasterState = {
      ...docMaster,
      documentState: "EN CORRECCIÓN",
      fechaUltimaActualizacion: `${FECHA_SISTEMA} ${nowHora}`,
    };

    saveState(nextState);

    onAuditLog?.(
      "CORRECCIÓN INICIADA",
      "Plan de Trabajo — Comisión de Eventos Académicos",
      "CORRECCIÓN INICIADA",
      `Docente elaborador inició la sesión de corrección del Plan v${docMaster.formalVersion} (Ronda ${docMaster.reviewRound})`,
      "Ing. Andrea Pérez, Mg.",
      "Docente"
    );
  }, [docMaster, onAuditLog, saveState]);

  // 9. Preparar Nueva Ronda de Revisión - Incrementa reviewRound ÚNICAMENTE al terminar corrección
  const prepararNuevaRonda = useCallback(() => {
    const nextRound = docMaster.reviewRound + 1;
    const nowHora = "11:20";
    const nowStr = `${FECHA_SISTEMA} ${nowHora}`;

    // Archivar artefacto actual al historial
    const updatedHistory = [...docMaster.artifactHistory, docMaster.currentArtifact];

    // Marcar observaciones como históricas
    const historifiedObs = docMaster.observations.map((o) => ({
      ...o,
      estado: "historica" as const,
    }));

    // Nuevo artefacto limpio sin firmas vigentes para la nueva ronda
    const cleanArtifact: DocumentArtifact = {
      ...docMaster.currentArtifact,
      id: `art-plan-fisei-v${docMaster.formalVersion.replace(".", "_")}-r${nextRound}-${Date.now()}`,
      formalVersion: docMaster.formalVersion,
      reviewRound: nextRound,
      generatedAt: nowStr,
      signatures: [], // Nueva ronda comienza sin firmas vigentes
    };

    // Reiniciar flujo dinámico preservando actores configurados
    const resetFlow = docMaster.flowStages.map((stage, i) => ({
      ...stage,
      estado: i === 0 ? ("PENDIENTE" as const) : ("PENDIENTE" as const),
      signature: undefined,
    }));

    const nextState: DocumentMasterState = {
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

    saveState(nextState);

    onAuditLog?.(
      "NUEVA RONDA INICIADA",
      "Plan de Trabajo — Comisión de Eventos Académicos",
      "NUEVA RONDA INICIADA",
      `Iniciada Ronda de revisión ${nextRound} para la Versión formal ${docMaster.formalVersion}. Requiere nueva firma de elaborador.`,
      "Ing. Andrea Pérez, Mg.",
      "Docente"
    );

    return nextState;
  }, [docMaster, onAuditLog, saveState]);

  // 10. Aprobar y Firmar por Revisor (Nivel intermedio)
  const aprobarYFirmarRevisor = useCallback(
    (
      revisorNombre: string = "Ing. Carlos López, Mg.",
      revisorCargo: string = "Responsable de revisión técnica",
      ubicacion: string = "Página 4 — Firmas de Responsabilidad: Revisado por"
    ) => {
      const nowHora = "11:35";
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

      // Agregar firma acumulada al mismo artefacto
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

      const nextState: DocumentMasterState = {
        ...docMaster,
        documentState: "EN VALIDACIÓN FINAL",
        currentArtifact: updatedArtifact,
        flowStages: updatedFlow,
        fechaUltimaActualizacion: `${FECHA_SISTEMA} ${nowHora}`,
      };

      saveState(nextState);

      onAuditLog?.(
        "DOCUMENTO APROBADO",
        "Plan de Trabajo — Comisión de Eventos Académicos",
        "DOCUMENTO APROBADO",
        `Revisión técnica aprobada y firmada por ${revisorNombre} (v${docMaster.formalVersion} / Ronda ${docMaster.reviewRound})`,
        revisorNombre,
        "Revisor"
      );

      onAuditLog?.(
        "DOCUMENTO FIRMADO",
        "Plan de Trabajo — Comisión de Eventos Académicos",
        "DOCUMENTO FIRMADO",
        `Firma digital de aprobación estampada por ${revisorNombre}`,
        revisorNombre,
        "Revisor"
      );
    },
    [docMaster, onAuditLog, saveState]
  );

  // 11. Validar y Firmar Final (Validador Final configurable)
  const validarYFirmarFinal = useCallback(
    (
      validadorNombre: string = "Ing. Patricia Salazar, Mg.",
      validadorCargo: string = "Coordinadora de Comisión / Autoridad",
      ubicacion: string = "Página 4 — Firmas de Responsabilidad: Validado por"
    ) => {
      const nowHora = "11:50";
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

      const nextState: DocumentMasterState = {
        ...docMaster,
        documentState: "VALIDADO",
        operationalState: docMaster.documentType === "PLAN_TRABAJO" ? "EN EJECUCIÓN" : undefined,
        finalValidatorId: validadorId,
        finalValidatorName: validadorNombre,
        currentArtifact: updatedArtifact,
        flowStages: updatedFlow,
        fechaUltimaActualizacion: `${FECHA_SISTEMA} ${nowHora}`,
      };

      saveState(nextState);

      onAuditLog?.(
        "VALIDACIÓN FINAL REALIZADA",
        "Plan de Trabajo — Comisión de Eventos Académicos",
        "VALIDACIÓN FINAL REALIZADA",
        `Validación final completada exitosamente por ${validadorNombre}. Documento pasa a estado VALIDADO.`,
        validadorNombre,
        "Validador"
      );

      onAuditLog?.(
        "DOCUMENTO FIRMADO",
        "Plan de Trabajo — Comisión de Eventos Académicos",
        "DOCUMENTO FIRMADO",
        `Firma digital de validación final estampada por ${validadorNombre}`,
        validadorNombre,
        "Validador"
      );
    },
    [docMaster, onAuditLog, saveState]
  );


  // 12. Restablecer DEMO
  const restablecerDemo = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setDocuments(INITIAL_DOCUMENTS_LIST);
    setSelectedDocId(INITIAL_DOCUMENT_MASTER.id);
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

