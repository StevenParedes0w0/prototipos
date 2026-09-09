import React, { useState, useMemo } from "react";
import { PlanHistorico, PeriodoResumenCierre } from "./types";
import {
  Search,
  Filter,
  Calendar,
  Archive,
  ArrowLeft,
  FileText,
  GitBranch,
  CheckCircle2,
  Lock,
  ChevronRight,
  Info
} from "./icons";

interface ConsultaHistoricaViewProps {
  planesHistoricos: PlanHistorico[];
  periodos: PeriodoResumenCierre[];
  onSeleccionarPlan: (plan: PlanHistorico) => void;
  onGenerarReporte: (plan: PlanHistorico) => void;
  onVolver?: () => void;
}

export const ConsultaHistoricaView: React.FC<ConsultaHistoricaViewProps> = ({
  planesHistoricos,
  periodos,
  onSeleccionarPlan,
  onGenerarReporte,
  onVolver,
}) => {
  const [periodoFiltro, setPeriodoFiltro] = useState<string>("TODOS");
  const [busqueda, setBusqueda] = useState<string>("");

  // Periodos cerrados
  const periodosCerrados = useMemo(() => {
    return periodos.filter((p) => p.estado === "CERRADO");
  }, [periodos]);

  const normPer = (s: string) => (s ? s.replace(/[-–—]/g, "-").trim().toLowerCase() : "");

  // Filtrar planes históricos
  const planesFiltrados = useMemo(() => {
    return planesHistoricos.filter((p) => {
      const cumplePeriodo =
        periodoFiltro === "TODOS" ||
        p.periodo === periodoFiltro ||
        normPer(p.periodo) === normPer(periodoFiltro);
      const q = busqueda.toLowerCase().trim();
      const codigo = (p.codigo || p.id).toLowerCase();
      const grupo = (p.nombreGrupo || p.grupo).toLowerCase();
      const docente = (p.docenteNombre || p.docente).toLowerCase();
      const planNombre = (p.planNombre || "").toLowerCase();
      const cumpleBusqueda =
        !q ||
        codigo.includes(q) ||
        grupo.includes(q) ||
        docente.includes(q) ||
        planNombre.includes(q);

      return cumplePeriodo && cumpleBusqueda;
    });
  }, [planesHistoricos, periodoFiltro, busqueda]);

  return (
    <div className="space-y-6">
      {/* Cabecera de Consulta Histórica */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          {onVolver && (
            <button
              onClick={onVolver}
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver a Reportes del Período Actual
            </button>
          )}
          <h1 className="text-2xl font-bold text-[#0f2f56] flex items-center gap-2.5">
            <Archive className="w-7 h-7 text-amber-600" />
            Consulta Histórica de Períodos Anteriores
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Auditoría y consulta en modo solo lectura de planes, versiones y evidencias de períodos académicos concluidos.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-amber-50 border border-amber-300 rounded-lg text-amber-800 text-xs font-semibold w-fit">
          <Lock className="w-4 h-4 text-amber-600" />
          Registro Histórico / Modo Solo Lectura
        </div>
      </div>

      {/* Banner Explicativo — Estilo institucional claro */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3 text-xs text-blue-900">
        <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p>
            <strong>Criterio de registro histórico:</strong> Los períodos concluidos mantienen el estado final de los planes de trabajo y sus evidencias en modo solo lectura.
          </p>
          <p className="text-blue-700">
            Se permite comparar versiones formales (v1.0 inicial vs v2.0 con actualización formal), revisar la trazabilidad institucional y generar extractos documentales.
          </p>
        </div>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="bg-white border border-[#DCE4EC] rounded-xl p-4 shadow-sm flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por código, grupo de trabajo o docente..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0f2f56]"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={periodoFiltro}
            onChange={(e) => setPeriodoFiltro(e.target.value)}
            className="py-2 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0f2f56]"
          >
            <option value="TODOS">Todos los períodos cerrados</option>
            {periodosCerrados.map((per) => {
              const perNombre = per.periodo || per.nombre;
              return (
                <option key={per.id || perNombre} value={perNombre}>
                  {perNombre} (Cerrado {per.fechaCierre || "25/07/2026"})
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Tabla de Planes Históricos */}
      <div className="bg-white border border-[#DCE4EC] rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Planes Históricos Registrados ({planesFiltrados.length})
            </span>
          </div>
        </div>

        {planesFiltrados.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Archive className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="font-medium text-slate-700">
              No se encontraron planes para los filtros seleccionados
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Pruebe cambiando el período o el término de búsqueda
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#F4F7FA] border-b border-slate-200 text-xs text-slate-600 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4 min-w-[140px]">Código / Período</th>
                  <th className="py-3 px-4 min-w-[200px]">Grupo de Trabajo</th>
                  <th className="py-3 px-4 min-w-[180px]">Docente Responsable</th>
                  <th className="py-3 px-4 text-center">Versión Final</th>
                  <th className="py-3 px-4 text-center">Evidencias</th>
                  <th className="py-3 px-4 text-center">Estado Final</th>
                  <th className="py-3 px-4 text-right min-w-[180px]">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {planesFiltrados.map((p) => {
                  const codigo = p.codigo || p.id;
                  const nombreGrupo = p.nombreGrupo || p.grupo;
                  const docenteNombre = p.docenteNombre || p.docente;
                  const versionFinal = p.versionFinal || p.versionVigente;
                  const totalActividades = p.totalActividades ?? p.actividadesTotal;
                  const fechaCierre = p.fechaCierre || "25/07/2026";

                  return (
                    <tr
                      key={p.id}
                      className="hover:bg-[#F4F7FA] transition-colors"
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-semibold text-[#0f2f56] text-xs">
                          {codigo}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                          <Calendar className="w-3 h-3" />
                          <span>{p.periodo}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">
                          {nombreGrupo}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {totalActividades} actividades planificadas
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-800">
                          {docenteNombre}
                        </div>
                        <span className="text-[11px] text-slate-400">
                          Cierre: {fechaCierre}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-full text-xs font-mono font-semibold">
                          <GitBranch className="w-3 h-3" />
                          v{versionFinal}
                        </span>
                        {p.versiones.length > 1 && (
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            {p.versiones.length} versiones
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {p.evidenciasValidadas} de {p.evidenciasRequeridas} evidencias validadas
                        </span>
                        <div className="text-[10px] text-slate-400">
                          Total verificado
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-semibold border border-slate-300">
                          <Lock className="w-3 h-3 text-slate-500" />
                          CERRADO
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => onGenerarReporte(p)}
                            className="p-1.5 text-slate-600 hover:text-slate-900 rounded hover:bg-slate-100 transition-colors"
                            title="Generar Resumen DEMO"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onSeleccionarPlan(p)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#0f2f56] hover:bg-[#1a4070] text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
                          >
                            Ver Histórico
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
        )}
      </div>
    </div>
  );
};

export default ConsultaHistoricaView;

