import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
    colaboradoresApi,
    type CreateColaboradorDto,
    type UpdateColaboradorDto,
} from '@/api/colaboradores.api'

export const colaboradoresKeys = {
    byCarrera: (carreraId: string) => ['colaboradores', carreraId] as const,
}

export function useColaboradores(carreraId: string) {
    return useQuery({
        queryKey: colaboradoresKeys.byCarrera(carreraId),
        queryFn: () => colaboradoresApi.getByCarrera(carreraId),
        enabled: Boolean(carreraId),
    })
}

export function useCreateColaborador(carreraId: string) {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (dto: CreateColaboradorDto) =>
            colaboradoresApi.create(carreraId, dto),
        onSuccess: () =>
            qc.invalidateQueries({ queryKey: colaboradoresKeys.byCarrera(carreraId) }),
    })
}

export function useUpdateColaborador(carreraId: string) {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: ({ id, dto }: { id: string; dto: UpdateColaboradorDto }) =>
            colaboradoresApi.update(id, dto),
        onSuccess: () =>
            qc.invalidateQueries({ queryKey: colaboradoresKeys.byCarrera(carreraId) }),
    })
}

export function useDeleteColaborador(carreraId: string) {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => colaboradoresApi.remove(id),
        onSuccess: () =>
            qc.invalidateQueries({ queryKey: colaboradoresKeys.byCarrera(carreraId) }),
    })
}
