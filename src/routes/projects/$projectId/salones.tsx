import { createFileRoute, redirect } from "@tanstack/react-router"
import { SalonesPage } from "@/features/salones/pages/SalonesPage"
import { supabase } from "@/lib/supabase"

export const Route = createFileRoute("/projects/$projectId/salones")({
    beforeLoad: async () => {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
            throw redirect({ to: "/login" })
        }
    },
    component: SalonesPage,
})

