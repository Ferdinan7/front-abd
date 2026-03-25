import { apiClient } from './client'

export type ColaboradorRol = 'admin' | 'viewer'

export interface ColaboradorUser {
    id?: string
    email?: string
    full_name?: string
    nombre?: string
}

export interface Colaborador {
    id: string
    carreraId?: string
    rol: ColaboradorRol
    user?: ColaboradorUser
}

export interface CreateColaboradorDto {
    email: string
    rol: ColaboradorRol
}

export interface UpdateColaboradorDto {
    rol: ColaboradorRol
}

export const colaboradoresApi = {
    getByCarrera: (carreraId: string) =>
        apiClient.getList<Colaborador>(`/carreras/${carreraId}/colaboradores`),

    create: (carreraId: string, dto: CreateColaboradorDto) =>
        apiClient.post<Colaborador>(`/carreras/${carreraId}/colaboradores`, dto),

    update: (id: string, dto: UpdateColaboradorDto) =>
        apiClient.put<Colaborador>(`/colaboradores/${id}`, dto),

    remove: (id: string) =>
        apiClient.delete(`/colaboradores/${id}`),
}
