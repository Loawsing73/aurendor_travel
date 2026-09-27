import type { Filters, FlightType } from '../types'
import { DEFAULT_FILTERS, isDefaultFilters } from '../logic/filters'
import { FLIGHT_TYPE_LABELS } from '../labels'

interface FiltersBarProps {
    filters: Filters
    onChange: (filters: Filters) => void
    agencies: string[]
    minDay: string
    maxDay: string
    resultCount: number
}

function FiltersBar({ filters, onChange, agencies, minDay, maxDay, resultCount}: FiltersBarProps) {
    return (
        <section className="block filters" aria-labelledby="filters-title">
            <h2 id="filters-title">Filtres</h2>

            <div className="filters-row">
                <div className="field">
                    <label htmlFor="start-day">Du</label>
                    <input
                        id="start-day"
                        type="date"
                        min={minDay}
                        max={filters.endDay || maxDay}
                        value={filters.startDay}
                        onChange={(event) => onChange({ ...filters, startDay: event.target.value})}
                    />
                </div>

                <div className="filed">
                    <label htmlFor="end-day">Au</label>
                    <input
                        id="end-day"
                        type="date"
                        min={filters.startDay || minDay}
                        max={maxDay}
                        value={filters.endDay}
                        onChange={(event) => onChange({ ...filters, endDay: event.target.value})}
                    />
                </div>

                <div className='field'>
                    <label htmlFor='agency'>Agence</label>
                    <select
                        id="agency"
                        value={filters.agency}
                        onChange={(event) => onChange({ ...filters, agency: event.target.value})}
                    >
                        <option value="all">Toutes</option>
                        {agencies.map((agency) => (
                            <option key={agency} value={agency}>
                                {agency}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="field">
                    <label htmlFor="flight-type">Type de vol</label>
                    <select
                        id="flight-type"
                        value={filters.flightType}
                        onChange={(event) =>
                        onChange({ ...filters, flightType: event.target.value as FlightType | 'all' })
                        }
                    >
                        <option value="all">Tous</option>
                        {Object.entries(FLIGHT_TYPE_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>
                            {label}
                        </option>
                        ))}
                    </select>
                </div>

                <button
                    type="button"
                    onClick={() => onChange(DEFAULT_FILTERS)}
                    disabled={isDefaultFilters(filters)}
                >
                    Réinitialiser
                </button>
            </div>

            {resultCount === 0 && (
                <p className="filters-empty" role="status">
                Aucun vol ne correspond à ces filtres.
                </p>
            )}
        </section>
    )
}

export default FiltersBar