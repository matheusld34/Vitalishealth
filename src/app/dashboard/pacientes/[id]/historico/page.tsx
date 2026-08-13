import { redirect } from "next/navigation"
import { auth } from "@/app/lib/auth"
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import PatientHistoryPage from "@/components/patients/PatientHistoryPage"

export default async function HistoricoPacienteRoute({ params }: { params: { id: string } }) {
    const session = await auth()
    if (!session) redirect("/")

    return (
        <DashboardLayout session={session}>
            <PatientHistoryPage id={params.id} />
        </DashboardLayout>
    )
}
