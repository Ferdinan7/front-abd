import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useDeleteGrupo } from "@/hooks/use-grupos"
import type { Grupo } from "@/api/grupos.api"

interface EliminarGrupoDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    grupo: Grupo
}

export function EliminarGrupoDialog({ open, onOpenChange, grupo }: EliminarGrupoDialogProps) {
    const { mutate: deleteGrupo, isPending, error } = useDeleteGrupo(grupo.carreraId)

    const handleConfirm = () => {
        deleteGrupo(grupo.id, {
            onSuccess: () => onOpenChange(false),
        })
    }

    return (
        <Dialog open={open} onOpenChange={(v) => !isPending && onOpenChange(v)}>
            <DialogContent className="sm:max-w-md bg-white">
                <DialogHeader>
                    <DialogTitle className="text-xl font-extrabold text-gray-900">
                        Eliminar grupo
                    </DialogTitle>
                    <DialogDescription>
                        Esta acción no se puede deshacer. Se eliminarán todas las asignaciones y horarios del grupo.
                    </DialogDescription>
                </DialogHeader>

                <div className="rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
                    ¿Estás seguro de que quieres eliminar el grupo{" "}
                    <span className="font-bold">{grupo.grado}° &quot;{grupo.seccion}&quot;</span>?
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
