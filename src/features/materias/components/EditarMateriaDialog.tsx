import { useEffect, useState } from "react"
import {
    Dialog, DialogContent, DialogDescription,
    DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useUpdateMateria } from "@/hooks/use-materias"
import type { Materia } from "@/api/materias.api"

interface EditarMateriaDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    materia: Materia
}

export function EditarMateriaDialog({ open, onOpenChange, materia }: EditarMateriaDialogProps) {
    const [nombre, setNombre] = useState(materia.nombre)
    const [codigo, setCodigo] = useState(materia.codigo ?? "")
    const [grado, setGrado] = useState(String(materia.grado))
    const [horas, setHoras] = useState(String(materia.horas_semanales))
    const { mutate: update, isPending, error } = useUpdateMateria(materia.carreraId)

    useEffect(() => {
        if (open) {
            setNombre(materia.nombre)
            setCodigo(materia.codigo ?? "")
            setGrado(String(materia.grado))
            setHoras(String(materia.horas_semanales))
        }
    }, [open, materia])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const gradoNum = parseInt(grado, 10)
        const horasNum = parseInt(horas, 10)
        if (!nombre.trim() || isNaN(gradoNum) || isNaN(horasNum)) return
        update(
            { id: materia.id, dto: { nombre: nombre.trim(), codigo: codigo.trim() || undefined, grado: gradoNum, horas_semanales: horasNum } },
            { onSuccess: () => onOpenChange(false) }
        )
    }

    return (
        <Dialog open={open} onOpenChange={(v) => !isPending && onOpenChange(v)}>
            <DialogContent className="sm:max-w-md bg-white">
                <DialogHeader>
                    <DialogTitle className="text-xl font-extrabold text-gray-900">Editar materia</DialogTitle>
                    <DialogDescription>Modifica los datos de la materia seleccionada.</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-1">
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Nombre <span className="text-red-500">*</span></label>
                        <Input value={nombre} onChange={(e) => setNombre(e.target.value)} disabled={isPending} autoFocus />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Código <span className="text-gray-400 font-normal">(opcional)</span></label>
                        <Input value={codigo} onChange={(e) => setCodigo(e.target.value)} disabled={isPending} />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700">Grado <span className="text-red-500">*</span></label>
                            <Input type="number" min={1} value={grado} onChange={(e) => setGrado(e.target.value)} disabled={isPending} />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700">Hrs/semana <span className="text-red-500">*</span></label>
                            <Input type="number" min={1} value={horas} onChange={(e) => setHoras(e.target.value)} disabled={isPending} />
                        </div>
                    </div>

                    {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error.message}</p>}

                    <DialogFooter className="pt-2 gap-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>Cancelar</Button>
                        <Button type="submit" disabled={!nombre.trim() || !grado || !horas || isPending} className="bg-[#1e40af] hover:bg-blue-800 text-white font-semibold">
                            {isPending ? "Guardando..." : "Guardar cambios"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
