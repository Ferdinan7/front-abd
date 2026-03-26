import { apiClient } from './client'

export interface Carrera {
    id: string
    nombre: string
    color?: string
    created_at?: string
    roles_carrera?: { rol: string }[]
}

export interface CreateCarreraDto {
    nombre: string
    color?: string
}

export interface UpdateCarreraDto {
    nombre?: string
    color?: string
}

export const carrerasApi = {
    getAll: () =>
        apiClient.getList<Carrera>('/carreras'),

    create: (dto: CreateCarreraDto) =>
        apiClient.post<Carrera>('/carreras', dto),

    update: (id: string, dto: UpdateCarreraDto) =>
        apiClient.put<Carrera>(`/carreras/${id}`, dto),

    remove: (id: string) =>
        apiClient.delete(`/carreras/${id}`),
}
