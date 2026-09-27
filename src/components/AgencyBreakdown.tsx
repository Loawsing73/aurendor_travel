import { useState } from 'react'
import { Bar, BarChart, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { CategoryTotal } from '../logic/aggregations'
import { compactFormat, integerFormat } from '../format'
import Toggle from './Toggle'

type Metric = 'spend' | 'count'

const METRIC_LABELS: Record<Metric, string> = {
  spend: 'Dépenses',
  count: 'Vols',
}

interface AgencyBreakdownProps {
  spendByAgency: CategoryTotal[]
  countByAgency: CategoryTotal[]
}

function AgencyBreakdown({ spendByAgency, countByAgency }: AgencyBreakdownProps) {
  const [metric, setMetric] = useState<Metric>('spend')
  const data = metric === 'spend' ? spendByAgency : countByAgency

  return (
    <section className="block chart">
      <div className="block-head">
        <h2>{METRIC_LABELS[metric]} par agence</h2>
        <Toggle label="Indicateur affiché" options={METRIC_LABELS} value={metric} onChange={setMetric} />
      </div>
      <ResponsiveContainer width="100%" height={data.length * 48 + 16}>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 48, bottom: 0, left: 0 }}>
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="label"
            width={100}
            tick={{ fill: '#1f2328', fontSize: 13 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: '#f4f5f7' }}
            formatter={(value) => [integerFormat.format(Number(value)), METRIC_LABELS[metric]]}
          />
          <Bar dataKey="value" fill="#2a78d6" radius={[0, 4, 4, 0]} barSize={24} isAnimationActive={false}>
            <LabelList
              dataKey="value"
              position="right"
              formatter={(value) => compactFormat.format(Number(value))}
              style={{ fill: '#57606a', fontSize: 12 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </section>
  )
}

export default AgencyBreakdown