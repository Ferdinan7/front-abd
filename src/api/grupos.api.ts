import { apiClient } from './client'

export type Turno = 'matutino' | 'vespertino'

export interface Grupo {
    id: string
    grado: number
    seccion: string
    turno: Turno
    hora_inicio?: string
    hora_fin?: string
    duracion_bloque?: number
    carreraId: string
}

export interface CreateGrupoDto {
    grado: number
    seccion: string
    turno: Turno
    hora_inicio?: string
    hora_fin?: string
    duracion_bloque?: number
}

export interface UpdateGrupoDto {
    grado?: number
    seccion?: string
    turno?: Turno
    hora_inicio?: string
    hora_fin?: string
    duracion_bloque?: number
}

export const gruposApi = {
    getByCarrera: (carreraId: string) =>
        apiClient.getList<Grupo>(`/carreras/${carreraId}/grupos`),

    create: (carreraId: string, dto: CreateGrupoDto) =>
        apiClient.post<Grupo>(`/carreras/${carreraId}/grupos`, dto),

    update: (id: string, dto: UpdateGrupoDto) =>
        apiClient.put<Grupo>(`/grupos/${id}`, dto),

    remove: (id: string) =>
        apiClient.delete(`/grupos/${id}`),
}
