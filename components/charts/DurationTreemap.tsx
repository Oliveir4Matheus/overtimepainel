'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { DurationGroup } from '../../lib/types'

interface DurationTreemapProps {
  data: DurationGroup[]
}

const COLORS = ['#60a5fa', '#34d399', '#fbbf24', '#f87171']

export function DurationTreemap({ data }: DurationTreemapProps) {
  if (data.length === 0 || data.every(d => d.size === 0)) {
    return (
      <div className="text-center py-8 text-foreground/60">
        Nenhum dado disponível
      </div>
    )
  }

  // Filter out empty groups
  const filteredData = data.filter(d => d.size > 0)

  // Prepare data for pie chart
  const chartData = filteredData.map(item => ({
    name: item.name,
    value: item.occurrences,
    hours: item.hours,
  }))

  // Custom legend renderer
  const renderLegend = (props: any) => {
    const { payload } = props

    return (
      <div className="flex flex-wrap justify-center gap-3 pt-4">
        {payload.map((entry: any, index: number) => (
          <div
            key={`legend-${index}`}
            className="flex items-center gap-2 px-3 py-2 border border-border rounded bg-muted/50"
          >
            <div
              className="w-3 h-3 rounded-full border-2 border-white shadow-sm"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm font-medium">{entry.value}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={120}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--background))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '6px',
            color: 'hsl(var(--foreground))',
          }}
          formatter={(value: number, name: string, props: any) => [
            `${value} ocorrências (${props.payload.hours.toFixed(2)}h)`,
            name
          ]}
        />
        <Legend
          content={renderLegend}
          verticalAlign="bottom"
          height={60}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
