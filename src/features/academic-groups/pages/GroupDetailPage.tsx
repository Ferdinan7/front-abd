import { useState, useMemo } from "react";
import { useParams, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGrupos } from "@/hooks/use-grupos";
import { useMaterias } from "@/hooks/use-materias";
import { useProfesores, useCreateProfesor } from "@/hooks/use-profesores";
import {
  useAsignaciones,
  useCreateAsignacion,
  useUpdateAsignacion,
  useDeleteAsignacion,
} from "@/hooks/use-asignaciones";
import {
  useHorario,
  useGenerarHorario,
  useDeleteHorario,
} from "@/hooks/use-horarios";
import { useSalones } from "@/hooks/use-salones";
import { useAuth } from "@/features/auth/context/AuthContext";
import type { Asignacion } from "@/api/asignaciones.api";
import type { Materia } from "@/api/materias.api";
import type { Profesor } from "@/api/profesores.api";
import {
  Plus,
  Trash2,
  BookOpen,
  AlertTriangle,
  CalendarDays,
  RefreshCw,
  Clock,
  User,
  GraduationCap,
  Pencil,
  Coffee,
  Building2,
  UserPlus,
} from "lucide-react";

const DIAS = [
  { key: "lunes" as const, label: "Lun" },
  { key: "martes" as const, label: "Mar" },
  { key: "miercoles" as const, label: "Mié" },
  { key: "jueves" as const, label: "Jue" },
  { key: "viernes" as const, label: "Vie" },
];

const DIA_COLORS = [
  "bg-blue-50 border-blue-100",
  "bg-indigo-50 border-indigo-100",
  "bg-violet-50 border-violet-100",
  "bg-purple-50 border-purple-100",
  "bg-cyan-50 border-cyan-100",
];

// ─── Dialog: Editar asignación ────────────────────────────────────────────────
// Recibe materias/profesores/salones como props para no re-fetchear al abrir

