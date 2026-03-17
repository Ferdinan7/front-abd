import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { asignacionesApi, type CreateAsignacionDto, type UpdateAsignacionDto } from '@/api/asignaciones.api'

export const asignacionesKeys = {
    byGrupo: (grupoId: string) => ['asignaciones', grupoId] as const,
}

export function useAsignaciones(grupoId: string) {
    return useQuery({
        queryKey: asignacionesKeys.byGrupo(grupoId),
        queryFn: () => asignacionesApi.getByGrupo(grupoId),
        enabled: Boolean(grupoId),
    })
}

export function useCreateAsignacion(grupoId: string) {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (dto: CreateAsignacionDto) => asignacionesApi.create(grupoId, dto),
        onSuccess: () =>
            qc.invalidateQueries({ queryKey: asignacionesKeys.byGrupo(grupoId) }),
    })
}

export function useUpdateAsignacion(grupoId: string) {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: ({ id, dto }: { id: string; dto: UpdateAsignacionDto }) =>
            asignacionesApi.update(id, dto),
        onSuccess: () =>
            qc.invalidateQueries({ queryKey: asignacionesKeys.byGrupo(grupoId) }),
    })
}

export function useDeleteAsignacion(grupoId: string) {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => asignacionesApi.remove(id),
        onSuccess: () =>
            qc.invalidateQueries({ queryKey: asignacionesKeys.byGrupo(grupoId) }),
    })
}
