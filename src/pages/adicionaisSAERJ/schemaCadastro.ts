import { dateDestructuring } from '@/utils/dateFormatter'
import { z } from 'zod'

export const schemaCadastro = z.object({
  nome_completo: z.string().optional(),
  admissao_saerj: z
    .object({
      //    dia: z.string().nullable(),
      //      mes: z.string().nullable(),
      //        ano: z.string().nullable(),

      dia: z.optional(z.string().nullable()),
      mes: z.optional(z.string().nullable()),
      ano: z.optional(z.string().nullable()),
    })
    .refine((value) => {
      const algumPreenchido = value.dia || value.mes || value.ano

      if (!algumPreenchido) return true

      const todosPreenchidos = value.dia && value.mes && value.ano
      if (!todosPreenchidos) {
        return false
      }

      const { dia, mes, ano } = value
      const dataAdmissao = new Date(`${ano}-${mes}-${dia}`)
      const hoje = new Date()

      if (
        dataAdmissao > hoje ||
        dateDestructuring(`${ano}-${mes}-${dia}`).day !== dia
      ) {
        return false
      }

      return true
    }, 'Data de admissão deve ser válida e não pode ser posterior à data atual'),
  // situacao: z.string(),
  cooperativa: z.string().nullable().optional(),
  nome_pai: z.string().nullable(),
  nome_mae: z.string().nullable(),
  tsa: z.string().nullable(),
  ano_ult_pgto_sba: z.string().nullable(),
  observacao_1: z.string().nullable(),
  observacao_2: z.string().nullable(),
  observacao_3: z.string().nullable(),

  //    hospital_1: z.string().nullable(),
  //  nome_responsavel: z.string().nullable(),
  //    tratamento: z.string().nullable(),
  //  nacionalidade: z.string().nullable(),
  //    cet_data_inicio: z.object({
  //  dia: z.string().nullable(),
  //    mes: z.string().nullable(),
  //      ano: z.string().nullable(),
  //  }),
  //    cet_data_fim: z.object({
  //  dia: z.string().nullable(),
  //    mes: z.string().nullable(),
  //      ano: z.string().nullable(),

  hospital_1: z.optional(z.string().nullable()),
  nome_responsavel: z.optional(z.string().nullable()),
  tratamento: z.optional(z.string().nullable()),
  nacionalidade: z.optional(z.string().nullable()),
  // cet_data_inicio: z.object({
  //   dia: z.optional(z.string().nullable()),
  //   mes: z.optional(z.string().nullable()),
  //   ano: z.optional(z.string().nullable()),
  // }),

  cet_data_inicio_dia: z
    .string()
    .min(1, { message: 'data precisa ser menor que data cet fim' }),
  cet_data_inicio_mes: z.string(),
  cet_data_inicio_ano: z.string(),
  // cet_data_fim: z.object({
  //   dia: z.optional(z.string().nullable()),
  //   mes: z.optional(z.string().nullable()),
  //   ano: z.optional(z.string().nullable()),
  // }),
  cet_data_fim_dia: z.string(),
  cet_data_fim_mes: z.string(),
  cet_data_fim_ano: z.string(),

  cet: z.string().nullable().optional(),
  ano_ult_pgto_regional: z.string().nullable().optional(),
  cat_saerj: z.string().nullable().optional(),
  foto_associado: z
    .custom<FileList | null>((value) => {
      if (!value || !(value instanceof FileList) || value.length === 0) {
        return true
      }

      const isValid = Array.from(value).every((file) => {
        const fileName = file.name.toLowerCase()
        return (
          fileName.endsWith('.jpg') ||
          fileName.endsWith('.jpeg') ||
          fileName.endsWith('.png')
        )
      })

      const limit5Mb = 5 * 1024 * 1024
      const isValidSize = isValidFileSize(value, limit5Mb)

      return isValid && isValidSize
    }, 'Arquivo inválido. Sua imagem não pode ser maior do que 5MB')
    .transform((value) => {
      if (!value || !value.length || isValidImage(value)) {
        return value
      } else {
        return null
      }
    }),
  declaro_verdadeiras: z.boolean().nullable(),
})
// .refine(
//   (schema) => {
//     const { hospital_1, hospital_2 } = schema

//     if (hospital_1 && hospital_2 && hospital_1 === hospital_2) {
//       return false
//     }
//     return true
//   },
//   {
//     message: 'O hospital 2 deve ser diferente do hospital 1.',
//     path: ['validacao_hospitais'],
//   },
// )
// .refine(
//   (schema) => {
//     const startDate = schema.cet_data_inicio
//     const endDate = schema.cet_data_fim
//     const startDateIncomplete =
//       !startDate || !startDate.dia || !startDate.mes || !startDate.ano
//     const endDateIncomplete =
//       !endDate || !endDate.dia || !endDate.mes || !endDate.ano
//     const cet_data_inicio = new Date(
//       `${startDate.ano}-${startDate.mes}-${startDate.dia}`,
//     )
//     const cet_data_fim = new Date(
//       `${endDate.ano}-${endDate.mes}-${endDate.dia}`,
//     )

//     const hoje = new Date()

//     if (endDateIncomplete) {
//       return true // Não faz validação se a data de fim não estiver preenchida
//     }

//     // se existir data início e for maior que o inicio
//     if (!startDateIncomplete && cet_data_inicio > hoje) {
//       return false
//     }

//     // se existir data fim e for maior que o inicio
//     if (!endDateIncomplete && cet_data_fim > hoje) {
//       return false
//     }

//     // datas invalidas
//     if (
//       !endDateIncomplete &&
//       dateDestructuring(String(cet_data_fim)).day !== endDate.dia
//     ) {
//       return false
//     }

//     if (
//       !startDateIncomplete &&
//       dateDestructuring(String(cet_data_inicio)).day !== startDate.dia
//     ) {
//       return false
//     }

//     return true
//   },
//   {
//     message:
//       'As data devem ser válidas e não podem ser posteriores à data atual',
//     path: ['validacao_cet'],
//   },
// )
// .refine(
//   (schema) => {
//     const startDate = schema.cet_data_inicio
//     const endDate = schema.cet_data_fim

//     const startDateIncomplete =
//       !startDate || !startDate.dia || !startDate.mes || !startDate.ano
//     const endDateIncomplete =
//       !endDate || !endDate.dia || !endDate.mes || !endDate.ano

//     const startDateFormated = new Date(
//       `${startDate.ano}-${startDate.mes}-${startDate.dia}`,
//     )
//     const endDateFormated = new Date(
//       `${endDate.ano}-${endDate.mes}-${endDate.dia}`,
//     )

//     if (!startDateIncomplete && !endDateIncomplete) {
//       return endDateFormated > startDateFormated
//     }

//     return true
//   },
//   {
//     message: 'A data de fim deve ser posterior à data de início',
//     path: ['validacao_cet'],
//   },
// )

function isValidImage(fileList: FileList): boolean {
  return Array.from(fileList).every((file) => file?.type?.startsWith('image/'))
}

function isValidFileSize(files: FileList | null, maxSize: number): boolean {
  if (!files || files.length === 0) {
    return true
  }

  return Array.from(files).every((file) => file.size <= maxSize)
}