function EditarAsignacionDialog({
  open,
  onOpenChange,
  asignacion,
  grupoId,
  materias,
  profesores,
  salones,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  asignacion: Asignacion;
  grupoId: string;
  materias: Materia[];
  profesores: Profesor[];
  salones: { id: string; nombre: string }[];
}) {
  const { mutate, isPending, error } = useUpdateAsignacion(grupoId);

  const mat = asignacion.materia as { nombre?: string } | undefined;
  const prof = asignacion.profesor as { nombre_completo?: string } | undefined;

  const [materiaId, setMateriaId] = useState(asignacion.materia_id);
  const [profesorId, setProfesorId] = useState(asignacion.profesor_id);
  const [salonId, setSalonId] = useState(asignacion.salon_id ?? "");

  const handleSave = () => {
    mutate(
      { id: asignacion.id, dto: { materia_id: materiaId, profesor_id: profesorId, salon_id: salonId || undefined } },
      { onSuccess: () => onOpenChange(false) }
    );
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !isPending && onOpenChange(v)}>
      <DialogContent className="sm:max-w-sm bg-white">
        <DialogHeader>
          <DialogTitle className="text-lg font-extrabold text-gray-900">
            Editar asignación
          </DialogTitle>
          <DialogDescription>
            {mat?.nombre ?? asignacion.materia_id} · {prof?.nombre_completo ?? asignacion.profesor_id}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 pt-2">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Materia</label>
            <select
              value={materiaId}
              onChange={(e) => setMateriaId(e.target.value)}
              disabled={isPending}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e40af]/30 focus:border-[#1e40af]"
            >
              {materias.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.grado}° — {m.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Profesor</label>
            <select
              value={profesorId}
              onChange={(e) => setProfesorId(e.target.value)}
              disabled={isPending}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e40af]/30 focus:border-[#1e40af]"
            >
              {profesores.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre_completo}
                </option>
              ))}
            </select>
          </div>
          {salones.length > 0 && (
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">Salón (opcional)</label>
              <select
                value={salonId}
                onChange={(e) => setSalonId(e.target.value)}
                disabled={isPending}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e40af]/30 focus:border-[#1e40af]"
              >
                <option value="">Sin salón asignado</option>
                {salones.map((s) => (
                  <option key={s.id} value={s.id}>{s.nombre}</option>
                ))}
              </select>
            </div>
          )}
          {error && (
            <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">
              {error.message}
            </p>
          )}
          <div className="flex gap-2 pt-1">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="flex-1 font-semibold"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={isPending || (!materiaId && !profesorId)}
              className="flex-1 bg-[#1e40af] hover:bg-blue-800 text-white font-semibold"
            >
              {isPending ? "Guardando…" : "Guardar"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Página principal ─────────────────────────────────────────────────────────

export function GroupDetailPage() {
  const { projectId: carreraId, groupId } = useParams({
    from: "/projects/$projectId/groups/$groupId",
  });

  const { user } = useAuth();

  const [materiaId, setMateriaId] = useState("");
  const [profesorId, setProfesorId] = useState("");
  const [salonId, setSalonId] = useState("");
  const [editAsig, setEditAsig] = useState<Asignacion | null>(null);
  const [vincularMe, setVincularMe] = useState(false);

  const { data: grupos, isLoading: loadingGrupo } = useGrupos(carreraId);
  const grupo = grupos?.find((g) => g.id === groupId);

  const { data: asignaciones, isLoading: loadingAsig } = useAsignaciones(groupId);
  const { mutate: createAsig, isPending: isCreating, error: createError } = useCreateAsignacion(groupId);
  const { mutate: deleteAsig } = useDeleteAsignacion(groupId);

  const { data: materias, isLoading: loadingMat } = useMaterias(carreraId);
  const { data: todosLosProfesores, isLoading: loadingProf, refetch: refetchProfesores } = useProfesores(carreraId);
  const { mutate: crearProfesor, isPending: isVinculando } = useCreateProfesor();

  const profesores = useMemo(() => {
    if (!todosLosProfesores) return []
    const withCarrera = todosLosProfesores.filter((p) => p.carreraId === carreraId)
    return withCarrera.length > 0 ? withCarrera : todosLosProfesores
  }, [todosLosProfesores, carreraId])

  const { data: salonesData } = useSalones(carreraId);
  const salones = salonesData ?? [];

  const handleVincularme = () => {
    if (!user) return;
    const nombre = user.user_metadata?.full_name ?? user.user_metadata?.name ?? user.email ?? "Profesor";
    const email = user.email ?? "";
    crearProfesor(
      { nombre_completo: nombre, email, carrera_id: carreraId },
      {
        onSuccess: () => {
          setVincularMe(false);
          refetchProfesores();
        },
      }
    );
  };

  const { data: horario, isLoading: loadingHorario } = useHorario(groupId);
  const { mutate: generar, isPending: isGenerating, data: generarResult } = useGenerarHorario(groupId);
  const { mutate: eliminar, isPending: isDeleting } = useDeleteHorario(groupId);

  const hasHorario = horario && DIAS.some((d) => (horario[d.key]?.length ?? 0) > 0);

  const timeSlots = useMemo(() => {
    if (!horario) return [];
    const slots = new Set<string>();
    DIAS.forEach((d) => {
      (horario[d.key] || []).forEach((b) => {
        slots.add(`${b.hora_inicio}-${b.hora_fin}`);
      });
    });
    return Array.from(slots).sort();
  }, [horario]);

  const handleAddAsig = () => {
    if (!materiaId || !profesorId) return;
    createAsig(
      { materia_id: materiaId, profesor_id: profesorId, salon_id: salonId || undefined },
      { onSuccess: () => { setMateriaId(""); setProfesorId(""); setSalonId(""); } }
    );
  };

  const turnoLabel =
    grupo?.turno === "matutino" ? "Matutino" : grupo?.turno === "vespertino" ? "Vespertino" : "";

  const noAsigWarn = generarResult?.warnings?.find(
    (w) => w.materia === "N/A" || w.motivo?.toLowerCase().includes("asignacion")
  );
  const realWarnings =
    generarResult?.warnings?.filter(
      (w) => w.materia !== "N/A" && !w.motivo?.toLowerCase().includes("asignacion")
    ) ?? [];

  if (loadingGrupo) {
    return (
      <div className="p-8 space-y-6 animate-pulse">
        <div className="h-5 bg-gray-100 rounded w-48" />
        <div className="h-9 bg-gray-100 rounded w-64" />
        <div className="grid grid-cols-5 gap-6">
          <div className="col-span-2 h-96 bg-gray-100 rounded-2xl" />
          <div className="col-span-3 h-96 bg-gray-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Dialog: editar asignación */}
      {editAsig && (
        <EditarAsignacionDialog
          open={Boolean(editAsig)}
          onOpenChange={(v) => !v && setEditAsig(null)}
          asignacion={editAsig}
          grupoId={groupId}
          materias={materias ?? []}
          profesores={profesores}
          salones={salones}
        />
      )}

      {/* Breadcrumb */}
      <nav className="text-sm font-medium text-gray-500">
        <ol className="flex items-center space-x-2">
          <li>
            <Link to="/projects" className="hover:text-gray-900 transition-colors">Carreras</Link>
          </li>
          <li><span className="text-gray-300">›</span></li>
          <li>
            <Link to="/projects/$projectId/groups" params={{ projectId: carreraId }} className="hover:text-gray-900 transition-colors">
              Grupos
            </Link>
          </li>
          <li><span className="text-gray-300">›</span></li>
          <li className="text-gray-900 font-bold">
            {grupo ? `${grupo.grado}° "${grupo.seccion}"` : groupId}
          </li>
        </ol>
      </nav>

      {/* Header del grupo */}
      <div className="flex items-center gap-4">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-sm
          ${grupo?.turno === "matutino" ? "bg-[#e0e7ff] text-blue-600" : "bg-orange-50 text-orange-600"}`}>
          <GraduationCap className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            {grupo ? `${grupo.grado}° "${grupo.seccion}"` : "Grupo"}
          </h1>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            {turnoLabel && (
              <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded
                ${grupo?.turno === "matutino" ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"}`}>
                {turnoLabel.toUpperCase()}
              </span>
            )}
            {grupo?.hora_inicio && grupo?.hora_fin && (
              <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                {grupo.hora_inicio} – {grupo.hora_fin}
                {grupo.duracion_bloque && ` · ${grupo.duracion_bloque} min/bloque`}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Layout de dos columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">
        {/* ───── Asignaciones ───── */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#1e40af]" />
            <h2 className="font-bold text-gray-900">Asignaciones</h2>
            {asignaciones && asignaciones.length > 0 && (
              <span className="ml-auto text-xs font-semibold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                {asignaciones.length}
              </span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            {loadingAsig && (
              <div className="p-4 space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-14 bg-gray-50 rounded-xl animate-pulse" />
                ))}
              </div>
            )}

            {!loadingAsig && (!asignaciones || asignaciones.length === 0) && (
              <div className="flex flex-col items-center justify-center py-10 px-6 text-center space-y-2 text-gray-400">
                <BookOpen className="w-8 h-8 text-gray-200" />
                <p className="text-sm font-semibold text-gray-500">Sin asignaciones</p>
                <p className="text-xs leading-relaxed">
                  Agrega materias y profesores para poder generar el horario.
                </p>
              </div>
            )}

            {!loadingAsig && asignaciones && asignaciones.length > 0 && (
              <div className="divide-y divide-gray-50">
                {asignaciones.map((asig) => {
                  const mat = asig.materia as { nombre?: string; horas_semanales?: number; grado?: number } | undefined;
                  const prof = asig.profesor as { nombre_completo?: string } | undefined;
                  const materiaNombre = mat?.nombre ?? asig.materia_id;
                  const profesorNombre = prof?.nombre_completo ?? asig.profesor_id;
                  const horas = mat?.horas_semanales;
                  const grado = mat?.grado;

                  return (
                    <div key={asig.id} className="group flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-sm font-semibold text-gray-900 truncate">
                            {grado ? `${grado}° — ` : ""}{materiaNombre}
                          </span>
                          {horas && (
                            <span className="shrink-0 text-[10px] font-bold bg-blue-50 text-blue-500 px-1.5 py-0.5 rounded">
                              {horas}h/sem
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <User className="w-3 h-3 shrink-0" />
                          <span className="truncate">{profesorNombre}</span>
                        </div>
                      </div>
                      {/* Acciones: editar y eliminar */}
                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <button
                          onClick={() => setEditAsig(asig)}
                          className="p-1.5 rounded-lg text-gray-200 hover:text-[#1e40af] hover:bg-blue-50 transition-colors"
                          title="Editar asignación"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteAsig(asig.id)}
                          className="p-1.5 rounded-lg text-gray-200 hover:text-red-500 hover:bg-red-50 transition-colors"
                          title="Eliminar asignación"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Formulario nueva asignación */}
          <div className="border-t border-gray-100 p-5 space-y-3 bg-gray-50/50">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Nueva asignación</p>

            <select
              value={materiaId}
              onChange={(e) => setMateriaId(e.target.value)}
              disabled={isCreating || loadingMat}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1e40af]/30 focus:border-[#1e40af] disabled:opacity-50"
            >
              <option value="">Seleccionar materia…</option>
              {(materias ?? []).map((m) => (
                <option key={m.id} value={m.id}>
                  {m.grado}° — {m.nombre}{m.codigo ? ` (${m.codigo})` : ""}
                </option>
              ))}
            </select>

            <select
              value={profesorId}
              onChange={(e) => setProfesorId(e.target.value)}
              disabled={isCreating || loadingProf}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1e40af]/30 focus:border-[#1e40af] disabled:opacity-50"
            >
              <option value="">Seleccionar profesor…</option>
              {profesores.map((p) => (
                <option key={p.id} value={p.id}>{p.nombre_completo}</option>
              ))}
            </select>

            {/* Aviso cuando no hay profesores: ofrecer vincularme */}
            {!loadingProf && profesores.length === 0 && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 space-y-2">
                <p className="text-xs font-semibold text-amber-700 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  No hay profesores vinculados a esta carrera.
                </p>
                {!vincularMe ? (
                  <button
                    type="button"
                    onClick={() => setVincularMe(true)}
                    className="text-xs font-semibold text-amber-700 underline underline-offset-2 hover:text-amber-900"
                  >
                    Registrarme como profesor en esta carrera
                  </button>
                ) : (
                  <Button
                    size="sm"
                    onClick={handleVincularme}
                    disabled={isVinculando}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold gap-1.5 text-xs h-8"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    {isVinculando ? "Vinculando…" : "Confirmar: vincularme como profesor"}
                  </Button>
                )}
              </div>
            )}

            {salones.length > 0 && (
              <select
                value={salonId}
                onChange={(e) => setSalonId(e.target.value)}
                disabled={isCreating}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1e40af]/30 focus:border-[#1e40af] disabled:opacity-50"
              >
                <option value="">Salón (opcional)…</option>
                {salones.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.nombre}
                  </option>
                ))}
              </select>
            )}

            {createError && (
              <div className="text-xs bg-red-50 border border-red-100 rounded-lg px-3 py-2 space-y-1.5">
                <p className="text-red-700 font-semibold">{createError.message}</p>
                {(createError.message.toLowerCase().includes("not linked") ||
                  createError.message.toLowerCase().includes("does not exist") ||
                  createError.message.toLowerCase().includes("no vinculado") ||
                  createError.message.toLowerCase().includes("not exist")) && (
                  <div className="text-red-500 leading-relaxed space-y-1">
                    <p>El profesor seleccionado no está vinculado a esta carrera.</p>
                    <p>
                      Usa el botón <strong>"Registrarme como profesor"</strong> de arriba (si es tu cuenta)
                      o ve a <strong>Colaboradores → Agregar persona</strong> para vincularlo.
                    </p>
                  </div>
                )}
                {createError.message.toLowerCase().includes("already assigned") && (
                  <p className="text-red-500">Esta materia ya tiene un profesor asignado en este grupo.</p>
                )}
              </div>
            )}

            <Button
              onClick={handleAddAsig}
              disabled={!materiaId || !profesorId || isCreating}
              className="w-full bg-[#1e40af] hover:bg-blue-800 text-white font-semibold gap-2 h-9 text-sm"
            >
              <Plus className="w-4 h-4" />
              {isCreating ? "Agregando…" : "Agregar asignación"}
            </Button>
          </div>
        </div>

        {/* ───── Horario ───── */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <CalendarDays className="w-4 h-4 text-[#1e40af] shrink-0" />
              <h2 className="font-bold text-gray-900">Horario Semanal</h2>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {!hasHorario ? (
                <Button
                  size="sm"
                  onClick={() => generar(false)}
                  disabled={isGenerating || loadingHorario}
                  className="bg-[#1e40af] hover:bg-blue-800 text-white font-semibold gap-1.5 text-xs h-8"
                >
                  <CalendarDays className="w-3.5 h-3.5" />
                  {isGenerating ? "Generando…" : "Generar"}
                </Button>
              ) : (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => generar(true)}
                    disabled={isGenerating || isDeleting}
                    className="font-semibold gap-1.5 text-xs h-8"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? "animate-spin" : ""}`} />
                    {isGenerating ? "Regenerando…" : "Regenerar"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => eliminar()}
                    disabled={isDeleting || isGenerating}
                    className="font-semibold gap-1.5 text-xs h-8 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    {isDeleting ? "Eliminando…" : "Eliminar"}
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="p-5 space-y-4">
            {/* Advertencias */}
            {noAsigWarn && (
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-blue-700">Sin asignaciones configuradas</p>
                  <p className="text-xs text-blue-600 mt-0.5">
                    Agrega materias y profesores en el panel izquierdo antes de generar el horario.
                  </p>
                </div>
              </div>
            )}
            {realWarnings.length > 0 && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 space-y-1.5">
                <div className="flex items-center gap-2 text-amber-700 font-semibold text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  Advertencias de generación
                </div>
                {realWarnings.map((w, i) => (
                  <p key={i} className="text-xs text-amber-600">
                    <span className="font-semibold">{w.materia}</span> — {w.motivo}
                    {w.horasFaltantes > 0 && ` (${w.horasFaltantes}h faltantes)`}
                  </p>
                ))}
              </div>
            )}

            {/* Skeleton */}
            {loadingHorario && (
              <div className="grid grid-cols-5 gap-2">
                {DIAS.map((d) => (
                  <div key={d.key} className="space-y-2">
                    <div className="h-8 bg-gray-100 rounded-lg animate-pulse" />
                    <div className="h-20 bg-gray-50 rounded-lg animate-pulse" />
                    <div className="h-20 bg-gray-50 rounded-lg animate-pulse opacity-50" />
                  </div>
                ))}
              </div>
            )}

            {/* Estado vacío */}
            {!loadingHorario && !hasHorario && !isGenerating && (
              <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center">
                  <CalendarDays className="w-7 h-7 text-gray-300" />
                </div>
                <p className="font-semibold text-gray-500">Sin horario generado</p>
                <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
                  Asegúrate de tener asignaciones configuradas y luego presiona <strong>Generar</strong>.
                </p>
              </div>
            )}

            {/* Tabla del horario */}
            {!loadingHorario && hasHorario && horario && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr>
                      <th className="w-20 p-2"></th>
                      {DIAS.map((dia, di) => (
                        <th key={dia.key} className="p-2 min-w-[120px]">
                          <div className={`rounded-lg border px-2 py-1.5 text-center text-[11px] font-bold uppercase tracking-wide text-gray-600 ${DIA_COLORS[di]}`}>
                            {dia.label}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {timeSlots.map((slot) => {
                      const [start, end] = slot.split("-");
                      return (
                        <tr key={slot}>
                          <td className="p-2 align-top text-right border-t border-gray-100">
                            <div className="text-[11px] font-semibold text-gray-500 mt-1">{start}</div>
                            <div className="text-[10px] text-gray-400">{end}</div>
                          </td>
                          {DIAS.map((dia, di) => {
                            const bloque = (horario[dia.key] ?? []).find(
                              (b) => `${b.hora_inicio}-${b.hora_fin}` === slot
                            );

                            // Bloque de receso (backend lo devuelve con tipo: "receso")
                            const esReceso = bloque?.tipo === "receso";

                            const materiaObj = materias?.find((m) => m.nombre === bloque?.materia);

                            return (
                              <td key={dia.key} className="p-1.5 align-top border-t border-gray-100">
                                {bloque ? (
                                  esReceso ? (
                                    <div className="h-full rounded-lg border border-gray-200 bg-gray-50 p-2 flex items-center justify-center gap-1 min-h-[52px]">
                                      <Coffee className="w-3 h-3 text-gray-300" />
                                      <span className="text-[10px] text-gray-400 italic font-medium">Receso</span>
                                    </div>
                                  ) : (
                                    <div className={`h-full rounded-lg p-2 border ${DIA_COLORS[di]} space-y-1`}>
                                      <p className="text-[11px] font-bold text-gray-800 leading-tight line-clamp-2">
                                        {materiaObj?.grado ? `${materiaObj.grado}° — ` : ""}
                                        {bloque.materia}
                                      </p>
                                      <p className="text-[10px] text-gray-500 truncate">{bloque.profesor}</p>
                                      {/* Salón: primero del backend, luego client-side join */}
                                      {(() => {
                                        const salonNombre =
                                          bloque.salon ??
                                          (() => {
                                            const asig = asignaciones?.find(
                                              (a) => a.materia?.nombre === bloque.materia
                                            );
                                            return (
                                              asig?.salon?.nombre ??
                                              salones.find((s) => s.id === asig?.salon_id)?.nombre
                                            );
                                          })();
                                        return salonNombre ? (
                                          <p className="text-[10px] text-gray-400 truncate flex items-center gap-0.5">
                                            <Building2 className="w-2.5 h-2.5 shrink-0" />
                                            {salonNombre}
                                          </p>
                                        ) : null;
                                      })()}
                                    </div>
                                  )
                                ) : (
                                  <div className="h-full rounded-lg bg-gray-50 border border-dashed border-gray-200 p-2 text-center flex items-center justify-center min-h-[60px]">
                                    <span className="text-xs text-gray-300">—</span>
                                  </div>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
