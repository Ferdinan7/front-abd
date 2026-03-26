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
import { useUpdateCarrera } from "@/hooks/use-carreras"
import type { Carrera } from "@/api/carreras.api"

const COLOR_PALETTE = [
    "#3B82F6", "#6366F1", "#8B5CF6", "#EC4899",
    "#10B981", "#F59E0B", "#EF4444", "#06B6D4",
]

interface EditarCarreraDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    carrera: Carrera
}

export function EditarCarreraDialog({ open, onOpenChange, carrera }: EditarCarreraDialogProps) {
    const [nombre, setNombre] = useState(carrera.nombre)
    const [color, setColor] = useState(carrera.color ?? COLOR_PALETTE[0])
    const { mutate: updateCarrera, isPending, error } = useUpdateCarrera()

    useEffect(() => {
        if (open) {
            setNombre(carrera.nombre)
            setColor(carrera.color ?? COLOR_PALETTE[0])
        }
    }, [open, carrera])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!nombre.trim()) return
        updateCarrera(
            { id: carrera.id, dto: { nombre: nombre.trim(), color } },
            { onSuccess: () => onOpenChange(false) }
        )
    }

    return (
        <Dialog open={open} onOpenChange={(v) => !isPending && onOpenChange(v)}>
            <DialogContent className="sm:max-w-md bg-white">
                <DialogHeader>
                    <DialogTitle className="text-xl font-extrabold text-gray-900">
                        Editar carrera
                    </DialogTitle>
                    <DialogDescription>
                        Modifica los datos de la carrera seleccionada.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-1">
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">
                            Nombre <span className="text-red-500">*</span>
                        </label>
                        <Input
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            disabled={isPending}
                            autoFocus
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">
                            Color
                        </label>
                        <div className="flex items-center gap-2 flex-wrap">
                            {COLOR_PALETTE.map((c) => (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => setColor(c)}
                                    disabled={isPending}
                                    className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 ${
                                        color === c ? "border-gray-900 scale-110" : "border-transparent"
                                    }`}
                                    style={{ backgroundColor: c }}
                                    title={c}
                                />
                            ))}
                            <input
                                type="color"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                                disabled={isPending}
                                className="w-7 h-7 rounded-full border border-gray-200 cursor-pointer p-0.5"
                                title="Color personalizado"
                            />
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
                            onClick={() => onOpenChange(false)}
                            disabled={isPending}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={!nombre.trim() || isPending}
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
