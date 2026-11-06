import { redirect } from "next/navigation"
import { auth } from "@/app/lib/auth"
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import DoctorSettingsPage from "@/components/doctors/DoctorSettingsPage"

export default async function PerfilMedicoRoute() {
    const session = await auth()
    if (!session) redirect("/")
    if (session.user.role !== "DOCTOR" && session.user.role !== "MASTER") redirect("/dashboard")

    return (
        <DashboardLayout session={session}>
            <DoctorSettingsPage
                userId={session.user.id}
                userRole={session.user.role}
                userName={session.user.name ?? "Profissional"}
            />
        </DashboardLayout>
    )
}
