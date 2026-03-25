import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useDisponibilidad, useCreateDisponibilidad, useDeleteDisponibilidad } from "@/hooks/use-profesores"
import type { CreateDisponibilidadDto } from "@/api/profesores.api"
import { Plus, Trash2, CalendarDays, Clock } from "lucide-react"

const DIAS = [
    { value: 1, label: "Lunes" },
    { value: 2, label: "Martes" },
    { value: 3, label: "Miércoles" },
    { value: 4, label: "Jueves" },
    { value: 5, label: "Viernes" },
]

interface Props {
    open: boolean
    onOpenChange: (v: boolean) => void
    profesorId: string
    profesorNombre: string
}

export function DisponibilidadDialog({ open, onOpenChange, profesorId, profesorNombre }: Props) {
    const { data: bloques, isLoading } = useDisponibilidad(profesorId)
    const { mutate: crear, isPending: isCreating, error: createError } = useCreateDisponibilidad(profesorId)
    const { mutate: eliminar } = useDeleteDisponibilidad(profesorId)

    const [dia, setDia] = useState<number>(1)
    const [horaInicio, setHoraInicio] = useState("07:00")
    const [horaFin, setHoraFin] = useState("11:00")
    const [formError, setFormError] = useState<string | null>(null)

    const handleAgregar = () => {
        setFormError(null)
        if (horaInicio >= horaFin) {
            setFormError("La hora de inicio debe ser anterior a la hora de fin.")
            return
        }
        const bloque: CreateDisponibilidadDto = {
            dia_semana: dia,
            hora_inicio: `${horaInicio}:00`,
            hora_fin: `${horaFin}:00`,
        }
        crear([bloque], {
            onSuccess: () => {
                setHoraInicio("07:00")
                setHoraFin("11:00")
            },
        })
    }

    const bloquesByDia = DIAS.reduce<Record<number, typeof bloques>>((acc, d) => {
        acc[d.value] = (bloques ?? []).filter((b) => b.dia_semana === d.value)
        return acc
    }, {})

    const totalHoras = (bloques ?? []).reduce((sum, b) => {
        const [hi, mi] = b.hora_inicio.split(":").map(Number)
        const [hf, mf] = b.hora_fin.split(":").map(Number)
        return sum + (hf * 60 + mf - (hi * 60 + mi)) / 60
    }, 0)

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl bg-white max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
                        <CalendarDays className="w-5 h-5 text-[#1e40af]" />
                        Disponibilidad semanal
                    </DialogTitle>
                    <DialogDescription>
                        {profesorNombre} · {totalHoras > 0 && <span className="font-semibold text-gray-700">{totalHoras}h totales/semana</span>}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-5 pt-2">
                    {/* Agregar bloque */}
                    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Agregar bloque</p>
                        <div className="grid grid-cols-3 gap-3">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-600">Día</label>
                                <select
                                    value={dia}
                                    onChange={(e) => setDia(Number(e.target.value))}
                                    disabled={isCreating}
                                    className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e40af]/30 focus:border-[#1e40af]"
                                >
                                    {DIAS.map((d) => (
                                        <option key={d.value} value={d.value}>{d.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-600">Hora inicio</label>
                                <input
                                    type="time"
                                    value={horaInicio}
                                    onChange={(e) => setHoraInicio(e.target.value)}
                                    disabled={isCreating}
                                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e40af]/30 focus:border-[#1e40af]"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-600">Hora fin</label>
                                <input
                                    type="time"
                                    value={horaFin}
                                    onChange={(e) => setHoraFin(e.target.value)}
                                    disabled={isCreating}
                                    className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e40af]/30 focus:border-[#1e40af]"
                                />
                            </div>
                        </div>
                        {(formError || createError) && (
                            <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">
                                {formError ?? createError?.message}
                            </p>
                        )}
                        <Button
                            onClick={handleAgregar}
                            disabled={isCreating}
                            className="bg-[#1e40af] hover:bg-blue-800 text-white font-semibold gap-2 h-9 text-sm"
                        >
                            <Plus className="w-4 h-4" />
                            {isCreating ? "Guardando…" : "Agregar bloque"}
                        </Button>
                    </div>

                    {/* Vista por día */}
                    {isLoading ? (
                        <div className="grid grid-cols-5 gap-2">
                            {DIAS.map((d) => (
                                <div key={d.value} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-5 gap-2">
                            {DIAS.map((d) => {
                                const dBloques = bloquesByDia[d.value] ?? []
                                return (
                                    <div key={d.value} className="space-y-1.5">
                                        <p className="text-[11px] font-bold text-gray-500 text-center uppercase tracking-wide">{d.label.slice(0, 3)}</p>
                                        {dBloques.length === 0 ? (
                                            <div className="h-16 rounded-lg border border-dashed border-gray-200 flex items-center justify-center">
                                                <span className="text-xs text-gray-300">—</span>
                                            </div>
                                        ) : (
                                            dBloques.map((b) => (
                                                <div key={b.id} className="group relative bg-[#e0e7ff] rounded-lg px-2 py-1.5 space-y-0.5">
                                                    <div className="flex items-center gap-1 text-[10px] font-semibold text-[#1e40af]">
                                                        <Clock className="w-2.5 h-2.5" />
                                                        {b.hora_inicio.slice(0, 5)}
                                                    </div>
                                                    <div className="text-[10px] text-blue-400">→ {b.hora_fin.slice(0, 5)}</div>
                                                    <button
                                                        onClick={() => eliminar(b.id)}
                                                        className="absolute top-1 right-1 p-0.5 rounded text-blue-300 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    )}

                    <div className="flex justify-end">
                        <Button variant="outline" onClick={() => onOpenChange(false)} className="font-semibold">
                            Cerrar
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
