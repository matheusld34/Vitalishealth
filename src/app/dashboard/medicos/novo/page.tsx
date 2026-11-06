import { redirect } from "next/navigation"
import { auth } from "@/app/lib/auth"
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import RegisterDoctorPage from "@/components/doctors/RegisterDoctorPage"

export default async function NovoMedicoRoute({
    searchParams,
}: {
    searchParams: Promise<{ id?: string }>
}) {
    const [session, resolvedSearch] = await Promise.all([auth(), searchParams])
    if (!session) redirect("/")

    return (
        <DashboardLayout session={session}>
            <RegisterDoctorPage doctorId={resolvedSearch?.id ?? null} />
        </DashboardLayout>
    )
}
