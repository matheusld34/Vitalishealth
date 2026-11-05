import { requireSession } from "@/app/lib/auth"
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import AppointmentsPage from "@/components/appointments/AppointmentsPage"

export default async function AgendamentoRoute() {
    const session = await requireSession()

    return (
        <DashboardLayout session={session}>
            <AppointmentsPage />
        </DashboardLayout>
    )
}
