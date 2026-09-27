import type { Flight, FlightType } from '../types'

export interface Kpis {
    totalSpend: number
    flightCount: number
    averagePrice: number
    averageDistance: number
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
        averageDistance: flightCount > 0 ? totalDistance / flightCount : 0,    }
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

export interface FlightTypeStats {
  flightType: FlightType
  count: number
  averagePrice: number
  averageDistance: number
  pricePerKm: number
}

const FLIGHT_TYPE_ORDER: FlightType[] = ['economic', 'premium', 'firstClass']

export function computeByFlightType(flights: Flight[]): FlightTypeStats[] {
  const sums = new Map<FlightType, { count: number; price: number; distance: number }>()

  for (const flight of flights) {
    const sum = sums.get(flight.flightType) ?? { count: 0, price: 0, distance: 0 }
    sum.count += 1
    sum.price += flight.price
    sum.distance += flight.distance
    sums.set(flight.flightType, sum)
  }

  return FLIGHT_TYPE_ORDER.filter((flightType) => sums.has(flightType)).map((flightType) => {
    const sum = sums.get(flightType)!
    return {
      flightType,
      count: sum.count,
      averagePrice: sum.price / sum.count,
      averageDistance: sum.distance / sum.count,
      pricePerKm: sum.price / sum.distance,
    }
  })
}

function directedRoute(flight: Flight): string {
  return `${flight.from}→${flight.to}`
}

export function economicReferencePrices(flights: Flight[]): Map<string, number> {
  const sums = new Map<string, { total: number; count: number }>()

  for (const flight of flights) {
    if (flight.flightType !== 'economic') continue
    const key = directedRoute(flight)
    const sum = sums.get(key) ?? { total: 0, count: 0 }
    sum.total += flight.price
    sum.count += 1
    sums.set(key, sum)
  }

  const averages = new Map<string, number>()
  for (const [key, sum] of sums) {
    averages.set(key, sum.total / sum.count)
  }
  return averages
}

export interface Savings {
  firstClassCount: number
  firstClassSpend: number
  potentialSavings: number
}

export function computeSavings(flights: Flight[], referencePrices: Map<string, number>): Savings {
  let firstClassCount = 0
  let firstClassSpend = 0
  let potentialSavings = 0

  for (const flight of flights) {
    if (flight.flightType !== 'firstClass') continue
    const economicPrice = referencePrices.get(directedRoute(flight))
    if (economicPrice === undefined) continue
    firstClassCount += 1
    firstClassSpend += flight.price
    potentialSavings += flight.price - economicPrice
  }

  return { firstClassCount, firstClassSpend, potentialSavings }
}