import { redirect } from "next/navigation"
import { auth } from "@/app/lib/auth"
import LoginPage from "@/components/login/LoginPage"

export default async function Home() {
    const session = await auth()
    if (session) redirect("/dashboard")
    return <LoginPage />
}
