"use client"

import type { Session } from "next-auth"
import { signOut } from "next-auth/react"
import Link from "next/link"
import logoImage from "@/app/assets/images/logo.png"

type Props = {
    session: Session
    onToggleSidebar: () => void
}

export default function Header({ session, onToggleSidebar }: Props) {
    const initials = (session.user.name ?? "VU")
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase()

    return (
        <header className="sticky top-0 z-50 h-16 md:h-20 bg-white border-b border-neutral-200">
            <div className="h-full max-w-[1600px] mx-auto px-4 md:px-8 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        aria-label="Abrir menu"
                        onClick={onToggleSidebar}
                        className="md:hidden h-10 w-10 inline-flex items-center justify-center rounded-lg border border-neutral-200 text-neutral-700 hover:bg-neutral-100"
                    >
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <line x1="3" y1="12" x2="21" y2="12" />
                            <line x1="3" y1="18" x2="21" y2="18" />
                        </svg>
                    </button>

                    <Link href="/dashboard" className="flex items-center gap-3 min-w-0">
                        <span className="h-10 w-10 shrink-0 rounded-lg bg-neutral-200 overflow-hidden flex items-center justify-center">
                            <img
                                src={logoImage.src}
                                alt="Vitalis Health"
                                className="h-full w-full object-contain"
                            />
                        </span>
                        <span className="text-brand-800 font-serif font-semibold text-lg md:text-xl tracking-tight truncate">
                            Vitalis Health
                        </span>
                    </Link>
                </div>

                <div className="flex items-center gap-2 md:gap-3">
                    <button
                        type="button"
                        aria-label="Notificações"
                        className="relative h-10 w-10 inline-flex items-center justify-center rounded-full text-neutral-600 hover:bg-neutral-100"
                    >
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                        </svg>
                    </button>

                    <button
                        type="button"
                        aria-label="Configurações"
                        className="h-10 w-10 inline-flex items-center justify-center rounded-full text-neutral-600 hover:bg-neutral-100"
                    >
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <circle cx="12" cy="12" r="3" />
                            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09A1.65 1.65 0 0 0 15 4.6a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09A1.65 1.65 0 0 0 19.4 15z" />
                        </svg>
                    </button>

                    <div className="ml-1 flex items-center gap-3">
                        <div className="hidden sm:flex flex-col items-end leading-tight">
                            <span className="text-sm font-medium text-neutral-800 truncate max-w-[160px]">
                                {session.user.name ?? "Usuário"}
                            </span>
                            <span className="text-xs text-neutral-500">
                                {roleLabel(session.user.role)}
                            </span>
                        </div>

                        <button
                            type="button"
                            onClick={() => signOut({ callbackUrl: "/" })}
                            title="Sair da conta"
                            className="relative h-10 w-10 shrink-0 rounded-full bg-brand-600 text-white ring-2 ring-brand-100 flex items-center justify-center text-sm font-semibold"
                        >
                            {session.user.image ? (
                                <img
                                    src={session.user.image}
                                    alt=""
                                    className="absolute inset-0 h-full w-full object-cover rounded-full"
                                />
                            ) : (
                                <span aria-hidden="true">{initials}</span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </header>
    )
}

function roleLabel(role: "MASTER" | "SECRETARY" | "DOCTOR") {
    switch (role) {
        case "MASTER":
            return "Master"
        case "SECRETARY":
            return "Secretaria"
        case "DOCTOR":
            return "Médico"
    }
}
