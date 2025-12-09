'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts'
import { AggregatedByCostCenter } from '../../lib/types'

interface HorizontalBarChartProps {
  data: AggregatedByCostCenter[]
}

export function HorizontalBarChart({ data }: HorizontalBarChartProps) {
  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-foreground/60">
        Nenhum dado disponível
      </div>
    )
  }

  // Data is already sorted by totalHours descending from aggregateByCostCenter
  const chartData = data.map(item => ({
    centroCusto: item.centroCusto,
    horas: parseFloat(item.totalHours.toFixed(2)),
    ocorrencias: item.occurrenceCount,
  }))

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ top: 5, right: 100, left: 100, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
        <XAxis
          type="number"
          stroke="currentColor"
          tick={{ fill: 'currentColor', fontSize: 12 }}
        />
        <YAxis
          dataKey="centroCusto"
          type="category"
          width={90}
          stroke="currentColor"
          tick={{ fill: 'currentColor', fontSize: 12 }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--background))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '6px',
            color: 'hsl(var(--foreground))',
          }}
          formatter={(value: number, name: string, props: any) => {
            if (name === 'horas') {
              return [`${value.toFixed(2)}h (${props.payload.ocorrencias} ocorrências)`, 'Horas']
            }
            return [value, name]
          }}
        />
        <Bar
          dataKey="horas"
          fill="#6366f1"
          radius={[0, 4, 4, 0]}
          label={(props: any) => {
            const { x, y, width, value, index } = props
            if (index === undefined) return null

            const item = chartData[index]
            if (!item) return null

            return (
              <text
                x={x + width + 5}
                y={y + 10}
                fill="currentColor"
                fontSize={11}
                fontWeight="600"
              >
                {value.toFixed(1)}h ({item.ocorrencias})
              </text>
            )
          }}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
