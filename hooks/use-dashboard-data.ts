'use client'

import { useState, useEffect, useMemo } from 'react'
import {
  CentroCustoRecord,
  OccurrenceRecord,
  JoinedRecord,
  AggregatedByCostCenter,
  DurationGroup,
  DailyTypeData,
} from '../lib/types'
import {
  joinData,
  aggregateByCostCenter,
  groupByDuration,
  aggregateByDateAndType,
  applyFilters,
} from '../lib/data-processor'

export function useDashboardData() {
  // Raw data state
  const [centroCustoData, setCentroCustoData] = useState<CentroCustoRecord[] | null>(null)
  const [ocorrenciasData, setOcorrenciasData] = useState<OccurrenceRecord[] | null>(null)

  // Filter state
  const [selectedCostCenter, setSelectedCostCenter] = useState<string | null>(null)
  const [selectedOvertimeType, setSelectedOvertimeType] = useState<string | null>(null)
  const [selectedStartDate, setSelectedStartDate] = useState<string | null>(null)
  const [selectedEndDate, setSelectedEndDate] = useState<string | null>(null)

  // Joined data (computed when raw data changes)
  const joinedData = useMemo(() => {
    if (!centroCustoData || !ocorrenciasData) return []
    return joinData(centroCustoData, ocorrenciasData)
  }, [centroCustoData, ocorrenciasData])

  // Available options for filters (computed from joined data)
  const costCenters = useMemo(() => {
    const centers = new Set<string>()
    joinedData.forEach(record => centers.add(record.centroCusto))
    return Array.from(centers).sort()
  }, [joinedData])

  const availableDates = useMemo(() => {
    const dates = new Set<string>()
    joinedData.forEach(record => dates.add(record.data))
    return Array.from(dates).sort()
  }, [joinedData])

  // Filtered data (computed when filters change)
  const filteredData = useMemo(() => {
    return applyFilters(joinedData, selectedCostCenter, selectedOvertimeType, selectedStartDate, selectedEndDate)
  }, [joinedData, selectedCostCenter, selectedOvertimeType, selectedStartDate, selectedEndDate])

  // Aggregated data (computed from filtered data)
  const aggregatedByCostCenter = useMemo(() => {
    return aggregateByCostCenter(filteredData)
  }, [filteredData])

  const durationGroups = useMemo(() => {
    return groupByDuration(filteredData)
  }, [filteredData])

  const dailyTypeData = useMemo(() => {
    return aggregateByDateAndType(filteredData)
  }, [filteredData])

  // Check if data is loaded
  const hasData = centroCustoData !== null && ocorrenciasData !== null

  // Function to set files
  const setFiles = (centroCusto: CentroCustoRecord[], ocorrencias: OccurrenceRecord[]) => {
    setCentroCustoData(centroCusto)
    setOcorrenciasData(ocorrencias)
    // Reset filters when new data is loaded
    setSelectedCostCenter(null)
    setSelectedOvertimeType(null)
    setSelectedStartDate(null)
    setSelectedEndDate(null)
  }

  return {
    // State
    hasData,
    centroCustoData,
    ocorrenciasData,
    selectedCostCenter,
    selectedOvertimeType,
    selectedStartDate,
    selectedEndDate,

    // Computed data
    filteredData,
    aggregatedByCostCenter,
    durationGroups,
    dailyTypeData,

    // Available options
    costCenters,
    availableDates,

    // Actions
    setFiles,
    setSelectedCostCenter,
    setSelectedOvertimeType,
    setSelectedStartDate,
    setSelectedEndDate,
  }
}
