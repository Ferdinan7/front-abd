import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  useHorario,
  useGenerarHorario,
  useDeleteHorario,
} from "@/hooks/use-horarios";
import {
  RefreshCw,
  Trash2,
  CalendarDays,
  AlertTriangle,
  Clock,
  Building,
} from "lucide-react";
import type { Grupo } from "@/api/grupos.api";

interface HorarioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  grupo: Grupo;
}

const DIAS = [
  { key: "lunes" as const, label: "Lunes" },
  { key: "martes" as const, label: "Martes" },
  { key: "miercoles" as const, label: "Miércoles" },
  { key: "jueves" as const, label: "Jueves" },
  { key: "viernes" as const, label: "Viernes" },
];

const DIA_COLORS = [
  "bg-blue-50 border-blue-100",
  "bg-indigo-50 border-indigo-100",
  "bg-violet-50 border-violet-100",
  "bg-purple-50 border-purple-100",
  "bg-cyan-50 border-cyan-100",
];

const BLOQUE_COLORS = [
  "bg-blue-100 text-blue-800",
  "bg-indigo-100 text-indigo-800",
  "bg-violet-100 text-violet-800",
  "bg-emerald-100 text-emerald-800",
  "bg-amber-100 text-amber-800",
  "bg-rose-100 text-rose-800",
  "bg-teal-100 text-teal-800",
  "bg-orange-100 text-orange-800",
];

