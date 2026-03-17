import { useState } from "react"
import {
    Dialog, DialogContent, DialogDescription,
    DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCreateMateria } from "@/hooks/use-materias"

interface NuevaMateriaDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    carreraId: string
}

export function NuevaMateriaDialog({ open, onOpenChange, carreraId }: NuevaMateriaDialogProps) {
    const [nombre, setNombre] = useState("")
    const [codigo, setCodigo] = useState("")
    const [grado, setGrado] = useState("")
    const [horas, setHoras] = useState("")
    const { mutate: create, isPending, error } = useCreateMateria(carreraId)

    const reset = () => { setNombre(""); setCodigo(""); setGrado(""); setHoras("") }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const gradoNum = parseInt(grado, 10)
        const horasNum = parseInt(horas, 10)
        if (!nombre.trim() || isNaN(gradoNum) || isNaN(horasNum)) return
        create(
            { nombre: nombre.trim(), codigo: codigo.trim() || undefined, grado: gradoNum, horas_semanales: horasNum },
            { onSuccess: () => { reset(); onOpenChange(false) } }
        )
    }

    const handleOpenChange = (v: boolean) => { if (!isPending) { reset(); onOpenChange(v) } }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-md bg-white">
                <DialogHeader>
                    <DialogTitle className="text-xl font-extrabold text-gray-900">Nueva materia</DialogTitle>
                    <DialogDescription>Completa los datos para registrar una nueva materia.</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-1">
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">
                            Nombre <span className="text-red-500">*</span>
                        </label>
                        <Input placeholder="Ej. Matemáticas" value={nombre} onChange={(e) => setNombre(e.target.value)} disabled={isPending} autoFocus />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">
                            Código <span className="text-gray-400 font-normal">(opcional)</span>
                        </label>
                        <Input placeholder="Ej. MAT-101" value={codigo} onChange={(e) => setCodigo(e.target.value)} disabled={isPending} />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700">
                                Grado <span className="text-red-500">*</span>
                            </label>
                            <Input type="number" min={1} placeholder="Ej. 1" value={grado} onChange={(e) => setGrado(e.target.value)} disabled={isPending} />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700">
                                Hrs/semana <span className="text-red-500">*</span>
                            </label>
                            <Input type="number" min={1} placeholder="Ej. 4" value={horas} onChange={(e) => setHoras(e.target.value)} disabled={isPending} />
                        </div>
                    </div>

                    {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error.message}</p>}

                    <DialogFooter className="pt-2 gap-2">
                        <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={isPending}>Cancelar</Button>
                        <Button type="submit" disabled={!nombre.trim() || !grado || !horas || isPending} className="bg-[#1e40af] hover:bg-blue-800 text-white font-semibold">
                            {isPending ? "Creando..." : "Crear materia"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
