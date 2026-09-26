import { useEffect, useState } from 'react'
import { loadFlights } from './data/loadFlights'
import type { Flight } from './types'
import './App.css'

type Status = 'loading' | 'ready' | 'error'

const numberFormat = new Intl.NumberFormat('fr-BE')

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
  return (
    <main>
      <div className="dashboard">
        <header className="block header">
          <h1>Suivi des déplacements</h1>
          <p>Période : 26/09/2019 - 24/07/2023</p>
        </header>

        <section className="block filters">
          <h2>Filtres</h2>
        </section>

        <article className="block kpi">
          <h2>Dépenses totales</h2>
        </article>
        <article className="block kpi">
          <h2>Nombre de vols</h2>
          {status === 'loading' && <p>Chargement…</p>}
          {status === 'error' && <p>Impossible de charger les données.</p>}
          {status === 'ready' && <p>{numberFormat.format(flights.length)}</p>}
        </article>
        <article className="block kpi">
          <h2>Prix moyen</h2>
        </article>
        <article className="block kpi">
          <h2>Distance totale</h2>
        </article>

        <section className="block trend">
          <h2>Evolution mensuelle</h2>
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
          <h2>Détails des vols</h2>
        </section>
      </div>
    </main>
  )
}

export default App