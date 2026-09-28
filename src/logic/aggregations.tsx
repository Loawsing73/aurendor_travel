import type { Flight, FlightType } from '../types'
import { cityName } from '../format'

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

function routeKey(flight: Flight): string {
  const [a, b] = [cityName(flight.from), cityName(flight.to)].sort()
  return `${a} ↔ ${b}`
}

export interface RouteStats {
  label: string
  roundTrips: number
  averagePrice: number
}

export function computeRoutes(flights: Flight[]): RouteStats[] {
  const byRoute = new Map<string, { travelCodes: Set<number>; total: number; count: number }>()

  for (const flight of flights) {
    const key = routeKey(flight)
    let route = byRoute.get(key)
    if (!route) {
      route = { travelCodes: new Set(), total: 0, count: 0 }
      byRoute.set(key, route)
    }
    route.travelCodes.add(flight.travelCode)
    route.total += flight.price
    route.count += 1
  }

  return [...byRoute.entries()].map(([label, route]) => ({
    label,
    roundTrips: route.travelCodes.size,
    averagePrice: route.total / route.count,
  }))
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
