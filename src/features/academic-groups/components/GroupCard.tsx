import { MoreHorizontal, Clock, Pencil, Trash2, ArrowRight } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface GroupCardProps {
    shift: "matutino" | "vespertino"
    level: string | number
    name: string
    timeRange: string
    onEdit?: () => void
    onDelete?: () => void
    onViewDetail?: () => void
}

export function GroupCard({ shift, level, name, timeRange, onEdit, onDelete, onViewDetail }: GroupCardProps) {
    const isMorning = shift === "matutino"

    const topBg = isMorning ? "bg-[#e0e7ff]" : "bg-orange-50/80"
    const badgeTheme = isMorning
        ? "bg-white text-blue-600 shadow-sm"
        : "bg-yellow-100/80 text-orange-600"
    const badgeLabel = isMorning ? "MATUTINO" : "VESPERTINO"

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden flex flex-col">
            <div className={`h-28 relative flex items-center justify-center ${topBg}`}>
                <div className="absolute top-3 right-3">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded ${badgeTheme}`}>
                        {badgeLabel}
                    </span>
                </div>
                <div className="text-4xl font-black text-blue-300 select-none">
                    {level}{name}
                </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                    <div className="flex justify-between items-start mb-3">
                        <h3 className="font-extrabold text-gray-900 text-lg">{level}° &quot;{name}&quot;</h3>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100 transition-colors">
                                    <MoreHorizontal className="w-5 h-5" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44 bg-white">
                                <DropdownMenuItem
                                    onClick={onEdit}
                                    className="cursor-pointer flex items-center gap-2 font-medium"
                                >
                                    <Pencil className="w-4 h-4 text-gray-500" />
                                    Editar
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={onDelete}
                                    className="cursor-pointer flex items-center gap-2 font-medium text-red-600 focus:text-red-700 focus:bg-red-50"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Eliminar
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <div className="flex items-center text-sm text-gray-500 font-medium">
                        <Clock className="w-4 h-4 mr-2" />
                        {timeRange}
                    </div>
                </div>

                <button
                    onClick={onViewDetail}
                    className="w-full bg-gray-50 hover:bg-[#1e40af] hover:text-white text-gray-700 font-semibold py-2.5 rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
                >
                    Ver grupo
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}
