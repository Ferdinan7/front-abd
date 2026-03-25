import { apiClient } from './client'

export type SalonTipo = 'aula' | 'laboratorio' | 'sala' | string

export interface Salon {
    id: string
    nombre: string
    edificio?: string
    tipo?: SalonTipo
    carreraId?: string
}

export interface CreateSalonDto {
    nombre: string
    edificio?: string
    tipo?: SalonTipo
}

export interface UpdateSalonDto {
    nombre?: string
    edificio?: string
    tipo?: SalonTipo
}

export const salonesApi = {
    getByCarrera: (carreraId: string) =>
        apiClient.getList<Salon>(`/carreras/${carreraId}/salones`),

    create: (carreraId: string, dto: CreateSalonDto) =>
        apiClient.post<Salon>(`/carreras/${carreraId}/salones`, dto),

    update: (id: string, dto: UpdateSalonDto) =>
        apiClient.put<Salon>(`/salones/${id}`, dto),

    remove: (id: string) =>
        apiClient.delete(`/salones/${id}`),
}
