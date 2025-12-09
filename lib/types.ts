// Raw CSV record types
export interface CentroCustoRecord {
  cadastro: string
  nome: string
  centroCusto: string
  descricaoCCU: string
}

export interface OccurrenceRecord {
  id_registro: string
  id_colaborador: string
  nome: string
  data: string // YYYY-MM-DD
  escala: string
  codigo_horario: string
  descricao_horario: string
  inicio: string // HH:MM:SS
  termino: string // HH:MM:SS
  total_horas: string // HH:MM:SS
  situacao: string // "Crédito BH 125%" | "Crédito BH 50%"
  total_horas_ocorrencia: string // HH:MM:SS (use directly)
}

// Processed data types
export interface JoinedRecord extends OccurrenceRecord {
  centroCusto: string
  descricaoCCU: string
}

export interface AggregatedByCostCenter {
  centroCusto: string
  totalHours: number // decimal hours
  occurrenceCount: number
}

export interface DurationGroup {
  name: string // "< 30 min", "30 min - 1h", "1h - 1h59min", ">= 2h"
  size: number // for treemap sizing (same as occurrences)
  hours: number
  occurrences: number
}

export interface DailyTypeData {
  date: string
  'Crédito BH 125%': number
  'Crédito BH 50%': number
}
