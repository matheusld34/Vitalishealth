import { redirect } from "next/navigation"
import { auth } from "@/app/lib/auth"
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import RegisterDoctorPage from "@/components/doctors/RegisterDoctorPage"

export default async function NovoMedicoRoute() {
    const session = await auth()
    if (!session) redirect("/")

    return (
        <DashboardLayout session={session}>
            <RegisterDoctorPage />
        </DashboardLayout>
    )
}
