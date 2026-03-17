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
import { useCreateCarrera } from "@/hooks/use-carreras"

interface NuevaCarreraDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function NuevaCarreraDialog({ open, onOpenChange }: NuevaCarreraDialogProps) {
    const [nombre, setNombre] = useState("")
    const [descripcion, setDescripcion] = useState("")
    const { mutate: createCarrera, isPending, error } = useCreateCarrera()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!nombre.trim()) return
        createCarrera(
            { nombre: nombre.trim(), descripcion: descripcion.trim() || undefined },
            {
                onSuccess: () => {
                    setNombre("")
                    setDescripcion("")
                    onOpenChange(false)
                },
            }
        )
    }

    const handleOpenChange = (value: boolean) => {
        if (!isPending) {
            setNombre("")
            setDescripcion("")
            onOpenChange(value)
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-md bg-white">
                <DialogHeader>
                    <DialogTitle className="text-xl font-extrabold text-gray-900">
                        Nueva carrera
                    </DialogTitle>
                    <DialogDescription>
                        Completa los datos para registrar una nueva carrera.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-1">
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">
                            Nombre <span className="text-red-500">*</span>
                        </label>
                        <Input
                            placeholder="Ej. Ingeniería en Software"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            disabled={isPending}
                            autoFocus
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">
                            Descripción <span className="text-gray-400 font-normal">(opcional)</span>
                        </label>
                        <Input
                            placeholder="Ej. Carrera de 4 años orientada a desarrollo web"
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            disabled={isPending}
                        />
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
                            disabled={!nombre.trim() || isPending}
                            className="bg-[#1e40af] hover:bg-blue-800 text-white font-semibold"
                        >
                            {isPending ? "Creando..." : "Crear carrera"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
