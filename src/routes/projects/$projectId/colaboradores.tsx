import { createFileRoute, redirect } from '@tanstack/react-router'
import { ColaboradoresPage } from '@/features/colaboradores/pages/ColaboradoresPage'
import { supabase } from '@/lib/supabase'

export const Route = createFileRoute('/projects/$projectId/colaboradores')({
    beforeLoad: async () => {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
            throw redirect({ to: '/login' })
        }
    },
    component: ColaboradoresPage,
})
