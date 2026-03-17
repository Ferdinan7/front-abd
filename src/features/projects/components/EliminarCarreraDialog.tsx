import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useDeleteCarrera } from "@/hooks/use-carreras"
import type { Carrera } from "@/api/carreras.api"

interface EliminarCarreraDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    carrera: Carrera
}

export function EliminarCarreraDialog({ open, onOpenChange, carrera }: EliminarCarreraDialogProps) {
    const { mutate: deleteCarrera, isPending, error } = useDeleteCarrera()

    const handleConfirm = () => {
        deleteCarrera(carrera.id, {
            onSuccess: () => onOpenChange(false),
        })
    }

    return (
        <Dialog open={open} onOpenChange={(v) => !isPending && onOpenChange(v)}>
            <DialogContent className="sm:max-w-md bg-white">
                <DialogHeader>
                    <DialogTitle className="text-xl font-extrabold text-gray-900">
                        Eliminar carrera
                    </DialogTitle>
                    <DialogDescription>
                        Esta acción no se puede deshacer. Se eliminarán todos los grupos y datos asociados.
                    </DialogDescription>
                </DialogHeader>

                <div className="rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
                    ¿Estás seguro de que quieres eliminar{" "}
                    <span className="font-bold">{carrera.nombre}</span>?
                </div>

                {error && (
                    <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
                        {error.message}
                    </p>
                )}

                <DialogFooter className="gap-2">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isPending}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={isPending}
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold"
                    >
                        {isPending ? "Eliminando..." : "Sí, eliminar"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
