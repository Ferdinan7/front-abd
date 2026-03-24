import { createFileRoute, redirect } from "@tanstack/react-router"
import { ConfiguracionPage } from "@/features/configuracion/pages/ConfiguracionPage"
import { supabase } from "@/lib/supabase"

export const Route = createFileRoute("/projects/$projectId/configuracion")({
    beforeLoad: async () => {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
            throw redirect({ to: "/login" })
        }
    },
    component: ConfiguracionPage,
})

