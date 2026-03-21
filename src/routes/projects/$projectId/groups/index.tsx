import { createFileRoute, redirect } from '@tanstack/react-router'
import { GroupsPage } from '@/features/academic-groups/pages/GroupsPage'
import { supabase } from '@/lib/supabase'

export const Route = createFileRoute('/projects/$projectId/groups/')({
    beforeLoad: async () => {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
            throw redirect({ to: '/login' })
        }
    },
    component: GroupsPage,
})
