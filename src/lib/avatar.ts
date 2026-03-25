/**
 * Devuelve la URL de avatar a usar para un usuario.
 *
 * Prioridad:
 *  1. avatar_url almacenado (Google OAuth → Supabase lo guarda en user_metadata / profiles)
 *  2. undefined → el componente mostrará las iniciales coloridas
 *
 * No se usa Gravatar para evitar identicons genéricos que confunden al usuario.
 */
export function resolveAvatarUrl(opts: {
    avatarUrl?: string
}): string | undefined {
    return opts.avatarUrl ?? undefined
}

/**
 * Colores de avatar consistentes según la primera letra del nombre.
 * Devuelve clases Tailwind para bg y text.
 */
const AVATAR_PALETTE = [
    "bg-blue-100 text-blue-700",
    "bg-indigo-100 text-indigo-700",
    "bg-violet-100 text-violet-700",
    "bg-emerald-100 text-emerald-700",
    "bg-amber-100 text-amber-700",
    "bg-rose-100 text-rose-700",
    "bg-cyan-100 text-cyan-700",
    "bg-orange-100 text-orange-700",
]

export function avatarColor(name: string): string {
    const code = name.charCodeAt(0) || 0
    return AVATAR_PALETTE[code % AVATAR_PALETTE.length]
}
