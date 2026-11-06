import { redirect } from "next/navigation"
import { auth } from "@/app/lib/auth"
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import RegisterPatientPage from "@/components/patients/RegisterPatientPage"

export default async function NovoPacienteRoute() {
    const session = await auth()
    if (!session) redirect("/")
    if (session.user.role === "DOCTOR") redirect("/dashboard")

    return (
        <DashboardLayout session={session}>
            <RegisterPatientPage />
        </DashboardLayout>
    )
}
