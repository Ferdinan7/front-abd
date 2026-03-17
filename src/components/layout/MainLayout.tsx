import { Outlet, useRouterState } from '@tanstack/react-router'
import { Header } from './Header'

export function MainLayout() {
    const router = useRouterState()

    // We don't want the header on the login page
    if (router.location.pathname === '/login') {
        return <Outlet />
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
            <Header />
            <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
                <Outlet />
            </main>
        </div>
    )
}
