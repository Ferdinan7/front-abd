import { Clock, LogOut } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useNavigate } from "@tanstack/react-router"

export function Header() {
    const navigate = useNavigate()

    return (
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 shadow-sm">
            <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#1e40af] rounded-lg flex items-center justify-center">
                    <Clock className="text-white w-6 h-6" />
                </div>
                <span className="font-extrabold text-xl text-gray-900 tracking-tight">Cronogramas UTT</span>
            </div>

            <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-3">
                    <div className="flex flex-col items-end">
                        <span className="text-sm font-bold text-gray-900 leading-tight">Rosalina Vargas</span>
                        <span className="text-xs text-gray-500 font-medium tracking-wide">Administrador Académico</span>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="border-0 bg-transparent p-0 m-0 outline-none hover:opacity-80 transition-opacity">
                                <Avatar className="w-11 h-11 border-2 border-white shadow-sm cursor-pointer">
                                    <AvatarImage src="https://i.pravatar.cc/150?u=rosalina" alt="Rosalina Vargas" />
                                    <AvatarFallback>RV</AvatarFallback>
                                </Avatar>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 bg-white">
                            <DropdownMenuItem
                                onClick={() => navigate({ to: '/login' })}
                                className="text-red-600 focus:bg-red-50 focus:text-red-700 cursor-pointer font-medium flex items-center gap-2"
                            >
                                <LogOut className="w-4 h-4" />
                                Cerrar sesión
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    )
}
