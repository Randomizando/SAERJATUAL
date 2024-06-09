export function findCountryByNationality(nationality: string) {
  if (nationality.toLocaleLowerCase() === 'brasileira') return 'Brasil'
  if (nationality.toLocaleLowerCase() === 'portuguesa') return 'Portugal'
  if (nationality.toLocaleLowerCase() === 'americana')
    return 'Estados Unidos América'
  return ''
}
