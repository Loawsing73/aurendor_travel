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

type Metric = 'spend' | 'count'

const METRIC_LABELS: Record<Metric, string> = {
  spend: 'Dépenses',
  count: 'Nombre de vols',
}

interface MonthlyTrendProps {
  data: MonthlyPoint[]
}

function MonthlyTrend({ data }: MonthlyTrendProps) {
  const [metric, setMetric] = useState<Metric>('spend')

  return (
    <section className="block trend">
      <div className="block-head">
        <h2>Évolution mensuelle — {METRIC_LABELS[metric]}</h2>
        <div className="toggle" role="group" aria-label="Indicateur affiché">
          {(Object.keys(METRIC_LABELS) as Metric[]).map((key) => (
            <button
              key={key}
              type="button"
              aria-pressed={metric === key}
              onClick={() => setMetric(key)}
            >
              {METRIC_LABELS[key]}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
          <CartesianGrid stroke="#eaeef2" vertical={false} />
          <XAxis
            dataKey="month"
            tickFormatter={formatMonth}
            minTickGap={40}
            tick={{ fill: '#57606a', fontSize: 12 }}
            axisLine={{ stroke: '#d0d7de' }}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(value: number) => compactFormat.format(value)}
            tick={{ fill: '#57606a', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            width={56}
          />
          <Tooltip
            labelFormatter={(label) => formatMonth(String(label))}
            formatter={(value) => [integerFormat.format(Number(value)), METRIC_LABELS[metric]]}
          />
          <Line
            type="linear"
            dataKey={metric}
            stroke="#2a78d6"
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