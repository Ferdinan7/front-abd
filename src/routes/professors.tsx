import { createFileRoute, redirect } from '@tanstack/react-router'
import { ProfesoresPage } from '@/features/professors/pages/ProfesoresPage'
import { supabase } from '@/lib/supabase'

export const Route = createFileRoute('/professors')({
    beforeLoad: async () => {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
            throw redirect({ to: '/login' })
        }
    },
    component: ProfesoresPage,
})
