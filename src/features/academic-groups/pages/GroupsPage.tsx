import { useState } from "react";
import { useNavigate, useParams, Link } from "@tanstack/react-router";
import { GroupCard } from "../components/GroupCard";
import { NuevoGrupoDialog } from "../components/NuevoGrupoDialog";
import { EditarGrupoDialog } from "../components/EditarGrupoDialog";
import { EliminarGrupoDialog } from "../components/EliminarGrupoDialog";
import { Button } from "@/components/ui/button";
import { Plus, BookOpen } from "lucide-react";
import { useGrupos } from "@/hooks/use-grupos";
import type { Grupo, Turno } from "@/api/grupos.api";

const TURNO_TIME_RANGE: Record<Turno, string> = {
  matutino: "07:00 - 14:00",
  vespertino: "14:00 - 21:00",
};

export function GroupsPage() {
  const { projectId: carreraId } = useParams({
    from: "/projects/$projectId/groups/",
  });
  const navigate = useNavigate();
  const { data: grupos, isLoading, isError } = useGrupos(carreraId);

  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Grupo | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Grupo | null>(null);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <NuevoGrupoDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        carreraId={carreraId}
      />

      {editTarget && (
        <EditarGrupoDialog
          open={Boolean(editTarget)}
          onOpenChange={(v) => !v && setEditTarget(null)}
          grupo={editTarget}
        />
      )}

      {deleteTarget && (
        <EliminarGrupoDialog
          open={Boolean(deleteTarget)}
          onOpenChange={(v) => !v && setDeleteTarget(null)}
          grupo={deleteTarget}
        />
      )}

      <nav className="text-sm font-medium text-gray-500">
        <ol className="flex items-center space-x-2">
          <li>
            <Link
              to="/projects"
              className="hover:text-gray-900 transition-colors"
            >
              Carreras
            </Link>
          </li>
          <li>
            <span className="text-gray-300">›</span>
          </li>
          <li className="text-gray-900 font-bold">Grupos</li>
        </ol>
      </nav>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Grupos Académicos
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Gestión de comisiones y alumnos por semestre.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() =>
              navigate({
                to: "/projects/$projectId/materias",
                params: { projectId: carreraId },
              })
            }
            variant="outline"
            className="rounded-lg px-5 py-2.5 font-semibold shadow-sm transition-transform active:scale-95 flex items-center gap-2"
          >
            <BookOpen className="w-5 h-5" />
            Ver Materias
          </Button>
          <Button
            onClick={() => setCreateOpen(true)}
            className="bg-[#1e40af] hover:bg-blue-800 text-white rounded-lg px-5 py-2.5 font-semibold shadow-sm transition-transform active:scale-95 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Nuevo Grupo
          </Button>
        </div>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl bg-gray-100 animate-pulse h-52"
            />
          ))}
        </div>
      )}

      {isError && (
        <div className="rounded-xl bg-red-50 border border-red-100 text-red-600 px-5 py-4 text-sm font-medium">
          Error al cargar los grupos. Verifica tu conexión con el backend.
        </div>
      )}

      {!isLoading &&
        !isError &&
        grupos &&
        (grupos.length === 0 ? (
          <div className="text-center py-16 text-gray-400 font-medium">
            No hay grupos registrados para esta carrera.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {grupos.map((grupo) => {
              const turno = grupo.turno as Turno;
              const timeRange = TURNO_TIME_RANGE[turno] ?? "";
              return (
                <GroupCard
                  key={grupo.id}
                  shift={turno}
                  level={grupo.grado}
                  name={grupo.seccion}
                  timeRange={timeRange}
                  onEdit={() => setEditTarget(grupo)}
                  onDelete={() => setDeleteTarget(grupo)}
                  onViewDetail={() =>
                    navigate({
                      to: "/projects/$projectId/groups/$groupId",
                      params: { projectId: carreraId, groupId: grupo.id },
                    })
                  }
                />
              );
            })}
          </div>
        ))}
    </div>
  );
}
