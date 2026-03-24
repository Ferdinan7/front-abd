import { Card, CardContent } from "@/components/ui/card";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Settings,
  Building,
  Users,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProjectCardProps {
  title: string;
  icon: React.ReactNode;
  color: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onViewConfiguracion?: () => void;
  onViewSalones?: () => void;
  onViewColaboradores?: () => void;
}

export function ProjectCard({
  title,
  icon,
  color,
  onEdit,
  onDelete,
  onViewConfiguracion,
  onViewSalones,
  onViewColaboradores,
}: ProjectCardProps) {
  return (
    <Card className="rounded-2xl border-0 shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer bg-white p-0 gap-0">
      <div
        className={`h-32 w-full flex items-center justify-center relative ${color}`}
      >
        {icon}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,white,transparent_50%)]"></div>
      </div>
      <CardContent className="p-5 flex items-center justify-between">
        <h3 className="font-bold text-gray-900 text-lg truncate pr-2">
          {title}
        </h3>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="text-gray-400 hover:text-gray-600 transition-colors shrink-0 p-1 rounded-md hover:bg-gray-100"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48 bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onViewConfiguracion?.();
              }}
              className="cursor-pointer flex items-center gap-2 font-medium"
            >
              <Settings className="w-4 h-4 text-gray-500" />
              Configuración
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onViewSalones?.();
              }}
              className="cursor-pointer flex items-center gap-2 font-medium"
            >
              <Building className="w-4 h-4 text-gray-500" />
              Salones
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onViewColaboradores?.();
              }}
              className="cursor-pointer flex items-center gap-2 font-medium"
            >
              <Users className="w-4 h-4 text-gray-500" />
              Colaboradores
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.();
              }}
              className="cursor-pointer flex items-center gap-2 font-medium"
            >
              <Pencil className="w-4 h-4 text-gray-500" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.();
              }}
              className="cursor-pointer flex items-center gap-2 font-medium text-red-600 focus:text-red-700 focus:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardContent>
    </Card>
  );
}
