import type { Filters, Flight } from '../types'

export const DEFAULT_FILTERS: Filters = {
    startDay: '',
    endDay: '',
    agency: 'all',
    flightType: 'all',
}

export function filterFlights(flights: Flight[], filters: Filters): Flight[] {
    return flights.filter(
        (flight) =>
        (filters.startDay === '' || flight.day >= filters.startDay) &&
        (filters.endDay === '' || flight.day >= filters.endDay) &&
        (filters.agency === 'all' || flight.agency === filters.agency) &&
        (filters.flightType === 'all' || flight.flightType === filters.flightType),
    )
}

export function isDefaultFilters(filters: Filters): boolean {
    return (
        filters.startDay === DEFAULT_FILTERS.startDay &&
        filters.endDay === DEFAULT_FILTERS.endDay &&
        filters.agency === DEFAULT_FILTERS.agency &&
        filters.flightType === DEFAULT_FILTERS.flightType
    )
}