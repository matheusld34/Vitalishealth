import { redirect } from "next/navigation"
import { auth } from "@/app/lib/auth"
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import AppointmentsPage from "@/components/appointments/AppointmentsPage"

export default async function AgendamentoRoute() {
    const session = await auth()
    if (!session) redirect("/")

    return (
        <DashboardLayout session={session}>
            <AppointmentsPage />
        </DashboardLayout>
    )
}
