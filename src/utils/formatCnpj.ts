export const formatCNPJ = (cnpj: string) => {
  // Remove caracteres não numéricos
  const cleanedCNPJ = cnpj.replace(/\D/g, '')

  // Aplica a máscara de CNPJ (XX.XXX.XXX/YYYY-ZZ)
  return cleanedCNPJ.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    '$1.$2.$3/$4-$5',
  )
}
