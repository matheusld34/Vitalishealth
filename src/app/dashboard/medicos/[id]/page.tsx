import { redirect } from "next/navigation"
import { auth } from "@/app/lib/auth"
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import DoctorProfilePage from "@/components/doctors/DoctorProfilePage"

export default async function MedicoDetalheRoute({ params }: { params: Promise<{ id: string }> }) {
    const [session, resolvedParams] = await Promise.all([auth(), params])
    if (!session) redirect("/")

    return (
        <DashboardLayout session={session}>
            <DoctorProfilePage id={resolvedParams.id} />
        </DashboardLayout>
    )
}
