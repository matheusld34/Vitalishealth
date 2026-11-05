import { requireSession } from "@/app/lib/auth"
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import PatientsPage from "@/components/patients/PatientsPage"

export default async function PacientesRoute() {
    const session = await requireSession()

    return (
        <DashboardLayout session={session}>
            <PatientsPage />
        </DashboardLayout>
    )
}
