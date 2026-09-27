export type FlightType = 'economic' | 'premium' | 'firstClass'

export interface Flight {
    travelCode: number
    userCode: number
    from : string
    to : string
    flightType: FlightType
    price : number
    time : number
    distance: number
    agency: string
    date: Date
    day: string
    month: string
}

export interface Filters {
  startDay: string
  endDay: string
  agency: string
  flightType: FlightType | 'all'
}