import { apiClient } from './client'

export interface Asignacion {
    id: string
    profesor_id: string
    materia_id: string
    grupoId: string
    salon_id?: string
    profesor?: { id: string; nombre_completo: string }
    materia?: { id: string; nombre: string; horas_semanales: number }
    salon?: { id: string; nombre: string }
}

export interface CreateAsignacionDto {
    profesor_id: string
    materia_id: string
    /** El backend aún no persiste salon_id en asignaciones, pero se envía por compatibilidad futura */
    salon_id?: string
}

export interface UpdateAsignacionDto {
    profesor_id?: string
    materia_id?: string
    salon_id?: string
}

export const asignacionesApi = {
    getByGrupo: (grupoId: string) =>
        apiClient.getList<Asignacion>(`/grupos/${grupoId}/asignaciones`),

    create: (grupoId: string, dto: CreateAsignacionDto) =>
        apiClient.post<Asignacion>(`/grupos/${grupoId}/asignaciones`, dto),

    update: (id: string, dto: UpdateAsignacionDto) =>
        apiClient.put<Asignacion>(`/asignaciones/${id}`, dto),

    remove: (id: string) =>
        apiClient.delete(`/asignaciones/${id}`),
}
