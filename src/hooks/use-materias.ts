import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { materiasApi, type CreateMateriaDto, type UpdateMateriaDto } from '@/api/materias.api'

export const materiasKeys = {
    byCarrera: (carreraId: string, grado?: number) =>
        ['materias', carreraId, grado] as const,
}

export function useMaterias(carreraId: string, grado?: number) {
    return useQuery({
        queryKey: materiasKeys.byCarrera(carreraId, grado),
        queryFn: () => materiasApi.getByCarrera(carreraId, grado),
        enabled: Boolean(carreraId),
    })
}

export function useCreateMateria(carreraId: string) {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (dto: CreateMateriaDto) => materiasApi.create(carreraId, dto),
        onSuccess: () =>
            qc.invalidateQueries({ queryKey: ['materias', carreraId] }),
    })
}

export function useUpdateMateria(carreraId: string) {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: ({ id, dto }: { id: string; dto: UpdateMateriaDto }) =>
            materiasApi.update(id, dto),
        onSuccess: () =>
            qc.invalidateQueries({ queryKey: ['materias', carreraId] }),
    })
}

export function useDeleteMateria(carreraId: string) {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => materiasApi.remove(id),
        onSuccess: () =>
            qc.invalidateQueries({ queryKey: ['materias', carreraId] }),
    })
}
