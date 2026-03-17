import { createFileRoute, redirect } from '@tanstack/react-router'
import { MateriasPage } from '@/features/materias/pages/MateriasPage'
import { supabase } from '@/lib/supabase'

export const Route = createFileRoute('/projects/$projectId/materias')({
    beforeLoad: async () => {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
            throw redirect({ to: '/login' })
        }
    },
    component: MateriasPage,
})
