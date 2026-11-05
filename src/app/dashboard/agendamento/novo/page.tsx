import { requireRole } from "@/app/lib/auth"
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import NewAppointmentPage from "@/components/appointments/NewAppointmentPage"

export default async function NovoAtendimentoRoute() {
    const session = await requireRole("MASTER", "SECRETARY")

    return (
        <DashboardLayout session={session}>
            <NewAppointmentPage />
        </DashboardLayout>
    )
}
