type StatItem = {
  label: string
  value: number
}

type StatsGridProps = {
  stats: StatItem[]
}

export function StatsGrid({ stats }: StatsGridProps) {

  return (
    <section className="stats-grid">
      {stats.map((stat) => (
        <article key={stat.label} className="stat-card">
          <p>{stat.label}</p>
          <strong>{stat.value}</strong>
        </article>
      ))}
    </section>
  )
}
