import Link from "next/link"

type Activity = {
    id: string
    title: string
    description: string
    time: string
    type: "checkin" | "done" | "scheduled"
}

const activities: Activity[] = [
    {
        id: "a1",
        title: "João Silva",
        description: "Check-in realizado para Clínica Geral",
        time: "09:15",
        type: "checkin",
    },
    {
        id: "a2",
        title: "Maria Oliveira",
        description: "Consulta finalizada - Dr. Arnaldo",
        time: "08:45",
        type: "done",
    },
    {
        id: "a3",
        title: "Agendamento Web",
        description: "Nova marcação: Exame de Sangue",
        time: "08:30",
        type: "scheduled",
    },
]

function iconFor(type: Activity["type"]) {
    const base = "text-white"
    if (type === "checkin") {
        return (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={base}>
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
            </svg>
        )
    }
    if (type === "done") {
        return (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={base}>
                <polyline points="20 6 9 17 4 12" />
            </svg>
        )
    }
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={base}>
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
    )
}

function wrapperFor(type: Activity["type"]) {
    switch (type) {
        case "checkin":
            return "bg-brand-500"
        case "done":
            return "bg-neutral-400"
        case "scheduled":
            return "bg-brand-400"
    }
}

export default function RecentActivity() {
    return (
        <section className="bg-white rounded-2xl border border-neutral-200/70 shadow-sm p-5 md:p-6">
            <header className="flex items-center justify-between mb-5 md:mb-6">
                <h2 className="text-base md:text-lg font-semibold text-neutral-800">
                    Atividades Recentes
                </h2>
                <Link
                    href="/dashboard/atividades"
                    className="text-sm font-semibold text-brand-700 hover:text-brand-800 hover:underline"
                >
                    Ver tudo
                </Link>
            </header>

            <ul className="space-y-1 md:space-y-2">
                {activities.map((activity) => (
                    <li
                        key={activity.id}
                        className="group rounded-xl border border-transparent hover:border-neutral-100 hover:bg-neutral-50 transition-colors"
                    >
                        <div className="flex items-center gap-4 py-3 md:py-4 px-3 md:px-4">
                            <span
                                className={`h-10 w-10 md:h-11 md:w-11 shrink-0 rounded-full inline-flex items-center justify-center ${wrapperFor(
                                    activity.type
                                )}`}
                            >
                                {iconFor(activity.type)}
                            </span>
                            <div className="min-w-0 flex-1">
                                <p className="text-sm md:text-[15px] font-semibold text-neutral-900 truncate">
                                    {activity.title}
                                </p>
                                <p className="text-xs md:text-sm text-neutral-600 truncate">
                                    {activity.description}
                                </p>
                            </div>
                            <span className="shrink-0 text-xs md:text-sm font-medium text-neutral-400 tabular-nums">
                                {activity.time}
                            </span>
                        </div>
                        {activity.id !== activities[activities.length - 1].id && (
                            <div className="mx-4 md:mx-5 border-t border-neutral-100" />
                        )}
                    </li>
                ))}
            </ul>
        </section>
    )
}
