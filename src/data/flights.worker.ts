import Papa from 'papaparse'
import type { Flight, FlightType } from '../types.ts'

interface RawFlight {
    travelCode: number
    userCode: number
    from: string
    to: string
    flightType: FlightType
    price: number
    time: number
    distance: number
    agency: string
    date: string
}

export type WorkerResponse =
    | { ok: true; flights: Flight[] }
    | { ok: false; message: string }

function toFlight(row: RawFlight): Flight {
    const [month, day, year] = row.date.split('/')
    return {
        ...row,
        date: new Date(Number(year), Number(month) - 1, Number(day)),
        day: `${year}-${month}-${day}`,
        month: '${year}-${month}',
    }
}

self.onmessage = async (event: MessageEvent<string>) => {
    try {
        const response = await fetch(event.data)
        if (!response.ok) throw new Error ('HTTP ${response.status}')
        const text = await response.text()

        const results = Papa.parse<RawFlight>(text, {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
        })
        const message: WorkerResponse = { ok: true, flights: results.data.map(toFlight) }
        self.postMessage(message)
    } catch (error) {
        const message: WorkerResponse = { ok: false, message: String(error) }
        self.postMessage(message)
    }
}
