import { Card, CardContent } from "@/components/ui/card"
import { MoreHorizontal } from "lucide-react"

interface ProjectCardProps {
    title: string
    icon: React.ReactNode
    color: string
}

export function ProjectCard({ title, icon, color }: ProjectCardProps) {
    return (
        <Card className="rounded-2xl border-0 shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer bg-white p-0 gap-0">
            <div className={`h-32 w-full flex items-center justify-center relative ${color}`}>
                {icon}
                {/* Subtle decorative shapes can go here based on color */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,white,transparent_50%)]"></div>
            </div>
            <CardContent className="p-5 flex items-center justify-between">
                <h3 className="font-bold text-gray-900 text-lg">{title}</h3>
                <button className="text-gray-400 hover:text-gray-600 transition-colors">
                    <MoreHorizontal className="w-5 h-5" />
                </button>
            </CardContent>
        </Card>
    )
}
