import { MoreHorizontal, Users, Clock } from "lucide-react"

interface GroupCardProps {
    shift: "Mañana" | "Tarde" | "Noche"
    level: string
    name: string
    studentsCount: number
    timeRange: string
}

export function GroupCard({ shift, level, name, studentsCount, timeRange }: GroupCardProps) {
    const isMorning = shift === "Mañana"
    const isAfternoon = shift === "Tarde"

    // Style configurations based on shift
    const topBg = isMorning
        ? "bg-[#e0e7ff]"
        : isAfternoon
            ? "bg-orange-50/80"
            : "bg-purple-100/60"

    const badgeTheme = isMorning
        ? "bg-white text-blue-600 shadow-sm"
        : isAfternoon
            ? "bg-yellow-100/80 text-orange-600"
            : "bg-purple-100 text-purple-600"

    const badgeText = shift.toUpperCase()

    const levelColor = isMorning
        ? "text-blue-300"
        : isAfternoon
            ? "text-blue-300"
            : "text-blue-300"

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden flex flex-col">
            <div className={`h-28 relative flex items-center justify-center ${topBg}`}>
                <div className="absolute top-3 right-3">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded ${badgeTheme}`}>
                        {badgeText}
                    </span>
                </div>
                <div className={`text-4xl font-black ${levelColor} select-none`}>
                    {level}{name}
                </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                    <div className="flex justify-between items-start mb-3">
                        <h3 className="font-extrabold text-gray-900 text-lg">{level}° &quot;{name}&quot;</h3>
                        <button className="text-gray-400 hover:text-gray-600">
                            <MoreHorizontal className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="space-y-2.5">
                        <div className="flex items-center text-sm text-gray-500 font-medium">
                            <Clock className="w-4 h-4 mr-2" />
                            {timeRange}
                        </div>
                    </div>
                </div>

                <button className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold py-2.5 rounded-lg transition-colors text-sm">
                    Ver Horario
                </button>
            </div>
        </div>
    )
}
