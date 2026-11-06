import { redirect } from "next/navigation"
import { auth } from "@/app/lib/auth"
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import NewAppointmentPage from "@/components/appointments/NewAppointmentPage"

export default async function NovoAtendimentoRoute() {
    const session = await auth()
    if (!session) redirect("/")
    if (session.user.role === "DOCTOR") redirect("/dashboard")

    return (
        <DashboardLayout session={session}>
            <NewAppointmentPage />
        </DashboardLayout>
    )
}
