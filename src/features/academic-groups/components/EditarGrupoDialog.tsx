import { useEffect, useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useUpdateGrupo } from "@/hooks/use-grupos"
import { TURNO_DEFAULTS, parseGrupoError } from "@/api/grupos.api"
import type { Grupo, Turno } from "@/api/grupos.api"

interface EditarGrupoDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    grupo: Grupo
}

const TURNOS: { value: Turno; label: string }[] = [
    { value: "matutino", label: "Matutino" },
    { value: "vespertino", label: "Vespertino" },
]


export function EditarGrupoDialog({ open, onOpenChange, grupo }: EditarGrupoDialogProps) {
    const [grado, setGrado] = useState(String(grupo.grado))
    const [seccion, setSeccion] = useState(grupo.seccion)
    const [turno, setTurno] = useState<Turno>(grupo.turno)
    const [horaInicio, setHoraInicio] = useState(grupo.hora_inicio ?? TURNO_DEFAULTS[grupo.turno].hora_inicio)
    const [horaFin, setHoraFin] = useState(grupo.hora_fin ?? TURNO_DEFAULTS[grupo.turno].hora_fin)
    const [duracionBloque, setDuracionBloque] = useState(String(grupo.duracion_bloque ?? 50))
    const { mutate: updateGrupo, isPending, error } = useUpdateGrupo(grupo.carreraId)

    useEffect(() => {
        if (open) {
            setGrado(String(grupo.grado))
            setSeccion(grupo.seccion)
            const t = grupo.turno
            setTurno(t)
            setHoraInicio(grupo.hora_inicio ?? TURNO_DEFAULTS[t].hora_inicio)
            setHoraFin(grupo.hora_fin ?? TURNO_DEFAULTS[t].hora_fin)
            setDuracionBloque(String(grupo.duracion_bloque ?? 50))
        }
    }, [open, grupo])

    const handleTurnoChange = (t: Turno) => {
        setTurno(t)
        setHoraInicio(TURNO_DEFAULTS[t].hora_inicio)
        setHoraFin(TURNO_DEFAULTS[t].hora_fin)
    }

    const horaError = horaInicio && horaFin && horaInicio >= horaFin
        ? "La hora de inicio debe ser anterior a la hora de fin."
        : null

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const gradoNum = parseInt(grado, 10)
        if (!grado.trim() || isNaN(gradoNum) || !seccion.trim()) return
        if (horaError) return

        const duracion = parseInt(duracionBloque, 10)
        updateGrupo(
            {
                id: grupo.id,
                dto: {
                    grado: gradoNum,
                    seccion: seccion.trim().toUpperCase(),
                    turno,
                    hora_inicio: horaInicio || undefined,
                    hora_fin: horaFin || undefined,
                    duracion_bloque: isNaN(duracion) ? undefined : duracion,
                },
            },
            { onSuccess: () => onOpenChange(false) }
        )
    }

    return (
        <Dialog open={open} onOpenChange={(v) => !isPending && onOpenChange(v)}>
            <DialogContent className="sm:max-w-md bg-white">
                <DialogHeader>
                    <DialogTitle className="text-xl font-extrabold text-gray-900">
                        Editar grupo
                    </DialogTitle>
                    <DialogDescription>
                        Modifica los datos del grupo seleccionado.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-1">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700">
                                Grado <span className="text-red-500">*</span>
                            </label>
                            <Input
                                type="number"
                                min={1}
                                value={grado}
                                onChange={(e) => setGrado(e.target.value)}
                                disabled={isPending}
                                autoFocus
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700">
                                Grupo <span className="text-red-500">*</span>
                            </label>
                            <Input
                                value={seccion}
                                onChange={(e) => setSeccion(e.target.value.toUpperCase())}
                                disabled={isPending}
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Turno</label>
                        <div className="flex gap-2">
                            {TURNOS.map((t) => (
                                <button
                                    key={t.value}
                                    type="button"
                                    onClick={() => handleTurnoChange(t.value)}
                                    disabled={isPending}
                                    className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition-colors ${
                                        turno === t.value
                                            ? "bg-[#1e40af] text-white border-[#1e40af]"
                                            : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                                    }`}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700">Hora inicio</label>
                            <Input
                                type="time"
                                value={horaInicio}
                                onChange={(e) => setHoraInicio(e.target.value)}
                                disabled={isPending}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700">Hora fin</label>
                            <Input
                                type="time"
                                value={horaFin}
                                onChange={(e) => setHoraFin(e.target.value)}
                                disabled={isPending}
                            />
                        </div>
                    </div>

                    {horaError && (
                        <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">
                            {horaError}
                        </p>
                    )}

                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">
                            Duración de bloque
                            <span className="ml-1 text-xs font-normal text-gray-400">(minutos)</span>
                        </label>
                        <Input
                            type="number"
                            min={10}
                            max={180}
                            value={duracionBloque}
                            onChange={(e) => setDuracionBloque(e.target.value)}
                            disabled={isPending}
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
                            {parseGrupoError(error.message)}
                        </p>
                    )}

                    <DialogFooter className="pt-2 gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isPending}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={!grado.trim() || !seccion.trim() || isPending || Boolean(horaError)}
                            className="bg-[#1e40af] hover:bg-blue-800 text-white font-semibold"
                        >
                            {isPending ? "Guardando..." : "Guardar cambios"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
