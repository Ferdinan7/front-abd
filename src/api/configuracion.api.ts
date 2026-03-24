import { apiClient } from "./client"

export interface ConfigCarreraDTO {
  carrera_id?: string
  duracion_bloque: number
  hora_inicio: string // HH:mm:ss
  hora_fin: string    // HH:mm:ss
  receso_matutino_inicio: string | null
  receso_matutino_fin: string | null
  receso_vespertino_inicio: string | null
  receso_vespertino_fin: string | null
}

export const configuracionApi = {
  getByCarrera: async (carreraId: string): Promise<ConfigCarreraDTO> => {
    // We get a single object directly
    const res = await apiClient.get<{ data?: ConfigCarreraDTO } | ConfigCarreraDTO>(`/carreras/${carreraId}/config`)
    // Handle { data: ... } or flat object
    if (res && typeof res === "object" && "data" in res && res.data) {
      return res.data as ConfigCarreraDTO
    }
    return res as ConfigCarreraDTO
  },

  update: async (carreraId: string, dto: Partial<ConfigCarreraDTO>): Promise<ConfigCarreraDTO> => {
    const res = await apiClient.put<{ data?: ConfigCarreraDTO } | ConfigCarreraDTO>(`/carreras/${carreraId}/config`, dto)
    if (res && typeof res === "object" && "data" in res && res.data) {
      return res.data as ConfigCarreraDTO
    }
    return res as ConfigCarreraDTO
  }
}

