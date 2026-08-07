import { redirect } from "next/navigation"
import { auth } from "@/app/lib/auth"
import RegisterPage from "@/components/register/RegisterPage"

export default async function Cadastro() {
    const session = await auth()
    if (session) redirect("/dashboard")
    return <RegisterPage />
}
