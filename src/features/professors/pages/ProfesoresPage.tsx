import { useState } from "react"
import { useParams, Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import {
    Dialog, DialogContent, DialogDescription,
    DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import {
    useProfesores,
    useCreateProfesor,
    useUpdateProfesor,
    useDeleteProfesor,
} from "@/hooks/use-profesores"
import type { Profesor } from "@/api/profesores.api"
import {
    Plus, Pencil, Trash2, Mail, UserCheck,
    UserRoundX, Users,
} from "lucide-react"

function NuevoProfesorDialog({
    open,
    onOpenChange,
    carreraId,
}: {
    open: boolean
    onOpenChange: (v: boolean) => void
    carreraId: string
}) {
    const [nombre, setNombre] = useState("")
    const [email, setEmail] = useState("")
    const { mutate, isPending, error } = useCreateProfesor()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!nombre.trim()) return
        mutate(
            { nombre_completo: nombre.trim(), email: email.trim() || undefined, carrera_id: carreraId },
            {
                onSuccess: () => {
                    setNombre("")
                    setEmail("")
                    onOpenChange(false)
                },
            }
        )
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md bg-white">
                <DialogHeader>
                    <DialogTitle className="text-xl font-extrabold text-gray-900">Agregar Profesor</DialogTitle>
                    <DialogDescription>
                        El correo electrónico debe coincidir con la cuenta Google que el profesor usará para acceder al sistema.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Nombre completo *</label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            placeholder="Ej: María González López"
                            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e40af]/30 focus:border-[#1e40af]"
                            required
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">
                            Correo electrónico
                            <span className="ml-1 text-xs font-normal text-gray-400">(Google)</span>
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="profesor@gmail.com"
                            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e40af]/30 focus:border-[#1e40af]"
                        />
                        <p className="text-xs text-gray-400">
                            Al ingresar su correo Google, el profesor podrá acceder al sistema y ver su horario.
                        </p>
                    </div>
                    {error && (
                        <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{error.message}</p>
                    )}
                    <div className="flex gap-2 pt-1">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="flex-1 font-semibold"
                            disabled={isPending}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={isPending || !nombre.trim()}
                            className="flex-1 bg-[#1e40af] hover:bg-blue-800 text-white font-semibold"
                        >
                            {isPending ? "Guardando…" : "Agregar"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

function EditarProfesorDialog({
    open,
    onOpenChange,
    profesor,
}: {
    open: boolean
    onOpenChange: (v: boolean) => void
    profesor: Profesor
}) {
    const [nombre, setNombre] = useState(profesor.nombre_completo)
    const [email, setEmail] = useState(profesor.email ?? "")
    const { mutate, isPending, error } = useUpdateProfesor()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        mutate(
            { id: profesor.id, dto: { nombre_completo: nombre.trim(), email: email.trim() || undefined } },
            { onSuccess: () => onOpenChange(false) }
        )
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md bg-white">
                <DialogHeader>
                    <DialogTitle className="text-xl font-extrabold text-gray-900">Editar Profesor</DialogTitle>
                    <DialogDescription>Actualiza los datos del profesor.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Nombre completo *</label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e40af]/30 focus:border-[#1e40af]"
                            required
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">
                            Correo electrónico
                            <span className="ml-1 text-xs font-normal text-gray-400">(Google)</span>
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e40af]/30 focus:border-[#1e40af]"
                        />
                    </div>
                    {error && (
                        <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{error.message}</p>
                    )}
                    <div className="flex gap-2 pt-1">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="flex-1 font-semibold"
                            disabled={isPending}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={isPending || !nombre.trim()}
                            className="flex-1 bg-[#1e40af] hover:bg-blue-800 text-white font-semibold"
                        >
                            {isPending ? "Guardando…" : "Guardar"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

function EliminarProfesorDialog({
    open,
    onOpenChange,
    profesor,
}: {
    open: boolean
    onOpenChange: (v: boolean) => void
    profesor: Profesor
}) {
    const { mutate, isPending, error } = useDeleteProfesor()

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md bg-white">
                <DialogHeader>
                    <DialogTitle className="text-xl font-extrabold text-gray-900">Eliminar Profesor</DialogTitle>
                    <DialogDescription>Esta acción no se puede deshacer.</DialogDescription>
                </DialogHeader>
                <div className="py-3">
                    <p className="text-sm text-gray-600">
                        ¿Estás seguro de que deseas eliminar a{" "}
                        <span className="font-bold text-gray-900">{profesor.nombre_completo}</span>?
                        También se eliminarán sus asignaciones activas.
                    </p>
                </div>
                {error && (
                    <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{error.message}</p>
                )}
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="flex-1 font-semibold"
                        disabled={isPending}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={() => mutate(profesor.id, { onSuccess: () => onOpenChange(false) })}
                        disabled={isPending}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold"
                    >
                        {isPending ? "Eliminando…" : "Eliminar"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export function ProfesoresPage() {
    const { projectId: carreraId } = useParams({ from: "/projects/$projectId/professors" })
    const { data: profesores, isLoading, isError } = useProfesores()

    const [createOpen, setCreateOpen] = useState(false)
    const [editTarget, setEditTarget] = useState<Profesor | null>(null)
    const [deleteTarget, setDeleteTarget] = useState<Profesor | null>(null)

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <NuevoProfesorDialog
                open={createOpen}
                onOpenChange={setCreateOpen}
                carreraId={carreraId}
            />
            {editTarget && (
                <EditarProfesorDialog
                    open={Boolean(editTarget)}
                    onOpenChange={(v) => !v && setEditTarget(null)}
                    profesor={editTarget}
                />
            )}
            {deleteTarget && (
                <EliminarProfesorDialog
                    open={Boolean(deleteTarget)}
                    onOpenChange={(v) => !v && setDeleteTarget(null)}
                    profesor={deleteTarget}
                />
            )}

            {/* Breadcrumb */}
            <nav className="text-sm font-medium text-gray-500">
                <ol className="flex items-center space-x-2">
                    <li>
                        <Link to="/projects" className="hover:text-gray-900 transition-colors">
                            Carreras
                        </Link>
                    </li>
                    <li><span className="text-gray-300">›</span></li>
                    <li className="text-gray-900 font-bold">Profesores</li>
                </ol>
            </nav>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Profesores</h1>
                    <p className="text-gray-500 mt-1 text-sm">
                        Registra los profesores de esta carrera. Ingresa su correo Google para que puedan acceder al sistema.
                    </p>
                </div>
                <Button
                    onClick={() => setCreateOpen(true)}
                    className="bg-[#1e40af] hover:bg-blue-800 text-white rounded-lg px-5 py-2.5 font-semibold shadow-sm transition-transform active:scale-95 flex items-center gap-2 shrink-0"
                >
                    <Plus className="w-5 h-5" />
                    Agregar Profesor
                </Button>
            </div>

            {isLoading && (
                <div className="space-y-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
                    ))}
                </div>
            )}

            {isError && (
                <div className="rounded-xl bg-red-50 border border-red-100 text-red-600 px-5 py-4 text-sm font-medium">
                    Error al cargar los profesores. Verifica tu conexión.
                </div>
            )}

            {!isLoading && !isError && profesores && (
                profesores.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
                        <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center">
                            <Users className="w-8 h-8 text-gray-300" />
                        </div>
                        <p className="font-semibold text-gray-500">Sin profesores registrados</p>
                        <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
                            Agrega los profesores de la carrera. Podrán iniciar sesión con su cuenta Google para ver su horario.
                        </p>
                        <Button
                            onClick={() => setCreateOpen(true)}
                            variant="outline"
                            className="mt-2 font-semibold gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Agregar primer profesor
                        </Button>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="divide-y divide-gray-50">
                            {profesores.map((prof) => (
                                <div
                                    key={prof.id}
                                    className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors group"
                                >
                                    {/* Avatar */}
                                    <div className="w-10 h-10 rounded-xl bg-[#e0e7ff] flex items-center justify-center shrink-0">
                                        <span className="text-sm font-extrabold text-[#1e40af]">
                                            {prof.nombre_completo.charAt(0).toUpperCase()}
                                        </span>
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-bold text-gray-900 truncate">
                                                {prof.nombre_completo}
                                            </p>
                                            {prof.activo === false && (
                                                <span className="shrink-0 inline-flex items-center gap-1 text-[10px] font-bold bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded">
                                                    <UserRoundX className="w-2.5 h-2.5" />
                                                    Inactivo
                                                </span>
                                            )}
                                            {prof.activo !== false && prof.email && (
                                                <span className="shrink-0 inline-flex items-center gap-1 text-[10px] font-bold bg-green-50 text-green-600 px-1.5 py-0.5 rounded">
                                                    <UserCheck className="w-2.5 h-2.5" />
                                                    Con acceso
                                                </span>
                                            )}
                                        </div>
                                        {prof.email && (
                                            <div className="flex items-center gap-1 mt-0.5">
                                                <Mail className="w-3 h-3 text-gray-400 shrink-0" />
                                                <p className="text-xs text-gray-400 truncate">{prof.email}</p>
                                            </div>
                                        )}
                                        {!prof.email && (
                                            <p className="text-xs text-amber-500 mt-0.5">
                                                Sin correo — no puede acceder al sistema
                                            </p>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                        <button
                                            onClick={() => setEditTarget(prof)}
                                            className="p-2 rounded-lg text-gray-400 hover:text-[#1e40af] hover:bg-blue-50 transition-colors"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => setDeleteTarget(prof)}
                                            className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )
            )}
        </div>
    )
}
