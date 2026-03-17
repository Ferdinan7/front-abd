import { GroupCard } from "../components/GroupCard"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export function GroupsPage() {
    const groups: Array<{
        id: string
        shift: "Mañana" | "Tarde" | "Noche"
        level: string
        name: string
        studentsCount: number
        timeRange: string
    }> = [
            {
                id: "1a",
                shift: "Mañana",
                level: "1",
                name: "A",
                studentsCount: 32,
                timeRange: "08:00 - 14:00"
            },
            {
                id: "1b",
                shift: "Mañana",
                level: "1",
                name: "B",
                studentsCount: 28,
                timeRange: "08:00 - 14:00"
            },
            {
                id: "2a",
                shift: "Tarde",
                level: "2",
                name: "A",
                studentsCount: 30,
                timeRange: "14:00 - 20:00"
            },
            {
                id: "2b",
                shift: "Tarde",
                level: "2",
                name: "B",
                studentsCount: 25,
                timeRange: "14:00 - 20:00"
            },
            {
                id: "3a",
                shift: "Noche",
                level: "3",
                name: "A",
                studentsCount: 22,
                timeRange: "18:00 - 20:00"
            },
            {
                id: "3b",
                shift: "Noche",
                level: "3",
                name: "B",
                studentsCount: 20,
                timeRange: "18:00 - 20:00"
            }
        ]

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <nav className="text-sm font-medium text-gray-500">
                <ol className="flex items-center space-x-2">
                    <li>
                        <a href="#" className="hover:text-gray-900 transition-colors">Inicio</a>
                    </li>
                    <li>
                        <span className="text-gray-300">›</span>
                    </li>
                    <li>
                        <a href="#" className="hover:text-gray-900 transition-colors">Carreras</a>
                    </li>
                    <li>
                        <span className="text-gray-300">›</span>
                    </li>
                    <li className="text-gray-900 font-bold">Grupos</li>
                </ol>
            </nav>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Grupos Académicos</h1>
                    <p className="text-gray-500 mt-1 text-sm">Gestión de comisiones y alumnos por semestre.</p>
                </div>
                <Button className="bg-[#1e40af] hover:bg-blue-800 text-white rounded-lg px-5 py-2.5 font-semibold shadow-sm transition-transform active:scale-95 flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Nuevo Grupo
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {groups.map((group) => (
                    <GroupCard
                        key={group.id}
                        shift={group.shift}
                        level={group.level}
                        name={group.name}
                        studentsCount={group.studentsCount}
                        timeRange={group.timeRange}
                    />
                ))}
            </div>
        </div>
    )
}
