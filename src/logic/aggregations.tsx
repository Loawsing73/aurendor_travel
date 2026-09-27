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
