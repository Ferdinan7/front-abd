import { useState } from "react"
import { Plus, BookOpen, Code2, LineChart, Cpu, Wifi, BriefcaseMedical, GraduationCap, FlaskConical, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProjectCard } from "../components/ProjectCard"
import { NuevaCarreraDialog } from "../components/NuevaCarreraDialog"
import { EditarCarreraDialog } from "../components/EditarCarreraDialog"
import { EliminarCarreraDialog } from "../components/EliminarCarreraDialog"
import { Link, useNavigate } from "@tanstack/react-router"
import { useCarreras } from "@/hooks/use-carreras"
import type { Carrera } from "@/api/carreras.api"

const CARD_VARIANTS = [
    { icon: (cls: string) => <Code2 className={cls} />, color: "bg-indigo-50" },
    { icon: (cls: string) => <BriefcaseMedical className={cls} />, color: "bg-blue-50" },
    { icon: (cls: string) => <LineChart className={cls} />, color: "bg-emerald-50" },
    { icon: (cls: string) => <Cpu className={cls} />, color: "bg-orange-50/70" },
    { icon: (cls: string) => <Wifi className={cls} />, color: "bg-cyan-50/70" },
    { icon: (cls: string) => <GraduationCap className={cls} />, color: "bg-purple-50" },
    { icon: (cls: string) => <FlaskConical className={cls} />, color: "bg-rose-50" },
    { icon: (cls: string) => <Building2 className={cls} />, color: "bg-yellow-50" },
    { icon: (cls: string) => <BookOpen className={cls} />, color: "bg-teal-50" },
]

const ICON_COLORS = [
    "text-indigo-400", "text-blue-400", "text-emerald-400",
    "text-orange-400", "text-cyan-400", "text-purple-400",
    "text-rose-400", "text-yellow-400", "text-teal-400",
]

export function ProjectsPage() {
    const { data: carreras, isLoading, isError } = useCarreras()
    const navigate = useNavigate()

    const [createOpen, setCreateOpen] = useState(false)
    const [editTarget, setEditTarget] = useState<Carrera | null>(null)
    const [deleteTarget, setDeleteTarget] = useState<Carrera | null>(null)

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <NuevaCarreraDialog open={createOpen} onOpenChange={setCreateOpen} />

            {editTarget && (
                <EditarCarreraDialog
                    open={Boolean(editTarget)}
                    onOpenChange={(v) => !v && setEditTarget(null)}
                    carrera={editTarget}
                />
            )}

            {deleteTarget && (
                <EliminarCarreraDialog
                    open={Boolean(deleteTarget)}
                    onOpenChange={(v) => !v && setDeleteTarget(null)}
                    carrera={deleteTarget}
                />
            )}

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Tus proyectos</h1>
                    <p className="text-gray-500 mt-1">Gestiona los cronogramas educativos por facultad</p>
                </div>
                <Button
                    onClick={() => setCreateOpen(true)}
                    className="bg-[#1e40af] hover:bg-blue-800 text-white rounded-lg px-5 py-2.5 font-semibold shadow-sm transition-transform active:scale-95 flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Nuevo Proyecto
                </Button>
            </div>

            <div className="border-b border-gray-200">
                <nav className="flex space-x-8">
                    <button className="border-b-2 border-[#1e40af] text-[#1e40af] pb-3 text-sm font-bold">
                        Todos
                    </button>
                </nav>
            </div>

            {isLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="rounded-2xl bg-gray-100 animate-pulse h-52" />
                    ))}
                </div>
            )}

            {isError && (
                <div className="rounded-xl bg-red-50 border border-red-100 text-red-600 px-5 py-4 text-sm font-medium">
                    Error al cargar las carreras. Verifica tu conexión con el backend.
                </div>
            )}

            {!isLoading && !isError && carreras && (
                carreras.length === 0 ? (
                    <div className="text-center py-16 text-gray-400 font-medium">
                        No hay carreras registradas aún.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                        {carreras.map((carrera, i) => {
                            const variant = CARD_VARIANTS[i % CARD_VARIANTS.length]
                            const iconColor = ICON_COLORS[i % ICON_COLORS.length]
                            return (
                                <Link
                                    key={carrera.id}
                                    to="/projects/$projectId/groups"
                                    params={{ projectId: carrera.id }}
                                    className="block group"
                                >
                                    <ProjectCard
                                        title={carrera.nombre}
                                        icon={variant.icon(`w-10 h-10 ${iconColor}`)}
                                        color={variant.color}
                                        onEdit={() => setEditTarget(carrera)}
                                        onDelete={() => setDeleteTarget(carrera)}
                                        onViewMaterias={() => navigate({ to: '/projects/$projectId/materias', params: { projectId: carrera.id } })}
                                        onViewProfesores={() => navigate({ to: '/projects/$projectId/professors', params: { projectId: carrera.id } })}
                                    />
                                </Link>
                            )
                        })}
                    </div>
                )
            )}
        </div>
    )
}
