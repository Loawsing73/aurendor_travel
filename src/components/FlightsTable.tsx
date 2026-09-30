import { useMemo, useRef, useState } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import type { Flight } from '../types'
import { FLIGHT_TYPE_LABELS } from '../labels'
import { cityName, integerFormat } from '../format'

type SortKey = 'day' | 'from' | 'to' | 'flightType' | 'agency' | 'price' | 'distance'
type SortDirection = 'asc' | 'desc'

interface Column {
  key: SortKey
  label: string
  numeric?: boolean
  render: (flight: Flight) => string
}

const COLUMNS: Column[] = [
  { key: 'day', label: 'Date', render: (f) => f.date.toLocaleDateString('fr-BE') },
  { key: 'from', label: 'Départ', render: (f) => cityName(f.from) },
  { key: 'to', label: 'Arrivée', render: (f) => cityName(f.to) },
  { key: 'flightType', label: 'Classe', render: (f) => FLIGHT_TYPE_LABELS[f.flightType] },
  { key: 'agency', label: 'Agence', render: (f) => f.agency },
  { key: 'price', label: 'Prix', numeric: true, render: (f) => integerFormat.format(f.price) },
  { key: 'distance', label: 'Distance (km)', numeric: true, render: (f) => integerFormat.format(f.distance) },
]

const ROW_HEIGHT = 36

interface FlightsTableProps {
  flights: Flight[]
}

function FlightsTable({ flights }: FlightsTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('day')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  const sortedFlights = useMemo(() => {
    const start = performance.now()
    const factor = sortDirection === 'asc' ? 1 : -1
    const result = [...flights].sort((a, b) => {
      const valueA = a[sortKey]
      const valueB = b[sortKey]
      if (valueA < valueB) return -factor
      if (valueA > valueB) return factor
      return 0
    })
    console.log(`Tri : ${result.length} vols en ${Math.round(performance.now() - start)} ms`)
    return result
  }, [flights, sortKey, sortDirection])

  const scrollRef = useRef<HTMLDivElement>(null)

  //count = total de lignes
  //getScrollElement = zone qui défile
  //estimate Size = hauteur de ligne
  //overscan = lignes supp, cas de défilement rapide
  const virtualizer = useVirtualizer({
    count: sortedFlights.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 10,
  })

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDirection('asc')
    }
  }

  return (
    <section className="block table" aria-labelledby="table-title">
      <div className="block-head">
        <h2 id="table-title">Détail des vols</h2>
        <span className="table-count">{integerFormat.format(sortedFlights.length)} vols</span>
      </div>

      <div
        ref={scrollRef}
        className="table-scroll"
        role="table"
        aria-labelledby="table-title"
        aria-rowcount={sortedFlights.length + 1}
      >
        <div className="table-row table-header" role="row" aria-rowindex={1}>
          {COLUMNS.map((column) => {
            const isSorted = column.key === sortKey
            return (
              <div
                key={column.key}
                role="columnheader"
                aria-sort={isSorted ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
                className={column.numeric ? 'numeric' : undefined}
              >
                <button type="button" onClick={() => handleSort(column.key)}>
                  {column.label}
                  <span aria-hidden="true">
                    {isSorted ? (sortDirection === 'asc' ? ' ▲' : ' ▼') : ''}
                  </span>
                </button>
              </div>
            )
          })}
        </div>

        <div className="table-body" style={{ height: virtualizer.getTotalSize() }}>
          {virtualizer.getVirtualItems().map((virtualRow) => {
            const flight = sortedFlights[virtualRow.index]
            return (
              <div
                key={virtualRow.key}
                className="table-row"
                role="row"
                aria-rowindex={virtualRow.index + 2}
                style={{ transform: `translateY(${virtualRow.start}px)` }}
              >
                {COLUMNS.map((column) => (
                  <div
                    key={column.key}
                    role="cell"
                    className={column.numeric ? 'numeric' : undefined}
                  >
                    {column.render(flight)}
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default FlightsTable