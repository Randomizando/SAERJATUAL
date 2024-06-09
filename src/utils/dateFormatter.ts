import { formatISO, parse } from 'date-fns'

export function dateDestructuring(date: string) {
  const resultConvert = new Date(date)
  if (!date) {
    return {
      day: '',
      month: '',
      year: '',
    }
  }

  const day = resultConvert.getUTCDate().toString()
  const month = (resultConvert.getUTCMonth() + 1).toString()
  const year = resultConvert.getUTCFullYear().toString()

  return { day, month, year }
}

export function dateJoinInISOFormat(day: string, month: string, year: string) {
  try {
    return formatISO(
      parse(
        `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`,
        'yyyy-MM-dd',
        new Date(),
      ),
    )
  } catch {}
}

export function dateDefaultPattern(date: string) {
  if (!date) return null

  return new Date(date)
    .toISOString()
    .replace(/T.*/, '')
    .split('-')
    .reverse()
    .join('/')
}

export function dateForFileGeneration() {
  const now = new Date()
  const hours = now.getHours()
  const getMinutes = ('0' + now.getMinutes()).slice(-2)

  const date = ('0' + now.getDate()).slice(-2)
  const month = ('0' + (now.getMonth() + 1)).slice(-2)
  const year = now.getFullYear()

  return `${year}-${month}-${date}-${hours}h${getMinutes}`
}
