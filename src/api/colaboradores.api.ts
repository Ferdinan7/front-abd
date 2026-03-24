import { apiClient } from "./client"

export type RolCarrera = "admin" | "viewer"

export interface ColaboradorDTO {
  id: string
  carrera_id: string
  user_id: string
  rol: RolCarrera
  created_at: string
  email?: string
  full_name?: string
  avatar_url?: string
}

export interface AddColaboradorDTO {
  email: string
  rol: RolCarrera
}

export interface UpdateColaboradorDTO {
  rol: RolCarrera
}

export const colaboradoresApi = {
  getByCarrera: (carreraId: string) =>
    apiClient.getList<ColaboradorDTO>(`/carreras/${carreraId}/colaboradores`),

  add: (carreraId: string, dto: AddColaboradorDTO) =>
    apiClient.post<ColaboradorDTO>(`/carreras/${carreraId}/colaboradores`, dto),

  update: (id: string, dto: UpdateColaboradorDTO) =>
    apiClient.put<ColaboradorDTO>(`/colaboradores/${id}`, dto),

  remove: (id: string) =>
    apiClient.delete(`/colaboradores/${id}`),
}

