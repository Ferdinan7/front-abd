import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { carrerasApi, type CreateCarreraDto, type UpdateCarreraDto } from '@/api/carreras.api'

export const carrerasKeys = {
    all: ['carreras'] as const,
}

export function useCarreras() {
    return useQuery({
        queryKey: carrerasKeys.all,
        queryFn: () => carrerasApi.getAll(),
    })
}

export function useCreateCarrera() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (dto: CreateCarreraDto) => carrerasApi.create(dto),
        onSuccess: () => qc.invalidateQueries({ queryKey: carrerasKeys.all }),
    })
}

export function useUpdateCarrera() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: ({ id, dto }: { id: string; dto: UpdateCarreraDto }) =>
            carrerasApi.update(id, dto),
        onSuccess: () => qc.invalidateQueries({ queryKey: carrerasKeys.all }),
    })
}

export function useDeleteCarrera() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => carrerasApi.remove(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: carrerasKeys.all }),
    })
}
