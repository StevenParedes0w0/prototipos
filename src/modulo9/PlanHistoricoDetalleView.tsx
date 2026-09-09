import React, { useState } from "react";
import { PlanHistorico, EvidenciaHistoricaItem } from "./types";
import {
  ArrowLeft,
  Lock,
  Calendar,
  User,
  Users,
  GitBranch,
  History,
  FileCheck,
  CheckCircle2,
  FileText,
  Shield,
  Layers,
  Archive,
  Eye
} from "./icons";

interface PlanHistoricoDetalleViewProps {
  plan: PlanHistorico;
  onVolver: () => void;
  onCompararVersiones: (plan: PlanHistorico) => void;
  onVerTrazabilidadEvidencia: (evidenciaId: string) => void;
  onGenerarReporte: (plan: PlanHistorico) => void;
}

type TabType = "info" | "actividades" | "evidencias" | "versiones" | "historial";

export const PlanHistoricoDetalleView: React.FC<PlanHistoricoDetalleViewProps> = ({
  plan,
  onVolver,
  onCompararVersiones,
  onVerTrazabilidadEvidencia,
  onGenerarReporte,
}) => {
  const [tabActiva, setTabActiva] = useState<TabType>("info");
  const [evidenciaSeleccionada, setEvidenciaSeleccionada] = useState<EvidenciaHistoricaItem | null>(null);

  const codigo = plan.codigo || "PLAN-2026-TIT-HIST";
  const nombreGrupo = plan.nombreGrupo || plan.grupo;
  const docenteNombre = plan.docenteNombre || plan.docente;
  const versionFinal = plan.versionFinal || plan.versionVigente;
  const totalActividades = plan.totalActividades ?? plan.actividadesTotal;
  const fechaCierre = plan.fechaCierre || "25/07/2026";
  const resolucion = plan.resolucionAprobacion || "Decisión institucional DEMO";
  const estadoFinal = plan.estado || plan.estadoFinal || "FINALIZADO";

  // Listas con respaldo
  const actividades = plan.actividades || [];
  const evidencias =
    plan.evidencias && plan.evidencias.length > 0
      ? plan.evidencias
      : actividades.flatMap((act) =>
          (act.medios || []).map((m) => ({
            id: m.id,
            nombre: m.nombre,
            tipo: m.tipo || "Informe Técnico / Evidencia",
            version: m.version || "v1.0",
            archivoNombre: m.archivoNombre || "documento_evidencia.pdf",
            archivoTamano: m.archivoTamano || m.tamano || "1.8 MB",
            tamano: m.tamano || m.archivoTamano || "1.8 MB",
            fechaCarga: m.fechaCarga || "25/06/2026 — 10:00",
            cargadoPor: m.cargadoPor || docenteNombre,
            estado: m.estado || "VALIDADA",
            validadoPor: m.validadoPor || m.validador || "Comisión de Acreditación",
            validador: m.validador || m.validadoPor || "Comisión de Acreditación",
            fechaValidacion: m.fechaValidacion || "26/06/2026 — 11:00",
          }))
        );
  const historialEventos = plan.historialEventos || [
    {
      id: "ev-1",
      fecha: "01/02/2026",
      usuario: docenteNombre,
      evento: "Elaboración y Registro de Plan v1.0",
      detalle: "Plan inicial formulado con 8 actividades según cronograma académico ordinario.",
    },
    {
      id: "ev-2",
      fecha: "08/02/2026",
      usuario: "Comisión Académica",
      evento: "Aprobación Institucional de Plan v1.0",
      detalle: "Revisión satisfactoria y firma digital sin observaciones pendientes.",
    },
    {
      id: "ev-3",
      fecha: "14/04/2026",
      usuario: "Autoridad Institucional DEMO",
      evento: "Emisión de Versión Formal v2.0",
      detalle: "Modificación formal autorizada de la planificación del período.",
    },
    {
      id: "ev-4",
      fecha: fechaCierre,
      usuario: "Gestión Administrativa FISEI",
      evento: "Cierre Formal del Período",
      detalle: "Cierre del período y registro histórico en modo solo lectura.",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Botón Volver y Acciones */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <button
          onClick={onVolver}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a Consulta Histórica
        </button>

        <button
          onClick={() => onGenerarReporte(plan)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#0f2f56] hover:bg-[#1a4070] text-white font-semibold rounded-lg shadow-sm transition-colors text-sm"
        >
          <FileText className="w-4 h-4" />
          Descargar Resumen Histórico (DEMO)
        </button>
      </div>

      {/* Banner Obligatorio: MODO SOLO LECTURA */}
      <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-xl flex items-start sm:items-center gap-3.5 shadow-sm text-amber-900">
        <div className="p-2 bg-amber-100 rounded-lg shrink-0">
          <Lock className="w-5 h-5 text-amber-700" />
        </div>
        <div className="flex-1">
          <h2 className="font-bold text-sm sm:text-base flex items-center gap-2">
            MODO SOLO LECTURA — PERÍODO CERRADO
          </h2>
          <p className="text-xs sm:text-sm text-amber-800 mt-0.5">
            Este plan pertenece al período académico <strong>{plan.periodo}</strong>, el cual se encuentra formalmente cerrado. Las acciones de edición, carga de nuevas evidencias, reemplazo documental y suscripción digital se encuentran deshabilitadas.
          </p>
        </div>
      </div>

      {/* Cabecera del Plan Histórico */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-[#0f2f56] bg-blue-50 border border-blue-200 px-2.5 py-1 rounded">
                Plan de Trabajo
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-300">
                {estadoFinal}
              </span>
              <span className="text-xs font-medium text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-1 rounded-full flex items-center gap-1">
                <GitBranch className="w-3 h-3" />
                Versión Final {versionFinal}
              </span>
              <span className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                {plan.evidenciasValidadas} de {plan.evidenciasRequeridas} evidencias validadas
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              {nombreGrupo}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Referencia de cierre: <span className="font-mono font-medium">{resolucion}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {plan.versiones.length > 1 && (
              <button
                onClick={() => onCompararVersiones(plan)}
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 text-sm font-medium rounded-lg transition-colors"
              >
                <GitBranch className="w-4 h-4" />
                Comparar Versiones (v1.0 vs v2.0)
              </button>
            )}
          </div>
        </div>

        {/* Metadatos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 text-sm">
          <div className="flex items-center gap-3">
            <User className="w-4 h-4 text-slate-400" />
            <div>
              <p className="text-xs text-slate-500">Docente Responsable</p>
              <p className="font-medium text-slate-900">{docenteNombre}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-slate-400" />
            <div>
              <p className="text-xs text-slate-500">Período Académico</p>
              <p className="font-medium text-slate-900">{plan.periodo}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Users className="w-4 h-4 text-slate-400" />
            <div>
              <p className="text-xs text-slate-500">Fecha de Cierre</p>
              <p className="font-medium text-slate-900">{fechaCierre}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Shield className="w-4 h-4 text-slate-400" />
            <div>
              <p className="text-xs text-slate-500">Total de Actividades</p>
              <p className="font-medium text-slate-900">{totalActividades} registradas</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pestañas de Navegación del Plan Histórico */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-2 sm:space-x-4 overflow-x-auto">
          {[
            { id: "info", label: "Información General", icon: Layers },
            { id: "actividades", label: `Actividades (${actividades.length})`, icon: FileText },
            { id: "evidencias", label: `Evidencias (${evidencias.length})`, icon: FileCheck },
            { id: "versiones", label: `Versiones (${plan.versiones.length})`, icon: GitBranch },
            { id: "historial", label: `Línea de Vida (${historialEventos.length})`, icon: History },
          ].map((tab) => {
            const Icon = tab.icon;
            const activa = tabActiva === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setTabActiva(tab.id as TabType)}
                className={`py-3 px-3 sm:px-4 text-sm font-medium border-b-2 inline-flex items-center gap-2 whitespace-nowrap transition-colors ${
                  activa
                    ? "border-[#0f2f56] text-[#0f2f56] font-semibold"
                    : "border-transparent text-slate-500 hover:text-slate-700"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* 1. INFORMACIÓN */}
      {tabActiva === "info" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-base">
              Datos Institucionales del Plan
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="p-3.5 bg-slate-50 rounded-lg">
                <span className="text-xs text-slate-500">Unidad Académica</span>
                <p className="font-medium text-slate-900 mt-0.5">
                  Facultad de Ingeniería en Sistemas, Electrónica e Industrial
                </p>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-lg">
                <span className="text-xs text-slate-500">Carrera</span>
                <p className="font-medium text-slate-900 mt-0.5">
                  Ingeniería de Software
                </p>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-lg">
                <span className="text-xs text-slate-500">Período Lectivo</span>
                <p className="font-medium text-slate-900 mt-0.5">
                  {plan.periodo}
                </p>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-lg">
                <span className="text-xs text-slate-500">Referencia Institucional</span>
                <p className="font-medium text-slate-900 mt-0.5">
                  {resolucion}
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
              <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider mb-2">
                Observación de Cierre
              </h4>
              <p className="text-sm text-slate-600">
                Plan registrado como FINALIZADO al cierre del período {plan.periodo}. Se registraron {plan.evidenciasValidadas} evidencias validadas con trazabilidad institucional.
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-base">
              Responsables históricos
            </h3>
            <div className="space-y-3 text-sm">
              <div className="p-3 border border-slate-200 rounded-lg">
                <p className="text-xs text-slate-500">Docente responsable</p>
                <p className="font-medium text-slate-900">{docenteNombre}</p>
                <span className="inline-block mt-1 text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  Docente
                </span>
              </div>
              <div className="p-3 border border-slate-200 rounded-lg">
                <p className="text-xs text-slate-500">Coordinador</p>
                <p className="font-medium text-slate-900">Ing. Carlos López, Mg.</p>
                <span className="inline-block mt-1 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                  Coordinador
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. ACTIVIDADES */}
      {tabActiva === "actividades" && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200">
            <h3 className="font-bold text-slate-900">
              Actividades Ejecutadas
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Registro histórico de actividades desarrolladas (solo lectura)
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">N°</th>
                  <th className="py-3 px-4 min-w-[200px]">Nombre de Actividad</th>
                  <th className="py-3 px-4 min-w-[140px]">Categoría</th>
                  <th className="py-3 px-4 text-center">Evidencias</th>
                  <th className="py-3 px-4 text-center">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {actividades.map((act, idx) => (
                  <tr key={act.id} className="hover:bg-slate-50/50">
                    <td className="py-3.5 px-4 text-center font-mono text-xs text-slate-500 font-semibold">
                      {act.numero ?? (idx + 1)}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-900">
                      {act.nombre}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-600">
                      {act.criterio || act.categoria}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2 py-1 bg-slate-100 rounded font-mono text-xs font-medium">
                        {act.medios?.length || act.evidenciasRequeridas || 1}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        VALIDADA
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. EVIDENCIAS ARCHIVADAS */}
      {tabActiva === "evidencias" && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <h3 className="font-bold text-slate-900">
                Evidencias Registradas y Trazabilidad
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Archivos digitales con trazabilidad institucional y registro de revisión
              </p>
            </div>
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full w-fit">
              {evidencias.length} evidencias validadas
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4 min-w-[200px]">Nombre del Documento</th>
                  <th className="py-3 px-4 min-w-[140px]">Tipo</th>
                  <th className="py-3 px-4 text-center">Fecha Carga</th>
                  <th className="py-3 px-4 text-center">Validación</th>
                  <th className="py-3 px-4 min-w-[140px]">Validador</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {evidencias.map((evi) => {
                  const tamano = evi.tamano || evi.archivoTamano;
                  const tipo = evi.tipo || "Informe Técnico";
                  const validador = evi.validador || evi.validadoPor || "Comisión de Acreditación";

                  return (
                    <tr key={evi.id} className="hover:bg-slate-50/50">
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-900 flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-700 shrink-0" />
                          <span>{evi.nombre}</span>
                        </div>
                        <span className="text-xs text-slate-400 font-mono pl-6">
                          {tamano}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs font-medium text-slate-600">
                        {tipo}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-center text-slate-600">
                        {evi.fechaCarga}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {evi.estado}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-700">
                        {validador}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => onVerTrazabilidadEvidencia(evi.id)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded text-xs font-medium transition-colors"
                            title="Ver trazabilidad completa del ciclo de vida de la evidencia"
                          >
                            <History className="w-3.5 h-3.5" />
                            Trazabilidad
                          </button>
                          <button
                            onClick={() => setEvidenciaSeleccionada(evi)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded text-xs font-medium transition-colors"
                            title="Ver detalles del documento"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Ver
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. VERSIONES FORMALES */}
      {tabActiva === "versiones" && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <GitBranch className="w-5 h-5 text-indigo-600" />
                  Historial de Versiones
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Diferenciación entre versiones institucionales creadas por decisión formal vs ajustes operativos
                </p>
              </div>

              {plan.versiones.length > 1 && (
                <button
                  onClick={() => onCompararVersiones(plan)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#0f2f56] hover:bg-[#1a4070] text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
                >
                  <GitBranch className="w-4 h-4" />
                  Comparar v1.0 con v2.0
                </button>
              )}
            </div>

            <div className="mt-6 space-y-4">
              {plan.versiones.map((ver) => {
                const esVigente = ver.version === versionFinal || ver.esVersionVigente;
                const motivo = ver.motivo || ver.descripcion;
                const res = ver.resolucion || resolucion;
                const fechaAprobacion = ver.fechaAprobacion || ver.fecha;
                const cambios = ver.cambiosEstructurales || (ver.cambios ? ver.cambios.map(c => `${c.campo}: ${c.v2}`) : []);

                return (
                  <div
                    key={ver.version}
                    className={`border rounded-xl p-5 transition-all ${
                      esVigente
                        ? "border-purple-200 bg-purple-50/20 shadow-sm"
                        : "border-slate-200 bg-slate-50/60"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-3 border-b border-slate-200/60">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-base font-bold text-slate-900">
                          Versión {ver.version}
                        </span>
                        {esVigente && (
                          <span className="px-2.5 py-0.5 bg-purple-600 text-white text-xs font-semibold rounded-full">
                            Versión Final
                          </span>
                        )}
                        <span className="text-xs text-slate-500">
                          Aprobada el {fechaAprobacion}
                        </span>
                      </div>
                      <span className="font-mono text-xs text-slate-600 bg-white px-2.5 py-1 rounded border border-slate-200">
                        Referencia: {res}
                      </span>
                    </div>

                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-xs font-medium text-slate-500">
                          Motivo de la versión:
                        </p>
                        <p className="text-slate-800 font-medium mt-0.5">
                          {ver.version === "1.0"
                            ? "Elaboración inicial."
                            : (ver.motivo || "Modificación formal autorizada de la planificación del período.")}
                        </p>
                        {ver.version !== "1.0" && (
                          <div className="mt-2 space-y-1 text-xs text-slate-500">
                            <p>
                              Origen: <span className="font-medium text-slate-700">{ver.origen || "Decisión institucional DEMO"}</span>
                            </p>
                            <p>
                              Referencia: <span className="font-medium text-slate-700">{res || "Decisión institucional DEMO"}</span>
                            </p>
                          </div>
                        )}
                      </div>

                      <div>
                        <p className="text-xs font-medium text-slate-500">
                          Resumen de Cambios Estructurales:
                        </p>
                        <ul className="mt-1 space-y-1 text-xs text-slate-700 list-disc list-inside">
                          {cambios.length > 0 ? (
                            cambios.map((c, i) => <li key={i}>{c}</li>)
                          ) : (
                            <li>Creación inicial de la estructura del plan</li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 5. LÍNEA DE VIDA / HISTORIAL AUDITORÍA */}
      {tabActiva === "historial" && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="pb-4 border-b border-slate-200">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <History className="w-5 h-5 text-slate-600" />
              Línea de Vida y Registro de Auditoría
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Eventos cronológicos del ciclo de vida del plan hasta su cierre formal
            </p>
          </div>

          <div className="mt-6 relative pl-6 border-l-2 border-slate-200 space-y-8">
            {historialEventos.map((ev) => (
              <div key={ev.id} className="relative group">
                {/* Dot */}
                <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-slate-900 border-4 border-slate-100" />
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <span className="text-xs font-mono font-medium text-slate-500">
                    {ev.fecha}
                  </span>
                  <span className="text-xs text-slate-400">
                    Responsable: <strong className="text-slate-700">{ev.usuario}</strong>
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm mt-1">
                  {ev.evento}
                </h4>
                <p className="text-xs text-slate-600 mt-1">
                  {ev.detalle}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mini Modal / Sheet Informativo para Ver Evidencia Archivada */}
      {evidenciaSeleccionada && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-600" />
                <h4 className="font-bold text-slate-900">
                  Evidencia en Registro Histórico
                </h4>
              </div>
              <button
                onClick={() => setEvidenciaSeleccionada(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-slate-500">Documento:</p>
                <p className="font-bold text-slate-900 text-sm mt-0.5">
                  {evidenciaSeleccionada.nombre}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 bg-slate-50 rounded">
                  <span className="text-slate-500">Tipo de Documento:</span>
                  <p className="font-medium text-slate-800">{evidenciaSeleccionada.tipo || "Informe Técnico"}</p>
                </div>
                <div className="p-2.5 bg-slate-50 rounded">
                  <span className="text-slate-500">Tamaño de Archivo:</span>
                  <p className="font-medium text-slate-800 font-mono">{evidenciaSeleccionada.tamano || evidenciaSeleccionada.archivoTamano}</p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg space-y-1">
                <span className="text-slate-500">Validador Institucional:</span>
                <p className="font-medium text-slate-900">{evidenciaSeleccionada.validador || evidenciaSeleccionada.validadoPor || "Comisión de Acreditación"}</p>
                <span className="text-slate-500">Fecha de Validación:</span>
                <p className="font-medium text-slate-900">{evidenciaSeleccionada.fechaValidacion || "24/07/2026"}</p>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2 text-amber-800">
                <Lock className="w-4 h-4 shrink-0" />
                <span>Documento bloqueado para modificaciones por cierre del período lectivo.</span>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  const id = evidenciaSeleccionada.id;
                  setEvidenciaSeleccionada(null);
                  onVerTrazabilidadEvidencia(id);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                Abrir Trazabilidad de Auditoría
              </button>
              <button
                onClick={() => setEvidenciaSeleccionada(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanHistoricoDetalleView;


