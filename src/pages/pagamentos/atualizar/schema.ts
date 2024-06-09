import { z } from 'zod'

export const schema = z.object({
  id: z.number(),
  saerjEnrollment: z.string().min(1, { message: 'Campo Obrigatório' }),
  paymentType: z.string().min(1, { message: 'Campo Obrigatório' }),
  paymentMethod: z.string().min(1, { message: 'Campo Obrigatório' }),
  year: z.string(),

  uniquePaymentDate: z.string(),
  uniqueInstallmentDay: z.string(),
  uniqueInstallmentMonth: z.string(),
  uniqueInstallmentYear: z.string(),
  uniqueInstallmentValue: z.string(),

  firstInstallmentDate: z.string(),
  firstInstallmentDay: z.string(),
  firstInstallmentMonth: z.string(),
  firstInstallmentYear: z.string(),
  firstInstallmentValue: z.string(),

  secondInstallmentDate: z.string(),
  secondInstallmentDay: z.string(),
  secondInstallmentMonth: z.string(),
  secondInstallmentYear: z.string(),
  secondInstallmentValue: z.string(),

  thirdInstallmentDate: z.string(),
  thirdInstallmentDay: z.string(),
  thirdInstallmentMonth: z.string(),
  thirdInstallmentYear: z.string(),
  thirdInstallmentValue: z.string(),
})
