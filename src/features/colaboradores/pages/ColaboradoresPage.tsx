import { useState } from "react"
import { Link, useParams } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    useColaboradores,
    useUpdateColaborador,
    useDeleteColaborador,
} from "@/hooks/use-colaboradores"
import { colaboradoresApi } from "@/api/colaboradores.api"
import { profesoresApi } from "@/api/profesores.api"
import type { Colaborador, ColaboradorRol } from "@/api/colaboradores.api"
import { Plus, Pencil, Trash2, ShieldCheck, Eye, UserPlus, AlertTriangle } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { resolveAvatarUrl, avatarColor } from "@/lib/avatar"

// ─── Flujo doble: Agregar persona (colaborador + profesor) ───────────────────

interface AgregarPersonaResult {
    colaboradorOk: boolean
    profesorOk: boolean
    colaboradorError?: string
    profesorError?: string
}

interface AgregarPersonaDialogProps {
    open: boolean
    onOpenChange: (v: boolean) => void
    carreraId: string
    onSuccess: () => void
}

function AgregarPersonaDialog({ open, onOpenChange, carreraId, onSuccess }: AgregarPersonaDialogProps) {
    const [email, setEmail] = useState("")
    const [nombre, setNombre] = useState("")
    const [rol, setRol] = useState<ColaboradorRol>("viewer")
    const [isPending, setIsPending] = useState(false)
    const [result, setResult] = useState<AgregarPersonaResult | null>(null)

    const reset = () => {
        setEmail("")
        setNombre("")
        setRol("viewer")
        setResult(null)
    }

    const handleClose = (v: boolean) => {
        if (!isPending) {
            reset()
            onOpenChange(v)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email.trim() || !nombre.trim()) return

        setIsPending(true)
        setResult(null)

        let colaboradorOk = false
        let colaboradorError: string | undefined
        let profesorOk = false
        let profesorError: string | undefined

        // Paso 1 — Dar acceso (colaborador). El 404 significa que aún no existe en profiles.
        try {
            await colaboradoresApi.create(carreraId, { email: email.trim(), rol })
            colaboradorOk = true
        } catch (err) {
            const msg = err instanceof Error ? err.message : String(err)
            colaboradorError = msg.toLowerCase().includes("404") || msg.toLowerCase().includes("does not exist")
                ? "Esta persona aún no tiene cuenta en el sistema. Podrá acceder a la carrera una vez que inicie sesión por primera vez."
                : msg
        }

        // Paso 2 — Crear/vincular profesor (siempre, incluso si el paso 1 falló)
        try {
            await profesoresApi.create({ nombre_completo: nombre.trim(), email: email.trim(), carrera_id: carreraId })
            profesorOk = true
        } catch (err) {
            profesorError = err instanceof Error ? err.message : String(err)
        }

        setIsPending(false)
        const res: AgregarPersonaResult = { colaboradorOk, colaboradorError, profesorOk, profesorError }
        setResult(res)

    }

    const bothFailed = result && !result.colaboradorOk && !result.profesorOk

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md bg-white">
                <DialogHeader>
                    <DialogTitle className="text-xl font-extrabold text-gray-900">
                        Agregar persona a la carrera
                    </DialogTitle>
                    <DialogDescription>
                        Le dará acceso como colaborador <strong>y</strong> la registrará como profesor asignable en materias.
                    </DialogDescription>
                </DialogHeader>

                {!result ? (
                    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700">
                                Nombre completo <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                placeholder="Ej: María González López"
                                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e40af]/30 focus:border-[#1e40af]"
                                required
                                disabled={isPending}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700">
                                Correo electrónico <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="persona@gmail.com"
                                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e40af]/30 focus:border-[#1e40af]"
                                required
                                disabled={isPending}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700">Rol de acceso</label>
                            <div className="flex gap-2">
                                {([
                                    { value: "viewer" as ColaboradorRol, label: "Solo lectura", icon: <Eye className="w-3.5 h-3.5" /> },
                                    { value: "admin" as ColaboradorRol, label: "Administrador", icon: <ShieldCheck className="w-3.5 h-3.5" /> },
                                ]).map((r) => (
                                    <button
                                        key={r.value}
                                        type="button"
                                        onClick={() => setRol(r.value)}
                                        disabled={isPending}
                                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold border transition-colors flex items-center justify-center gap-1.5 ${
                                            rol === r.value
                                                ? "bg-[#1e40af] text-white border-[#1e40af]"
                                                : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                                        }`}
                                    >
                                        {r.icon}
                                        {r.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-2 pt-1">
                            <Button type="button" variant="outline" onClick={() => handleClose(false)} disabled={isPending} className="flex-1 font-semibold">
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                disabled={isPending || !email.trim() || !nombre.trim()}
                                className="flex-1 bg-[#1e40af] hover:bg-blue-800 text-white font-semibold gap-2"
                            >
                                <UserPlus className="w-4 h-4" />
                                {isPending ? "Procesando…" : "Agregar"}
                            </Button>
                        </div>
                    </form>
                ) : (
                    <div className="space-y-3 pt-2">
                        {/* Resultado paso 1: acceso */}
                        <div className={`rounded-xl p-3.5 text-sm space-y-1 ${result.colaboradorOk ? "bg-green-50 border border-green-100" : "bg-amber-50 border border-amber-100"}`}>
                            <p className={`font-semibold ${result.colaboradorOk ? "text-green-700" : "text-amber-700"}`}>
                                {result.colaboradorOk ? "✓ Acceso a la carrera otorgado" : "⚠ No se pudo dar acceso"}
                            </p>
                            {result.colaboradorError && (
                                <p className="text-amber-600 text-xs leading-relaxed">{result.colaboradorError}</p>
                            )}
                        </div>

                        {/* Resultado paso 2: profesor */}
                        <div className={`rounded-xl p-3.5 text-sm space-y-1 ${result.profesorOk ? "bg-green-50 border border-green-100" : "bg-red-50 border border-red-100"}`}>
                            <p className={`font-semibold ${result.profesorOk ? "text-green-700" : "text-red-700"}`}>
                                {result.profesorOk ? "✓ Registrada como profesor asignable" : "✗ No se pudo crear el vínculo de profesor"}
                            </p>
                            {result.profesorError && (
                                <p className="text-red-600 text-xs">{result.profesorError}</p>
                            )}
                        </div>

                        {bothFailed && (
                            <div className="flex items-start gap-2 bg-red-50 border border-red-100 rounded-xl p-3 text-xs text-red-600">
                                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                                <span>Ambas operaciones fallaron. Verifica los datos e intenta de nuevo.</span>
                            </div>
                        )}

                        <div className="flex gap-2 pt-1">
                            {!bothFailed && (
                                <Button
                                    onClick={() => {
                                        onSuccess()
                                        reset()
                                        onOpenChange(false)
                                    }}
                                    className="flex-1 bg-[#1e40af] hover:bg-blue-800 text-white font-semibold"
                                >
                                    Listo
                                </Button>
                            )}
                            {bothFailed && (
                                <>
                                    <Button variant="outline" onClick={() => setResult(null)} className="flex-1 font-semibold">
                                        Reintentar
                                    </Button>
                                    <Button variant="outline" onClick={() => handleClose(false)} className="flex-1 font-semibold">
                                        Cerrar
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}

// ─── Cambiar rol de colaborador ───────────────────────────────────────────────

function CambiarRolDialog({
    open, onOpenChange, colaborador, carreraId,
}: { open: boolean; onOpenChange: (v: boolean) => void; colaborador: Colaborador; carreraId: string }) {
    const [rol, setRol] = useState<ColaboradorRol>(colaborador.rol)
    const { mutate, isPending, error } = useUpdateColaborador(carreraId)

    return (
        <Dialog open={open} onOpenChange={(v) => !isPending && onOpenChange(v)}>
            <DialogContent className="sm:max-w-xs bg-white">
                <DialogHeader>
                    <DialogTitle className="text-lg font-extrabold text-gray-900">Cambiar rol</DialogTitle>
                    <DialogDescription>
                        {colaborador.user?.email ?? colaborador.user?.nombre ?? "Colaborador"}
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                    <div className="flex gap-2">
                        {([
                            { value: "viewer" as ColaboradorRol, label: "Solo lectura", icon: <Eye className="w-3.5 h-3.5" /> },
                            { value: "admin" as ColaboradorRol, label: "Administrador", icon: <ShieldCheck className="w-3.5 h-3.5" /> },
                        ]).map((r) => (
                            <button
                                key={r.value}
                                type="button"
                                onClick={() => setRol(r.value)}
                                disabled={isPending}
                                className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold border transition-colors flex items-center justify-center gap-1.5 ${
                                    rol === r.value
                                        ? "bg-[#1e40af] text-white border-[#1e40af]"
                                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                                }`}
                            >
                                {r.icon}
                                {r.label}
                            </button>
                        ))}
                    </div>
                    {error && <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{error.message}</p>}
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending} className="flex-1 font-semibold">Cancelar</Button>
                        <Button
                            onClick={() => mutate({ id: colaborador.id, dto: { rol } }, { onSuccess: () => onOpenChange(false) })}
                            disabled={isPending || rol === colaborador.rol}
                            className="flex-1 bg-[#1e40af] hover:bg-blue-800 text-white font-semibold"
                        >
                            {isPending ? "Guardando…" : "Guardar"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

// ─── Eliminar colaborador ─────────────────────────────────────────────────────

function EliminarColaboradorDialog({
    open, onOpenChange, colaborador, carreraId,
}: { open: boolean; onOpenChange: (v: boolean) => void; colaborador: Colaborador; carreraId: string }) {
    const { mutate, isPending, error } = useDeleteColaborador(carreraId)
    const displayName = colaborador.user?.full_name ?? colaborador.user?.nombre ?? colaborador.user?.email ?? "este colaborador"

    return (
        <Dialog open={open} onOpenChange={(v) => !isPending && onOpenChange(v)}>
            <DialogContent className="sm:max-w-xs bg-white">
                <DialogHeader>
                    <DialogTitle className="text-lg font-extrabold text-gray-900">Eliminar colaborador</DialogTitle>
                    <DialogDescription>Esta acción no se puede deshacer.</DialogDescription>
                </DialogHeader>
                <div className="py-3 space-y-4">
                    <p className="text-sm text-gray-600">
                        ¿Eliminar a <span className="font-bold text-gray-900">{displayName}</span> de la carrera?
                        Perderá acceso, pero su registro de profesor se mantendrá.
                    </p>
                    {error && <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{error.message}</p>}
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending} className="flex-1 font-semibold">Cancelar</Button>
                        <Button
                            onClick={() => mutate(colaborador.id, { onSuccess: () => onOpenChange(false) })}
                            disabled={isPending}
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold"
                        >
                            {isPending ? "Eliminando…" : "Eliminar"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

// ─── Página principal ─────────────────────────────────────────────────────────

export function ColaboradoresPage() {
    const { projectId: carreraId } = useParams({ from: "/projects/$projectId/colaboradores" })

    const { data: colaboradores, isLoading, isError, refetch } = useColaboradores(carreraId)
    const [addOpen, setAddOpen] = useState(false)
    const [editTarget, setEditTarget] = useState<Colaborador | null>(null)
    const [deleteTarget, setDeleteTarget] = useState<Colaborador | null>(null)

    const resolveColaboradorIdentity = (col: Colaborador) => {
        const raw = col as unknown as Record<string, unknown>
        const user = (raw.user as Record<string, unknown> | undefined) ?? {}
        const profile = (raw.profile as Record<string, unknown> | undefined) ?? {}

        const fullName =
            (user.full_name as string | undefined) ??
            (user.nombre as string | undefined) ??
            (profile.full_name as string | undefined) ??
            (profile.nombre as string | undefined) ??
            (raw.full_name as string | undefined) ??
            (raw.nombre as string | undefined)

        const email =
            (user.email as string | undefined) ??
            (profile.email as string | undefined) ??
            (raw.email as string | undefined)

        // avatar_url proviene de Supabase (Google OAuth lo almacena aquí)
        const avatarUrl =
            (user.avatar_url as string | undefined) ??
            (profile.avatar_url as string | undefined) ??
            (raw.avatar_url as string | undefined)

        const displayName = fullName ?? email ?? "Sin nombre"
        const photoUrl = resolveAvatarUrl({ avatarUrl })
        return { displayName, email: email ?? "", photoUrl }
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <AgregarPersonaDialog
                open={addOpen}
                onOpenChange={setAddOpen}
                carreraId={carreraId}
                onSuccess={async () => {
                    await refetch()
                    window.location.reload()
                }}
            />

            {editTarget && (
                <CambiarRolDialog
                    open={Boolean(editTarget)}
                    onOpenChange={(v) => !v && setEditTarget(null)}
                    colaborador={editTarget}
                    carreraId={carreraId}
                />
            )}

            {deleteTarget && (
                <EliminarColaboradorDialog
                    open={Boolean(deleteTarget)}
                    onOpenChange={(v) => !v && setDeleteTarget(null)}
                    colaborador={deleteTarget}
                    carreraId={carreraId}
                />
            )}

            {/* Breadcrumb */}
            <nav className="text-sm font-medium text-gray-500">
                <ol className="flex items-center space-x-2">
                    <li><Link to="/projects" className="hover:text-gray-900 transition-colors">Carreras</Link></li>
                    <li><span className="text-gray-300">›</span></li>
                    <li>
                    <Link to="/projects/$projectId/groups" params={{ projectId: carreraId }} className="hover:text-gray-900 transition-colors">
                        Grupos
                    </Link>
                    </li>
                    <li><span className="text-gray-300">›</span></li>
                    <li className="text-gray-900 font-bold">Colaboradores</li>
                </ol>
            </nav>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Colaboradores</h1>
                    <p className="text-gray-500 mt-1 text-sm">
                        Personas con acceso a esta carrera. Al agregar una persona también se registra como profesor asignable.
                    </p>
                </div>
                <Button
                    onClick={() => setAddOpen(true)}
                    className="bg-[#1e40af] hover:bg-blue-800 text-white rounded-lg px-5 py-2.5 font-semibold shadow-sm transition-transform active:scale-95 flex items-center gap-2 shrink-0"
                >
                    <Plus className="w-5 h-5" />
                    Agregar persona
                </Button>
            </div>

            {isLoading && (
                <div className="space-y-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
                    ))}
                </div>
            )}

            {isError && (
                <div className="rounded-xl bg-red-50 border border-red-100 text-red-600 px-5 py-4 text-sm font-medium">
                    Error al cargar los colaboradores. Verifica tu conexión.
                </div>
            )}

            {!isLoading && !isError && colaboradores && (
                colaboradores.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
                        <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center">
                            <UserPlus className="w-8 h-8 text-gray-300" />
                        </div>
                        <p className="font-semibold text-gray-500">Sin colaboradores</p>
                        <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
                            Agrega personas para que puedan acceder y gestionar esta carrera.
                        </p>
                        <Button onClick={() => setAddOpen(true)} variant="outline" className="mt-2 font-semibold gap-2">
                            <Plus className="w-4 h-4" />
                            Agregar primera persona
                        </Button>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="divide-y divide-gray-50">
                            {colaboradores.map((col) => {
                                const { displayName, email: displayEmail, photoUrl } = resolveColaboradorIdentity(col)
                                const isAdmin = col.rol === "admin"
                                const fallbackColor = avatarColor(displayName)

                                return (
                                    <div key={col.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors group">
                                        <Avatar className="w-10 h-10 rounded-xl shrink-0">
                                            <AvatarImage src={photoUrl} alt={displayName} className="object-cover rounded-xl" />
                                            <AvatarFallback className={`rounded-xl text-sm font-extrabold ${fallbackColor}`}>
                                                {displayName.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <p className="text-sm font-bold text-gray-900 truncate">{displayName}</p>
                                                <span className={`shrink-0 inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                                    isAdmin ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"
                                                }`}>
                                                    {isAdmin ? <ShieldCheck className="w-2.5 h-2.5" /> : <Eye className="w-2.5 h-2.5" />}
                                                    {isAdmin ? "Admin" : "Viewer"}
                                                </span>
                                            </div>
                                            {displayEmail && (
                                                <p className="text-xs text-gray-500 truncate mt-0.5">{displayEmail}</p>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => setEditTarget(col)}
                                                className="p-2 rounded-lg text-gray-400 hover:text-[#1e40af] hover:bg-blue-50 transition-colors"
                                                title="Cambiar rol"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => setDeleteTarget(col)}
                                                className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                                title="Eliminar colaborador"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )
            )}
        </div>
    )
}
