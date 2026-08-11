import { redirect } from "next/navigation"
import { auth } from "@/app/lib/auth"
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import RegisterPatientPage from "@/components/patients/RegisterPatientPage"

export default async function NovoPacienteRoute() {
    const session = await auth()
    if (!session) redirect("/")

    return (
        <DashboardLayout session={session}>
            <RegisterPatientPage />
        </DashboardLayout>
    )
}
