import { apiClient } from './client'

export interface Profesor {
    id: string
    nombre_completo: string
    email?: string
    activo?: boolean
}

export interface CreateProfesorDto {
    nombre_completo: string
    email?: string
    carrera_id: string
}

export interface UpdateProfesorDto {
    nombre_completo?: string
    email?: string
    activo?: boolean
}

export interface DisponibilidadBloque {
    id: string
    dia_semana: number
    hora_inicio: string
    hora_fin: string
    profesorId: string
}

export interface CreateDisponibilidadDto {
    dia_semana: number
    hora_inicio: string
    hora_fin: string
}

export const profesoresApi = {
    getAll: () =>
        apiClient.getList<Profesor>('/profesores'),

    create: (dto: CreateProfesorDto) =>
        apiClient.post<Profesor>('/profesores', dto),

    update: (id: string, dto: UpdateProfesorDto) =>
        apiClient.put<Profesor>(`/profesores/${id}`, dto),

    remove: (id: string) =>
        apiClient.delete(`/profesores/${id}`),

    getDisponibilidad: (id: string) =>
        apiClient.getList<DisponibilidadBloque>(`/profesores/${id}/disponibilidad`),

    createDisponibilidad: (id: string, bloques: CreateDisponibilidadDto[]) =>
        apiClient.post<DisponibilidadBloque[]>(`/profesores/${id}/disponibilidad`, bloques),

    deleteDisponibilidad: (bloqueId: string) =>
        apiClient.delete(`/disponibilidad/${bloqueId}`),
}
