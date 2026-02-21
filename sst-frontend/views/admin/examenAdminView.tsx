"use client";

import { useState, useEffect } from "react";
import LayoutComponent from "@/components/layoutComponent";
import {
  ClipboardList,
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  ChevronDown,
  Settings,
  CheckCircle2,
  BookOpen,
  Search,
  Loader2,
} from "lucide-react";
import { useExamenAdminContext } from "@/context/ExamenAdminContext";
import type { Opcion, PreguntaExamen, PreguntaExamenFormData } from "@/lib/api/examen";

const emptyForm: PreguntaExamenFormData = {
  pregunta: "",
  opcionA: "",
  opcionB: "",
  opcionC: "",
  opcionD: "",
  respuestaCorrecta: "A",
  activa: true,
};

const ExamenAdminView = () => {
  const {
    preguntas,
    preguntasActivas,
    configuracion,
    isLoadingPreguntas,
    isLoadingConfig,
    error,
    createPregunta,
    updatePregunta,
    deletePregunta,
    updateConfiguracion,
    refreshPreguntas,
    refreshConfiguracion,
  } = useExamenAdminContext();

  const [busqueda, setBusqueda] = useState("");
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [creando, setCreando] = useState(false);
  const [form, setForm] = useState<PreguntaExamenFormData>(emptyForm);
  const [configGuardada, setConfigGuardada] = useState(false);
  const [tab, setTab] = useState<"preguntas" | "config">("preguntas");
  const [configForm, setConfigForm] = useState({
    puntajeAprobatorio: configuracion?.puntajeAprobatorio || 14,
    puntajeTotal: configuracion?.puntajeTotal || 20,
    intentosMaximos: configuracion?.intentosMaximos || 3,
    tiempoEsperaMinutos: configuracion?.tiempoEsperaMinutos || 10,
  });

  // Sincronizar configForm con configuracion cuando cambie
  useEffect(() => {
    if (configuracion) {
      setConfigForm({
        puntajeAprobatorio: configuracion.puntajeAprobatorio,
        puntajeTotal: configuracion.puntajeTotal,
        intentosMaximos: configuracion.intentosMaximos,
        tiempoEsperaMinutos: configuracion.tiempoEsperaMinutos,
      });
    }
  }, [configuracion]);

  const preguntasFiltradas = preguntas.filter((p) =>
    p.pregunta.toLowerCase().includes(busqueda.toLowerCase())
  );
  const activas = preguntasActivas.length;

  // ── Editar ────────────────────────────────────────────────────────────────
  const handleEditar = (p: PreguntaExamen) => {
    setEditandoId(p.id);
    setCreando(false);
    setForm({
      pregunta: p.pregunta,
      opcionA: p.opcionA,
      opcionB: p.opcionB,
      opcionC: p.opcionC,
      opcionD: p.opcionD,
      respuestaCorrecta: p.respuestaCorrecta,
      activa: p.activa,
    });
  };

  const handleGuardarEdit = async () => {
    if (!editandoId) return;
    try {
      await updatePregunta(editandoId, form);
      setEditandoId(null);
      setForm(emptyForm);
    } catch (error: any) {
      alert(error.message || "Error al actualizar pregunta");
    }
  };

  // ── Crear ─────────────────────────────────────────────────────────────────
  const handleCrear = () => {
    setCreando(true);
    setEditandoId(null);
    setForm(emptyForm);
  };

  const handleGuardarNueva = async () => {
    try {
      await createPregunta(form);
      setCreando(false);
      setForm(emptyForm);
    } catch (error: any) {
      alert(error.message || "Error al crear pregunta");
    }
  };

  // ── Eliminar ──────────────────────────────────────────────────────────────
  const handleEliminar = async (id: number) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta pregunta?")) {
      return;
    }
    try {
      await deletePregunta(id);
      if (editandoId === id) {
        setEditandoId(null);
        setForm(emptyForm);
      }
    } catch (error: any) {
      alert(error.message || "Error al eliminar pregunta");
    }
  };

  const handleToggleActiva = async (id: number) => {
    const pregunta = preguntas.find((p) => p.id === id);
    if (!pregunta) return;
    try {
      await updatePregunta(id, { activa: !pregunta.activa });
    } catch (error: any) {
      alert(error.message || "Error al cambiar estado de la pregunta");
    }
  };

  // ── Config ────────────────────────────────────────────────────────────────
  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateConfiguracion(configForm);
      setConfigGuardada(true);
      setTimeout(() => setConfigGuardada(false), 2500);
    } catch (error: any) {
      alert(error.message || "Error al guardar configuración");
    }
  };

  const cancelarForm = () => {
    setEditandoId(null);
    setCreando(false);
    setForm(emptyForm);
  };

  // ── Form compartido (crear / editar) ─────────────────────────────────────
  const FormularioPregunta = ({
    onSave,
    onCancel,
    titulo,
  }: {
    onSave: () => void;
    onCancel: () => void;
    titulo: string;
  }) => (
    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 space-y-4 mb-4">
      <h3 className="font-bold text-[#003366] text-base">{titulo}</h3>

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">
          Pregunta <span className="text-red-400">*</span>
        </label>
        <textarea
          rows={2}
          value={form.pregunta}
          onChange={(e) => setForm((f) => ({ ...f, pregunta: e.target.value }))}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-300 bg-white resize-none"
          placeholder="Escribe la pregunta..."
        />
      </div>

      {(["A", "B", "C", "D"] as Opcion[]).map((op) => {
        const key = `opcion${op}` as keyof typeof form;
        return (
          <div key={op}>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Opción {op}
              {form.respuestaCorrecta === op && (
                <span className="ml-2 text-emerald-600 text-xs">✓ Correcta</span>
              )}
            </label>
            <input
              type="text"
              value={form[key] as string}
              onChange={(e) =>
                setForm((f) => ({ ...f, [key]: e.target.value }))
              }
              className={`w-full px-3 py-2 text-sm border rounded-xl focus:outline-none focus:ring-2 bg-white ${
                form.respuestaCorrecta === op
                  ? "border-emerald-400 focus:ring-emerald-200 bg-emerald-50"
                  : "border-gray-200 focus:ring-cyan-300"
              }`}
              placeholder={`Opción ${op}...`}
            />
          </div>
        );
      })}

      <div>
        <label className="block text-xs font-semibold text-gray-600 mb-1">
          Respuesta correcta <span className="text-red-400">*</span>
        </label>
        <div className="relative">
          <ChevronDown
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <select
            value={form.respuestaCorrecta}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                respuestaCorrecta: e.target.value as Opcion,
              }))
            }
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-300 bg-white appearance-none"
          >
            {(["A", "B", "C", "D"] as Opcion[]).map((op) => (
              <option key={op} value={op}>
                Opción {op}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          onClick={onCancel}
          className="flex-1 py-2 rounded-xl text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
        >
          Cancelar
        </button>
        <button
          onClick={onSave}
          disabled={
            !form.pregunta ||
            !form.opcionA ||
            !form.opcionB ||
            !form.opcionC ||
            !form.opcionD
          }
          className="flex-1 py-2 rounded-xl text-sm font-semibold bg-[#003366] text-white hover:bg-[#004080] transition disabled:opacity-40 flex items-center justify-center gap-2"
        >
          <Save size={14} />
          Guardar
        </button>
      </div>
    </div>
  );

  if (isLoadingPreguntas && preguntas.length === 0) {
    return (
      <LayoutComponent>
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#003366]" />
          <p className="text-gray-600">Cargando preguntas...</p>
        </div>
      </LayoutComponent>
    );
  }

  return (
    <LayoutComponent>
      <div className="space-y-6">
        {/* ── Header ── */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Examen de Inducción</h1>
            <p className="text-gray-500 mt-1">
              Administración de preguntas y configuración del examen
            </p>
          </div>
        </div>

        {/* ── KPIs ── */}
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              label: "Preguntas en banco",
              value: preguntas.length,
              color: "text-blue-600",
              bg: "bg-blue-50",
            },
            {
              label: "Preguntas activas",
              value: activas,
              color: "text-emerald-600",
              bg: "bg-emerald-50",
            },
            {
              label: "Preguntas por examen",
              value: configuracion?.puntajeTotal || 20,
              color: "text-purple-600",
              bg: "bg-purple-50",
            },
          ].map(({ label, value, color, bg }) => (
            <div
              key={label}
              className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex items-center gap-4"
            >
              <div
                className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center`}
              >
                <ClipboardList size={20} className={color} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-xs text-gray-500">{label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Tabs ── */}
        <div className="flex gap-2 border-b border-gray-200">
          {[
            { key: "preguntas", label: "Banco de Preguntas", icon: BookOpen },
            { key: "config", label: "Configuración", icon: Settings },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key as typeof tab)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition -mb-px ${
                tab === key
                  ? "border-[#003366] text-[#003366]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>

        {/* ══ TAB: PREGUNTAS ════════════════════════════════════════════════════ */}
        {tab === "preguntas" && (
          <div className="space-y-4">
            {/* Barra de herramientas */}
            <div className="flex gap-3 items-center">
              <div className="relative flex-1">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Buscar pregunta..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-300 bg-white"
                />
              </div>
              <button
                onClick={handleCrear}
                className="flex items-center gap-2 px-4 py-2 bg-[#003366] text-white rounded-full font-semibold text-sm hover:bg-[#004080] transition shadow-sm whitespace-nowrap"
              >
                <Plus size={16} />
                Nueva Pregunta
              </button>
            </div>

            {/* Formulario de creación */}
            {creando && (
              <FormularioPregunta
                titulo="Nueva Pregunta"
                onSave={handleGuardarNueva}
                onCancel={cancelarForm}
              />
            )}

            {/* Lista de preguntas */}
            <div className="space-y-3">
              {preguntasFiltradas.map((p, idx) => (
                <div key={p.id}>
                  {/* Formulario de edición inline */}
                  {editandoId === p.id ? (
                    <FormularioPregunta
                      titulo={`Editando pregunta #${idx + 1}`}
                      onSave={handleGuardarEdit}
                      onCancel={cancelarForm}
                    />
                  ) : (
                    <div
                      className={`bg-white rounded-2xl border shadow-sm overflow-hidden transition-all ${
                        p.activa ? "border-gray-100" : "border-gray-100 opacity-60"
                      }`}
                    >
                      {/* Header card */}
                      <div className="flex items-start gap-4 p-5">
                        {/* Número */}
                        <div
                          className={`w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                            p.activa
                              ? "bg-[#003366] text-white"
                              : "bg-gray-300 text-gray-600"
                          }`}
                        >
                          {idx + 1}
                        </div>

                        {/* Pregunta y opciones */}
                        <div className="flex-1 min-w-0 space-y-3">
                          <p className="text-sm font-semibold text-gray-900 leading-snug">
                            {p.pregunta}
                          </p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {(["A", "B", "C", "D"] as Opcion[]).map((op) => {
                              const key = `opcion${op}` as keyof PreguntaExamen;
                              const esCorrecta = p.respuestaCorrecta === op;
                              return (
                                <div
                                  key={op}
                                  className={`flex items-start gap-2 px-3 py-2 rounded-lg text-xs ${
                                    esCorrecta
                                      ? "bg-emerald-50 border border-emerald-200"
                                      : "bg-gray-50 border border-gray-100"
                                  }`}
                                >
                                  <span
                                    className={`font-bold shrink-0 ${
                                      esCorrecta ? "text-emerald-600" : "text-gray-400"
                                    }`}
                                  >
                                    {op}.
                                  </span>
                                  <span
                                    className={`leading-snug ${
                                      esCorrecta
                                        ? "text-emerald-800 font-medium"
                                        : "text-gray-600"
                                    }`}
                                  >
                                    {p[key] as string}
                                  </span>
                                  {esCorrecta && (
                                    <CheckCircle2
                                      size={13}
                                      className="text-emerald-500 shrink-0 ml-auto mt-0.5"
                                    />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Footer acciones */}
                      <div className="flex border-t border-gray-100">
                        <button
                          onClick={() => handleToggleActiva(p.id)}
                          className={`flex-1 py-2.5 text-xs font-semibold transition ${
                            p.activa
                              ? "text-amber-600 hover:bg-amber-50"
                              : "text-emerald-600 hover:bg-emerald-50"
                          }`}
                        >
                          {p.activa ? "Desactivar" : "Activar"}
                        </button>
                        <div className="w-px bg-gray-100" />
                        <button
                          onClick={() => handleEditar(p)}
                          className="flex-1 py-2.5 text-xs font-semibold text-[#003366] hover:bg-blue-50 transition flex items-center justify-center gap-1.5"
                        >
                          <Pencil size={12} />
                          Editar
                        </button>
                        <div className="w-px bg-gray-100" />
                        <button
                          onClick={() => handleEliminar(p.id)}
                          className="flex-1 py-2.5 text-xs font-semibold text-red-500 hover:bg-red-50 transition flex items-center justify-center gap-1.5"
                        >
                          <Trash2 size={12} />
                          Eliminar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {preguntasFiltradas.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <ClipboardList className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">No se encontraron preguntas</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══ TAB: CONFIGURACIÓN ═══════════════════════════════════════════════ */}
        {tab === "config" && (
          <div className="max-w-xl">
            <form
              onSubmit={handleSaveConfig}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6"
            >
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-900">
                  Parámetros del Examen
                </h2>
                {configGuardada && (
                  <span className="flex items-center gap-1.5 text-sm text-emerald-600 font-semibold">
                    <CheckCircle2 size={15} /> Guardado
                  </span>
                )}
              </div>

              <p className="text-xs text-gray-400 -mt-2">
                Cada pregunta vale 1 punto. El puntaje se calcula contando
                respuestas correctas.
              </p>

              {[
                {
                  key: "puntajeAprobatorio",
                  label: "Puntaje mínimo aprobatorio",
                  min: 1,
                  max: 20,
                  hint: "de 20 puntos posibles",
                },
                {
                  key: "puntajeTotal",
                  label: "Preguntas por examen",
                  min: 1,
                  max: activas,
                  hint: `máx. ${activas} (preguntas activas)`,
                },
                {
                  key: "intentosMaximos",
                  label: "Intentos máximos",
                  min: 1,
                  max: 10,
                  hint: "antes de bloqueo temporal",
                },
                {
                  key: "tiempoEsperaMinutos",
                  label: "Tiempo de espera (minutos)",
                  min: 1,
                  max: 1440,
                  hint: "tras agotar intentos",
                },
              ].map(({ key, label, min, max, hint }) => (
                <div key={key}>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    {label}
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min={min}
                      max={max}
                      value={configForm[key as keyof typeof configForm]}
                      onChange={(e) =>
                        setConfigForm((c) => ({
                          ...c,
                          [key]: Number(e.target.value),
                        }))
                      }
                      className="w-24 px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-300 bg-gray-50 text-center font-bold"
                    />
                    <span className="text-xs text-gray-400">{hint}</span>
                  </div>
                </div>
              ))}

              <button
                type="submit"
                disabled={isLoadingConfig}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#003366] text-white font-bold text-sm hover:bg-[#004080] transition shadow disabled:opacity-50"
              >
                {isLoadingConfig ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    Guardar Configuración
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </LayoutComponent>
  );
};

export default ExamenAdminView;
