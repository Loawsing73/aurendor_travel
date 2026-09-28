import type { FlightTypeStats } from '../logic/aggregations'
import { FLIGHT_TYPE_LABELS } from '../labels'
import { integerFormat } from '../format'

const pricePerKmFormat = new Intl.NumberFormat('fr-BE', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

interface FlightTypeTableProps {
  data: FlightTypeStats[]
}

function FlightTypeTable({ data }: FlightTypeTableProps) {
  return (
    <section className="block chart">
      <h2 id="flight-type-title">Comparaison par type de vol</h2>
      <div className="compare-wrap">
        <table className="compare-table" aria-labelledby="flight-type-title">
          <thead>
            <tr>
              <th scope="col">Classe</th>
              <th scope="col" className="numeric">Vols</th>
              <th scope="col" className="numeric">Prix moyen</th>
              <th scope="col" className="numeric">Distance moy.</th>
              <th scope="col" className="numeric">Prix / km</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.flightType}>
                <th scope="row">{FLIGHT_TYPE_LABELS[row.flightType]}</th>
                <td className="numeric">{integerFormat.format(row.count)}</td>
                <td className="numeric">{integerFormat.format(row.averagePrice)}</td>
                <td className="numeric">{integerFormat.format(row.averageDistance)} km</td>
                <td className="numeric">{pricePerKmFormat.format(row.pricePerKm)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default FlightTypeTable