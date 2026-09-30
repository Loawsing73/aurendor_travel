import { useState } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { MonthlyPoint } from '../logic/aggregations'
import { compactFormat, formatMonth, integerFormat } from '../format'
import { CHART, TOOLTIP_STYLE } from '../theme'
import Toggle from './Toggle'

type Metric = 'spend' | 'count'

const METRIC_LABELS: Record<Metric, string> = {
  spend: 'Dépenses',
  count: 'Nombre de vols',
}

interface MonthlyTrendProps {
  data: MonthlyPoint[]
}

/*choix entre spend et count + spend par défaut*/
function MonthlyTrend({ data }: MonthlyTrendProps) {
  /*setMtric relance .tsx avec nvl valeur*/
  const [metric, setMetric] = useState<Metric>('spend')

  return (
    <section className="block trend">
      <div className="block-head">
        <h2>Évolution mensuelle - {METRIC_LABELS[metric]}</h2>
        {/*.tsx passe setMetric à compo Toggle*/}
        <Toggle label="Indicateur affiché" options={METRIC_LABELS} value={metric} onChange={setMetric} />
      </div>

        {/*s'adapte à largeur*/}
        <ResponsiveContainer width="100%" height={260}>
            {/*linechart reçoit data de App.tsx*/}
            <LineChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
            <CartesianGrid stroke={CHART.rule} vertical={false} />
            <XAxis
                dataKey="month"
                tickFormatter={formatMonth}
                minTickGap={40}
                tick={{ fill: CHART.muted, fontSize: 12, fontFamily: CHART.mono }}
                axisLine={{ stroke: CHART.ink }}
                tickLine={false}
            />
            <YAxis
                tickFormatter={(value: number) => compactFormat.format(value)}
                tick={{ fill: CHART.muted, fontSize: 12, fontFamily: CHART.mono }}
                axisLine={false}
                tickLine={false}
                width={56}
            />
            <Tooltip
                {...TOOLTIP_STYLE}
                labelFormatter={(label) => formatMonth(String(label))}
                formatter={(value) => [integerFormat.format(Number(value)), METRIC_LABELS[metric]]}
            />
            <Line
                type="linear"
                dataKey={metric}
                stroke={CHART.accent}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 5 }}
                isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </section>
  )
}

export default MonthlyTrend