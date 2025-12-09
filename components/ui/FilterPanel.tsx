'use client'

interface FilterPanelProps {
  costCenters: string[]
  availableDates: string[]
  selectedCostCenter: string | null
  selectedOvertimeType: string | null
  selectedStartDate: string | null
  selectedEndDate: string | null
  totalRecords: number
  onCostCenterChange: (value: string | null) => void
  onOvertimeTypeChange: (value: string | null) => void
  onStartDateChange: (value: string | null) => void
  onEndDateChange: (value: string | null) => void
}

export function FilterPanel({
  costCenters,
  availableDates,
  selectedCostCenter,
  selectedOvertimeType,
  selectedStartDate,
  selectedEndDate,
  totalRecords,
  onCostCenterChange,
  onOvertimeTypeChange,
  onStartDateChange,
  onEndDateChange,
}: FilterPanelProps) {
  const handleClearFilters = () => {
    onCostCenterChange(null)
    onOvertimeTypeChange(null)
    onStartDateChange(null)
    onEndDateChange(null)
  }

  const hasActiveFilters = selectedCostCenter || selectedOvertimeType || selectedStartDate || selectedEndDate

  return (
    <div className="space-y-3">
      {/* Quantidade de registros */}
      <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-lg border border-border">
        <span className="text-sm font-medium">Ocorrências encontradas:</span>
        <span className="text-lg font-bold text-foreground">{totalRecords}</span>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 p-4 bg-muted rounded-lg border border-border">
      <div className="flex-1 min-w-[180px]">
        <label htmlFor="cost-center" className="block text-sm font-medium mb-2">
          Centro de Custo
        </label>
        <select
          id="cost-center"
          value={selectedCostCenter || 'all'}
          onChange={(e) => onCostCenterChange(e.target.value === 'all' ? null : e.target.value)}
          className="w-full p-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
        >
          <option value="all">Todos</option>
          {costCenters.map(cc => (
            <option key={cc} value={cc}>{cc}</option>
          ))}
        </select>
      </div>

      <div className="flex-1 min-w-[180px]">
        <label htmlFor="overtime-type" className="block text-sm font-medium mb-2">
          Tipo de Hora Extra
        </label>
        <select
          id="overtime-type"
          value={selectedOvertimeType || 'all'}
          onChange={(e) => onOvertimeTypeChange(e.target.value === 'all' ? null : e.target.value)}
          className="w-full p-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
        >
          <option value="all">Todos</option>
          <option value="Crédito BH 125%">Crédito BH 125%</option>
          <option value="Crédito BH 50%">Crédito BH 50%</option>
        </select>
      </div>

      <div className="flex-1 min-w-[180px]">
        <label htmlFor="start-date" className="block text-sm font-medium mb-2">
          Data Início
        </label>
        <input
          id="start-date"
          type="date"
          value={selectedStartDate || ''}
          onChange={(e) => onStartDateChange(e.target.value || null)}
          min={availableDates[0]}
          max={availableDates[availableDates.length - 1]}
          className="w-full p-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
        />
      </div>

      <div className="flex-1 min-w-[180px]">
        <label htmlFor="end-date" className="block text-sm font-medium mb-2">
          Data Fim
        </label>
        <input
          id="end-date"
          type="date"
          value={selectedEndDate || ''}
          onChange={(e) => onEndDateChange(e.target.value || null)}
          min={availableDates[0]}
          max={availableDates[availableDates.length - 1]}
          className="w-full p-2 border border-border rounded bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
        />
      </div>

      <div className="flex items-end">
        <button
          onClick={handleClearFilters}
          disabled={!hasActiveFilters}
          className="px-4 py-2 text-sm border border-border rounded hover:bg-background transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          Limpar Filtros
        </button>
      </div>
      </div>
    </div>
  )
}
