import React from "react";
import { ReportePlanItem } from "./types";
import {
  ArrowLeft,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  ShieldCheck,
  Calendar,
  User,
  Users,
  Layers,
  FileCheck,
  Info
} from "./icons";

interface ReporteDetallePlanViewProps {
  plan: ReportePlanItem;
  onVolver: () => void;
  onGenerarReporte: (plan: ReportePlanItem) => void;
  onVerEvidencias?: (planId: string) => void;
}

export const ReporteDetallePlanView: React.FC<ReporteDetallePlanViewProps> = ({
  plan,
  onVolver,
  onGenerarReporte,
  onVerEvidencias,
}) => {
  const codigo = plan.codigo || "PLAN-2026-TIT";
  const nombreGrupo = plan.nombreGrupo || plan.grupo;
  const docenteNombre = plan.docenteNombre || plan.docente;
  const totalActividades = plan.totalActividades ?? plan.actividadesTotal;
  const fechaModificacion = plan.fechaModificacion || plan.fechaElaboracion || "07/09/2026";
  const actividades = plan.actividades || [];

  return (
    <div className="space-y-6">
      {/* Botón Volver y Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <button
          onClick={onVolver}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a la lista de reportes
        </button>

        <button
          onClick={() => onGenerarReporte(plan)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0f2f56] hover:bg-[#1a4070] text-white font-semibold rounded-lg shadow-sm transition-colors text-sm"
        >
          <FileText className="w-4 h-4" />
          Generar Reporte Institucional
        </button>
      </div>

      {/* Tarjeta Informativa Principal */}
      <div className="bg-white border border-[#DCE4EC] rounded-xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-sm font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded">
                {codigo}
              </span>
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                  plan.estado === "APROBADO" || plan.estado === "FINALIZADO"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : plan.estado === "EN REVISIÓN"
                    ? "bg-blue-50 text-blue-700 border-blue-200"
                    : plan.estado === "EN CORRECCIÓN" || plan.estado === "DEVUELTO"
                    ? "bg-amber-50 text-amber-700 border-amber-200"
                    : plan.estado === "EN EJECUCIÓN"
                    ? "bg-blue-50 text-blue-700 border-blue-200"
                    : "bg-purple-50 text-purple-700 border-purple-200"
                }`}
              >
                {plan.estado}
              </span>
              <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                Versión {plan.version}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-[#0f2f56] mt-2">
              {nombreGrupo}
            </h1>
          </div>

          {onVerEvidencias && (
            <button
              onClick={() => onVerEvidencias(plan.id)}
              className="inline-flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-medium rounded-lg transition-colors w-fit"
            >
              <ExternalLink className="w-4 h-4" />
              Gestionar Evidencias en Módulo
            </button>
          )}
        </div>

        {/* Metadatos en Grid */}
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
              <p className="text-xs text-slate-500">Grupo de Trabajo</p>
              <p className="font-medium text-slate-900">{nombreGrupo}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ShieldCheck className="w-4 h-4 text-slate-400" />
            <div>
              <p className="text-xs text-slate-500">Última Actualización</p>
              <p className="font-medium text-slate-900">{fechaModificacion}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Resumen Cuantitativo: Métricas Numéricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white border border-[#DCE4EC] rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider">Actividades</span>
            <Layers className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-[#16263D]">
            {totalActividades}
          </div>
          <p className="text-xs text-slate-500 mt-1">Planificadas en el período</p>
        </div>

        <div className="bg-white border border-[#DCE4EC] rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider">Cargadas</span>
            <FileCheck className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-blue-600">
            {plan.evidenciasCargadas}{" "}
            <span className="text-sm font-normal text-slate-500">/ {plan.evidenciasRequeridas}</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Evidencias subidas al sistema</p>
        </div>

        <div className="bg-white border border-[#DCE4EC] rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider">Validadas</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600">
            {plan.evidenciasValidadas}{" "}
            <span className="text-sm font-normal text-slate-500">/ {plan.evidenciasRequeridas}</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Aprobadas formalmente</p>
        </div>

        <div className="bg-white border border-[#DCE4EC] rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider">Observadas</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600">
            {plan.evidenciasObservadas}
          </div>
          <p className="text-xs text-slate-500 mt-1">Requieren corrección</p>
        </div>

        <div className="bg-white border border-[#DCE4EC] rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-medium uppercase tracking-wider">Pendientes</span>
            <Clock className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-2xl font-bold text-slate-600">
            {plan.evidenciasPendientes}
          </div>
          <p className="text-xs text-slate-500 mt-1">Por cargar o revisar</p>
        </div>
      </div>

      {/* Nota de criterios */}
      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3 text-xs text-blue-800">
        <Info className="w-4 h-4 shrink-0 text-blue-600" />
        <span>
          <strong>Criterio de seguimiento institucional:</strong> Los datos cuantitativos representan conteos concretos de actividades y medios de verificación requeridos según la planificación formal aprobada.
        </span>
      </div>

      {/* Tabla Detallada de Actividades */}
      <div className="bg-white border border-[#DCE4EC] rounded-xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-[#0f2f56]">
              Desglose de Actividades y Medios de Verificación
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Estado de validación por cada actividad planificada
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F4F7FA] border-b border-slate-200 text-xs text-slate-600 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4 w-12 text-center">N°</th>
                <th className="py-3 px-4 min-w-[200px]">Nombre de Actividad</th>
                <th className="py-3 px-4 min-w-[180px]">Criterio / Resultado</th>
                <th className="py-3 px-4 text-center">Evidencias Requeridas</th>
                <th className="py-3 px-4 text-center">Estado Validación</th>
                <th className="py-3 px-4 min-w-[200px]">Observaciones del Revisor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {actividades.map((act, idx) => {
                const numero = act.numero ?? (idx + 1);
                const criterio = act.criterio || act.categoria;
                const req = act.evidenciasRequeridas ?? act.mediosTotal;
                const estadoVal =
                  act.estadoValidacion ||
                  (act.estadoDocumental === "EVIDENCIA VALIDADA"
                    ? "VALIDADA"
                    : act.estadoDocumental === "OBSERVADA"
                    ? "OBSERVADA"
                    : "PENDIENTE");

                return (
                  <tr key={act.id} className="hover:bg-[#F4F7FA] transition-colors">
                    <td className="py-3.5 px-4 text-center font-mono text-xs text-slate-500 font-semibold">
                      {numero}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-900">
                      {act.nombre}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-600">
                      {criterio}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center px-2 py-1 rounded bg-slate-100 text-xs font-mono font-medium text-slate-700">
                        {req} doc{req > 1 ? "s" : ""}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          estadoVal === "VALIDADA"
                            ? "bg-emerald-50 text-emerald-700"
                            : estadoVal === "OBSERVADA"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {estadoVal === "VALIDADA" && (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        )}
                        {estadoVal === "OBSERVADA" && (
                          <AlertTriangle className="w-3.5 h-3.5" />
                        )}
                        {estadoVal === "PENDIENTE" && (
                          <Clock className="w-3.5 h-3.5" />
                        )}
                        {estadoVal}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs">
                      {act.observaciones ? (
                        <span className="text-amber-700 bg-amber-50 p-1.5 rounded block border border-amber-200">
                          {act.observaciones}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Sin observaciones</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReporteDetallePlanView;

