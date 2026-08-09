import { redirect } from "next/navigation"
import { auth } from "@/app/lib/auth"
import DashboardLayout from "@/components/dashboard/DashboardLayout"
import DoctorsPage from "@/components/doctors/DoctorsPage"

export default async function MedicosRoute() {
    const session = await auth()
    if (!session) redirect("/")

    return (
        <DashboardLayout session={session}>
            <DoctorsPage />
        </DashboardLayout>
    )
}
