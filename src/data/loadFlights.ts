import type { Flight } from '../types'
import type { WorkerResponse } from './flights.worker'

const FLIGHTS_URL = new URL('data/flights.csv', document.baseURI).href

//Promise: pending-fulfilled-rejected
//obj = résultat pas encore disponible
//valeur obtenue quand promesse résolue sera tableau Flight
export function loadFlights(): Promise<Flight[]> {
    return new Promise((resolve, reject) => {
//création worker
        const worker = new Worker(new URL ('./flights.worker.ts', import.meta.url), {
            type: 'module',
        })

        worker.onmessage = (event: MessageEvent<WorkerResponse>) => {
            if (event.data.ok) {
                resolve(event.data.flights)
            } else {
                reject(new Error(event.data.message))
            }
            worker.terminate()
        }

        worker.onerror = (event) => {
            reject(new Error(event.message))
            worker.terminate()
        }

        worker.postMessage(FLIGHTS_URL)
    })
}