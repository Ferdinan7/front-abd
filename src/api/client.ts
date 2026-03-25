import { supabase } from '@/lib/supabase'
import type { Session } from '@supabase/supabase-js'

const BASE_URL = import.meta.env.VITE_API_URL as string

/**
 * Caché de sesión activa actualizada por onAuthStateChange.
 *
 * Problema original: supabase.auth.getSession() puede devolver null momentáneamente:
 *  - Justo después del redirect OAuth (sesión en hash URL, no en storage aún).
 *  - Durante la ventana de auto-refresh del token.
 *
 * Solución: nos suscribimos a los cambios de sesión al iniciar el módulo para
 * tener siempre el token más reciente disponible síncronamente.
 */
let _cachedSession: Session | null = null

supabase.auth.onAuthStateChange((_event, session) => {
    _cachedSession = session
})

// Pre-cargar desde storage al inicializar el módulo
supabase.auth.getSession().then(({ data: { session } }) => {
    if (session && !_cachedSession) _cachedSession = session
})

async function getToken(): Promise<string | null> {
    // 1. Token en caché (actualizado por onAuthStateChange)
    if (_cachedSession?.access_token) return _cachedSession.access_token

    // 2. Fallback: leer de storage (por si el módulo cargó antes que onAuthStateChange disparara)
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.access_token) {
        _cachedSession = session
        return session.access_token
    }

    return null
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const token = await getToken()

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(init.headers as Record<string, string> ?? {}),
    }
    if (token) {
        headers['Authorization'] = `Bearer ${token}`
    }

    const res = await fetch(`${BASE_URL}${path}`, { ...init, headers })

    if (!res.ok) {
        const body = await res.json().catch(() => null) as Record<string, unknown> | null
        let message = `HTTP ${res.status}`
        if (body) {
            if (Array.isArray(body.message)) {
                message = (body.message as string[]).join(', ')
            } else if (typeof body.message === 'string') {
                message = body.message
            } else if (typeof body.error === 'string') {
                message = body.error
            }
        }
        throw new Error(message)
    }

    if (res.status === 204) return undefined as T
    return res.json() as Promise<T>
}

/**
 * Normalizes list responses — the backend may return a plain array
 * or wrap it in an object like { data: [...] }.
 */
async function getList<T>(path: string): Promise<T[]> {
    const result = await request<T[] | { data: T[] } | Record<string, unknown>>(path)
    if (Array.isArray(result)) return result
    if (result && typeof result === 'object' && 'data' in result && Array.isArray(result.data)) {
        return result.data as T[]
    }
    // Fallback: look for the first array-valued key in the response object
    for (const value of Object.values(result as Record<string, unknown>)) {
        if (Array.isArray(value)) return value as T[]
    }
    return []
}

export const apiClient = {
    get: <T>(path: string) => request<T>(path),
    getList: <T>(path: string) => getList<T>(path),
    post: <T>(path: string, body?: unknown) =>
        request<T>(path, { method: 'POST', body: body !== undefined ? JSON.stringify(body) : undefined }),
    put: <T>(path: string, body?: unknown) =>
        request<T>(path, { method: 'PUT', body: body !== undefined ? JSON.stringify(body) : undefined }),
    delete: <T = void>(path: string) => request<T>(path, { method: 'DELETE' }),
}
