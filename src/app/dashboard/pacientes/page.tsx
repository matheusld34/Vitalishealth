import { redirect } from "next/navigation"
import { auth } from "@/app/lib/auth"
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import PatientsPage from "@/components/patients/PatientsPage"

export default async function PacientesRoute() {
    const session = await auth()
    if (!session) redirect("/")

    return (
        <DashboardLayout session={session}>
            <PatientsPage />
        </DashboardLayout>
    )
}
