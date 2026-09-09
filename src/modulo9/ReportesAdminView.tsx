import React, { useState, useMemo } from "react";
import { ReportePlanItem, PeriodoResumenCierre } from "./types";
import {
  FileText,
  Search,
  Layers,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ChevronRight,
  History,
  Calendar,
  Building2,
  ShieldCheck,
  FileSpreadsheet
} from "./icons";

interface ReportesAdminViewProps {
  planes: ReportePlanItem[];
  periodos: PeriodoResumenCierre[];
  onSeleccionarPlan: (plan: ReportePlanItem) => void;
  onGenerarReporte: (plan: ReportePlanItem) => void;
  onGenerarReporteConsolidado: () => void;
  onIrAConsultaHistorica: () => void;
  onIrACierrePeriodos: () => void;
}

export const ReportesAdminView: React.FC<ReportesAdminViewProps> = ({
  planes,
  periodos,
  onSeleccionarPlan,
  onGenerarReporte,
  onGenerarReporteConsolidado,
  onIrAConsultaHistorica,
  onIrACierrePeriodos,
}) => {
  const [filtroGrupo, setFiltroGrupo] = useState<string>("TODOS");
  const [filtroDocente, setFiltroDocente] = useState<string>("TODOS");
  const [filtroEstado, setFiltroEstado] = useState<string>("TODOS");
  const [busqueda, setBusqueda] = useState<string>("");

  // Grupos únicos para dropdown
  const gruposUnicos = useMemo(() => {
    const set = new Set(planes.map((p) => p.nombreGrupo || p.grupo));
    return Array.from(set);
  }, [planes]);

  // Docentes únicos para dropdown
  const docentesUnicos = useMemo(() => {
    const set = new Set(planes.map((p) => p.docenteNombre || p.docente));
    return Array.from(set);
  }, [planes]);

  // Filtrado reactivo
  const planesFiltrados = useMemo(() => {
    return planes.filter((p) => {
      const grupo = p.nombreGrupo || p.grupo;
      const docente = p.docenteNombre || p.docente;
      const codigo = p.codigo || p.id;

      const cumpleGrupo = filtroGrupo === "TODOS" || grupo === filtroGrupo;
      const cumpleDocente = filtroDocente === "TODOS" || docente === filtroDocente;
      const cumpleEstado = filtroEstado === "TODOS" || p.estado === filtroEstado;
      const q = busqueda.toLowerCase().trim();
      const cumpleBusqueda =
        !q ||
        codigo.toLowerCase().includes(q) ||
        grupo.toLowerCase().includes(q) ||
        docente.toLowerCase().includes(q);

      return cumpleGrupo && cumpleDocente && cumpleEstado && cumpleBusqueda;
    });
  }, [planes, filtroGrupo, filtroDocente, filtroEstado, busqueda]);

  // Métricas agregadas
  const totalPlanes = planesFiltrados.length;
  const totalActividades = planesFiltrados.reduce((acc, p) => acc + (p.totalActividades ?? p.actividadesTotal ?? 0), 0);
  const totalRequeridas = planesFiltrados.reduce((acc, p) => acc + p.evidenciasRequeridas, 0);
  const totalCargadas = planesFiltrados.reduce((acc, p) => acc + p.evidenciasCargadas, 0);
  const totalValidadas = planesFiltrados.reduce((acc, p) => acc + p.evidenciasValidadas, 0);
  const totalObservadas = planesFiltrados.reduce((acc, p) => acc + p.evidenciasObservadas, 0);
  const totalPendientes = planesFiltrados.reduce((acc, p) => acc + p.evidenciasPendientes, 0);

  return (
    <div className="space-y-6">
      {/* Cabecera Admin */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0f2f56] flex items-center gap-2.5">
            <Building2 className="w-7 h-7 text-[#1a4f8a]" />
            Reportes Institucionales y Consolidados
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Panel consolidado institucional para la gestión administrativa de FISEI.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onIrACierrePeriodos}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-amber-50 text-amber-800 border border-amber-300 rounded-lg text-xs font-semibold hover:bg-amber-100 transition-colors shadow-sm"
          >
            <Calendar className="w-4 h-4 text-amber-600" />
            Cierre de Períodos
          </button>
          <button
            onClick={onIrAConsultaHistorica}
            className="inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold transition-colors shadow-sm"
          >
            <History className="w-4 h-4 text-slate-500" />
            Consulta Histórica
          </button>
          <button
            onClick={onGenerarReporteConsolidado}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#0f2f56] hover:bg-[#1a4070] text-white rounded-lg text-xs font-semibold transition-colors shadow-sm"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Generar Consolidado Institucional
          </button>
        </div>
      </div>

      {/* Métricas Cuantitativas Generales */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-white border border-[#DCE4EC] rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Total Planes</span>
            <Layers className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-[#16263D]">
            {totalPlanes}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Planes institucionales</p>
        </div>

        <div className="bg-white border border-[#DCE4EC] rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Actividades</span>
            <FileText className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-[#16263D]">
            {totalActividades}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Planificadas en FISEI</p>
        </div>

        <div className="bg-white border border-[#DCE4EC] rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Cargadas</span>
            <ShieldCheck className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-blue-600">
            {totalCargadas}{" "}
            <span className="text-xs font-normal text-slate-500">/ {totalRequeridas}</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Evidencias cargadas</p>
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
          <p className="text-[11px] text-slate-500 mt-0.5">Validadas por revisores</p>
        </div>

        <div className="bg-white border border-[#DCE4EC] rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Observadas</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600">
            {totalObservadas}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Observaciones activas</p>
        </div>

        <div className="bg-white border border-[#DCE4EC] rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider">Pendientes</span>
            <Clock className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-2xl font-bold text-slate-600">
            {totalPendientes}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Por dictaminar/cargar</p>
        </div>
      </div>

      {/* Barra de Filtros */}
      <div className="bg-white border border-[#DCE4EC] rounded-xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por código, grupo o docente..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0f2f56]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <select
              value={filtroGrupo}
              onChange={(e) => setFiltroGrupo(e.target.value)}
              className="py-2 px-3 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0f2f56]"
            >
              <option value="TODOS">Todos los Grupos</option>
              {gruposUnicos.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>

            <select
              value={filtroDocente}
              onChange={(e) => setFiltroDocente(e.target.value)}
              className="py-2 px-3 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0f2f56]"
            >
              <option value="TODOS">Todos los Docentes</option>
              {docentesUnicos.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="py-2 px-3 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0f2f56]"
            >
              <option value="TODOS">Todos los Estados</option>
              <option value="EN EJECUCIÓN">EN EJECUCIÓN</option>
              <option value="EN REVISIÓN">EN REVISIÓN</option>
              <option value="EN CORRECCIÓN">EN CORRECCIÓN</option>
              <option value="APROBADO">APROBADO</option>
              <option value="FINALIZADO">FINALIZADO</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla Consolidada */}
      <div className="bg-white border border-[#DCE4EC] rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-[#0f2f56] text-sm sm:text-base">
              Consolidado Institucional de Planes de Trabajo
            </h2>
            <p className="text-xs text-slate-500">
              Período Lectivo Julio – Diciembre 2026 (Activo)
            </p>
          </div>
          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            {planesFiltrados.length} registros
          </span>
        </div>

        {planesFiltrados.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Layers className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="font-medium text-slate-700">
              No se encontraron planes con los filtros aplicados
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#F4F7FA] border-b border-slate-200 text-xs text-slate-600 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4 min-w-[220px]">Plan de Trabajo</th>
                  <th className="py-3 px-4 min-w-[170px]">Docente Responsable</th>
                  <th className="py-3 px-4 text-center">Actividades</th>
                  <th className="py-3 px-4 text-center">Evidencias Cargadas</th>
                  <th className="py-3 px-4 text-center">Evidencias Validadas</th>
                  <th className="py-3 px-4 text-center">Estado</th>
                  <th className="py-3 px-4 text-right min-w-[160px]">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {planesFiltrados.map((p) => {
                  const nombreGrupo = p.nombreGrupo || p.grupo;
                  const docenteNombre = p.docenteNombre || p.docente;
                  const actTotal = p.totalActividades ?? p.actividadesTotal;
                  const fechaMod = p.fechaModificacion || p.fechaElaboracion || "07/09/2026";

                  return (
                    <tr key={p.id} className="hover:bg-[#F4F7FA] transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900">
                          Plan de Trabajo — {nombreGrupo}
                        </div>
                        <span className="text-[11px] text-slate-400">
                          v{p.version} · Modif. {fechaMod}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-medium text-slate-800 text-xs">
                        {docenteNombre}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span className="px-2 py-1 bg-slate-100 rounded font-mono text-xs text-slate-700">
                          {actTotal}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span className="text-xs font-medium text-blue-700">
                          {p.evidenciasCargadas} / {p.evidenciasRequeridas}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-emerald-600">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {p.evidenciasValidadas} / {p.evidenciasRequeridas}
                        </div>
                        {p.evidenciasObservadas > 0 && (
                          <span className="text-[10px] text-amber-600 font-medium">
                            ({p.evidenciasObservadas} obs.)
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                            p.estado === "APROBADO" || p.estado === "FINALIZADO"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : p.estado === "EN REVISIÓN"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : p.estado === "EN CORRECCIÓN" || p.estado === "DEVUELTO"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : p.estado === "EN EJECUCIÓN"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : "bg-purple-50 text-purple-700 border-purple-200"
                          }`}
                        >
                          {p.estado}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => onGenerarReporte(p)}
                            className="p-1.5 text-slate-600 hover:text-slate-900 rounded hover:bg-slate-100 transition-colors"
                            title="Generar Reporte Individual"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onSeleccionarPlan(p)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#0f2f56] hover:bg-[#1a4070] text-white rounded-lg text-xs font-medium transition-colors"
                          >
                            Ver Resumen
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

export default ReportesAdminView;

