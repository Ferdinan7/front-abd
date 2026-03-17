import { useState } from "react"
import { useParams, Link } from "@tanstack/react-router"
import { Plus, BookOpen, Pencil, Trash2, Hash, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMaterias } from "@/hooks/use-materias"
import { NuevaMateriaDialog } from "../components/NuevaMateriaDialog"
import { EditarMateriaDialog } from "../components/EditarMateriaDialog"
import { EliminarMateriaDialog } from "../components/EliminarMateriaDialog"
import type { Materia } from "@/api/materias.api"

const GRADO_COLORS = [
    "bg-blue-50 text-blue-700 border-blue-100",
    "bg-indigo-50 text-indigo-700 border-indigo-100",
    "bg-violet-50 text-violet-700 border-violet-100",
    "bg-emerald-50 text-emerald-700 border-emerald-100",
    "bg-amber-50 text-amber-700 border-amber-100",
]

export function MateriasPage() {
    const { projectId: carreraId } = useParams({ from: '/projects/$projectId/materias' })
    const { data: materias, isLoading, isError } = useMaterias(carreraId)

    const [createOpen, setCreateOpen] = useState(false)
    const [editTarget, setEditTarget] = useState<Materia | null>(null)
    const [deleteTarget, setDeleteTarget] = useState<Materia | null>(null)

    const materiasOrdenadas = materias
        ? [...materias].sort((a, b) => a.grado - b.grado || a.nombre.localeCompare(b.nombre))
        : []

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <NuevaMateriaDialog open={createOpen} onOpenChange={setCreateOpen} carreraId={carreraId} />

            {editTarget && (
                <EditarMateriaDialog
                    open={Boolean(editTarget)}
                    onOpenChange={(v) => !v && setEditTarget(null)}
                    materia={editTarget}
                />
            )}

            {deleteTarget && (
                <EliminarMateriaDialog
                    open={Boolean(deleteTarget)}
                    onOpenChange={(v) => !v && setDeleteTarget(null)}
                    materia={deleteTarget}
                />
            )}

            {/* Breadcrumb */}
            <nav className="text-sm font-medium text-gray-500">
                <ol className="flex items-center space-x-2">
                    <li>
                        <Link to="/projects" className="hover:text-gray-900 transition-colors">Carreras</Link>
                    </li>
                    <li><span className="text-gray-300">›</span></li>
                    <li className="text-gray-900 font-bold">Materias</li>
                </ol>
            </nav>

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Materias</h1>
                    <p className="text-gray-500 mt-1 text-sm">Gestión del plan de estudios por grado.</p>
                </div>
                <Button
                    onClick={() => setCreateOpen(true)}
                    className="bg-[#1e40af] hover:bg-blue-800 text-white rounded-lg px-5 py-2.5 font-semibold shadow-sm transition-transform active:scale-95 flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Nueva Materia
                </Button>
            </div>

            {/* Loading */}
            {isLoading && (
                <div className="space-y-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
                    ))}
                </div>
            )}

            {/* Error */}
            {isError && (
                <div className="rounded-xl bg-red-50 border border-red-100 text-red-600 px-5 py-4 text-sm font-medium">
                    Error al cargar las materias. Verifica tu conexión con el backend.
                </div>
            )}

            {/* Empty */}
            {!isLoading && !isError && materiasOrdenadas.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
                    <BookOpen className="w-10 h-10 text-gray-300" />
                    <p className="font-semibold text-gray-500">Sin materias registradas</p>
                    <p className="text-sm text-gray-400">Agrega materias al plan de estudios de esta carrera.</p>
                </div>
            )}

            {/* Table */}
            {!isLoading && !isError && materiasOrdenadas.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50">
                                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wide">Materia</th>
                                <th className="text-left px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wide">Código</th>
                                <th className="text-center px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wide">Grado</th>
                                <th className="text-center px-5 py-3.5 text-xs font-bold text-gray-500 uppercase tracking-wide">Hrs/sem</th>
                                <th className="px-5 py-3.5" />
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {materiasOrdenadas.map((materia) => {
                                const colorIdx = (materia.grado - 1) % GRADO_COLORS.length
                                return (
                                    <tr key={materia.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-5 py-4">
                                            <span className="font-semibold text-gray-900">{materia.nombre}</span>
                                        </td>
                                        <td className="px-5 py-4">
                                            {materia.codigo ? (
                                                <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                                    <Hash className="w-3 h-3" />
                                                    {materia.codigo}
                                                </span>
                                            ) : (
                                                <span className="text-gray-300 text-xs">—</span>
                                            )}
                                        </td>
                                        <td className="px-5 py-4 text-center">
                                            <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full border ${GRADO_COLORS[colorIdx]}`}>
                                                {materia.grado}°
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-center">
                                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-gray-600">
                                                <Clock className="w-3 h-3 text-gray-400" />
                                                {materia.horas_semanales}h
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => setEditTarget(materia)}
                                                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => setDeleteTarget(materia)}
                                                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
