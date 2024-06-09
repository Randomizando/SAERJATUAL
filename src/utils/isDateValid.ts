export function isDateInvalid(mes: number, dia: number, ano: number) {
  const data = new Date(ano, mes - 1, dia); 
  return data.getFullYear() !== ano || data.getMonth() !== mes - 1 || data.getDate() !== dia;
}
