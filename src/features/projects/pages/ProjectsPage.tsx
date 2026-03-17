import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProjectCard } from "../components/ProjectCard"
import { Link } from "@tanstack/react-router"
import {
    BriefcaseMedical,
    Code2,
    LineChart,
    Cpu,
    Wifi
} from "lucide-react"

export function ProjectsPage() {
    const projects = [
        {
            id: "enfermeria",
            title: "Enfermería",
            icon: <BriefcaseMedical className="w-10 h-10 text-blue-400" />,
            color: "bg-blue-50"
        },
        {
            id: "software",
            title: "Desarrollo de Software",
            icon: <Code2 className="w-10 h-10 text-indigo-400" />,
            color: "bg-indigo-50"
        },
        {
            id: "negocios",
            title: "Negocios",
            icon: <LineChart className="w-10 h-10 text-blue-300" />,
            color: "bg-emerald-50"
        },
        {
            id: "mecatronica",
            title: "Mecatrónica",
            icon: <Cpu className="w-10 h-10 text-slate-400" />,
            color: "bg-orange-50/50"
        },
        {
            id: "redes",
            title: "Redes",
            icon: <Wifi className="w-10 h-10 text-cyan-400" />,
            color: "bg-cyan-50/50"
        },
    ]

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Tus proyectos</h1>
                    <p className="text-gray-500 mt-1">Gestiona los cronogramas educativos por facultad</p>
                </div>
                <Button className="bg-[#1e40af] hover:bg-blue-800 text-white rounded-lg px-5 py-2.5 font-semibold shadow-sm transition-transform active:scale-95 flex items-center gap-2">
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                {projects.map((project) => (
                    <Link key={project.id} to="/projects/$projectId/groups" params={{ projectId: project.id }} className="block group">
                        <ProjectCard title={project.title} icon={project.icon} color={project.color} />
                    </Link>
                ))}
            </div>
        </div>
    )
}
