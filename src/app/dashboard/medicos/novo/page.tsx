import { requireRole } from "@/app/lib/auth"
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import RegisterDoctorPage from "@/components/doctors/RegisterDoctorPage"

export default async function NovoMedicoRoute() {
    const session = await requireRole("MASTER", "SECRETARY")

    return (
        <DashboardLayout session={session}>
            <RegisterDoctorPage />
        </DashboardLayout>
    )
}
