'use client'

import { useDashboardData } from '../hooks/use-dashboard-data'
import { FileUpload } from './ui/FileUpload'
import { FilterPanel } from './ui/FilterPanel'
import { ThemeToggle } from './ui/ThemeToggle'
import { OvertimeTable } from './charts/OvertimeTable'
import { HorizontalBarChart } from './charts/HorizontalBarChart'
import { TypeLineChart } from './charts/TypeLineChart'
import { DurationTreemap } from './charts/DurationTreemap'

export function Dashboard() {
  const {
    hasData,
    costCenters,
    availableDates,
    selectedCostCenter,
    selectedOvertimeType,
    selectedStartDate,
    selectedEndDate,
    aggregatedByCostCenter,
    durationGroups,
    dailyTypeData,
    setFiles,
    setSelectedCostCenter,
    setSelectedOvertimeType,
    setSelectedStartDate,
    setSelectedEndDate,
  } = useDashboardData()

  return (
    <div className="min-h-screen p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard de Horas Extras</h1>
        <ThemeToggle />
      </div>

      {/* File Upload (shown when no data) */}
      {!hasData && (
        <FileUpload onFilesLoaded={setFiles} />
      )}

      {/* Filters (shown when data is loaded) */}
      {hasData && (
        <FilterPanel
          costCenters={costCenters}
          availableDates={availableDates}
          selectedCostCenter={selectedCostCenter}
          selectedOvertimeType={selectedOvertimeType}
          selectedStartDate={selectedStartDate}
          selectedEndDate={selectedEndDate}
          totalRecords={aggregatedByCostCenter.reduce((sum, item) => sum + item.occurrenceCount, 0)}
          onCostCenterChange={setSelectedCostCenter}
          onOvertimeTypeChange={setSelectedOvertimeType}
          onStartDateChange={setSelectedStartDate}
          onEndDateChange={setSelectedEndDate}
        />
      )}

      {/* Dashboard Grid (shown when data is loaded) */}
      {hasData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Row 1: Table and Bar Chart */}
          <div className="border border-border rounded-lg p-6 bg-background">
            <h2 className="text-xl font-semibold mb-4">Horas por Centro de Custo</h2>
            <OvertimeTable data={aggregatedByCostCenter} />
          </div>

          <div className="border border-border rounded-lg p-6 bg-background flex flex-col">
            <h2 className="text-xl font-semibold mb-4">Top Centros de Custo</h2>
            <div className="flex-1 min-h-[400px]">
              <HorizontalBarChart data={aggregatedByCostCenter} />
            </div>
          </div>

          {/* Row 2: Line Chart and Treemap */}
          <div className="border border-border rounded-lg p-6 bg-background">
            <h2 className="text-xl font-semibold mb-4">Horas por Tipo e Dia</h2>
            <TypeLineChart data={dailyTypeData} />
          </div>

          <div className="border border-border rounded-lg p-6 bg-background">
            <h2 className="text-xl font-semibold mb-4">Distribuição por Duração</h2>
            <DurationTreemap data={durationGroups} />
          </div>
        </div>
      )}
    </div>
  )
}
