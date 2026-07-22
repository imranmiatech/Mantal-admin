type StatItem = {
  label: string
  value: number
}

type StatsGridProps = {
  stats: StatItem[]
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <section className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
      {stats.map((stat) => (
        <article key={stat.label} className="glass-panel relative flex flex-col justify-between overflow-hidden rounded-2xl p-4 sm:rounded-3xl sm:p-6 group">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 rounded-full blur-2xl group-hover:scale-110 group-hover:from-emerald-500/20 group-hover:to-teal-500/10 transition-all duration-700 ease-out"></div>
          <p className="text-slate-500 font-semibold text-sm tracking-wide z-10">{stat.label}</p>
          <strong className="text-3xl lg:text-5xl font-black mt-3 sm:mt-4 tracking-tight bg-gradient-to-br from-slate-900 via-slate-800 to-slate-600 bg-clip-text text-transparent z-10 drop-shadow-sm">
            {stat.value}
          </strong>
        </article>
      ))}
    </section>
  )
}
