type Metric = {
    label: string
    value: number
    valueClassName?: string
}

type Props = {
    title: string
    titleClassName?: string
    percent: number
    percentLabel: string
    ringColor: string
    metrics: [Metric, Metric]
}

export default function StatCard({
    title,
    titleClassName = "",
    percent,
    percentLabel,
    ringColor,
    metrics,
}: Props) {
    const clamped = Math.max(0, Math.min(100, percent))
    const radius = 80
    const circumference = 2 * Math.PI * radius
    const dash = (circumference * clamped) / 100

    return (
        <section className="bg-white rounded-2xl border border-neutral-200/70 shadow-sm p-6 md:p-8 flex flex-col items-center">
            <h2
                className={`text-base md:text-lg font-medium mb-6 md:mb-8 ${
                    titleClassName || "text-neutral-800"
                }`}
            >
                {title}
            </h2>

            <div className="relative h-44 w-44 md:h-52 md:w-52 shrink-0">
                <svg
                    className="-rotate-90 h-full w-full"
                    viewBox="0 0 184 184"
                    aria-hidden="true"
                >
                    <circle
                        cx="92"
                        cy="92"
                        r={radius}
                        fill="none"
                        strokeWidth="14"
                        className="stroke-neutral-200"
                    />
                    <circle
                        cx="92"
                        cy="92"
                        r={radius}
                        fill="none"
                        strokeWidth="14"
                        strokeLinecap="round"
                        className={ringColor}
                        strokeDasharray={`${dash} ${circumference - dash}`}
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl md:text-4xl font-semibold text-neutral-800 tabular-nums">
                        {clamped}%
                    </span>
                    <span className="mt-1 text-xs md:text-sm tracking-[0.16em] font-medium text-neutral-500 uppercase">
                        {percentLabel}
                    </span>
                </div>
            </div>

            <div className="mt-8 w-full grid grid-cols-2 divide-x divide-neutral-200 border-t border-neutral-200 pt-6">
                {metrics.map((m) => (
                    <div key={m.label} className="text-center px-2">
                        <p
                            className={`text-2xl md:text-3xl font-semibold tabular-nums ${
                                m.valueClassName || "text-neutral-800"
                            }`}
                        >
                            {String(m.value).padStart(2, "0")}
                        </p>
                        <p className="mt-1 text-xs md:text-sm font-medium tracking-[0.08em] text-neutral-500 uppercase">
                            {m.label}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    )
}
