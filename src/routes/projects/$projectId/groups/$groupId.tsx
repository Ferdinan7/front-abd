import { createFileRoute, redirect } from '@tanstack/react-router'
import { GroupDetailPage } from '@/features/academic-groups/pages/GroupDetailPage'
import { supabase } from '@/lib/supabase'

export const Route = createFileRoute('/projects/$projectId/groups/$groupId')({
    beforeLoad: async () => {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
            throw redirect({ to: '/login' })
        }
    },
    component: GroupDetailPage,
})
