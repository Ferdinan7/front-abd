import { apiClient } from "./client"

export type TipoSalon = "aula" | "laboratorio" | "sala"

export interface SalonDTO {
  salones_carrera_id?: string
  es_principal?: boolean
  id: string
  nombre: string
  edificio: string
  tipo: TipoSalon
  activo: boolean
}

export interface CreateSalonDTO {
  nombre: string
  edificio: string
  tipo: TipoSalon
}

export interface UpdateSalonDTO {
  nombre?: string
  edificio?: string
  tipo?: TipoSalon
  activo?: boolean
}

export const salonesApi = {
  getByCarrera: (carreraId: string) =>
    apiClient.getList<SalonDTO>(`/carreras/${carreraId}/salones`),

  create: (carreraId: string, dto: CreateSalonDTO) =>
    apiClient.post<SalonDTO>(`/carreras/${carreraId}/salones`, dto),

  update: (id: string, dto: UpdateSalonDTO) =>
    apiClient.put<SalonDTO>(`/salones/${id}`, dto),

  remove: (id: string) =>
    apiClient.delete(`/salones/${id}`),
}

