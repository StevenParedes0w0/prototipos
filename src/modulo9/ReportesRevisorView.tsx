import React from "react";
import { ReportePlanItem } from "./types";
import {
  ShieldCheck,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Clock,
  FileText,
  ChevronRight,
  History,
  Info
} from "./icons";

interface ReportesRevisorViewProps {
  planes: ReportePlanItem[];
  onSeleccionarPlan: (plan: ReportePlanItem) => void;
  onGenerarReporte: (plan: ReportePlanItem) => void;
  onIrAConsultaHistorica: () => void;
}

export const ReportesRevisorView: React.FC<ReportesRevisorViewProps> = ({
  planes,
  onSeleccionarPlan,
  onGenerarReporte,
  onIrAConsultaHistorica,
}) => {
  // Conteo métricas revisor
  const totalPlanes = planes.length;
  const totalActividades = planes.reduce((acc, p) => acc + (p.totalActividades ?? p.actividadesTotal ?? 0), 0);
  const totalRequeridas = planes.reduce((acc, p) => acc + p.evidenciasRequeridas, 0);
  const totalValidadas = planes.reduce((acc, p) => acc + p.evidenciasValidadas, 0);
  const totalObservadas = planes.reduce((acc, p) => acc + p.evidenciasObservadas, 0);
  const totalPendientes = planes.reduce((acc, p) => acc + p.evidenciasPendientes, 0);

  return (
    <div className="space-y-6">
      {/* Cabecera Revisor */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0f2f56] flex items-center gap-2.5">
            <ShieldCheck className="w-7 h-7 text-[#1a4f8a]" />
            Reportes de Seguimiento y Validación
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Supervisión cuantitativa del estado documental para grupos de trabajo y comisiones asignadas.
          </p>
        </div>

        <button
          onClick={onIrAConsultaHistorica}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-sm font-medium transition-colors w-fit shadow-sm"
        >
          <History className="w-4 h-4 text-slate-500" />
          Histórico de Períodos
        </button>
      </div>

      {/* Aviso de Alcance de Revisión */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start sm:items-center gap-3 text-xs text-blue-900">
        <Info className="w-4 h-4 shrink-0 text-blue-600" />
        <span>
          <strong>Alcance de Revisión:</strong> Se muestran los planes asignados formalmente para control de evidencias y verificación del estado documental reglamentario.
        </span>
      </div>

      {/* Tarjetas Cuantitativas del Revisor */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-[#DCE4EC] rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Planes Asignados</span>
            <Layers className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-[#16263D]">
            {totalPlanes}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Grupos bajo supervisión</p>
        </div>

        <div className="bg-white border border-[#DCE4EC] rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Evidencias Validadas</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-600">
            {totalValidadas}{" "}
            <span className="text-xs font-normal text-slate-500">/ {totalRequeridas}</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Conformidad aprobada</p>
        </div>

        <div className="bg-white border border-[#DCE4EC] rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Observadas</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600">
            {totalObservadas}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Pendientes de corrección</p>
        </div>

        <div className="bg-white border border-[#DCE4EC] rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Por Validar</span>
            <Clock className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-2xl font-bold text-slate-700">
            {totalPendientes}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Cargadas por revisar</p>
        </div>
      </div>

      {/* Tabla de Planes del Revisor */}
      <div className="bg-white border border-[#DCE4EC] rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-[#0f2f56]">
            Planes Asignados a la Comisión Revisor
          </h2>
          <span className="text-xs text-slate-500">
            Período Julio – Diciembre 2026
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F4F7FA] border-b border-slate-200 text-xs text-slate-600 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4 min-w-[220px]">Plan de Trabajo</th>
                <th className="py-3 px-4 min-w-[180px]">Docente Responsable</th>
                <th className="py-3 px-4 text-center">Actividades</th>
                <th className="py-3 px-4 text-center">Evidencias (Val/Req)</th>
                <th className="py-3 px-4 text-center">Estado</th>
                <th className="py-3 px-4 text-right min-w-[160px]">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {planes.map((plan) => {
                const nombreGrupo = plan.nombreGrupo || plan.grupo;
                const docenteNombre = plan.docenteNombre || plan.docente;
                const actTotal = plan.totalActividades ?? plan.actividadesTotal;

                return (
                  <tr key={plan.id} className="hover:bg-[#F4F7FA] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">
                        Plan de Trabajo — {nombreGrupo}
                      </div>
                      <span className="text-[11px] text-slate-400">
                        Versión {plan.version}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">
                      {docenteNombre}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2 py-1 bg-slate-100 rounded font-mono text-xs text-slate-700">
                        {actTotal}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-emerald-600">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {plan.evidenciasValidadas} / {plan.evidenciasRequeridas}
                      </div>
                      {plan.evidenciasObservadas > 0 && (
                        <span className="text-[10px] text-amber-600 font-medium">
                          ({plan.evidenciasObservadas} observada)
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                          plan.estado === "APROBADO" || plan.estado === "FINALIZADO"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : plan.estado === "EN EJECUCIÓN"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-blue-50 text-blue-700 border-blue-200"
                        }`}
                      >
                        {plan.estado}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => onGenerarReporte(plan)}
                          className="p-1.5 text-slate-600 hover:text-slate-900 rounded hover:bg-slate-100 transition-colors"
                          title="Generar Reporte de Seguimiento"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onSeleccionarPlan(plan)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#0f2f56] hover:bg-[#1a4070] text-white rounded-lg text-xs font-medium transition-colors"
                        >
                          Ver Detalle
                          <ChevronRight className="w-3.5 h-3.5" />
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
    </div>
  );
};

export default ReportesRevisorView;

