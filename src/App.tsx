import { useEffect, useMemo, useState } from 'react'
import { loadFlights } from './data/loadFlights'
import {
  computeByFlightType,
  computeKpis,
  computeMonthly,
  computeRoutes,
  sumBy,
} from './logic/aggregations'
import { DEFAULT_FILTERS, filterFlights } from './logic/filters'
import FiltersBar from './components/FiltersBar'
import KpiCard from './components/KpiCard'
import MonthlyTrend from './components/MonthlyTrend'
import FlightTypeTable from './components/FlightTypeTable'
import AgencyBreakdown from './components/AgencyBreakdown'
import TopRoutes from './components/TopRoutes'
import FlightsTable from './components/FlightsTable'
import { compactFormat, integerFormat } from './format'
import type { Filters, Flight } from './types'
import './App.css'

type Status = 'loading' | 'ready' | 'error'

//useState - garde état valeur ∩ change
function App() {
  const [flights, setFlights] = useState<Flight[]>([])
  const [status, setStatus] = useState<Status>('loading')
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)

//useEffect - pareil mais en dehors d'affichage
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
//useMemo - résultat de calcul et refait si données d'entrée changées
//extrait agence de chaque vol=>répétitions
//new set = ensemble => doublons disparaissent
//... => set en tableau puis sort
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
  const byFlightType = useMemo(() => computeByFlightType(filteredFlights), [filteredFlights])
  const countByAgency = useMemo(
    () => sumBy(filteredFlights, (flight) => flight.agency, () => 1),
    [filteredFlights],
  )
  const spendByAgency = useMemo(
    () => sumBy(filteredFlights, (flight) => flight.agency, (flight) => flight.price),
    [filteredFlights],
  )
  const routes = useMemo(() => computeRoutes(filteredFlights), [filteredFlights])
  const mostFrequentRoutes = useMemo(
    () =>
      [...routes]
        .sort((a, b) => b.roundTrips - a.roundTrips)
        .slice(0, 5)
        .map((route) => ({ label: route.label, value: route.roundTrips })),
    [routes],
  )
  const mostExpensiveRoutes = useMemo(
    () =>
      [...routes]
        .sort((a, b) => b.averagePrice - a.averagePrice)
        .slice(0, 5)
        .map((route) => ({ label: route.label, value: route.averagePrice })),
    [routes],
  )

  const show = (formatted: string) => (status === 'ready' ? formatted : '…')

  return (
    <main>
      <div className="dashboard">
        <header className="header">
          <div>
            <h1>Suivi des déplacements</h1>
            <p>Vols d’affaires réservés du 26/09/2019 au 24/07/2023</p>
          </div>
          <p className="header-meta">Source : Travel Dataset, Datathon 2019</p>
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
          label="Distance moyenne"
          value={show(integerFormat.format(kpis.averageDistance))}
          unit="km"
        />

        <MonthlyTrend data={monthly} />
        <FlightTypeTable data={byFlightType} />
        <AgencyBreakdown spendByAgency={spendByAgency} countByAgency={countByAgency} />
        <TopRoutes
          title="Trajets les plus fréquents (allers-retours)"
          items={mostFrequentRoutes}
          formatValue={(value) => `${integerFormat.format(value)} A/R`}
        />
        <TopRoutes
          title="Trajets les plus chers (prix moyen par vol)"
          items={mostExpensiveRoutes}
          formatValue={(value) => integerFormat.format(value)}
        />
        <FlightsTable flights={filteredFlights} />
      </div>
    </main>
  )
}

export default App