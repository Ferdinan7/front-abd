import { createFileRoute } from '@tanstack/react-router'
import { GroupsPage } from '@/features/academic-groups/pages/GroupsPage'

export const Route = createFileRoute('/projects/$projectId/groups')({
    component: GroupsPage,
})
