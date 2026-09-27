import { Bar, BarChart, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { CategoryTotal } from '../logic/aggregations'
import { compactFormat, integerFormat } from '../format'

interface BarBreakdownProps {
  title: string
  data: CategoryTotal[]
  valueLabel: string
}

function BarBreakdown({ title, data, valueLabel }: BarBreakdownProps) {
  return (
    <section className="block chart">
      <h2>{title}</h2>
      <ResponsiveContainer width="100%" height={data.length * 48 + 16}>
        <BarChart data={data} layout="vertical" margin={{ top: 0, right: 48, bottom: 0, left: 0 }}>
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="label"
            width={120}
            tick={{ fill: '#1f2328', fontSize: 13 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: '#f4f5f7' }}
            formatter={(value) => [integerFormat.format(Number(value)), valueLabel]}
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

export default BarBreakdown