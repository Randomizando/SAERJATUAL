export function isValidNumber(data: any) {
  return !isNaN(parseFloat(data)) && isFinite(data)
}
