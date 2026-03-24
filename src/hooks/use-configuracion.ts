import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { configuracionApi, type ConfigCarreraDTO } from "@/api/configuracion.api"

export const configuracionKeys = {
  all: ["configuracion"] as const,
  byCarrera: (carreraId: string) => [...configuracionKeys.all, carreraId] as const,
}

export function useConfiguracion(carreraId: string) {
  return useQuery({
    queryKey: configuracionKeys.byCarrera(carreraId),
    queryFn: () => configuracionApi.getByCarrera(carreraId),
    enabled: Boolean(carreraId),
  })
}

export function useUpdateConfiguracion(carreraId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (dto: Partial<ConfigCarreraDTO>) => configuracionApi.update(carreraId, dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: configuracionKeys.byCarrera(carreraId) }),
  })
}

