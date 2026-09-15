import React, { useState } from "react";
import { PeriodoResumenCierre } from "./types";
import {
  Calendar,
  Lock,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Archive,
  ArrowRight,
  ShieldAlert,
  Layers,
  RefreshCw,
  FileText,
  Info
} from "./icons";

interface CierrePeriodosViewProps {
  periodos: PeriodoResumenCierre[];
  onIniciarCierrePeriodo: (periodo: PeriodoResumenCierre) => void;
  onConsultarHistorico: (nombrePeriodo: string) => void;
  onRestablecerDemo?: () => void;
}

export const CierrePeriodosView: React.FC<CierrePeriodosViewProps> = ({
  periodos,
  onIniciarCierrePeriodo,
  onConsultarHistorico,
  onRestablecerDemo,
}) => {
  const [avisoSimulacionOpen, setAvisoSimulacionOpen] = useState(false);
  const [mostrarDiagnostico, setMostrarDiagnostico] = useState(true);

  const periodoActivo = periodos.find((p) => p.estado === "ACTIVO");
  const periodosCerrados = periodos.filter((p) => p.estado === "CERRADO");

  const nombreActivo = periodoActivo?.periodo || periodoActivo?.nombre || "Julio – Diciembre 2026";
  const planesActivoTotal = periodoActivo ? (periodoActivo.totalPlanes ?? periodoActivo.planesTotal) : 0;

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
          <Calendar className="w-7 h-7 text-[#0f2f56]" />
          Cierre de Períodos Académicos
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Gestión del ciclo de vida formal de los períodos lectivos de la FISEI y registro en modo solo lectura.
        </p>
      </div>

      {/* Regla Institucional: Sin Reapertura en Prototipo */}
      <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl flex items-start gap-3.5 text-xs text-amber-900">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-sm">
            Cierre de Período Académico (Modo Solo Lectura)
          </p>
          <p className="text-amber-800">
            Al ejecutar el cierre formal de un período lectivo, los planes de trabajo, matrices de actividades y archivos de evidencias pasan a <strong>registro histórico en modo solo lectura</strong>.
          </p>
          <p className="text-amber-700 font-medium">
            La reapertura de períodos no se representa en este prototipo debido a que el procedimiento institucional correspondiente aún no ha sido definido dentro de los requerimientos confirmados.
          </p>
        </div>
      </div>

      {/* SECCIÓN 1: PERÍODO VIGENTE EN CURSO O ESTADO SIMULADO */}
      {periodoActivo ? (
        <div className="bg-white border-2 border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-5 border-b border-slate-200">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-lg shrink-0 mt-1 sm:mt-0">
                <Clock className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-300">
                    PERÍODO EN CURSO
                  </span>
                  <span className="text-xs font-medium text-slate-500">
                    Fecha de finalización: <strong>31/12/2026</strong>
                  </span>
                  <span className="text-xs text-slate-400">
                    (Fecha del sistema: 07/09/2026)
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mt-1">
                  {nombreActivo}
                </h2>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => setMostrarDiagnostico((prev) => !prev)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors text-xs border border-slate-300"
              >
                <FileText className="w-4 h-4 text-slate-500" />
                {mostrarDiagnostico ? "Ocultar Diagnóstico" : "REVISAR ESTADO DOCUMENTAL"}
              </button>

              <button
                type="button"
                onClick={() => setAvisoSimulacionOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg shadow-sm transition-colors text-xs"
              >
                <Lock className="w-4 h-4" />
                PROBAR CIERRE — DEMO
              </button>
            </div>
          </div>

          {/* Información de coherencia temporal */}
          <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-2.5 text-xs text-slate-600">
            <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <p>
              El período <strong>Julio – Diciembre 2026</strong> se encuentra actualmente en ejecución ordinaria (finaliza el 31/12/2026). Las autoridades administrativas pueden consultar el estado documental cuantitativo o ejecutar una <strong>simulación interactiva del proceso de cierre</strong> para verificar el comportamiento del prototipo.
            </p>
          </div>

          {/* Resumen y Diagnóstico Pre-Cierre */}
          {mostrarDiagnostico && (
            <div className="mt-5 space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Estado Documental Cuantitativo del Período
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between text-slate-500 text-xs">
                    <span>Planes Institucionales</span>
                    <Layers className="w-4 h-4 text-slate-400" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900 mt-1">
                    {planesActivoTotal}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">En ejecución en FISEI</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between text-slate-500 text-xs">
                    <span>Evidencias Validadas</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div className="text-2xl font-bold text-emerald-600 mt-1">
                    {periodoActivo.evidenciasValidadas}{" "}
                    <span className="text-sm font-normal text-slate-500">/ {periodoActivo.evidenciasRequeridas}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Con verificación formal</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-amber-200 bg-amber-50/40">
                  <div className="flex items-center justify-between text-amber-700 text-xs font-semibold">
                    <span>Evidencias Observadas</span>
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                  </div>
                  <div className="text-2xl font-bold text-amber-600 mt-1">
                    {periodoActivo.evidenciasObservadas}
                  </div>
                  <p className="text-[11px] text-amber-700 mt-0.5">En proceso de corrección</p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between text-slate-500 text-xs">
                    <span>Evidencias Pendientes</span>
                    <Clock className="w-4 h-4 text-slate-500" />
                  </div>
                  <div className="text-2xl font-bold text-slate-700 mt-1">
                    {periodoActivo.evidenciasPendientes}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">Por dictaminar o subir</p>
                </div>
              </div>

              {(periodoActivo.evidenciasPendientes > 0 || periodoActivo.evidenciasObservadas > 0) && (
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-3 text-xs text-amber-800">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
                  <span>
                    <strong>Diagnóstico documental:</strong> Existen <strong>{periodoActivo.evidenciasPendientes} evidencias pendientes</strong> y <strong>{periodoActivo.evidenciasObservadas} observaciones activas</strong> dentro del período ordinario en curso.
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Tarjeta cuando el período ha sido cerrado en la simulación DEMO */
        <div className="bg-white border-2 border-purple-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-300">
                  Estado resultante simulado: CERRADO
                </span>
                <span className="text-xs text-slate-500">Escenario DEMO</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mt-1">
                Julio – Diciembre 2026 (Simulado CERRADO)
              </h2>
            </div>

            {onRestablecerDemo && (
              <button
                type="button"
                onClick={onRestablecerDemo}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-lg shadow transition-colors text-xs"
              >
                <RefreshCw className="w-4 h-4 text-emerald-400" />
                RESTABLECER DEMO
              </button>
            )}
          </div>

          <p className="text-xs text-slate-600">
            El período <strong>Julio – Diciembre 2026</strong> ha sido cambiado a estado <strong>CERRADO</strong> exclusivamente dentro de la simulación de demostración. Sus planes y evidencias se muestran en modo solo lectura en la Consulta Histórica.
          </p>

          <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg text-xs text-purple-900">
            <Info aria-hidden="true" className="w-3 h-3 inline mr-1"/> <strong>Restablecimiento de Demostración:</strong> El botón <em>RESTABLECER DEMO</em> sirve exclusivamente para reiniciar el escenario interactivo a su estado inicial en curso. No representa una reapertura institucional, dado que dicho procedimiento no forma parte de los requerimientos confirmados.
          </div>
        </div>
      )}

      {/* SECCIÓN 2: HISTORIAL DE PERÍODOS CONCLUIDOS */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Archive className="w-5 h-5 text-slate-500" />
              Historial de Períodos Concluidos
            </h2>
            <p className="text-xs text-slate-500">
              Períodos académicos concluidos en modo solo lectura
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            {periodosCerrados.length} períodos cerrados
          </span>
        </div>

        <div className="space-y-3">
          {periodosCerrados.map((p) => {
            const nombrePer = p.periodo || p.nombre;
            const planesTot = p.totalPlanes ?? p.planesTotal;
            const fechaCierre = p.fechaCierre || "25/07/2026";

            return (
              <div
                key={p.id || nombrePer}
                className="p-5 bg-slate-50 border border-slate-200 rounded-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-slate-900 text-base">
                      {nombrePer}
                    </h3>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700">
                      <Lock className="w-3 h-3" />
                      CERRADO
                    </span>
                    <span className="text-xs text-slate-500">
                      {fechaCierre.includes("Simulación") ? fechaCierre : `Cerrado el ${fechaCierre}`}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-0.5">
                    <span>{planesTot} planes en registro histórico</span>
                    <span>·</span>
                    <span className="text-emerald-700 font-medium">
                      {p.evidenciasValidadas} de {p.evidenciasRequeridas} evidencias validadas
                    </span>
                    <span>·</span>
                    <span className="text-slate-500">
                      Decisión institucional DEMO
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onConsultarHistorico(nombrePer)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#0f2f56] hover:bg-[#1a4070] text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
                  >
                    <Archive className="w-3.5 h-3.5" />
                    Consultar Planes Históricos
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL / DIÁLOGO DE AVISO PREVIO A LA SIMULACIÓN */}
      {avisoSimulacionOpen && periodoActivo && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(2px)",
            zIndex: 1290,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
            fontFamily: "'DM Sans', sans-serif",
          }}
          onClick={() => setAvisoSimulacionOpen(false)}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: 12,
              width: 480,
              maxWidth: "100%",
              boxShadow: "0 25px 60px rgba(0,0,0,0.3)",
              border: "1px solid #e2e8f0",
              overflow: "hidden",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                padding: "18px 24px",
                borderBottom: "1px solid #fde68a",
                background: "#fffbeb",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: "#fef3c7",
                    color: "#b45309",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                  }}
                >
                  <Info aria-hidden="true" className="w-4 h-4"/>
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: "#92400e", margin: 0 }}>
                  Aviso de Simulación de Cierre
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setAvisoSimulacionOpen(false)}
                style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer", color: "#92400e" }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: "20px 24px" }}>
              <p style={{ fontSize: 13.5, color: "#334155", lineHeight: 1.6, margin: "0 0 14px" }}>
                El período <strong>Julio – Diciembre 2026</strong> aún se encuentra en curso. Su fecha de finalización es el <strong>31/12/2026</strong>.
              </p>
              <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.6, margin: 0 }}>
                La siguiente interacción corresponde únicamente a una simulación del proceso de cierre para efectos del prototipo.
              </p>
            </div>

            <div
              style={{
                padding: "14px 24px",
                borderTop: "1px solid #e2e8f0",
                background: "#f8fafc",
                display: "flex",
                justifyContent: "flex-end",
                gap: 10,
              }}
            >
              <button
                type="button"
                onClick={() => setAvisoSimulacionOpen(false)}
                style={{
                  padding: "8px 16px",
                  borderRadius: 6,
                  border: "1px solid #cbd5e1",
                  background: "#ffffff",
                  color: "#475569",
                  fontSize: 12.5,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  setAvisoSimulacionOpen(false);
                  onIniciarCierrePeriodo(periodoActivo);
                }}
                style={{
                  padding: "8px 18px",
                  borderRadius: 6,
                  border: "none",
                  background: "#b45309",
                  color: "#ffffff",
                  fontSize: 12.5,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                CONTINUAR CON SIMULACIÓN
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CierrePeriodosView;

