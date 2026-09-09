import React from "react";
import { ReportePlanItem } from "./types";
import {
  FileText,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Clock,
  History,
  ChevronRight,
  ExternalLink,
  Calendar,
  Sparkles,
  FileCheck
} from "./icons";

interface ReportesDocenteViewProps {
  planes: ReportePlanItem[];
  onSeleccionarPlan: (plan: ReportePlanItem) => void;
  onGenerarReporte: (plan: ReportePlanItem) => void;
  onIrAConsultaHistorica: () => void;
  onVerEvidencias?: (planId: string) => void;
}

export const ReportesDocenteView: React.FC<ReportesDocenteViewProps> = ({
  planes,
  onSeleccionarPlan,
  onGenerarReporte,
  onIrAConsultaHistorica,
  onVerEvidencias,
}) => {
  // Conteo total de métricas docentes cuantitativas
  const totalPlanes = planes.length;
  const totalActividades = planes.reduce((acc, p) => acc + (p.totalActividades ?? p.actividadesTotal ?? 0), 0);
  const totalRequeridas = planes.reduce((acc, p) => acc + p.evidenciasRequeridas, 0);
  const totalCargadas = planes.reduce((acc, p) => acc + p.evidenciasCargadas, 0);
  const totalValidadas = planes.reduce((acc, p) => acc + p.evidenciasValidadas, 0);
  const totalObservadas = planes.reduce((acc, p) => acc + p.evidenciasObservadas, 0);
  const totalPendientes = planes.reduce((acc, p) => acc + p.evidenciasPendientes, 0);

  return (
    <div className="space-y-6">
      {/* Cabecera Principal */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0f2f56] flex items-center gap-2.5">
            <FileText className="w-7 h-7 text-[#1a4f8a]" />
            Mis Reportes de Gestión Docente
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Seguimiento cuantitativo del cumplimiento de actividades y medios de verificación requeridos.
          </p>
        </div>

        <button
          onClick={onIrAConsultaHistorica}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-sm font-medium transition-colors w-fit shadow-sm"
        >
          <History className="w-4 h-4 text-slate-500" />
          Consulta Histórica de Períodos
        </button>
      </div>

      {/* Tarjetas Cuantitativas de Seguimiento */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-white border border-[#DCE4EC] rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Planes</span>
            <Layers className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-[#16263D]">
            {totalPlanes}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Asignados en el período</p>
        </div>

        <div className="bg-white border border-[#DCE4EC] rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Actividades</span>
            <Sparkles className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-[#16263D]">
            {totalActividades}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Planificadas en total</p>
        </div>

        <div className="bg-white border border-[#DCE4EC] rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Cargadas</span>
            <FileCheck className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-blue-600">
            {totalCargadas}{" "}
            <span className="text-xs font-normal text-slate-500">/ {totalRequeridas}</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Evidencias en sistema</p>
        </div>

        <div className="bg-white border border-[#DCE4EC] rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Validadas</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600">
            {totalValidadas}{" "}
            <span className="text-xs font-normal text-slate-500">/ {totalRequeridas}</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Aprobadas formalmente</p>
        </div>

        <div className="bg-white border border-[#DCE4EC] rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Observadas</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600">
            {totalObservadas}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Requieren corrección</p>
        </div>

        <div className="bg-white border border-[#DCE4EC] rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Pendientes</span>
            <Clock className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-2xl font-bold text-slate-600">
            {totalPendientes}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Por cargar o revisar</p>
        </div>
      </div>

      {/* Lista de Planes de Trabajo Actuales */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#0f2f56]">
            Planes del Período Académico Actual (Julio – Diciembre 2026)
          </h2>
          <span className="text-xs text-slate-500">
            Mostrando {planes.length} plan{planes.length > 1 ? "es" : ""}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {planes.map((plan) => {
            const codigo = plan.codigo || plan.id;
            const nombreGrupo = plan.nombreGrupo || plan.grupo;
            const actTotal = plan.totalActividades ?? plan.actividadesTotal;

            return (
              <div
                key={plan.id}
                className="bg-white border border-[#DCE4EC] rounded-xl p-6 shadow-sm hover:border-slate-300 hover:shadow-md transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded">
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
                      <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded">
                        Versión {plan.version}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-[#0f2f56]">
                      {nombreGrupo}
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {plan.periodo}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5" />
                        {actTotal} actividades
                      </span>
                      <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {plan.evidenciasValidadas} de {plan.evidenciasRequeridas} validadas
                      </span>
                      {plan.evidenciasObservadas > 0 && (
                        <span className="flex items-center gap-1.5 text-amber-600 font-medium">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          {plan.evidenciasObservadas} observada
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Acciones de la Tarjeta */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                    <button
                      onClick={() => onGenerarReporte(plan)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors border border-slate-200"
                    >
                      <FileText className="w-3.5 h-3.5 text-slate-500" />
                      Generar Reporte
                    </button>

                    {onVerEvidencias && (
                      <button
                        onClick={() => onVerEvidencias(plan.id)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                        Evidencias
                      </button>
                    )}

                    <button
                      onClick={() => onSeleccionarPlan(plan)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0f2f56] hover:bg-[#1a4070] text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
                    >
                      Ver Detalle de Plan
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ReportesDocenteView;

