import { useEffect, useMemo, useState } from 'react'
import { loadFlights } from './data/loadFlights'
import { computeKpis, computeMonthly, routeKey, sumBy } from './logic/aggregations'
import { DEFAULT_FILTERS, filterFlights } from './logic/filters'
import FiltersBar from './components/FiltersBar'
import KpiCard from './components/KpiCard'
import MonthlyTrend from './components/MonthlyTrend'
import BarBreakdown from './components/BarBreakdown'
import TopRoutes from './components/TopRoutes'
import { FLIGHT_TYPE_LABELS } from './labels'
import { cityName, compactFormat, integerFormat } from './format'
import type { Filters, Flight } from './types'
import FlightsTable from './components/FlightsTable'
import './App.css'

type Status = 'loading' | 'ready' | 'error'

function App() {
  const [flights, setFlights] = useState<Flight[]>([])
  const [status, setStatus] = useState<Status>('loading')
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)

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

  const agencies = useMemo(
    () => [...new Set(flights.map((flight) => flight.agency))].sort(),
    [flights],
  )

  const filteredFlights = useMemo(() => {
    const start = performance.now()
    const result = filterFlights(flights, filters)
    console.log(`Filtrage : ${result.length} vols en ${Math.round(performance.now() - start)} ms`)
    return result
  }, [flights, filters])

  const kpis = useMemo(() => computeKpis(filteredFlights), [filteredFlights])
  const monthly = useMemo(() => computeMonthly(filteredFlights), [filteredFlights])
  const byFlightType = useMemo(
    () => sumBy(filteredFlights, (flight) => FLIGHT_TYPE_LABELS[flight.flightType], () => 1),
    [filteredFlights],
  )
  const spendByAgency = useMemo(
    () => sumBy(filteredFlights, (flight) => flight.agency, (flight) => flight.price),
    [filteredFlights],
  )
  const topRoutes = useMemo(
    () =>
      sumBy(
        filteredFlights,
        (flight) => routeKey({ ...flight, from: cityName(flight.from), to: cityName(flight.to) }),
        () => 1,
      ).slice(0, 5),
    [filteredFlights],
  )

  const show = (formatted: string) => (status === 'ready' ? formatted : '…')

  return (
    <main>
      <div className="dashboard">
        <header className="block header">
          <h1>Suivi des déplacements</h1>
          <p>Période : 26/09/2019 – 24/07/2023</p>
          {status === 'error' && <p role="alert">Impossible de charger les données.</p>}
        </header>

        <FiltersBar
          filters={filters}
          onChange={setFilters}
          agencies={agencies}
          minDay="2019-09-26"
          maxDay="2023-07-24"
          resultCount={status === 'ready' ? filteredFlights.length : -1}
        />

        <KpiCard label="Dépenses totales" value={show(compactFormat.format(kpis.totalSpend))} />
        <KpiCard label="Nombre de vols" value={show(integerFormat.format(kpis.flightCount))} />
        <KpiCard label="Prix moyen" value={show(integerFormat.format(kpis.averagePrice))} />
        <KpiCard
          label="Distance totale"
          value={show(compactFormat.format(kpis.totalDistance))}
          unit="km"
        />

        <MonthlyTrend data={monthly} />
        <BarBreakdown title="Répartition par type de vol" data={byFlightType} valueLabel="Vols" />
        <BarBreakdown title="Dépenses par agence" data={spendByAgency} valueLabel="Dépenses" />
        <TopRoutes data={topRoutes} />

        <section className="block table">
          <h2>Détail des vols</h2>
            <FlightsTable flights={filteredFlights} />
        </section>
      </div>
    </main>
  )
}

export default App