export const maskCPF = (cpf: any) => {
  if (!cpf) {
    return null
  }

  cpf = cpf.replace(/\D/g, '')

  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

export const maskMoney = (money: string | number) => {
  if (typeof money === 'number') money = money.toString()

  money = money.replace(/\D/g, '')

  const result = new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
  }).format(parseFloat(money || '0') / 100)

  return result
}
