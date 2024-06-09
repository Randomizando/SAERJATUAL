export function checkAspirantCode(code: string) {
  return !!code && code.toLowerCase().includes('asp')
}
