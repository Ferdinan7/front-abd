import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { gruposApi, type CreateGrupoDto, type UpdateGrupoDto } from '@/api/grupos.api'

export const gruposKeys = {
    byCarrera: (carreraId: string) => ['grupos', carreraId] as const,
}

export function useGrupos(carreraId: string) {
    return useQuery({
        queryKey: gruposKeys.byCarrera(carreraId),
        queryFn: () => gruposApi.getByCarrera(carreraId),
        enabled: Boolean(carreraId),
    })
}

export function useCreateGrupo(carreraId: string) {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (dto: CreateGrupoDto) => gruposApi.create(carreraId, dto),
        onSuccess: () => qc.invalidateQueries({ queryKey: gruposKeys.byCarrera(carreraId) }),
    })
}

export function useUpdateGrupo(carreraId: string) {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: ({ id, dto }: { id: string; dto: UpdateGrupoDto }) =>
            gruposApi.update(id, dto),
        onSuccess: () => qc.invalidateQueries({ queryKey: gruposKeys.byCarrera(carreraId) }),
    })
}

export function useDeleteGrupo(carreraId: string) {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => gruposApi.remove(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: gruposKeys.byCarrera(carreraId) }),
    })
}
