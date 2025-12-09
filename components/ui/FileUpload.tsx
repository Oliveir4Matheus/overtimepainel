'use client'

import { ChangeEvent, useState } from 'react'
import { parseCentroCusto, parseOcorrencias } from '../../lib/csv-parser'
import { CentroCustoRecord, OccurrenceRecord } from '../../lib/types'

interface FileUploadProps {
  onFilesLoaded: (centroCusto: CentroCustoRecord[], ocorrencias: OccurrenceRecord[]) => void
}

export function FileUpload({ onFilesLoaded }: FileUploadProps) {
  const [centroCustoFile, setCentroCustoFile] = useState<File | null>(null)
  const [ocorrenciasFile, setOcorrenciasFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCentroCustoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCentroCustoFile(file)
      setError(null)
    }
  }

  const handleOcorrenciasChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setOcorrenciasFile(file)
      setError(null)
    }
  }

  const handleUpload = async () => {
    if (!centroCustoFile || !ocorrenciasFile) {
      setError('Por favor, selecione ambos os arquivos CSV')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const [ccData, occData] = await Promise.all([
        parseCentroCusto(centroCustoFile),
        parseOcorrencias(ocorrenciasFile)
      ])

      if (ccData.length === 0) {
        throw new Error('Nenhum registro encontrado no arquivo centro_custo.csv')
      }

      if (occData.length === 0) {
        throw new Error('Nenhuma ocorrência de crédito encontrada no arquivo ocorrencias.csv')
      }

      onFilesLoaded(ccData, occData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao processar arquivos')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-8 border border-border rounded-lg bg-background">
      <div>
        <h2 className="text-2xl font-bold mb-2">Upload de Arquivos</h2>
        <p className="text-sm text-foreground/70">
          Selecione os arquivos CSV para visualizar o dashboard de horas extras
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="centro-custo" className="block text-sm font-medium mb-2">
            Centro de Custo CSV
          </label>
          <input
            id="centro-custo"
            type="file"
            accept=".csv"
            onChange={handleCentroCustoChange}
            className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border file:border-border file:text-sm file:font-medium file:bg-muted file:text-foreground hover:file:bg-border cursor-pointer"
          />
          {centroCustoFile && (
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              ✓ {centroCustoFile.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="ocorrencias" className="block text-sm font-medium mb-2">
            Ocorrências CSV
          </label>
          <input
            id="ocorrencias"
            type="file"
            accept=".csv"
            onChange={handleOcorrenciasChange}
            className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border file:border-border file:text-sm file:font-medium file:bg-muted file:text-foreground hover:file:bg-border cursor-pointer"
          />
          {ocorrenciasFile && (
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              ✓ {ocorrenciasFile.name}
            </p>
          )}
        </div>
      </div>

      <button
        onClick={handleUpload}
        disabled={!centroCustoFile || !ocorrenciasFile || loading}
        className="w-full bg-foreground text-background px-6 py-3 rounded font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
      >
        {loading ? 'Carregando...' : 'Carregar Dados'}
      </button>

      {error && (
        <div className="p-4 border border-red-500 bg-red-50 dark:bg-red-950/20 rounded">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}
    </div>
  )
}
