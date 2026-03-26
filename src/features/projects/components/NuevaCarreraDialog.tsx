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

const COLOR_PALETTE = [
    "#3B82F6", "#6366F1", "#8B5CF6", "#EC4899",
    "#10B981", "#F59E0B", "#EF4444", "#06B6D4",
]

interface NuevaCarreraDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function NuevaCarreraDialog({ open, onOpenChange }: NuevaCarreraDialogProps) {
    const [nombre, setNombre] = useState("")
    const [color, setColor] = useState(COLOR_PALETTE[0])
    const { mutate: createCarrera, isPending, error } = useCreateCarrera()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!nombre.trim()) return
        createCarrera(
            { nombre: nombre.trim(), color },
            {
                onSuccess: () => {
                    setNombre("")
                    setColor(COLOR_PALETTE[0])
                    onOpenChange(false)
                },
            }
        )
    }

    const handleOpenChange = (value: boolean) => {
        if (!isPending) {
            setNombre("")
            setColor(COLOR_PALETTE[0])
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
                            Color <span className="text-gray-400 font-normal">(opcional)</span>
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
