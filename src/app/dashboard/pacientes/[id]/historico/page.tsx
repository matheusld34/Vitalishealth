import { redirect } from "next/navigation"
import { auth } from "@/app/lib/auth"
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import PatientHistoryPage from "@/components/patients/PatientHistoryPage"

export default async function HistoricoPacienteRoute({ params }: { params: Promise<{ id: string }> }) {
    const [session, resolvedParams] = await Promise.all([auth(), params])
    if (!session) redirect("/")

    return (
        <DashboardLayout session={session}>
            <PatientHistoryPage id={resolvedParams.id} />
        </DashboardLayout>
    )
}
