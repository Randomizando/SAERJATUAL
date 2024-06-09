export const moneyToFloat = (money: string) => {
  return parseFloat(money.replace('.', '').replace(',', '.'))
}
