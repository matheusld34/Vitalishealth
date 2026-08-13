import { redirect } from "next/navigation"
import { auth } from "@/app/lib/auth"
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import DoctorProfilePage from "@/components/doctors/DoctorProfilePage"

export default async function MedicoDetalheRoute({ params }: { params: { id: string } }) {
    const session = await auth()
    if (!session) redirect("/")

    return (
        <DashboardLayout session={session}>
            <DoctorProfilePage id={params.id} />
        </DashboardLayout>
    )
}
