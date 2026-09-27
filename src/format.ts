export const integerFormat = new Intl.NumberFormat('fr-BE', { maximumFractionDigits: 0 })

export const compactFormat = new Intl.NumberFormat('fr-BE', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

const monthFormat = new Intl.DateTimeFormat('fr-BE', { month: 'short', year: 'numeric' })

export function formatMonth(month: string): string {
  const [year, monthNumber] = String(month).split('-').map(Number)
  const date = new Date(year, monthNumber - 1, 1)
  return Number.isNaN(date.getTime()) ? String(month) : monthFormat.format(date)
}

export function cityName(city: string): string {
  return city.replace(/ \(.*\)$/, '')
}