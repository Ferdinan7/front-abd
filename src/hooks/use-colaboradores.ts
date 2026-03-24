import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { colaboradoresApi, type AddColaboradorDTO, type UpdateColaboradorDTO } from "@/api/colaboradores.api"

export const colaboradoresKeys = {
  all: ["colaboradores"] as const,
  byCarrera: (carreraId: string) => [...colaboradoresKeys.all, carreraId] as const,
}

export function useColaboradores(carreraId: string) {
  return useQuery({
    queryKey: colaboradoresKeys.byCarrera(carreraId),
    queryFn: () => colaboradoresApi.getByCarrera(carreraId),
    enabled: Boolean(carreraId),
  })
}

export function useAddColaborador(carreraId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (dto: AddColaboradorDTO) => colaboradoresApi.add(carreraId, dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: colaboradoresKeys.byCarrera(carreraId) }),
  })
}

export function useUpdateColaborador(carreraId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateColaboradorDTO }) => colaboradoresApi.update(id, dto),
    onSuccess: () => qc.invalidateQueries({ queryKey: colaboradoresKeys.byCarrera(carreraId) }),
  })
}

export function useDeleteColaborador(carreraId: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => colaboradoresApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: colaboradoresKeys.byCarrera(carreraId) }),
  })
}

