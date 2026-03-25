import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
    profesoresApi,
    type CreateProfesorDto,
    type UpdateProfesorDto,
    type CreateDisponibilidadDto,
} from '@/api/profesores.api'

export const profesoresKeys = {
    all: ['profesores'] as const,
    byCarrera: (carreraId: string) => ['profesores', 'carrera', carreraId] as const,
    disponibilidad: (id: string) => ['profesores', id, 'disponibilidad'] as const,
}

export function useProfesores(carreraId?: string) {
    return useQuery({
        queryKey: carreraId ? profesoresKeys.byCarrera(carreraId) : profesoresKeys.all,
        queryFn: () => profesoresApi.getAll(carreraId),
    })
}

export function useCreateProfesor() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (dto: CreateProfesorDto) => profesoresApi.create(dto),
        onSuccess: () => qc.invalidateQueries({ queryKey: profesoresKeys.all }),
    })
}

export function useUpdateProfesor() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: ({ id, dto }: { id: string; dto: UpdateProfesorDto }) =>
            profesoresApi.update(id, dto),
        onSuccess: () => qc.invalidateQueries({ queryKey: profesoresKeys.all }),
    })
}

export function useDeleteProfesor() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => profesoresApi.remove(id),
        onSuccess: () => qc.invalidateQueries({ queryKey: profesoresKeys.all }),
    })
}

export function useDisponibilidad(profesorId: string) {
    return useQuery({
        queryKey: profesoresKeys.disponibilidad(profesorId),
        queryFn: () => profesoresApi.getDisponibilidad(profesorId),
        enabled: Boolean(profesorId),
    })
}

export function useCreateDisponibilidad(profesorId: string) {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (bloques: CreateDisponibilidadDto[]) =>
            profesoresApi.createDisponibilidad(profesorId, bloques),
        onSuccess: () =>
            qc.invalidateQueries({ queryKey: profesoresKeys.disponibilidad(profesorId) }),
    })
}

export function useDeleteDisponibilidad(profesorId: string) {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (bloqueId: string) => profesoresApi.deleteDisponibilidad(bloqueId),
        onSuccess: () =>
            qc.invalidateQueries({ queryKey: profesoresKeys.disponibilidad(profesorId) }),
    })
}
