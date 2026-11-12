"use client"

import { useEffect, useMemo, useState } from "react"
import { useTheme } from "@/components/theme/ThemeProvider"

type Toast = { kind: "success" | "info" | "error"; message: string } | null

type NotificationPrefs = {
    appointmentReminder: boolean
    emailConfirm: boolean
    whatsappConfirm: boolean
    newAppointment: boolean
    dailyDigest: boolean
}

const DEFAULT_NOTIF: NotificationPrefs = {
    appointmentReminder: true,
    emailConfirm: true,
    whatsappConfirm: false,
    newAppointment: true,
    dailyDigest: false,
}

const DEFAULT_LEAD = "24"

const SESSIONS = [
    { id: "cur", device: "Este dispositivo · Chrome", ip: "192.168.0.12", when: "Agora", current: true },
    { id: "m1", device: "iPhone 15 · App", ip: "177.92.14.8", when: "Há 2 horas", current: false },
    { id: "m2", device: "Windows · Edge", ip: "189.45.201.33", when: "Ontem, 18:24", current: false },
]

function passwordScore(value: string): number {
    let score = 0
    if (value.length >= 8) score++
    if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score++
    if (/\d/.test(value)) score++
    if (/[^A-Za-z0-9]/.test(value)) score++
    return score
}

