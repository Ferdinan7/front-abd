import { createFileRoute, redirect } from '@tanstack/react-router'
import { ProjectsPage } from '@/features/projects/pages/ProjectsPage'
import { supabase } from '@/lib/supabase'

export const Route = createFileRoute('/projects/')({
    beforeLoad: async () => {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
            throw redirect({ to: '/login' })
        }
    },
    component: ProjectsPage,
})
