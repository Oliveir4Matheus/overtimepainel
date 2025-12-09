'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { DailyTypeData } from '../../lib/types'

interface TypeLineChartProps {
  data: DailyTypeData[]
}

export function TypeLineChart({ data }: TypeLineChartProps) {
  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-foreground/60">
        Nenhum dado disponível
      </div>
    )
  }

  // Format date to DD/MM
  const chartData = data.map(item => ({
    date: new Date(item.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    'Crédito BH 125%': parseFloat(item['Crédito BH 125%'].toFixed(2)),
    'Crédito BH 50%': parseFloat(item['Crédito BH 50%'].toFixed(2)),
  }))

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={chartData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.1} />
        <XAxis
          dataKey="date"
          stroke="currentColor"
          tick={{ fill: 'currentColor', fontSize: 12 }}
        />
        <YAxis
          label={{ value: 'Horas', angle: -90, position: 'insideLeft', fill: 'currentColor' }}
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
          formatter={(value: number) => `${value.toFixed(2)}h`}
        />
        <Legend
          wrapperStyle={{
            paddingTop: '10px',
          }}
        />
        <Line
          type="monotone"
          dataKey="Crédito BH 125%"
          stroke="#ef4444"
          strokeWidth={2}
          dot={{ fill: '#ef4444', r: 4 }}
          activeDot={{ r: 6 }}
        />
        <Line
          type="monotone"
          dataKey="Crédito BH 50%"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={{ fill: '#3b82f6', r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
