import { apiClient } from './client'

export interface Materia {
    id: string
    nombre: string
    codigo?: string
    grado: number
    horas_semanales: number
    carreraId: string
}

export interface CreateMateriaDto {
    nombre: string
    codigo?: string
    grado: number
    horas_semanales: number
}

export interface UpdateMateriaDto {
    nombre?: string
    codigo?: string
    grado?: number
    horas_semanales?: number
}

export const materiasApi = {
    getByCarrera: (carreraId: string, grado?: number) => {
        const query = grado !== undefined ? `?grado=${grado}` : ''
        return apiClient.getList<Materia>(`/carreras/${carreraId}/materias${query}`)
    },

    create: (carreraId: string, dto: CreateMateriaDto) =>
        apiClient.post<Materia>(`/carreras/${carreraId}/materias`, dto),

    update: (id: string, dto: UpdateMateriaDto) =>
        apiClient.put<Materia>(`/materias/${id}`, dto),

    remove: (id: string) =>
        apiClient.delete(`/materias/${id}`),
}
