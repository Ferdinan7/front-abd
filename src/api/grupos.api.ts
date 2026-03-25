import { apiClient } from './client'

export type Turno = 'matutino' | 'vespertino'

/** Cortes de horario válidos para cada turno (deben coincidir con la rejilla del backend) */
export const TURNO_CORTES: Record<Turno, string[]> = {
    vespertino: ["13:20", "14:10", "15:00", "15:50", "16:40", "17:30", "18:20", "19:10", "20:00"],
    matutino:   ["07:00", "07:50", "08:40", "09:30", "10:20", "11:10", "12:00", "12:50", "13:40"],
}

/** Defaults razonables al seleccionar turno (primer y último corte) */
export const TURNO_DEFAULTS: Record<Turno, { hora_inicio: string; hora_fin: string }> = {
    matutino:   { hora_inicio: "07:00", hora_fin:  "13:40" },
    vespertino: { hora_inicio: "13:20", hora_fin:  "20:00" },
}

/** Transforma mensajes de error del backend a texto legible para el usuario */
export function parseGrupoError(message: string): string {
    const m = message.toLowerCase()
    if (m.includes('duplicate key') || m.includes('grado_seccion') || m.includes('already exists')) {
        return 'Ya existe un grupo con ese grado y sección en esta carrera. Cambia la sección o usa otra carrera.'
    }
    if (m.includes('no token') || m.includes('bearer') || m.includes('unauthorized')) {
        return 'Error de autenticación. Recarga la página e intenta de nuevo.'
    }
    return message
}

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
