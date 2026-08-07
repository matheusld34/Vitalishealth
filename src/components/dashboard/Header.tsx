"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import type { Session } from "next-auth"
import { signOut } from "next-auth/react"
import Link from "next/link"
import logoImage from "@/app/assets/images/logo.png"

type Props = {
    session: Session
    onToggleSidebar: () => void
}

export default function Header({ session, onToggleSidebar }: Props) {
    const [menuOpen, setMenuOpen] = useState(false)
    const [avatarError, setAvatarError] = useState(false)
    const menuRef = useRef<HTMLDivElement | null>(null)
    const menuButtonRef = useRef<HTMLDivElement | null>(null)

    const initials = (session.user.name ?? "VU")
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase()

    const profileImage = !avatarError ? session.user.image : null

    useEffect(() => {
        if (!menuOpen) return undefined

        function handleClickOutside(e: MouseEvent) {
            const target = e.target as Node
            if (
                menuRef.current?.contains(target) ||
                menuButtonRef.current?.contains(target)
            ) {
                return
            }
            setMenuOpen(false)
        }

        function handleEsc(e: KeyboardEvent) {
            if (e.key === "Escape") setMenuOpen(false)
        }

        document.addEventListener("mousedown", handleClickOutside)
        document.addEventListener("keydown", handleEsc)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
            document.removeEventListener("keydown", handleEsc)
        }
    }, [menuOpen])

    async function handleSignOut() {
        setMenuOpen(false)
        await signOut({ callbackUrl: "/" })
    }

    return (
        <header className="sticky top-0 z-50 h-16 md:h-20 border-b border-neutral-200/70 bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/70 shadow-[0_1px_0_rgba(0,0,0,0.02)]">
            <div className="h-full max-w-[1600px] mx-auto px-4 md:px-8 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 md:gap-4">
                    <button
                        type="button"
                        aria-label="Abrir menu"
                        onClick={onToggleSidebar}
                        className="md:hidden h-10 w-10 inline-flex items-center justify-center rounded-xl border border-neutral-200/80 text-neutral-700 bg-white hover:bg-neutral-50 hover:border-neutral-300 hover:shadow-sm transition-all duration-200"
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

                    <Link href="/dashboard" className="flex items-center gap-3 min-w-0 group">
                        <span className="relative h-11 w-11 shrink-0 rounded-2xl bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 shadow-[0_4px_14px_rgba(16,142,93,0.25)] ring-1 ring-white/40 overflow-hidden flex items-center justify-center transition-transform duration-300 group-hover:scale-[1.03] group-hover:shadow-[0_6px_18px_rgba(16,142,93,0.32)]">
                            <Image
                                src={logoImage}
                                alt="Vitalis Health"
                                width={30}
                                height={30}
                                className="w-auto h-auto object-contain drop-shadow-[0_1px_0_rgba(255,255,255,0.25)]"
                                priority
                            />
                        </span>
                        <div className="min-w-0 leading-tight">
                            <span className="block text-brand-800 font-serif font-semibold text-[19px] md:text-[22px] tracking-tight truncate">
                                Vitalis Health
                            </span>
                            <span className="hidden md:block text-[11px] font-medium tracking-[0.18em] text-brand-600/80 uppercase">
                                Clínica & Gestão
                            </span>
                        </div>
                    </Link>
                </div>

                <div className="flex items-center gap-2 md:gap-3">
                    <button
                        type="button"
                        aria-label="Notificações"
                        className="relative h-10 w-10 inline-flex items-center justify-center rounded-xl border border-transparent text-neutral-600 bg-neutral-50/60 hover:bg-white hover:border-neutral-200 hover:text-brand-700 hover:shadow-sm transition-all duration-200"
                    >
                        <svg
                            width="19"
                            height="19"
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
                        <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white shadow-[0_0_0_1px_rgba(239,68,68,0.3)]" />
                    </button>

                    <button
                        type="button"
                        aria-label="Configurações"
                        className="relative h-10 w-10 inline-flex items-center justify-center rounded-xl border border-transparent text-neutral-600 bg-neutral-50/60 hover:bg-white hover:border-neutral-200 hover:text-brand-700 hover:shadow-sm transition-all duration-200"
                    >
                        <svg
                            width="19"
                            height="19"
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

                    <div className="mx-1 h-8 w-px bg-neutral-200/80 hidden md:block" aria-hidden="true" />

                    <div ref={menuButtonRef} className="relative">
                        <button
                            type="button"
                            onClick={() => setMenuOpen((open) => !open)}
                            aria-haspopup="menu"
                            aria-expanded={menuOpen}
                            aria-label="Abrir menu do usuário"
                            className={`group flex items-center gap-2 md:gap-3 pl-1.5 pr-3 md:pl-2 md:pr-4 py-1.5 rounded-full border transition-all duration-200 ${menuOpen
                                    ? "bg-brand-50 border-brand-200 shadow-[0_4px_14px_rgba(16,142,93,0.12)]"
                                    : "bg-white border-neutral-200/80 hover:border-brand-200/80 hover:bg-brand-50/40 hover:shadow-[0_4px_14px_rgba(16,142,93,0.08)]"
                                }`}
                        >
                            <div className="hidden sm:flex flex-col items-end leading-tight">
                                <span className="text-sm font-semibold text-neutral-800 truncate max-w-[150px]">
                                    {session.user.name ?? "Usuário"}
                                </span>
                                <span className="text-[11px] font-medium text-brand-700/80 uppercase tracking-wide">
                                    {roleLabel(session.user.role)}
                                </span>
                            </div>

                            <div className="relative h-10 w-10 md:h-11 md:w-11 shrink-0 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 ring-2 ring-white shadow-[0_4px_14px_rgba(16,142,93,0.22)] overflow-hidden flex items-center justify-center transition-transform duration-200 group-hover:scale-[1.03]">
                                {profileImage ? (
                                    <Image
                                        src={profileImage}
                                        alt={session.user.name ?? "Foto do usuário"}
                                        width={44}
                                        height={44}
                                        onError={() => setAvatarError(true)}
                                        className="absolute inset-0 h-full w-full object-cover"
                                        referrerPolicy="no-referrer"
                                    />
                                ) : (
                                    <span
                                        aria-hidden="true"
                                        className="relative text-[13px] md:text-sm font-bold tracking-wide text-white drop-shadow-[0_1px_0_rgba(0,0,0,0.15)]"
                                    >
                                        {initials}
                                    </span>
                                )}
                            </div>

                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                                className={`hidden md:block text-neutral-400 transition-transform duration-200 ${menuOpen ? "rotate-180 text-brand-700" : ""
                                    }`}
                            >
                                <polyline points="6 9 12 15 18 9" />
                            </svg>
                        </button>

                        {menuOpen && (
                            <div
                                ref={menuRef}
                                role="menu"
                                className="absolute right-0 mt-3 w-[300px] origin-top-right rounded-2xl border border-neutral-200/80 bg-white shadow-[0_20px_60px_-15px_rgba(15,23,42,0.18)] ring-1 ring-black/[0.03] focus:outline-none animate-[fadeIn_0.15s_ease-out,slideDown_0.18s_ease-out]"
                                style={{ animationFillMode: "both" }}
                            >
                                <div className="px-4 py-4 border-b border-neutral-100 flex items-center gap-3">
                                    <div className="relative h-12 w-12 shrink-0 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 ring-2 ring-white shadow-md overflow-hidden flex items-center justify-center">
                                        {profileImage ? (
                                            <Image
                                                src={profileImage}
                                                alt=""
                                                width={48}
                                                height={48}
                                                onError={() => setAvatarError(true)}
                                                className="absolute inset-0 h-full w-full object-cover"
                                                referrerPolicy="no-referrer"
                                            />
                                        ) : (
                                            <span className="relative text-sm font-bold text-white">
                                                {initials}
                                            </span>
                                        )}
                                    </div>
                                    <div className="min-w-0 leading-tight">
                                        <p className="text-sm font-semibold text-neutral-900 truncate">
                                            {session.user.name ?? "Usuário"}
                                        </p>
                                        <p className="text-xs text-neutral-500 truncate">
                                            {session.user.email ?? ""}
                                        </p>
                                        <p className="mt-1 inline-flex items-center px-2 py-0.5 rounded-full bg-brand-50 text-[10px] font-semibold tracking-wide text-brand-700 uppercase">
                                            {roleLabel(session.user.role)}
                                        </p>
                                    </div>
                                </div>

                                <div className="py-1.5 px-2">
                                    <Link
                                        href="/dashboard/perfil"
                                        onClick={() => setMenuOpen(false)}
                                        role="menuitem"
                                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
                                    >
                                        <span className="h-8 w-8 inline-flex items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                                            <svg
                                                width="17"
                                                height="17"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                aria-hidden="true"
                                            >
                                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                                <circle cx="12" cy="7" r="4" />
                                            </svg>
                                        </span>
                                        <div className="flex-1 leading-tight">
                                            <span className="block font-medium">Meu perfil</span>
                                            <span className="block text-[11px] text-neutral-500">
                                                Visualizar e editar dados
                                            </span>
                                        </div>
                                    </Link>

                                    <Link
                                        href="/dashboard/configuracoes"
                                        onClick={() => setMenuOpen(false)}
                                        role="menuitem"
                                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
                                    >
                                        <span className="h-8 w-8 inline-flex items-center justify-center rounded-lg bg-neutral-100 text-neutral-600">
                                            <svg
                                                width="17"
                                                height="17"
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
                                        </span>
                                        <div className="flex-1 leading-tight">
                                            <span className="block font-medium">Configurações</span>
                                            <span className="block text-[11px] text-neutral-500">
                                                Preferências da conta
                                            </span>
                                        </div>
                                    </Link>
                                </div>

                                <div className="border-t border-neutral-100 py-1.5 px-2 mb-1">
                                    <button
                                        type="button"
                                        onClick={handleSignOut}
                                        role="menuitem"
                                        className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                        <span className="h-8 w-8 inline-flex items-center justify-center rounded-lg bg-red-50 text-red-500">
                                            <svg
                                                width="17"
                                                height="17"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                aria-hidden="true"
                                            >
                                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                                <polyline points="16 17 21 12 16 7" />
                                                <line x1="21" y1="12" x2="9" y2="12" />
                                            </svg>
                                        </span>
                                        <div className="flex-1 leading-tight text-left">
                                            <span className="block font-semibold">Sair</span>
                                            <span className="block text-[11px] text-red-500/80">
                                                Encerrar sessão atual
                                            </span>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        )}
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
