'use client'

import { AggregatedByCostCenter } from '../../lib/types'

interface OvertimeTableProps {
  data: AggregatedByCostCenter[]
}

export function OvertimeTable({ data }: OvertimeTableProps) {
  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-foreground/60">
        Nenhum dado disponível
      </div>
    )
  }

  return (
    <div className="overflow-x-auto scrollbar-thin">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b-2 border-border">
            <th className="text-left p-3 font-semibold">Centro de custo</th>
            <th className="text-right p-3 font-semibold">Quantidade de horas</th>
            <th className="text-right p-3 font-semibold">Quantidade de ocorrências</th>
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={row.centroCusto} className="border-b border-border hover:bg-muted/50 transition-colors">
              <td className="p-3">{row.centroCusto}</td>
              <td className="text-right p-3 tabular-nums">{row.totalHours.toFixed(2)}h</td>
              <td className="text-right p-3 tabular-nums">{row.occurrenceCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
