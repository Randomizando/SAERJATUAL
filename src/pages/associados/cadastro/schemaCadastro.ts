import { z } from 'zod'

export const schemaCadastro = z.object({
  numero_proposta_SBA: z.number(),
  matricula_SAERJ: z.number().min(1, { message: 'Campo obrigatório' }),
  matricula_SBA: z.number(),
  situacao: z.string().min(1, { message: 'Campo Obrigatório' }),
  uf_crm: z.string().min(1, { message: 'Campo Obrigatório' }),
  crm: z.string().min(1, { message: 'Campo Obrigatório' }),
  nome_completo: z.string().min(1, { message: 'Campo Obrigatório' }),
  cpf: z.string().min(1, { message: 'Campo Obrigatório' }),
  sexo: z.string().min(1, { message: 'Campo Obrigatório' }),
  nome_profissional: z.string(),
  categoria: z.string().min(1, { message: 'Campo Obrigatório' }),
  pais: z.string().min(1, { message: 'Campo Obrigatório' }),
  cep: z.string().min(8, { message: 'Campo Obrigatório' }),
  logradouro: z.string().min(1, { message: 'Campo Obrigatório' }),
  numero: z.string().min(1, { message: 'Campo Obrigatório' }),
  bairro: z.string().min(1, { message: 'Campo Obrigatório' }),
  uf: z.string().min(1, { message: 'Campo Obrigatório' }),
  cidade: z.string().min(1, { message: 'Campo Obrigatório' }),
  complemento: z.string(),
  telefone_celular: z.string().min(1, { message: 'Campo Obrigatório' }),
  telefone_residencial: z.string(),
  email: z
    .string()
    .email('O email não é válido')
    .min(1, { message: 'Campo Obrigatório' }),
  nome_instituicao_ensino_graduacao: z
    .string()
    .min(1, { message: 'Campo Obrigatório' }),
  ano_conclusao_graduacao: z.string().min(1, { message: 'Campo Obrigatório' }),
  residencia_mec_cnrm: z.boolean(),
  nivel_residencia: z.string(),
  nome_hospital_mec: z.optional(z.string()),
  uf_prm: z.string().min(1, { message: 'Campo Obrigatório' }),
  comprovante_endereco: z.any(),
  carta_indicacao_2_membros: z.any(),
  declaracao_hospital: z.any(),
  diploma_medicina: z.any(),
  certidao_quitacao_crm: z.any(),
  certificado_conclusao_especializacao: z.any(),
  declaro_verdadeiras: z.boolean(),
  declaro_quite_SAERJ: z.boolean(),
  pendencias_SAERJ: z.string(),
  nome_presidente_regional: z.string(),
  sigla_regional: z.optional(z.string()),
  comprovante_cpf: z.any(),
  yearNasc: z.string().min(1, { message: 'Dia Obrigatório' }),
  monthNasc: z.string().min(1, { message: 'Mês Obrigatório' }),
  dayNasc: z.string().min(1, { message: 'Ano Obrigatório' }),
  dayInicioEspec: z.optional(z.string()),
  monthInicioEspec: z.optional(z.string()),
  yearInicioEspec: z.optional(z.string()),
  dayPrevConcl: z.optional(z.string()),
  monthPrevConcl: z.optional(z.string()),
  yearPrevConcl: z.optional(z.string()),
  confirmarEmail: z.string(),
})
