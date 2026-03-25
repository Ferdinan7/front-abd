import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
    salonesApi,
    type CreateSalonDto,
    type UpdateSalonDto,
} from '@/api/salones.api'

export const salonesKeys = {
    byCarrera: (carreraId: string) => ['salones', carreraId] as const,
}

export function useSalones(carreraId: string) {
    return useQuery({
        queryKey: salonesKeys.byCarrera(carreraId),
        queryFn: () => salonesApi.getByCarrera(carreraId),
        enabled: Boolean(carreraId),
    })
}

export function useCreateSalon(carreraId: string) {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (dto: CreateSalonDto) => salonesApi.create(carreraId, dto),
        onSuccess: () =>
            qc.invalidateQueries({ queryKey: salonesKeys.byCarrera(carreraId) }),
    })
}

export function useUpdateSalon(carreraId: string) {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: ({ id, dto }: { id: string; dto: UpdateSalonDto }) =>
            salonesApi.update(id, dto),
        onSuccess: () =>
            qc.invalidateQueries({ queryKey: salonesKeys.byCarrera(carreraId) }),
    })
}

export function useDeleteSalon(carreraId: string) {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => salonesApi.remove(id),
        onSuccess: () =>
            qc.invalidateQueries({ queryKey: salonesKeys.byCarrera(carreraId) }),
    })
}
