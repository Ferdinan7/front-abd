import { useState } from "react";
import { useParams, Link } from "@tanstack/react-router";
import {
  useColaboradores,
  useAddColaborador,
  useUpdateColaborador,
  useDeleteColaborador,
} from "@/hooks/use-colaboradores";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Users, Plus, Trash2 } from "lucide-react";
import type { RolCarrera } from "@/api/colaboradores.api";

function AddColaboradorDialog({
  open,
  onOpenChange,
  carreraId,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  carreraId: string;
}) {
  const [email, setEmail] = useState("");
  const [rol, setRol] = useState<RolCarrera>("viewer");
  const { mutate, isPending, error } = useAddColaborador(carreraId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    mutate(
      { email: email.trim(), rol },
      {
        onSuccess: () => {
          setEmail("");
          setRol("viewer");
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>Agregar Colaborador</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">
              Email del usuario *
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isPending}
              placeholder="ejemplo@google.com"
            />
            <p className="text-xs text-gray-400">
              Debe estar registrado en el sistema.
            </p>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Rol</label>
            <select
              value={rol}
              onChange={(e) => setRol(e.target.value as RolCarrera)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e40af]/30"
              disabled={isPending}
            >
              <option value="viewer">Viewer (Solo lectura)</option>
              <option value="admin">Admin (Edición completa)</option>
            </select>
          </div>
          {error && (
            <p className="text-xs text-red-600 bg-red-50 p-2 rounded">
              {error.message}
            </p>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isPending || !email.trim()}
              className="bg-[#1e40af] text-white"
            >
              {isPending ? "Agregando..." : "Agregar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function ColaboradoresPage() {
  const { projectId: carreraId } = useParams({
    from: "/projects/$projectId/colaboradores",
  });
  const { data: colaboradores, isLoading } = useColaboradores(carreraId);
  const { mutate: updateRol } = useUpdateColaborador(carreraId);
  const { mutate: deleteColab } = useDeleteColaborador(carreraId);

  const [createOpen, setCreateOpen] = useState(false);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl">
      <AddColaboradorDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        carreraId={carreraId}
      />

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
          <li className="text-gray-900 font-bold">Colaboradores</li>
        </ol>
      </nav>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            <Users className="w-8 h-8 text-gray-400" /> Colaboradores
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Administra quién tiene acceso a esta carrera y sus permisos.
          </p>
        </div>
        <Button
          onClick={() => setCreateOpen(true)}
          className="bg-[#1e40af] hover:bg-blue-800 text-white gap-2"
        >
          <Plus className="w-5 h-5" /> Agregar Colaborador
        </Button>
      </div>

      {isLoading && (
        <div className="h-40 bg-gray-50 rounded-2xl animate-pulse" />
      )}

      {!isLoading && colaboradores && colaboradores.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="font-medium text-gray-500">
            No hay colaboradores registrados.
          </p>
        </div>
      )}

      {!isLoading && colaboradores && colaboradores.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase text-xs tracking-wide">
              <tr>
                <th className="px-5 py-3.5">Usuario</th>
                <th className="px-5 py-3.5">Rol</th>
                <th className="px-5 py-3.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {colaboradores.map((c) => (
                <tr
                  key={c.id}
                  className="hover:bg-gray-50/50 transition-colors group"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold overflow-hidden shrink-0">
                        {c.avatar_url ? (
                          <img src={c.avatar_url} alt="avatar" />
                        ) : (
                          (c.full_name || c.email || "?")[0].toUpperCase()
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {c.full_name || "Sin nombre"}
                        </div>
                        <div className="text-xs text-gray-500">{c.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <select
                      value={c.rol}
                      onChange={(e) =>
                        updateRol({
                          id: c.id,
                          dto: { rol: e.target.value as RolCarrera },
                        })
                      }
                      className={`text-xs font-semibold px-2 py-1 rounded-md border-0 bg-transparent cursor-pointer hover:bg-gray-100 transition-colors focus:ring-2 focus:ring-[#1e40af]/30 ${
                        c.rol === "admin" ? "text-purple-700" : "text-gray-600"
                      }`}
                    >
                      <option value="admin">Admin</option>
                      <option value="viewer">Viewer</option>
                    </select>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => {
                        if (confirm("¿Quitar acceso a este colaborador?"))
                          deleteColab(c.id);
                      }}
                      className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
