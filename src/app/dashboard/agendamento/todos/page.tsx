import { requireSession } from "@/app/lib/auth"
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import AllAppointmentsPage from "@/components/appointments/AllAppointmentsPage"

export default async function TodosAgendamentosRoute() {
    const session = await requireSession()

    return (
        <DashboardLayout session={session}>
            <AllAppointmentsPage />
        </DashboardLayout>
    )
}
