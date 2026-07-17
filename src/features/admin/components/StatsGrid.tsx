type StatItem = {
  label: string
  value: number
}

type StatsGridProps = {
  stats: StatItem[]
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {stats.map((stat) => (
        <article key={stat.label} className="glass-panel p-6 rounded-3xl flex flex-col justify-between overflow-hidden relative group">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 rounded-full blur-2xl group-hover:scale-110 group-hover:from-emerald-500/20 group-hover:to-teal-500/10 transition-all duration-700 ease-out"></div>
          <p className="text-slate-500 font-semibold text-sm tracking-wide z-10">{stat.label}</p>
          <strong className="text-4xl lg:text-5xl font-black mt-4 tracking-tight bg-gradient-to-br from-slate-900 via-slate-800 to-slate-600 bg-clip-text text-transparent z-10 drop-shadow-sm">
            {stat.value}
          </strong>
        </article>
      ))}
    </section>
  )
}
