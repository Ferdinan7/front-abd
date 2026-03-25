import { useState } from "react"
import {
    Dialog, DialogContent, DialogDescription,
    DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus, Trash2, BookOpen, User } from "lucide-react"
import { useAsignaciones, useCreateAsignacion, useDeleteAsignacion } from "@/hooks/use-asignaciones"
import { useMaterias } from "@/hooks/use-materias"
import { useProfesores } from "@/hooks/use-profesores"
import type { Grupo } from "@/api/grupos.api"

interface AsignacionesDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    grupo: Grupo
    carreraId: string
}

export function AsignacionesDialog({ open, onOpenChange, grupo, carreraId }: AsignacionesDialogProps) {
    const [materiaId, setMateriaId] = useState("")
    const [profesorId, setProfesorId] = useState("")

    const { data: asignaciones, isLoading: loadingAsig } = useAsignaciones(grupo.id)
    const { data: materias, isLoading: loadingMat } = useMaterias(carreraId)
    const { data: profesores, isLoading: loadingProf } = useProfesores()

    const { mutate: createAsig, isPending: isCreating, error: createError } = useCreateAsignacion(grupo.id)
    const { mutate: deleteAsig, isPending: isDeleting } = useDeleteAsignacion(grupo.id)

    const handleAdd = () => {
        if (!materiaId || !profesorId) return
        createAsig(
            { materia_id: materiaId, profesor_id: profesorId },
            {
                onSuccess: () => {
                    setMateriaId("")
                    setProfesorId("")
                },
            }
        )
    }

    const turnoLabel = grupo.turno === "matutino" ? "Matutino" : "Vespertino"

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg bg-white max-h-[85vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="text-xl font-extrabold text-gray-900">
                        Asignaciones — {grupo.grado}° &quot;{grupo.seccion}&quot;
                    </DialogTitle>
                    <DialogDescription>
                        Asigna materias y profesores a este grupo. Estas asignaciones se usan para generar el horario.
                        <span className="ml-1 font-medium text-gray-500">· {turnoLabel}</span>
                    </DialogDescription>
                </DialogHeader>

                {/* Current assignments list */}
                <div className="flex-1 overflow-y-auto space-y-2 min-h-0">
                    {loadingAsig && (
                        <div className="space-y-2">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />
                            ))}
                        </div>
                    )}

                    {!loadingAsig && (!asignaciones || asignaciones.length === 0) && (
                        <div className="flex flex-col items-center justify-center py-8 text-center text-gray-400 space-y-1.5">
                            <BookOpen className="w-8 h-8 text-gray-300" />
                            <p className="text-sm font-semibold text-gray-500">Sin asignaciones</p>
                            <p className="text-xs">Agrega materias y profesores para poder generar el horario.</p>
                        </div>
                    )}

                    {!loadingAsig && asignaciones && asignaciones.length > 0 && (
                        <div className="space-y-1.5">
                            {asignaciones.map((asig) => {
                                const materiaNombre =
                                    (asig.materia as { nombre?: string } | undefined)?.nombre ??
                                    asig.materia_id
                                const profesorNombre =
                                    (asig.profesor as { nombre_completo?: string } | undefined)?.nombre_completo ??
                                    asig.profesor_id

                                return (
                                    <div
                                        key={asig.id}
                                        className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-gray-50 border border-gray-100 group"
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-sm font-semibold text-gray-900 truncate flex items-center gap-1.5">
                                                    <BookOpen className="w-3.5 h-3.5 text-[#1e40af] shrink-0" />
                                                    {materiaNombre}
                                                </span>
                                                <span className="text-xs text-gray-500 truncate flex items-center gap-1.5 mt-0.5">
                                                    <User className="w-3 h-3 shrink-0" />
                                                    {profesorNombre}
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => deleteAsig(asig.id)}
                                            disabled={isDeleting}
                                            className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0 opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>

                {/* Add new assignment */}
                <div className="border-t border-gray-100 pt-4 space-y-3">
                    <p className="text-sm font-bold text-gray-700">Nueva asignación</p>

                    <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Materia</label>
                            <select
                                value={materiaId}
                                onChange={(e) => setMateriaId(e.target.value)}
                                disabled={isCreating || loadingMat}
                                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1e40af]/30 focus:border-[#1e40af] disabled:opacity-50"
                            >
                                <option value="">Seleccionar…</option>
                                {(materias ?? []).map((m) => (
                                    <option key={m.id} value={m.id}>
                                        {m.grado}° — {m.nombre}
                                        {m.codigo ? ` (${m.codigo})` : ""}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Profesor</label>
                            <select
                                value={profesorId}
                                onChange={(e) => setProfesorId(e.target.value)}
                                disabled={isCreating || loadingProf}
                                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1e40af]/30 focus:border-[#1e40af] disabled:opacity-50"
                            >
                                <option value="">Seleccionar…</option>
                                {(profesores ?? []).map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.nombre_completo}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {createError && (
                        <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">
                            {createError.message}
                        </p>
                    )}

                    <Button
                        onClick={handleAdd}
                        disabled={!materiaId || !profesorId || isCreating}
                        className="w-full bg-[#1e40af] hover:bg-blue-800 text-white font-semibold gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        {isCreating ? "Agregando..." : "Agregar asignación"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
