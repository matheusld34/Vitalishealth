import { redirect } from "next/navigation"
import { auth } from "@/app/lib/auth"
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import AllAppointmentsPage from "@/components/appointments/AllAppointmentsPage"

export default async function TodosAgendamentosRoute() {
    const session = await auth()
    if (!session) redirect("/")
    if (session.user.role === "DOCTOR") redirect("/dashboard")

    return (
        <DashboardLayout session={session}>
            <AllAppointmentsPage />
        </DashboardLayout>
    )
}
