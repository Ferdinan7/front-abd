import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { horariosApi } from '@/api/horarios.api'

export const horariosKeys = {
    byGrupo: (grupoId: string) => ['horarios', grupoId] as const,
}

export function useHorario(grupoId: string) {
    return useQuery({
        queryKey: horariosKeys.byGrupo(grupoId),
        queryFn: () => horariosApi.getByGrupo(grupoId),
        enabled: Boolean(grupoId),
        retry: false,
    })
}

export function useGenerarHorario(grupoId: string) {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (regenerar: boolean) => horariosApi.generar(grupoId, regenerar),
        onSuccess: () => qc.invalidateQueries({ queryKey: horariosKeys.byGrupo(grupoId) }),
    })
}

export function useDeleteHorario(grupoId: string) {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: () => horariosApi.remove(grupoId),
        onSuccess: () => qc.invalidateQueries({ queryKey: horariosKeys.byGrupo(grupoId) }),
    })
}
