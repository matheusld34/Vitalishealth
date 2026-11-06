import { redirect } from "next/navigation"
import { auth } from "@/app/lib/auth"
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import MyAgendaPage from "@/components/agenda/MyAgendaPage"

export default async function AgendaRoute() {
    const session = await auth()
    if (!session) redirect("/")

    // Página exclusiva do corpo clínico: médicos e master
    if (session.user.role !== "DOCTOR" && session.user.role !== "MASTER") {
        redirect("/dashboard")
    }

    return (
        <DashboardLayout session={session}>
            <MyAgendaPage
                userId={session.user.id}
                userRole={session.user.role}
                userName={session.user.name ?? "Profissional"}
            />
        </DashboardLayout>
    )
}
