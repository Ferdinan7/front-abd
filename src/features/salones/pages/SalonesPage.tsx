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
    useSalones,
    useCreateSalon,
    useUpdateSalon,
    useDeleteSalon,
} from "@/hooks/use-salones"
import type { Salon, SalonTipo } from "@/api/salones.api"
import { Plus, Pencil, Trash2, DoorOpen, Building2 } from "lucide-react"

const TIPOS_SALON: { value: SalonTipo; label: string }[] = [
    { value: "aula", label: "Aula" },
    { value: "laboratorio", label: "Laboratorio" },
    { value: "sala", label: "Sala" },
]

const TIPO_COLORS: Record<string, string> = {
    aula: "bg-blue-50 text-blue-700",
    laboratorio: "bg-emerald-50 text-emerald-700",
    sala: "bg-violet-50 text-violet-700",
}

// ─── Nuevo salón ──────────────────────────────────────────────────────────────

function NuevoSalonDialog({ open, onOpenChange, carreraId }: { open: boolean; onOpenChange: (v: boolean) => void; carreraId: string }) {
    const [nombre, setNombre] = useState("")
    const [edificio, setEdificio] = useState("")
    const [tipo, setTipo] = useState<SalonTipo>("aula")
    const { mutate, isPending, error } = useCreateSalon(carreraId)

    const reset = () => { setNombre(""); setEdificio(""); setTipo("aula") }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!nombre.trim()) return
        mutate(
            { nombre: nombre.trim(), edificio: edificio.trim() || undefined, tipo },
            { onSuccess: () => { reset(); onOpenChange(false) } }
        )
    }

    return (
        <Dialog open={open} onOpenChange={(v) => { if (!isPending) { reset(); onOpenChange(v) } }}>
            <DialogContent className="sm:max-w-md bg-white">
                <DialogHeader>
                    <DialogTitle className="text-xl font-extrabold text-gray-900">Nuevo salón</DialogTitle>
                    <DialogDescription>El nombre debe ser único en todo el sistema.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">
                            Nombre <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            placeholder="Ej: A-101"
                            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e40af]/30 focus:border-[#1e40af]"
                            required
                            disabled={isPending}
                            autoFocus
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Edificio</label>
                        <input
                            type="text"
                            value={edificio}
                            onChange={(e) => setEdificio(e.target.value)}
                            placeholder="Ej: Edificio A"
                            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e40af]/30 focus:border-[#1e40af]"
                            disabled={isPending}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Tipo</label>
                        <div className="flex gap-2 flex-wrap">
                            {TIPOS_SALON.map((t) => (
                                <button
                                    key={t.value}
                                    type="button"
                                    onClick={() => setTipo(t.value)}
                                    disabled={isPending}
                                    className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition-colors ${
                                        tipo === t.value
                                            ? "bg-[#1e40af] text-white border-[#1e40af]"
                                            : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                                    }`}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    {error && <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{error.message}</p>}
                    <div className="flex gap-2 pt-1">
                        <Button type="button" variant="outline" onClick={() => { reset(); onOpenChange(false) }} disabled={isPending} className="flex-1 font-semibold">Cancelar</Button>
                        <Button type="submit" disabled={isPending || !nombre.trim()} className="flex-1 bg-[#1e40af] hover:bg-blue-800 text-white font-semibold">
                            {isPending ? "Creando…" : "Crear salón"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

// ─── Editar salón ─────────────────────────────────────────────────────────────

function EditarSalonDialog({ open, onOpenChange, salon, carreraId }: { open: boolean; onOpenChange: (v: boolean) => void; salon: Salon; carreraId: string }) {
    const [nombre, setNombre] = useState(salon.nombre)
    const [edificio, setEdificio] = useState(salon.edificio ?? "")
    const [tipo, setTipo] = useState<SalonTipo>(salon.tipo ?? "aula")
    const { mutate, isPending, error } = useUpdateSalon(carreraId)

    return (
        <Dialog open={open} onOpenChange={(v) => !isPending && onOpenChange(v)}>
            <DialogContent className="sm:max-w-md bg-white">
                <DialogHeader>
                    <DialogTitle className="text-xl font-extrabold text-gray-900">Editar salón</DialogTitle>
                    <DialogDescription>Actualiza los datos del salón.</DialogDescription>
                </DialogHeader>
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        if (!nombre.trim()) return
                        mutate(
                            { id: salon.id, dto: { nombre: nombre.trim(), edificio: edificio.trim() || undefined, tipo } },
                            { onSuccess: () => onOpenChange(false) }
                        )
                    }}
                    className="space-y-4 pt-2"
                >
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Nombre <span className="text-red-500">*</span></label>
                        <input
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e40af]/30 focus:border-[#1e40af]"
                            required
                            disabled={isPending}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Edificio</label>
                        <input
                            type="text"
                            value={edificio}
                            onChange={(e) => setEdificio(e.target.value)}
                            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e40af]/30 focus:border-[#1e40af]"
                            disabled={isPending}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Tipo</label>
                        <div className="flex gap-2 flex-wrap">
                            {TIPOS_SALON.map((t) => (
                                <button
                                    key={t.value}
                                    type="button"
                                    onClick={() => setTipo(t.value)}
                                    disabled={isPending}
                                    className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition-colors ${
                                        tipo === t.value
                                            ? "bg-[#1e40af] text-white border-[#1e40af]"
                                            : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                                    }`}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    {error && <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{error.message}</p>}
                    <div className="flex gap-2 pt-1">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending} className="flex-1 font-semibold">Cancelar</Button>
                        <Button type="submit" disabled={isPending || !nombre.trim()} className="flex-1 bg-[#1e40af] hover:bg-blue-800 text-white font-semibold">
                            {isPending ? "Guardando…" : "Guardar"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

// ─── Eliminar salón ───────────────────────────────────────────────────────────

function EliminarSalonDialog({ open, onOpenChange, salon, carreraId }: { open: boolean; onOpenChange: (v: boolean) => void; salon: Salon; carreraId: string }) {
    const { mutate, isPending, error } = useDeleteSalon(carreraId)
    return (
        <Dialog open={open} onOpenChange={(v) => !isPending && onOpenChange(v)}>
            <DialogContent className="sm:max-w-xs bg-white">
                <DialogHeader>
                    <DialogTitle className="text-lg font-extrabold text-gray-900">Eliminar salón</DialogTitle>
                    <DialogDescription>Esta acción no se puede deshacer.</DialogDescription>
                </DialogHeader>
                <div className="py-3 space-y-4">
                    <p className="text-sm text-gray-600">
                        ¿Eliminar el salón <span className="font-bold text-gray-900">{salon.nombre}</span>?
                    </p>
                    {error && <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{error.message}</p>}
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending} className="flex-1 font-semibold">Cancelar</Button>
                        <Button
                            onClick={() => mutate(salon.id, { onSuccess: () => onOpenChange(false) })}
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

export function SalonesPage() {
    const { projectId: carreraId } = useParams({ from: "/projects/$projectId/salones" })

    const { data: salones, isLoading, isError } = useSalones(carreraId)
    const [createOpen, setCreateOpen] = useState(false)
    const [editTarget, setEditTarget] = useState<Salon | null>(null)
    const [deleteTarget, setDeleteTarget] = useState<Salon | null>(null)

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <NuevoSalonDialog open={createOpen} onOpenChange={setCreateOpen} carreraId={carreraId} />

            {editTarget && (
                <EditarSalonDialog
                    open={Boolean(editTarget)}
                    onOpenChange={(v) => !v && setEditTarget(null)}
                    salon={editTarget}
                    carreraId={carreraId}
                />
            )}

            {deleteTarget && (
                <EliminarSalonDialog
                    open={Boolean(deleteTarget)}
                    onOpenChange={(v) => !v && setDeleteTarget(null)}
                    salon={deleteTarget}
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
                    <li className="text-gray-900 font-bold">Salones</li>
                </ol>
            </nav>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Salones</h1>
                    <p className="text-gray-500 mt-1 text-sm">
                        Aulas, laboratorios y talleres asociados a esta carrera.
                    </p>
                </div>
                <Button
                    onClick={() => setCreateOpen(true)}
                    className="bg-[#1e40af] hover:bg-blue-800 text-white rounded-lg px-5 py-2.5 font-semibold shadow-sm transition-transform active:scale-95 flex items-center gap-2 shrink-0"
                >
                    <Plus className="w-5 h-5" />
                    Nuevo salón
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
                    Error al cargar los salones. Verifica tu conexión.
                </div>
            )}

            {!isLoading && !isError && salones && (
                salones.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
                        <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center">
                            <DoorOpen className="w-8 h-8 text-gray-300" />
                        </div>
                        <p className="font-semibold text-gray-500">Sin salones registrados</p>
                        <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
                            Registra los salones disponibles para esta carrera.
                        </p>
                        <Button onClick={() => setCreateOpen(true)} variant="outline" className="mt-2 font-semibold gap-2">
                            <Plus className="w-4 h-4" />
                            Agregar primer salón
                        </Button>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="divide-y divide-gray-50">
                            {salones.map((salon) => (
                                <div key={salon.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors group">
                                    <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                                        <DoorOpen className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <p className="text-sm font-bold text-gray-900">{salon.nombre}</p>
                                            {salon.tipo && (
                                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${TIPO_COLORS[salon.tipo] ?? "bg-gray-100 text-gray-500"}`}>
                                                    {salon.tipo.toUpperCase()}
                                                </span>
                                            )}
                                        </div>
                                        {salon.edificio && (
                                            <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                                                <Building2 className="w-3 h-3" />
                                                {salon.edificio}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => setEditTarget(salon)} className="p-2 rounded-lg text-gray-400 hover:text-[#1e40af] hover:bg-blue-50 transition-colors">
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => setDeleteTarget(salon)} className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors">
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
