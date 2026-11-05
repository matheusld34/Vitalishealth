import { requireSession } from "@/app/lib/auth"
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import RegisterPatientPage from "@/components/patients/RegisterPatientPage"

export default async function NovoPacienteRoute() {
    const session = await requireSession()

    return (
        <DashboardLayout session={session}>
            <RegisterPatientPage />
        </DashboardLayout>
    )
}
