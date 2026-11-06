import { redirect } from "next/navigation"
import { auth } from "@/app/lib/auth"
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import PatientsPage from "@/components/patients/PatientsPage"

export default async function PacientesRoute() {
    const session = await auth()
    if (!session) redirect("/")
    if (session.user.role === "DOCTOR") redirect("/dashboard")

    return (
        <DashboardLayout session={session}>
            <PatientsPage />
        </DashboardLayout>
    )
}
