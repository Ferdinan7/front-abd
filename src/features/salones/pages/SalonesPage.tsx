import { useState } from "react";
import { useParams, Link } from "@tanstack/react-router";
import { useSalones, useCreateSalon, useUpdateSalon, useDeleteSalon } from "@/hooks/use-salones";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Building, Plus, Pencil, Trash2 } from "lucide-react";
import type { SalonDTO, TipoSalon } from "@/api/salones.api";

function SalonFormDialog({ 
  open, onOpenChange, carreraId, salon 
}: { 
  open: boolean; onOpenChange: (v: boolean) => void; carreraId: string; salon?: SalonDTO 
}) {
  const isEditing = !!salon;
  const [nombre, setNombre] = useState(salon?.nombre || "");
  const [edificio, setEdificio] = useState(salon?.edificio || "");
  const [tipo, setTipo] = useState<TipoSalon>(salon?.tipo || "aula");

  const { mutate: createSalon, isPending: isCreating } = useCreateSalon(carreraId);
  const { mutate: updateSalon, isPending: isUpdating } = useUpdateSalon(carreraId);
  
  const isPending = isCreating || isUpdating;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !edificio.trim()) return;

    if (isEditing) {
      updateSalon({ id: salon.id, dto: { nombre, edificio, tipo } }, {
        onSuccess: () => onOpenChange(false)
      });
    } else {
      createSalon({ nombre, edificio, tipo }, {
        onSuccess: () => {
          setNombre(""); setEdificio(""); setTipo("aula");
          onOpenChange(false);
        }
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Salón" : "Nuevo Salón"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Nombre / Número *</label>
            <Input value={nombre} onChange={(e) => setNombre(e.target.value)} required disabled={isPending} />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Edificio *</label>
            <Input value={edificio} onChange={(e) => setEdificio(e.target.value)} required disabled={isPending} />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700">Tipo</label>
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value as TipoSalon)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e40af]/30"
              disabled={isPending}
            >
              <option value="aula">Aula</option>
              <option value="laboratorio">Laboratorio</option>
              <option value="sala">Sala</option>
            </select>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>Cancelar</Button>
            <Button type="submit" disabled={isPending || !nombre.trim()} className="bg-[#1e40af] text-white">
              {isPending ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function SalonesPage() {
  const { projectId: carreraId } = useParams({ from: "/projects/$projectId/salones" });
  const { data: salones, isLoading } = useSalones(carreraId);
  const { mutate: deleteSalon } = useDeleteSalon(carreraId);

  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<SalonDTO | null>(null);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl">
      {createOpen && <SalonFormDialog open={createOpen} onOpenChange={setCreateOpen} carreraId={carreraId} />}
      {editTarget && <SalonFormDialog open={!!editTarget} onOpenChange={(v) => !v && setEditTarget(null)} carreraId={carreraId} salon={editTarget} />}

      <nav className="text-sm font-medium text-gray-500">
        <ol className="flex items-center space-x-2">
          <li><Link to="/projects" className="hover:text-gray-900 transition-colors">Carreras</Link></li>
          <li><span className="text-gray-300">›</span></li>
          <li className="text-gray-900 font-bold">Salones</li>
        </ol>
      </nav>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
            <Building className="w-8 h-8 text-gray-400" /> Salones
          </h1>
          <p className="text-gray-500 mt-1 text-sm">Gestiona los espacios físicos disponibles para la carrera.</p>
        </div>
        <Button onClick={() => setCreateOpen(true)} className="bg-[#1e40af] hover:bg-blue-800 text-white gap-2">
          <Plus className="w-5 h-5" /> Nuevo Salón
        </Button>
      </div>

      {isLoading && <div className="h-40 bg-gray-50 rounded-2xl animate-pulse" />}

      {!isLoading && salones && salones.length === 0 && (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <Building className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="font-medium text-gray-500">No hay salones registrados.</p>
        </div>
      )}

      {!isLoading && salones && salones.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 uppercase text-xs tracking-wide">
              <tr>
                <th className="px-5 py-3.5">Nombre / Número</th>
                <th className="px-5 py-3.5">Edificio</th>
                <th className="px-5 py-3.5">Tipo</th>
                <th className="px-5 py-3.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {salones.map((salon) => (
                <tr key={salon.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-5 py-4 font-semibold text-gray-900">{salon.nombre}</td>
                  <td className="px-5 py-4 text-gray-600">{salon.edificio}</td>
                  <td className="px-5 py-4">
                    <span className="inline-block px-2.5 py-1 rounded bg-gray-100 text-gray-600 text-xs font-medium uppercase tracking-wide">
                      {salon.tipo}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setEditTarget(salon)} className="p-2 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => { if(confirm("¿Eliminar salón?")) deleteSalon(salon.id) }} className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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