export function HorarioDialog({
  open,
  onOpenChange,
  grupo,
}: HorarioDialogProps) {
  const { data: horario, isLoading, isError } = useHorario(grupo.id);
  const {
    mutate: generar,
    isPending: isGenerating,
    data: generarResult,
  } = useGenerarHorario(grupo.id);
  const { mutate: eliminar, isPending: isDeleting } = useDeleteHorario(
    grupo.id,
  );

  const turnoLabel = grupo.turno === "matutino" ? "Matutino" : "Vespertino";

  const hasHorario =
    horario && DIAS.some((d) => (horario[d.key]?.length ?? 0) > 0);

  const handleGenerar = (regenerar: boolean) => {
    generar(regenerar);
  };

  const handleEliminar = () => {
    eliminar();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-full bg-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-[#1e40af]" />
            Horario — {grupo.grado}° &quot;{grupo.seccion}&quot;
            <span className="text-sm font-semibold text-gray-400 ml-1">
              · {turnoLabel}
            </span>
          </DialogTitle>
          <DialogDescription>
            Horario semanal del grupo. Puedes generarlo automáticamente o
            eliminarlo.
          </DialogDescription>
        </DialogHeader>

        {/* Warnings from last generation */}
        {generarResult?.warnings &&
          generarResult.warnings.length > 0 &&
          (() => {
            const noAsigWarn = generarResult.warnings.find(
              (w) =>
                w.materia === "N/A" ||
                w.motivo?.toLowerCase().includes("asignacion"),
            );
            const realWarnings = generarResult.warnings.filter(
              (w) =>
                w.materia !== "N/A" &&
                !w.motivo?.toLowerCase().includes("asignacion"),
            );

            return (
              <div className="space-y-2">
                {noAsigWarn && (
                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 flex items-start gap-3">
                    <AlertTriangle className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-blue-700">
                        Sin asignaciones configuradas
                      </p>
                      <p className="text-xs text-blue-600 mt-0.5">
                        Este grupo no tiene materias ni colaboradores asignados.
                        Abre el menú del grupo y selecciona{" "}
                        <strong>Asignaciones</strong> para configurarlos antes
                        de generar el horario.
                      </p>
                    </div>
                  </div>
                )}
                {realWarnings.length > 0 && (
                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 space-y-1.5">
                    <div className="flex items-center gap-2 text-amber-700 font-semibold text-sm">
                      <AlertTriangle className="w-4 h-4" />
                      Advertencias de generación
                    </div>
                    {realWarnings.map((w, i) => (
                      <p key={i} className="text-xs text-amber-600">
                        <span className="font-semibold">{w.materia}</span> —{" "}
                        {w.motivo}
                        {w.horasFaltantes > 0 &&
                          ` (${w.horasFaltantes}h faltantes)`}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}

        {/* Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {!hasHorario ? (
            <Button
              onClick={() => handleGenerar(false)}
              disabled={isGenerating || isLoading}
              className="bg-[#1e40af] hover:bg-blue-800 text-white font-semibold gap-2"
            >
              <CalendarDays className="w-4 h-4" />
              {isGenerating ? "Generando..." : "Generar horario"}
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => handleGenerar(true)}
                disabled={isGenerating || isDeleting}
                className="gap-2 font-semibold"
              >
                <RefreshCw
                  className={`w-4 h-4 ${isGenerating ? "animate-spin" : ""}`}
                />
                {isGenerating ? "Regenerando..." : "Regenerar"}
              </Button>
              <Button
                variant="outline"
                onClick={handleEliminar}
                disabled={isDeleting || isGenerating}
                className="gap-2 font-semibold text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
                {isDeleting ? "Eliminando..." : "Eliminar horario"}
              </Button>
            </>
          )}
        </div>

        {/* Horario Grid */}
        {isLoading && (
          <div className="grid grid-cols-5 gap-3 pt-2">
            {DIAS.map((d) => (
              <div key={d.key} className="space-y-2">
                <div className="h-8 bg-gray-100 rounded animate-pulse" />
                <div className="h-20 bg-gray-50 rounded animate-pulse" />
              </div>
            ))}
          </div>
        )}

        {!isLoading && !hasHorario && !isGenerating && (
          <div className="flex flex-col items-center justify-center py-12 text-center text-gray-400 space-y-2">
            <CalendarDays className="w-10 h-10 text-gray-300" />
            <p className="font-semibold text-gray-500">Sin horario generado</p>
            <p className="text-sm">
              Asegúrate de tener asignaciones configuradas antes de generar el
              horario.
            </p>
          </div>
        )}

        {!isLoading && hasHorario && horario && (
          <div className="grid grid-cols-5 gap-3 pt-1 min-w-0">
            {DIAS.map((dia, di) => (
              <div key={dia.key} className="space-y-2">
                <div
                  className={`rounded-lg border px-3 py-2 text-center text-xs font-bold uppercase tracking-wide text-gray-600 ${DIA_COLORS[di]}`}
                >
                  {dia.label}
                </div>
                <div className="space-y-1.5">
                  {(horario[dia.key] ?? []).length === 0 ? (
                    <div className="rounded-lg bg-gray-50 border border-dashed border-gray-200 py-4 text-center text-xs text-gray-300">
                      Sin clases
                    </div>
                  ) : (
                    (horario[dia.key] ?? []).map((bloque, bi) => (
                      <div
                        key={bi}
                        className={`rounded-lg p-2.5 border ${DIA_COLORS[di]} space-y-1`}
                      >
                        <div
                          className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded ${BLOQUE_COLORS[bi % BLOQUE_COLORS.length]}`}
                        >
                          <Clock className="w-2.5 h-2.5" />
                          {bloque.hora_inicio.slice(0, 5)} –{" "}
                          {bloque.hora_fin.slice(0, 5)}
                        </div>
                        <p className="text-xs font-bold text-gray-800 leading-tight line-clamp-2">
                          {bloque.materia}
                        </p>
                        <p className="text-[10px] text-gray-500 font-medium leading-tight">
                          {bloque.profesor}
                        </p>
                        {bloque.salon && (
                          <p className="text-[10px] font-medium text-[#1e40af] leading-tight flex items-center gap-1 mt-0.5">
                            <Building className="w-2.5 h-2.5 shrink-0" />
                            {bloque.salon}
                          </p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {isError && !isGenerating && (
          <div className="flex flex-col items-center justify-center py-10 text-center text-gray-400 space-y-1">
            <CalendarDays className="w-8 h-8 text-gray-300" />
            <p className="text-sm font-medium text-gray-500">
              Horario no generado aún
            </p>
            <p className="text-xs">
              Usa el botón para crear el horario automáticamente.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
