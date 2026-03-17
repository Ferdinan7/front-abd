import {
    Dialog, DialogContent, DialogDescription,
    DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useDeleteMateria } from "@/hooks/use-materias"
import type { Materia } from "@/api/materias.api"

interface EliminarMateriaDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    materia: Materia
}

export function EliminarMateriaDialog({ open, onOpenChange, materia }: EliminarMateriaDialogProps) {
    const { mutate: remove, isPending, error } = useDeleteMateria(materia.carreraId)

    return (
        <Dialog open={open} onOpenChange={(v) => !isPending && onOpenChange(v)}>
            <DialogContent className="sm:max-w-md bg-white">
                <DialogHeader>
                    <DialogTitle className="text-xl font-extrabold text-gray-900">Eliminar materia</DialogTitle>
                    <DialogDescription>Esta acción no se puede deshacer. Se perderán todas las asignaciones relacionadas.</DialogDescription>
                </DialogHeader>

                <div className="rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
                    ¿Estás seguro de que quieres eliminar{" "}
                    <span className="font-bold">{materia.nombre}</span>
                    {materia.codigo && <span className="font-normal text-red-500"> ({materia.codigo})</span>}?
                </div>

                {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error.message}</p>}

                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>Cancelar</Button>
                    <Button onClick={() => remove(materia.id, { onSuccess: () => onOpenChange(false) })} disabled={isPending} className="bg-red-600 hover:bg-red-700 text-white font-semibold">
                        {isPending ? "Eliminando..." : "Sí, eliminar"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
