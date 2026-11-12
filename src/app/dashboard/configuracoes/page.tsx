import { redirect } from "next/navigation"
import { auth } from "@/app/lib/auth"
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import SettingsPage from "@/components/settings/SettingsPage"

export default async function ConfiguracoesRoute() {
    const session = await auth()
    if (!session) redirect("/")
    if (session.user.role !== "MASTER") redirect("/dashboard")

    return (
        <DashboardLayout session={session}>
            <SettingsPage
                userName={session.user.name ?? "Administrador"}
                userEmail={session.user.email ?? "—"}
            />
        </DashboardLayout>
    )
}
