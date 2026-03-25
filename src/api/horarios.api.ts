import { apiClient } from './client'

export interface HorarioBloqueItem {
    hora_inicio: string
    hora_fin: string
    materia: string
    profesor: string
    salon?: string
    tipo?: 'clase' | 'receso' | string
}

export interface HorarioData {
    lunes: HorarioBloqueItem[]
    martes: HorarioBloqueItem[]
    miercoles: HorarioBloqueItem[]
    jueves: HorarioBloqueItem[]
    viernes: HorarioBloqueItem[]
}

export interface HorarioWarning {
    materia: string
    horasFaltantes: number
    motivo: string
}

export interface GenerarHorarioResponse {
    status: string
    message: string
    data: { asignacion_id: string; dia_semana: number; hora_inicio: string; hora_fin: string }[]
    warnings?: HorarioWarning[]
}

export const horariosApi = {
    generar: (grupoId: string, regenerar = false) =>
        apiClient.post<GenerarHorarioResponse>(
            `/grupos/${grupoId}/horario/generar?regenerar=${regenerar}`
        ),

    getByGrupo: async (grupoId: string): Promise<HorarioData> => {
        const result = await apiClient.get<{ status: string; data: HorarioData }>(
            `/grupos/${grupoId}/horario`
        )
        return result.data
    },

    remove: (grupoId: string) =>
        apiClient.delete(`/grupos/${grupoId}/horario`),
}