export default function SettingsPage({
    userName,
    userEmail,
}: {
    userName: string
    userEmail: string
}) {
    const { isDark: dark } = useTheme()
    const [toast, setToast] = useState<Toast>(null)

    const [notif, setNotif] = useState<NotificationPrefs>(DEFAULT_NOTIF)
    const [reminderLead, setReminderLead] = useState(DEFAULT_LEAD)
    const [savedNotif, setSavedNotif] = useState<{ prefs: NotificationPrefs; lead: string }>({
        prefs: DEFAULT_NOTIF,
        lead: DEFAULT_LEAD,
    })
    const [notifLoaded, setNotifLoaded] = useState(false)
    const [notifSaving, setNotifSaving] = useState(false)
    const [sessionExpiry, setSessionExpiry] = useState("8")

    const [twoFactor, setTwoFactor] = useState(false)
    const [currentPwd, setCurrentPwd] = useState("")
    const [newPwd, setNewPwd] = useState("")
    const [confirmPwd, setConfirmPwd] = useState("")
    const [showPwd, setShowPwd] = useState(false)

    useEffect(() => {
        if (!toast) return
        const id = setTimeout(() => setToast(null), 3400)
        return () => clearTimeout(id)
    }, [toast])

    // Carrega as preferências de notificação persistidas do usuário.
    useEffect(() => {
        let cancelled = false
            ; (async () => {
                try {
                    const res = await fetch("/api/settings/notifications", { cache: "no-store" })
                    const data = await res.json().catch(() => null)
                    if (!res.ok || !data?.ok) throw new Error(data?.error || "Falha ao carregar")
                    if (cancelled) return
                    const p = data.preferences ?? {}
                    const prefs: NotificationPrefs = {
                        appointmentReminder: Boolean(p.appointmentReminder),
                        emailConfirm: Boolean(p.emailConfirm),
                        whatsappConfirm: Boolean(p.whatsappConfirm),
                        newAppointment: Boolean(p.newAppointment),
                        dailyDigest: Boolean(p.dailyDigest),
                    }
                    const lead = String(p.reminderLeadHours ?? DEFAULT_LEAD)
                    setNotif(prefs)
                    setReminderLead(lead)
                    setSavedNotif({ prefs, lead })
                } catch {
                    if (cancelled) return
                    setToast({ kind: "error", message: "Não foi possível carregar as preferências de notificação." })
                } finally {
                    if (!cancelled) setNotifLoaded(true)
                }
            })()
        return () => {
            cancelled = true
        }
    }, [])

    const notifDirty =
        notifLoaded &&
        (reminderLead !== savedNotif.lead ||
            (Object.keys(notif) as (keyof NotificationPrefs)[]).some(
                (key) => notif[key] !== savedNotif.prefs[key]
            ))

    async function saveNotifications() {
        setNotifSaving(true)
        try {
            const res = await fetch("/api/settings/notifications", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...notif, reminderLeadHours: Number(reminderLead) }),
            })
            const data = await res.json().catch(() => null)
            if (!res.ok || !data?.ok) throw new Error(data?.error || "Falha ao salvar")
            setSavedNotif({ prefs: notif, lead: reminderLead })
            setToast({ kind: "success", message: "Preferências de notificação salvas com sucesso." })
        } catch {
            setToast({ kind: "error", message: "Não foi possível salvar as preferências de notificação." })
        } finally {
            setNotifSaving(false)
        }
    }

    function restoreNotificationDefaults() {
        setNotif(DEFAULT_NOTIF)
        setReminderLead(DEFAULT_LEAD)
    }

    const pwdScore = useMemo(() => passwordScore(newPwd), [newPwd])
    const pwdMismatch = confirmPwd.length > 0 && confirmPwd !== newPwd

    const t = dark
        ? {
            shell:
                "bg-[radial-gradient(ellipse_at_top,rgba(45,149,105,0.18),transparent_55%),linear-gradient(to_bottom,#0b100e,#070a09)] border-neutral-800/80 text-neutral-100 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.85)]",
            card: "bg-neutral-900/60 border-neutral-800/80",
            title: "text-neutral-50",
            heading: "text-neutral-100",
            text: "text-neutral-300",
            muted: "text-neutral-500",
            divider: "border-neutral-800/80",
            input:
                "bg-neutral-900/80 border-neutral-700 text-neutral-100 placeholder:text-neutral-600 focus:border-brand-500/60 focus:ring-brand-500/25",
            iconWrap: "bg-brand-500/15 text-brand-300 ring-brand-400/20",
            toggleOff: "bg-neutral-700",
            toggleTrack: "bg-brand-500",
            ghost: "border-neutral-700 text-neutral-200 hover:bg-neutral-800/70",
            banner: "bg-amber-500/10 border-amber-400/25 text-amber-200",
            row: "bg-neutral-900/40 border-neutral-800/70",
            chip: "bg-neutral-800/80 text-neutral-300 ring-neutral-700/60",
        }
        : {
            shell:
                "bg-[radial-gradient(ellipse_at_top,rgba(16,142,93,0.07),transparent_55%),linear-gradient(to_bottom,#ffffff,#f7f9f8)] border-neutral-200/70 text-neutral-900 shadow-[0_20px_60px_-32px_rgba(15,23,42,0.25)]",
            card: "bg-white/85 border-neutral-200/70",
            title: "text-neutral-900",
            heading: "text-neutral-900",
            text: "text-neutral-600",
            muted: "text-neutral-400",
            divider: "border-neutral-200/80",
            input:
                "bg-white border-neutral-200 text-neutral-800 placeholder:text-neutral-400 focus:border-brand-400/60 focus:ring-brand-500/25",
            iconWrap: "bg-brand-50 text-brand-700 ring-brand-600/10",
            toggleOff: "bg-neutral-300",
            toggleTrack: "bg-brand-500",
            ghost: "border-neutral-200 text-neutral-700 hover:bg-neutral-50",
            banner: "bg-amber-50 border-amber-200 text-amber-800",
            row: "bg-neutral-50/80 border-neutral-200/70",
            chip: "bg-neutral-100 text-neutral-600 ring-neutral-200",
        }

    const cardBase = `rounded-3xl border backdrop-blur-xl p-5 md:p-7 transition-colors duration-300 ${t.card}`

    return (
        <div className={`rounded-[28px] border p-4 md:p-7 transition-colors duration-300 ${t.shell}`}>
            {/* Cabeçalho */}
            <header className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div className="min-w-0">
                    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[10.5px] font-black uppercase tracking-[0.18em] ring-1 ${t.chip}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${t.toggleTrack} animate-pulse`} />
                        Sistema
                    </span>
                    <h1 className={`mt-3 text-2xl md:text-3xl font-serif font-semibold tracking-tight ${t.title}`}>
                        Configurações
                    </h1>
                    <p className={`mt-1 text-sm ${t.text}`}>
                        Gerencie notificações e a segurança da sua conta na Vitalis Health.
                    </p>
                </div>
            </header>

            {/* Aviso de demonstração */}
            <div className={`mb-6 flex items-start gap-3 rounded-2xl border px-4 py-3 text-[13px] font-semibold ${t.banner}`}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="mt-0.5 shrink-0">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>
                    As preferências de <strong className="font-black">Notificações</strong> são salvas na sua conta.
                    As demais seções desta página ainda são apenas demonstrativas.
                </span>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Notificações */}
                <section className={cardBase}>
                    <header className="flex items-center gap-3 mb-5">
                        <span className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl ring-1 ${t.iconWrap}`}>
                            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                            </svg>
                        </span>
                        <div>
                            <h2 className={`text-lg font-serif font-semibold ${t.heading}`}>Notificações</h2>
                            <p className={`text-[12.5px] ${t.muted}`}>Escolha como a clínica avisa sobre as consultas.</p>
                        </div>
                        <div className="ml-auto">
                            {notifSaving ? (
                                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] ring-1 ${t.chip}`}>
                                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                                    Salvando
                                </span>
                            ) : notifDirty ? (
                                <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-amber-700 bg-amber-500/10 ring-1 ring-amber-500/25 dark:text-amber-300">
                                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                                    Não salvo
                                </span>
                            ) : notifLoaded ? (
                                <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-brand-600 bg-brand-500/10 ring-1 ring-brand-500/20 dark:text-brand-300">
                                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                    Salvo
                                </span>
                            ) : null}
                        </div>
                    </header>

                    <div className="space-y-2.5">
                        <ToggleRow
                            theme={t}
                            title="Lembretes de consulta"
                            description="Enviar lembrete automático aos pacientes antes do atendimento."
                            checked={notif.appointmentReminder}
                            onChange={(v) => setNotif((s) => ({ ...s, appointmentReminder: v }))}
                        />
                        <ToggleRow
                            theme={t}
                            title="Confirmação por e-mail"
                            description="Notificar o paciente por e-mail ao confirmar o agendamento."
                            checked={notif.emailConfirm}
                            onChange={(v) => setNotif((s) => ({ ...s, emailConfirm: v }))}
                        />
                        <ToggleRow
                            theme={t}
                            title="Confirmação por WhatsApp"
                            description="Enviar a confirmação e o lembrete também por WhatsApp."
                            checked={notif.whatsappConfirm}
                            onChange={(v) => setNotif((s) => ({ ...s, whatsappConfirm: v }))}
                        />
                        <ToggleRow
                            theme={t}
                            title="Novos agendamentos"
                            description="Avisar a equipe sempre que uma nova consulta for marcada."
                            checked={notif.newAppointment}
                            onChange={(v) => setNotif((s) => ({ ...s, newAppointment: v }))}
                        />
                        <ToggleRow
                            theme={t}
                            title="Resumo diário da agenda"
                            description="Receber um resumo das consultas do dia pela manhã."
                            checked={notif.dailyDigest}
                            onChange={(v) => setNotif((s) => ({ ...s, dailyDigest: v }))}
                        />
                    </div>

                    <div className={`mt-5 border-t pt-5 ${t.divider}`}>
                        <label className={`block text-xs font-black uppercase tracking-[0.14em] mb-2 ${t.muted}`}>
                            Antecedência do lembrete
                        </label>
                        <select
                            value={reminderLead}
                            onChange={(e) => setReminderLead(e.target.value)}
                            disabled={!notif.appointmentReminder}
                            className={`w-full rounded-2xl border-2 px-4 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed ${t.input}`}
                        >
                            <option value="2">2 horas antes</option>
                            <option value="6">6 horas antes</option>
                            <option value="24">24 horas antes</option>
                            <option value="48">48 horas antes</option>
                        </select>
                    </div>
                </section>

                {/* Segurança */}
                <section className={cardBase}>
                    <header className="flex items-center gap-3 mb-5">
                        <span className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl ring-1 ${t.iconWrap}`}>
                            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                <path d="m9 12 2 2 4-4" />
                            </svg>
                        </span>
                        <div>
                            <h2 className={`text-lg font-serif font-semibold ${t.heading}`}>Segurança</h2>
                            <p className={`text-[12.5px] ${t.muted}`}>Proteja o acesso ao sistema da clínica.</p>
                        </div>
                    </header>

                    {/* Alterar senha */}
                    <div className="space-y-3">
                        <div>
                            <label className={`block text-xs font-black uppercase tracking-[0.14em] mb-2 ${t.muted}`}>
                                Senha atual
                            </label>
                            <input
                                type={showPwd ? "text" : "password"}
                                value={currentPwd}
                                onChange={(e) => setCurrentPwd(e.target.value)}
                                placeholder="••••••••"
                                className={`w-full rounded-2xl border-2 px-4 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 ${t.input}`}
                            />
                        </div>
                        <div>
                            <label className={`block text-xs font-black uppercase tracking-[0.14em] mb-2 ${t.muted}`}>
                                Nova senha
                            </label>
                            <div className="relative">
                                <input
                                    type={showPwd ? "text" : "password"}
                                    value={newPwd}
                                    onChange={(e) => setNewPwd(e.target.value)}
                                    placeholder="Mínimo de 8 caracteres"
                                    className={`w-full rounded-2xl border-2 pl-4 pr-12 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 ${t.input}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPwd((v) => !v)}
                                    aria-label={showPwd ? "Ocultar senhas" : "Mostrar senhas"}
                                    className={`absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-8 w-8 items-center justify-center rounded-xl transition ${t.muted} hover:opacity-80`}
                                >
                                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        {showPwd ? (
                                            <>
                                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                                <line x1="1" y1="1" x2="23" y2="23" />
                                            </>
                                        ) : (
                                            <>
                                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                                <circle cx="12" cy="12" r="3" />
                                            </>
                                        )}
                                    </svg>
                                </button>
                            </div>

                            {newPwd.length > 0 && (
                                <div className="mt-2.5 flex items-center gap-2">
                                    <div className="flex flex-1 gap-1.5">
                                        {[0, 1, 2, 3].map((i) => (
                                            <span
                                                key={i}
                                                className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${i < pwdScore
                                                    ? pwdScore <= 1
                                                        ? "bg-red-500"
                                                        : pwdScore === 2
                                                            ? "bg-amber-500"
                                                            : pwdScore === 3
                                                                ? "bg-lime-500"
                                                                : "bg-brand-500"
                                                    : dark
                                                        ? "bg-neutral-800"
                                                        : "bg-neutral-200"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <span className={`text-[11.5px] font-bold ${t.muted}`}>
                                        {pwdScore <= 1 ? "Fraca" : pwdScore === 2 ? "Média" : pwdScore === 3 ? "Boa" : "Forte"}
                                    </span>
                                </div>
                            )}
                        </div>
                        <div>
                            <label className={`block text-xs font-black uppercase tracking-[0.14em] mb-2 ${t.muted}`}>
                                Confirmar nova senha
                            </label>
                            <input
                                type={showPwd ? "text" : "password"}
                                value={confirmPwd}
                                onChange={(e) => setConfirmPwd(e.target.value)}
                                placeholder="Repita a nova senha"
                                className={`w-full rounded-2xl border-2 px-4 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 ${pwdMismatch ? "border-red-400/70 text-red-500" : t.input}`}
                            />
                            {pwdMismatch && (
                                <p className="mt-1.5 text-[12px] font-semibold text-red-500">As senhas não coincidem.</p>
                            )}
                        </div>
                    </div>

                    {/* 2FA */}
                    <div className={`mt-5 border-t pt-5 ${t.divider}`}>
                        <ToggleRow
                            theme={t}
                            title="Autenticação em dois fatores"
                            description="Exigir um código extra no login, além da senha."
                            checked={twoFactor}
                            onChange={setTwoFactor}
                        />
                    </div>

                    {/* Sessões */}
                    <div className={`mt-5 border-t pt-5 ${t.divider}`}>
                        <div className="flex items-center justify-between gap-3 mb-3">
                            <h3 className={`text-sm font-black uppercase tracking-[0.14em] ${t.muted}`}>
                                Sessões ativas
                            </h3>
                            <button
                                type="button"
                                onClick={() => setToast({ kind: "success", message: "Ação simulada: as demais sessões seriam encerradas." })}
                                className="text-[12px] font-bold text-red-500 hover:text-red-400 transition-colors"
                            >
                                Encerrar todas
                            </button>
                        </div>
                        <ul className="space-y-2">
                            {SESSIONS.map((s) => (
                                <li
                                    key={s.id}
                                    className={`flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 ${t.row}`}
                                >
                                    <div className="min-w-0">
                                        <p className={`truncate text-[13px] font-bold ${t.heading}`}>{s.device}</p>
                                        <p className={`text-[11.5px] tabular-nums ${t.muted}`}>{s.ip} · {s.when}</p>
                                    </div>
                                    {s.current && (
                                        <span className="shrink-0 rounded-full bg-brand-500/15 px-2.5 py-1 text-[10.5px] font-black uppercase tracking-[0.12em] text-brand-500 ring-1 ring-brand-500/25">
                                            Atual
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Expiração */}
                    <div className={`mt-5 border-t pt-5 ${t.divider}`}>
                        <label className={`block text-xs font-black uppercase tracking-[0.14em] mb-2 ${t.muted}`}>
                            Expiração automática de sessão
                        </label>
                        <select
                            value={sessionExpiry}
                            onChange={(e) => setSessionExpiry(e.target.value)}
                            className={`w-full rounded-2xl border-2 px-4 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 ${t.input}`}
                        >
                            <option value="1">1 hora de inatividade</option>
                            <option value="4">4 horas de inatividade</option>
                            <option value="8">8 horas de inatividade</option>
                            <option value="24">24 horas de inatividade</option>
                        </select>
                    </div>
                </section>
            </div>

            {/* Rodapé de ações */}
            <footer className={`mt-6 flex flex-wrap items-center justify-between gap-3 rounded-3xl border px-5 py-4 ${t.card}`}>
                <p className={`text-[12.5px] ${t.muted}`}>
                    Logado como <span className={`font-bold ${t.text}`}>{userName}</span> · {userEmail}
                </p>
                <div className="flex items-center gap-2.5">
                    <button
                        type="button"
                        onClick={() => {
                            restoreNotificationDefaults()
                            setToast({ kind: "info", message: "Preferências de notificação restauradas ao padrão. Salve para aplicar." })
                        }}
                        className={`rounded-2xl border px-4 py-2.5 text-sm font-bold transition-colors ${t.ghost}`}
                    >
                        Restaurar padrões
                    </button>
                    <button
                        type="button"
                        onClick={() => void saveNotifications()}
                        disabled={notifSaving}
                        className="rounded-2xl bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 px-5 py-2.5 text-sm font-bold text-white shadow-[0_10px_24px_-10px_rgba(16,142,93,0.6)] transition-all hover:brightness-[1.04] active:brightness-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {notifSaving ? "Salvando…" : "Salvar alterações"}
                    </button>
                </div>
            </footer>

            {/* Toast */}
            {toast && (
                <div
                    role="status"
                    className={`fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2.5 rounded-2xl border bg-neutral-900/95 px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_50px_-18px_rgba(15,23,42,0.6)] backdrop-blur-xl ${toast.kind === "success"
                        ? "border-brand-400/50"
                        : toast.kind === "info"
                            ? "border-sky-400/50"
                            : "border-red-400/50"
                        }`}
                >
                    <span
                        className={`h-2 w-2 shrink-0 rounded-full ${toast.kind === "success" ? "bg-brand-400" : toast.kind === "info" ? "bg-sky-400" : "bg-red-400"
                            }`}
                    />
                    {toast.message}
                </div>
            )}
        </div>
    )
}

type ThemeTokens = {
    card: string
    title: string
    heading: string
    text: string
    muted: string
    divider: string
    input: string
    iconWrap: string
    toggleOff: string
    toggleTrack: string
    ghost: string
    banner: string
    row: string
    chip: string
}

function ToggleRow({
    theme,
    title,
    description,
    checked,
    onChange,
}: {
    theme: ThemeTokens
    title: string
    description: string
    checked: boolean
    onChange: (value: boolean) => void
}) {
    return (
        <div className={`flex items-start justify-between gap-4 rounded-2xl border px-4 py-3.5 ${theme.row}`}>
            <div className="min-w-0">
                <p className={`text-[13.5px] font-bold ${theme.heading}`}>{title}</p>
                <p className={`mt-0.5 text-[12px] leading-relaxed ${theme.muted}`}>{description}</p>
            </div>
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                aria-label={title}
                onClick={() => onChange(!checked)}
                className={`relative mt-0.5 inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-300 ${checked ? theme.toggleTrack : theme.toggleOff}`}
            >
                <span
                    className={`inline-block rounded-full bg-white shadow transition-transform duration-300 ${checked ? "translate-x-[22px]" : "translate-x-[3px]"
                        }`}
                    style={{ height: "18px", width: "18px" }}
                />
            </button>
        </div>
    )
}
