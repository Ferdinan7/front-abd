import { apiClient } from './client'

export interface UserProfile {
    id: string
    email: string
    nombre: string
    avatarUrl?: string
    rol: string
}

export const authApi = {
    syncProfile: () =>
        apiClient.post<UserProfile>('/auth/sync-profile'),
}
