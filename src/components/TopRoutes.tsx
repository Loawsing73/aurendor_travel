import type { CategoryTotal } from '../logic/aggregations'
import { integerFormat } from '../format'

interface TopRoutesProps {
  data: CategoryTotal[]
}

function TopRoutes({ data }: TopRoutesProps) {
  const max = data[0]?.value ?? 0

  return (
    <section className="block chart">
      <h2>Top 5 trajets (aller-retour)</h2>
      <ol className="routes">
        {data.map((route) => (
          <li key={route.label}>
            <div className="route-line">
              <span>{route.label}</span>
              <strong>{integerFormat.format(route.value)} vols</strong>
            </div>
            <div className="route-bar" style={{ width: `${(route.value / max) * 100}%` }} />
          </li>
        ))}
      </ol>
    </section>
  )
}

export default TopRoutes