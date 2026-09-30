interface RankingItem {
  label: string
  value: number
}

interface TopRoutesProps {
  title: string
  items: RankingItem[]
  formatValue: (value: number) => string
}
/*pas graph => div dont largeur calculée en %*/
function TopRoutes({ title, items, formatValue }: TopRoutesProps) {
  const max = items[0]?.value ?? 0

  return (
    <section className="block chart">
      <h2>{title}</h2>
      <ol className="routes">
        {items.map((item) => (
          <li key={item.label}>
            <div className="route-line">
              <span>{item.label}</span>
              <strong>{formatValue(item.value)}</strong>
            </div>
            <div className="route-bar" style={{ width: `${(item.value / max) * 100}%` }} />
          </li>
        ))}
      </ol>
    </section>
  )
}

export default TopRoutes