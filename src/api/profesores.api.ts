import { apiClient } from './client'

export interface Profesor {
    id: string
    nombre_completo: string
    email?: string
    activo?: boolean
    /** Presente en algunas respuestas del backend; permite filtrar por carrera en cliente */
    carreraId?: string
    /** URL de foto de perfil Google/OAuth (si el backend la expone en el perfil del usuario) */
    avatarUrl?: string
    avatar_url?: string
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
    /** Si se pasa carreraId se envía como query param; si el backend lo ignora devuelve todos. */
    getAll: (carreraId?: string) =>
        apiClient.getList<Profesor>(carreraId ? `/profesores?carrera_id=${carreraId}` : '/profesores'),

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
