import { CentroCustoRecord, OccurrenceRecord } from './types'

// Remove UTF-8 BOM if present
function removeBOM(text: string): string {
  if (text.charCodeAt(0) === 0xFEFF) {
    return text.slice(1)
  }
  return text
}

// Parse CSV line handling quoted fields
function parseCSVLine(line: string, delimiter: string = ','): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === delimiter && !inQuotes) {
      result.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }

  result.push(current.trim())
  return result
}

// Detect CSV delimiter by analyzing the first line
function detectDelimiter(text: string): string {
  const delimiters = [',', ';']

  // Get first line (header)
  const firstLine = text.split('\n')[0]

  if (!firstLine) {
    return ',' // Default fallback
  }

  // Count fields for each delimiter
  let bestDelimiter = ','
  let maxFields = 0

  for (const delimiter of delimiters) {
    const fields = parseCSVLine(firstLine, delimiter)
    const fieldCount = fields.length

    // Choose delimiter that produces more fields (minimum 2)
    if (fieldCount >= 2 && fieldCount > maxFields) {
      maxFields = fieldCount
      bestDelimiter = delimiter
    }
  }

  return bestDelimiter
}

// Parse centro_custo.csv (auto-detect delimiter, UTF-8 with BOM)
export async function parseCentroCusto(file: File): Promise<CentroCustoRecord[]> {
  try {
    const text = await file.text()
    const cleanText = removeBOM(text)
    const lines = cleanText.split('\n').map(l => l.trim()).filter(Boolean)

    if (lines.length === 0) {
      throw new Error('Arquivo centro_custo.csv está vazio')
    }

    // Detect delimiter from the cleaned text
    const delimiter = detectDelimiter(cleanText)

    // Skip header
    const dataLines = lines.slice(1)

    return dataLines.map(line => {
      const fields = parseCSVLine(line, delimiter)

      if (fields.length < 4) {
        console.warn('Linha inválida no centro_custo.csv:', line)
        return null
      }

      return {
        cadastro: fields[0].trim(),
        nome: fields[1].trim(),
        centroCusto: fields[2].trim(),
        descricaoCCU: fields[3].trim(),
      }
    }).filter((record): record is CentroCustoRecord => record !== null)
  } catch (error) {
    throw new Error(`Erro ao processar centro_custo.csv: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
  }
}

// Parse ocorrencias.csv (auto-detect delimiter, filter credit occurrences only)
export async function parseOcorrencias(file: File): Promise<OccurrenceRecord[]> {
  try {
    const text = await file.text()
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean)

    if (lines.length === 0) {
      throw new Error('Arquivo ocorrencias.csv está vazio')
    }

    // Detect delimiter from the text
    const delimiter = detectDelimiter(text)

    // Skip header
    const dataLines = lines.slice(1)

    const records = dataLines.map(line => {
      const fields = parseCSVLine(line, delimiter)

      if (fields.length < 12) {
        console.warn('Linha inválida no ocorrencias.csv:', line)
        return null
      }

      return {
        id_registro: fields[0].trim(),
        id_colaborador: fields[1].trim(),
        nome: fields[2].trim(),
        data: fields[3].trim(),
        escala: fields[4].trim(),
        codigo_horario: fields[5].trim(),
        descricao_horario: fields[6].trim(),
        inicio: fields[7].trim(),
        termino: fields[8].trim(),
        total_horas: fields[9].trim(),
        situacao: fields[10].trim(),
        total_horas_ocorrencia: fields[11].trim(),
      }
    }).filter((record): record is OccurrenceRecord => record !== null)

    // Filter only credit occurrences
    const creditRecords = records.filter(r =>
      r.situacao === 'Crédito BH 125%' || r.situacao === 'Crédito BH 50%'
    )

    if (creditRecords.length === 0) {
      console.warn('Nenhuma ocorrência de crédito encontrada no arquivo')
    }

    return creditRecords
  } catch (error) {
    throw new Error(`Erro ao processar ocorrencias.csv: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
  }
}
