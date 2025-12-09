import {
  CentroCustoRecord,
  OccurrenceRecord,
  JoinedRecord,
  AggregatedByCostCenter,
  DurationGroup,
  DailyTypeData,
} from './types'

// Parse time string (HH:MM:SS) to decimal hours
export function parseTimeToDecimal(time: string): number {
  if (!time || time.trim() === '') return 0

  const parts = time.split(':')
  if (parts.length !== 3) return 0

  const hours = parseInt(parts[0], 10) || 0
  const minutes = parseInt(parts[1], 10) || 0
  const seconds = parseInt(parts[2], 10) || 0

  return hours + minutes / 60 + seconds / 3600
}

// Join centro_custo and ocorrencias data
export function joinData(
  centroCusto: CentroCustoRecord[],
  ocorrencias: OccurrenceRecord[]
): JoinedRecord[] {
  // Create a map for fast lookup
  const centroCustoMap = new Map<string, CentroCustoRecord>()
  centroCusto.forEach(record => {
    centroCustoMap.set(record.cadastro, record)
  })

  // Join occurrences with cost center data
  const joined: JoinedRecord[] = []

  ocorrencias.forEach(occurrence => {
    const costCenterData = centroCustoMap.get(occurrence.id_colaborador)

    if (costCenterData) {
      joined.push({
        ...occurrence,
        centroCusto: costCenterData.centroCusto,
        descricaoCCU: costCenterData.descricaoCCU,
      })
    } else {
      console.warn(`Centro de custo não encontrado para colaborador: ${occurrence.id_colaborador}`)
    }
  })

  return joined
}

// Aggregate data by cost center
export function aggregateByCostCenter(joined: JoinedRecord[]): AggregatedByCostCenter[] {
  const aggregationMap = new Map<string, { totalHours: number; occurrenceCount: number }>()

  joined.forEach(record => {
    const { centroCusto, total_horas_ocorrencia } = record
    const hours = parseTimeToDecimal(total_horas_ocorrencia)

    const existing = aggregationMap.get(centroCusto)
    if (existing) {
      existing.totalHours += hours
      existing.occurrenceCount += 1
    } else {
      aggregationMap.set(centroCusto, {
        totalHours: hours,
        occurrenceCount: 1,
      })
    }
  })

  // Convert map to array and sort by total hours descending
  const result: AggregatedByCostCenter[] = Array.from(aggregationMap.entries()).map(
    ([centroCusto, data]) => ({
      centroCusto,
      totalHours: data.totalHours,
      occurrenceCount: data.occurrenceCount,
    })
  )

  return result.sort((a, b) => b.totalHours - a.totalHours)
}

// Group occurrences by duration ranges
export function groupByDuration(joined: JoinedRecord[]): DurationGroup[] {
  const groups = {
    '< 30 min': { hours: 0, occurrences: 0 },
    '30 min - 1h': { hours: 0, occurrences: 0 },
    '1h - 1h59min': { hours: 0, occurrences: 0 },
    '>= 2h': { hours: 0, occurrences: 0 },
  }

  joined.forEach(record => {
    const hours = parseTimeToDecimal(record.total_horas_ocorrencia)
    const minutes = hours * 60

    if (minutes < 30) {
      groups['< 30 min'].hours += hours
      groups['< 30 min'].occurrences += 1
    } else if (minutes < 60) {
      groups['30 min - 1h'].hours += hours
      groups['30 min - 1h'].occurrences += 1
    } else if (minutes < 120) {
      groups['1h - 1h59min'].hours += hours
      groups['1h - 1h59min'].occurrences += 1
    } else {
      groups['>= 2h'].hours += hours
      groups['>= 2h'].occurrences += 1
    }
  })

  // Convert to array format for treemap
  return Object.entries(groups).map(([name, data]) => ({
    name,
    size: data.occurrences, // Treemap size based on occurrence count
    hours: data.hours,
    occurrences: data.occurrences,
  }))
}

// Aggregate data by date and overtime type
export function aggregateByDateAndType(joined: JoinedRecord[]): DailyTypeData[] {
  const aggregationMap = new Map<string, { 'Crédito BH 125%': number; 'Crédito BH 50%': number }>()

  joined.forEach(record => {
    const { data, situacao, total_horas_ocorrencia } = record
    const hours = parseTimeToDecimal(total_horas_ocorrencia)

    const existing = aggregationMap.get(data)
    if (existing) {
      if (situacao === 'Crédito BH 125%') {
        existing['Crédito BH 125%'] += hours
      } else if (situacao === 'Crédito BH 50%') {
        existing['Crédito BH 50%'] += hours
      }
    } else {
      aggregationMap.set(data, {
        'Crédito BH 125%': situacao === 'Crédito BH 125%' ? hours : 0,
        'Crédito BH 50%': situacao === 'Crédito BH 50%' ? hours : 0,
      })
    }
  })

  // Convert map to array and sort by date
  const result: DailyTypeData[] = Array.from(aggregationMap.entries())
    .map(([date, data]) => ({
      date,
      'Crédito BH 125%': data['Crédito BH 125%'],
      'Crédito BH 50%': data['Crédito BH 50%'],
    }))
    .sort((a, b) => a.date.localeCompare(b.date))

  return result
}

// Apply filters to joined data
export function applyFilters(
  data: JoinedRecord[],
  costCenter: string | null,
  overtimeType: string | null,
  startDate: string | null,
  endDate: string | null
): JoinedRecord[] {
  let filtered = data

  if (costCenter && costCenter !== 'all') {
    filtered = filtered.filter(r => r.centroCusto === costCenter)
  }

  if (overtimeType && overtimeType !== 'all') {
    filtered = filtered.filter(r => r.situacao === overtimeType)
  }

  // Filter by date range
  if (startDate || endDate) {
    filtered = filtered.filter(r => {
      const recordDate = r.data

      if (startDate && endDate) {
        return recordDate >= startDate && recordDate <= endDate
      } else if (startDate) {
        return recordDate >= startDate
      } else if (endDate) {
        return recordDate <= endDate
      }

      return true
    })
  }

  return filtered
}
