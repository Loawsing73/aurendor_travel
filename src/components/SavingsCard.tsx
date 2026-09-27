import type { Savings } from '../logic/aggregations'
import { compactFormat, integerFormat } from '../format'

interface SavingsCardProps {
  savings: Savings
  totalSpend: number
}

function SavingsCard({ savings, totalSpend }: SavingsCardProps) {
  const share = totalSpend > 0 ? (savings.potentialSavings / totalSpend) * 100 : 0

  return (
    <section className="block chart savings" aria-labelledby="savings-title">
      <h2 id="savings-title">Économies potentielles</h2>
      {savings.firstClassCount === 0 ? (
        <p className="block-note">Aucun vol en première classe dans la sélection.</p>
      ) : (
        <>
          <p className="savings-value">{compactFormat.format(savings.potentialSavings)}</p>
          <p className="savings-text">
            si les {integerFormat.format(savings.firstClassCount)} vols en première classe avaient
            été réservés en économique, soit <strong>{integerFormat.format(share)} %</strong> des
            dépenses de la sélection.
          </p>
          <p className="block-note">
            Estimation : pour chaque vol, écart avec le prix moyen en économique sur le même trajet.
          </p>
        </>
      )}
    </section>
  )
}

export default SavingsCard