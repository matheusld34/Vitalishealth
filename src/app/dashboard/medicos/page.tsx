import { requireRole } from "@/app/lib/auth"
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import DoctorsPage from "@/components/doctors/DoctorsPage"

export default async function MedicosRoute() {
    const session = await requireRole("MASTER", "SECRETARY")

    return (
        <DashboardLayout session={session}>
            <DoctorsPage />
        </DashboardLayout>
    )
}
