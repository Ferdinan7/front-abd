import { useState, useEffect } from "react";
import { useParams, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useConfiguracion,
  useUpdateConfiguracion,
} from "@/hooks/use-configuracion";
import { Settings, Save } from "lucide-react";

export function ConfiguracionPage() {
  const { projectId: carreraId } = useParams({
    from: "/projects/$projectId/configuracion",
  });
  const { data: config, isLoading, isError } = useConfiguracion(carreraId);
  const { mutate: updateConfig, isPending } = useUpdateConfiguracion(carreraId);

  const [form, setForm] = useState({
    duracion_bloque: "50",
    hora_inicio: "07:00:00",
    hora_fin: "15:00:00",
  });

  useEffect(() => {
    if (config) {
      setForm({
        duracion_bloque: String(config.duracion_bloque || 50),
        hora_inicio: config.hora_inicio || "07:00:00",
        hora_fin: config.hora_fin || "15:00:00",
      });
    }
  }, [config]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateConfig({
      duracion_bloque: Number(form.duracion_bloque),
      hora_inicio: form.hora_inicio,
      hora_fin: form.hora_fin,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (e.target.type === "time" && val.length === 5) {
      val += ":00"; // ensure HH:mm:ss format for backend
    }
    setForm((prev) => ({ ...prev, [e.target.name]: val }));
  };

  const toTimeInput = (val: string) => (val ? val.substring(0, 5) : "");

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-3xl">
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
          <li className="text-gray-900 font-bold">Configuración</li>
        </ol>
      </nav>

      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
          <Settings className="w-8 h-8 text-gray-400" />
          Configuración de la Carrera
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          Ajusta los parámetros base para la generación de horarios.
        </p>
      </div>

      {isLoading && (
        <div className="h-64 bg-gray-50 rounded-2xl animate-pulse" />
      )}

      {!isLoading && !isError && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Duración del bloque (minutos)
              </label>
              <Input
                type="number"
                name="duracion_bloque"
                value={form.duracion_bloque}
                onChange={handleChange}
                min={1}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-gray-50">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Hora inicio jornada
              </label>
              <Input
                type="time"
                name="hora_inicio"
                value={toTimeInput(form.hora_inicio)}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700">
                Hora fin jornada
              </label>
              <Input
                type="time"
                name="hora_fin"
                value={toTimeInput(form.hora_fin)}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="pt-6 flex justify-end">
            <Button
              type="submit"
              disabled={isPending}
              className="bg-[#1e40af] hover:bg-blue-800 text-white font-semibold flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isPending ? "Guardando..." : "Guardar configuración"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
