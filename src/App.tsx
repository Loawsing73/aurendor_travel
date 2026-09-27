import { useEffect, useMemo, useState } from 'react'
import { loadFlights } from './data/loadFlights'
import { computeKpis } from './logic/aggregations'
import KpiCard from './components/KpiCard'
import type { Flight } from './types'
import './App.css'

type Status = 'loading' | 'ready' | 'error'

const integerFormat = new Intl.NumberFormat('fr-BE', { maximumFractionDigits: 0 })
const compactFormat = new Intl.NumberFormat('fr-BE', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

function App() {
  const [flights, setFlights] = useState<Flight[]>([])
  const [status, setStatus] = useState<Status>('loading')

  useEffect(() => {
    let cancelled = false
    const start = performance.now()

    loadFlights()
      .then((data) => {
        if (cancelled) return
        console.log(`${data.length} vols chargés en ${Math.round(performance.now() - start)} ms`)
        setFlights(data)
        setStatus('ready')
      })
      .catch((error) => {
        if (cancelled) return
        console.error(error)
        setStatus('error')
      })

    return () => {
      cancelled = true
    }
  }, [])

  const kpis = useMemo(() => computeKpis(flights), [flights])

  const show = (formatted: string) => (status === 'ready' ? formatted : '…')
  
  return (
    <main>
      <div className="dashboard">
        <header className="block header">
          <h1>Suivi des déplacements</h1>
          <p>Période : 26/09/2019 – 24/07/2023</p>
          {status === 'error' && <p role="alert">Impossible de charger les données.</p>}
        </header>

        <section className="block filters">
          <h2>Filtres</h2>
        </section>

        <KpiCard label="Dépenses totales" value={show(compactFormat.format(kpis.totalSpend))} />
        <KpiCard label="Nombre de vols" value={show(integerFormat.format(kpis.flightCount))} />
        <KpiCard label="Prix moyen" value={show(integerFormat.format(kpis.averagePrice))} />
        <KpiCard
          label="Distance totale"
          value={show(compactFormat.format(kpis.totalDistance))}
          unit="km"
        />

        <section className="block trend">
          <h2>Évolution mensuelle</h2>
        </section>
        <section className="block chart">
          <h2>Répartition par type de vol</h2>
        </section>
        <section className="block chart">
          <h2>Dépenses par agence</h2>
        </section>
        <section className="block chart">
          <h2>Top trajets</h2>
        </section>

        <section className="block table">
          <h2>Détail des vols</h2>
        </section>
      </div>
    </main>
  )
}

export default App