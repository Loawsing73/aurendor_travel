import type { Flight } from '../types.ts'

export interface Kpis {
    totalSpend: number
    flightCount: number
    averagePrice: number
    totalDistance: number
}

export function computeKpis(flights: Flight[]) : Kpis {
    let totalSpend = 0
    let totalDistance = 0

    for (const flight of flights) {
        totalSpend += flight.price
        totalDistance += flight.distance
    }

    const flightCount = flights.length

    return {
        totalSpend,
        flightCount,
        averagePrice: flightCount > 0 ? totalSpend / flightCount : 0,
        totalDistance,
    }
}

export interface MonthlyPoint {
  month: string
  spend: number
  count: number
}

export function computeMonthly(flights: Flight[]): MonthlyPoint[] {
  const byMonth = new Map<string, MonthlyPoint>()

  for (const flight of flights) {
    let point = byMonth.get(flight.month)
    if (!point) {
      point = { month: flight.month, spend: 0, count: 0 }
      byMonth.set(flight.month, point)
    }
    point.spend += flight.price
    point.count += 1
  }

  return [...byMonth.values()].sort((a, b) => a.month.localeCompare(b.month))
}

export interface CategoryTotal {
  label: string
  value: number
}

export function sumBy(
  flights: Flight[],
  getKey: (flight: Flight) => string,
  getValue: (flight: Flight) => number,
): CategoryTotal[] {
  const totals = new Map<string, number>()

  for (const flight of flights) {
    const key = getKey(flight)
    totals.set(key, (totals.get(key) ?? 0) + getValue(flight))
  }

  return [...totals.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
}

export function routeKey(flight: Flight): string {
  const [a, b] = [flight.from, flight.to].sort()
  return `${a} ↔ ${b}`
}