import { useState } from "react"
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
import { useCreateGrupo } from "@/hooks/use-grupos"
import type { Turno } from "@/api/grupos.api"

interface NuevoGrupoDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    carreraId: string
}

const TURNOS: { value: Turno; label: string }[] = [
    { value: "matutino", label: "Matutino" },
    { value: "vespertino", label: "Vespertino" },
]

export function NuevoGrupoDialog({ open, onOpenChange, carreraId }: NuevoGrupoDialogProps) {
    const [grado, setGrado] = useState("")
    const [seccion, setSeccion] = useState("")
    const [turno, setTurno] = useState<Turno>("matutino")
    const { mutate: createGrupo, isPending, error } = useCreateGrupo(carreraId)

    const reset = () => {
        setGrado("")
        setSeccion("")
        setTurno("matutino")
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const gradoNum = parseInt(grado, 10)
        if (!grado.trim() || isNaN(gradoNum) || !seccion.trim()) return
        createGrupo(
            { grado: gradoNum, seccion: seccion.trim(), turno },
            {
                onSuccess: () => {
                    reset()
                    onOpenChange(false)
                },
            }
        )
    }

    const handleOpenChange = (v: boolean) => {
        if (!isPending) { reset(); onOpenChange(v) }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-md bg-white">
                <DialogHeader>
                    <DialogTitle className="text-xl font-extrabold text-gray-900">
                        Nuevo grupo
                    </DialogTitle>
                    <DialogDescription>
                        Completa los datos para registrar un nuevo grupo académico.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-1">
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">
                            Grado <span className="text-red-500">*</span>
                        </label>
                        <Input
                            type="number"
                            min={1}
                            placeholder="Ej. 1"
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
                            placeholder="Ej. A"
                            value={seccion}
                            onChange={(e) => setSeccion(e.target.value)}
                            disabled={isPending}
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Turno</label>
                        <div className="flex gap-2">
                            {TURNOS.map((t) => (
                                <button
                                    key={t.value}
                                    type="button"
                                    onClick={() => setTurno(t.value)}
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

                    {error && (
                        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
                            {error.message}
                        </p>
                    )}

                    <DialogFooter className="pt-2 gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleOpenChange(false)}
                            disabled={isPending}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={!grado.trim() || !seccion.trim() || isPending}
                            className="bg-[#1e40af] hover:bg-blue-800 text-white font-semibold"
                        >
                            {isPending ? "Creando..." : "Crear grupo"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
