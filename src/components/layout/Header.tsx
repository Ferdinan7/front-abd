import { Clock, LogOut } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useNavigate } from "@tanstack/react-router"
import { useAuth } from "@/features/auth/context/AuthContext"

export function Header() {
    const navigate = useNavigate()
    const { user, signOut } = useAuth()

    const displayName = user?.user_metadata?.full_name ?? user?.email ?? "Usuario"
    const avatarUrl = user?.user_metadata?.avatar_url as string | undefined
    const initials = displayName
        .split(" ")
        .slice(0, 2)
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()

    const handleSignOut = async () => {
        await signOut()
        navigate({ to: "/login" })
    }

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
                        <span className="text-sm font-bold text-gray-900 leading-tight">{displayName}</span>
                        <span className="text-xs text-gray-500 font-medium tracking-wide">{user?.email}</span>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="border-0 bg-transparent p-0 m-0 outline-none hover:opacity-80 transition-opacity">
                                <Avatar className="w-11 h-11 border-2 border-white shadow-sm cursor-pointer">
                                    <AvatarImage src={avatarUrl} alt={displayName} />
                                    <AvatarFallback>{initials}</AvatarFallback>
                                </Avatar>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 bg-white">
                            <DropdownMenuItem
                                onClick={handleSignOut}
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
