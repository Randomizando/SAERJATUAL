/* eslint-disable @typescript-eslint/no-unused-vars */
import { BackPage } from '@/components/BackPage'
import { SelectOptions } from '@/components/SelectOptions'
import { TextInput } from '@/components/TextInput'
import { prisma } from '@/lib/prisma'
import { useArrayDate } from '@/utils/useArrayDate'
import Checkbox from '@mui/material/Checkbox'
import { format } from 'date-fns'
import { GetServerSideProps } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { CaretRight } from 'phosphor-react'
import { z } from 'zod'
import { Box, Container, Fieldset, Text } from './styled'

const schemaAssociados = z.object({
  numero_proposta_SBA: z.number(),
  matricula_SAERJ: z.number(),
  matricula_SBA: z.number(),
  situacao: z.string(),
  uf_crm: z.string(),
  crm: z.number(),
  nome_completo: z.string(),
  cpf: z.string(),
  sexo: z.string(),
  nome_profissional: z.string(),
  categoria: z.string(),
  cep: z.string(),
  logradouro: z.string(),
  numero: z.number(),
  complemento: z.string(),
  bairro: z.string(),
  cidade: z.string(),
  uf: z.string(),
  pais: z.string(),
  telefone_celular: z.string(),
  telefone_residencial: z.string(),
  email: z.string(),
  nome_instituicao_ensino_graduacao: z.string(),
  ano_conclusao_graduacao: z.string(),
  residencia_mec_cnrm: z.string(),
  nivel_residencia: z.string(),
  nome_hospital_mec: z.string(),
  uf_prm: z.string(),
  comprovante_endereco: z.string(),
  carta_indicacao_2_membros: z.string(),
  declaracao_hospital: z.string(),
  diploma_medicina: z.string(),
  certidao_quitacao_crm: z.string(),
  certificado_conclusao_especializacao: z.string(),
  declaro_verdadeiras: z.string(),
  declaro_quite_SAERJ: z.string(),
  pendencias_SAERJ: z.string(),
  nome_presidente_regional: z.string(),
  sigla_regional: z.string(),
  comprovante_cpf: z.string(),

  // data_nascimento: z.string(),
  // data_inicio_especializacao: z.string(),
  // data_previsao_conclusao: z.string(),

  yearNasc: z.string(),
  monthNasc: z.string(),
  dayNasc: z.string(),

  dayInicioEspec: z.string(),
  monthInicioEspec: z.string(),
  yearInicioEspec: z.string(),

  dayPrevConcl: z.string(),
  monthPrevConcl: z.string(),
  yearPrevConcl: z.string(),
})

type SchemaAssociados = z.infer<typeof schemaAssociados>

interface schemaAssociados {
  data: {
    id: number
    data_nascimento: string
    data_inicio_especializacao: string
    data_previsao_conclusao: string
    comprovante_cpf: string
    numero_proposta_SBA: any
    matricula_SAERJ: number
    matricula_SBA: number
    situacao: string
    uf_crm: string
    crm: number
    nome_completo: string
    cpf: string
    sexo: string
    nome_profissional: string
    categoria: string
    cep: string
    logradouro: string
    numero: number
    complemento: string
    bairro: string
    cidade: string
    uf: string
    pais: string
    telefone_celular: string
    telefone_residencial: string
    email: string
    nome_instituicao_ensino_graduacao: string
    ano_conclusao_graduacao: string
    residencia_mec_cnrm: string
    nivel_residencia: string
    nome_hospital_mec: string
    uf_prm: string
    comprovante_endereco: string
    carta_indicacao_2_membros: string
    declaracao_hospital: string
    diploma_medicina: string
    certidao_quitacao_crm: string
    certificado_conclusao_especializacao: string
    declaro_verdadeiras: any
    declaro_quite_SAERJ: any
    pendencias_SAERJ: string
    nome_presidente_regional: string
    sigla_regional: string
  }
  dataSituacao: any[]
}
export default function AssociadosCadastro({
  data,
  dataSituacao,
}: schemaAssociados) {
  const router = useRouter()

  const dataInicio = useArrayDate.DesestruturarDate(
    data.data_inicio_especializacao,
  )
  const dataPrevisao = useArrayDate.DesestruturarDate(
    data.data_previsao_conclusao,
  )
  const dataNascimento = useArrayDate.DesestruturarDate(data.data_nascimento)

  console.log(dataNascimento)
  return (
    <Container>
      <form>
        <BackPage backRoute="/associados" />
        <fieldset>
          <legend>
            <Link href="/associados">Associados</Link>
            <CaretRight size={14} />
            <span>Visualizar</span>
          </legend>
          {/* GERAIS */}
          <Fieldset>
            <legend>
              <h2>Gerais</h2>
            </legend>

            <Box>
              <div>
                <TextInput w={120} title="UF CRM" value={data.uf_crm} />
              </div>
              <div>
                <TextInput w={180} title="CRM" value={data.crm} />
              </div>

              <TextInput title="Nome Completo" value={data.nome_completo} />
              <div>
                <TextInput
                  w={140}
                  title="CPF"
                  mask={'999.999.999-99'}
                  value={data.cpf}
                />
              </div>
            </Box>

            <Box>
              <div>
                <TextInput w={100} title="Sexo" value={data.sexo} />
              </div>
              <div>
                <TextInput
                  w={330}
                  title="Nome Profissional"
                  value={data.nome_profissional}
                />
              </div>

              <div
                style={{ display: 'flex', alignItems: 'end', width: '28rem' }}
              >
                <Text>Data Nascimento</Text>

                <SelectOptions
                  description="Dia"
                  data={useArrayDate.Dia()}
                  w={90}
                  defaultValue={{ label: dataNascimento.dia }}
                  // defaultValue={{ label: newDateAnuidade.dia }}
                />

                <SelectOptions
                  // data={dataMonths}
                  data={useArrayDate.Mes()}
                  description="Mês"
                  w={90}
                  defaultValue={{ label: dataNascimento.mes }}
                  // defaultValue={{ label: newDateAnuidade.mes }}
                />

                <SelectOptions
                  w={120}
                  description="Ano"
                  // data={dataYears}
                  data={useArrayDate.AnoAtualMenor()}
                  defaultValue={{ label: dataNascimento.ano }}
                  // defaultValue={{ label: newDateAnuidade.ano }}
                />
              </div>
              <div
                style={{
                  width: '20%',
                  border: 'solid 1px',
                  fontSize: '14px',
                  borderColor:
                    'transparent transparent rgb(169, 169, 178) transparent',
                }}
              >
                <TextInput
                  // data={dataCategoria}
                  title="Categoria"
                  value={data.categoria}
                />
              </div>
            </Box>
          </Fieldset>
          {/* Dados de endereço */}

          <Fieldset>
            <legend>
              <h2>Dados de endereço</h2>
            </legend>
            <Box>
              <div>
                <TextInput
                  w={200}
                  title="Cep *"
                  value={data.cep}
                  mask="99999-999"
                />
              </div>
              <div>
                <TextInput
                  w={260}
                  title="País onde reside *"
                  value={data.pais}
                />
              </div>
              <div>
                <TextInput w={100} title="UF *" value={data.uf} />
              </div>

              <div>
                <TextInput w={400} title="Cidade *" value={data.cidade} />
              </div>

              <div>
                <TextInput w={300} title="Bairro *" value={data.bairro} />
              </div>
            </Box>
            <Box>
              <div>
                <TextInput
                  w={400}
                  title="Logradouro *"
                  value={data.logradouro}
                />
              </div>
              <div>
                <TextInput w={90} title="Número *" value={data.numero} />
              </div>
              <div>
                <TextInput
                  title="Complemento"
                  w={400}
                  value={data.complemento}
                />
              </div>
            </Box>
          </Fieldset>

          <Fieldset>
            <legend>
              <h2>Dados de contato</h2>
            </legend>

            <Box>
              <div>
                <TextInput
                  w={300}
                  title="Telefone Celular"
                  mask={'(99) 9.9999-9999'}
                  value={data.telefone_celular}
                />
              </div>
              <div>
                <TextInput
                  w={300}
                  title="Telefone Residencial"
                  mask={'(99) 9999-9999'}
                  value={data.telefone_residencial}
                />
              </div>
              <TextInput w={320} title="Email" value={data.email} />

              {/* <TextInput title="Confirmação email" /> */}
            </Box>
          </Fieldset>

          <Fieldset>
            <legend>
              <h2>Dados referente a formação acadêmica</h2>
            </legend>
            <>
              <Box>
                <div>
                  <TextInput
                    w={400}
                    title="Nome Instituição de Ensino Graduação"
                    value={data.nome_instituicao_ensino_graduacao}
                  />
                </div>
                <div>
                  <TextInput
                    w={180}
                    title="Ano de Conclusão Graduação"
                    value={data.ano_conclusao_graduacao}
                  />
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'end',
                    width: '25rem',
                  }}
                >
                  <Text>Data Início Especialização</Text>

                  <SelectOptions
                    description="Dia"
                    data={useArrayDate.Dia()}
                    w={90}
                    defaultValue={{ label: dataInicio.dia }}
                  />

                  <SelectOptions
                    data={useArrayDate.Mes()}
                    description="Mês"
                    w={90}
                    defaultValue={{ label: dataInicio.mes }}
                  />

                  <SelectOptions
                    w={120}
                    description="Ano"
                    data={useArrayDate.AnoAtualMenor()}
                    defaultValue={{ label: dataInicio.ano }}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'end',
                    width: '25rem',
                  }}
                >
                  <Text>Data Previsão Conclusão</Text>

                  <SelectOptions
                    description="Dia"
                    data={useArrayDate.Dia()}
                    w={90}
                    value={dataPrevisao.dia}
                    defaultValue={{ label: dataPrevisao.dia }}
                  />

                  <SelectOptions
                    data={useArrayDate.Mes()}
                    description="Mês"
                    w={90}
                    defaultValue={{ label: dataPrevisao.mes }}
                  />

                  <SelectOptions
                    w={120}
                    description="Ano"
                    data={useArrayDate.AnoAtualMaior()}
                    value={dataPrevisao.ano}
                    defaultValue={{ label: dataPrevisao.ano }}
                  />
                </div>
                <div>
                  <TextInput
                    w={130}
                    title="Residencia MEC-CNRM"
                    value={data.residencia_mec_cnrm}
                  />
                </div>

                <div>
                  <TextInput w={120} title="UF PRM" value={data.uf_prm} />
                </div>
              </Box>
            </>
          </Fieldset>

          <Fieldset>
            <legend>
              <h2>Histórico do Proponente</h2>
            </legend>

            <Box>
              <TextInput
                title="Nível Residencia"
                value={data.nivel_residencia}
              />
              <TextInput title="UF PRM" value={data.uf_prm} />
              <TextInput
                title="Nome Hospital MEC"
                value={data.nome_hospital_mec}
              />
            </Box>
          </Fieldset>

          <Fieldset>
            <legend>
              <h2>Documentos Comprobatórios</h2>
            </legend>
            <h3
              style={{ display: 'flex', alignItems: 'center', width: '100%' }}
            >
              <div style={{ flex: 1 }}>Documentos</div>
              <div style={{ flex: 1 }}>Arquivo(.pdf)</div>
            </h3>

            <Box>
              <TextInput title="Comprovante CPF" value={data.comprovante_cpf} />
            </Box>

            <Box>
              <TextInput
                title="Comprovante Endereço"
                value={data.comprovante_endereco}
              />
            </Box>
            <Box>
              <TextInput
                title="Certidão de Quitação CRM"
                value={data.certidao_quitacao_crm}
              />
            </Box>

            <Box>
              <TextInput
                title="Certificado Conclusão Especialização"
                value={data.certificado_conclusao_especializacao}
              />
            </Box>

            <Box>
              <TextInput
                title="Carta Indicação 2 Membros"
                value={data.carta_indicacao_2_membros}
              />
            </Box>
            <Box>
              <TextInput
                title="Diploma Medicina"
                value={data.diploma_medicina}
              />
            </Box>

            <Box>
              <TextInput
                title="declaracao_hospital"
                value={data.declaracao_hospital}
              />
            </Box>
          </Fieldset>

          <Fieldset>
            <legend>
              <h2>Declaração veracidade das informações</h2>
            </legend>
            <Box>
              <div>
                <TextInput
                  w={180}
                  title="Número proposta SBA"
                  value={data.numero_proposta_SBA}
                />
              </div>
              <div>
                <TextInput
                  w={180}
                  title="Matrícula SAERJ"
                  value={data.matricula_SAERJ}
                />
              </div>
              <div>
                <TextInput
                  w={180}
                  title="Matrícula SBA"
                  value={data.matricula_SBA}
                />
              </div>

              <div>
                <SelectOptions
                  w={200}
                  description="Situação"
                  data={dataSituacao}
                  defaultValue={{ label: data.situacao }}
                />
              </div>

              <TextInput
                title="Pendências SAERJ"
                value={data.pendencias_SAERJ}
              />
              <div>
                <TextInput
                  w={180}
                  title="Nome Presidente Regional"
                  value={data.nome_presidente_regional}
                />
              </div>
              <div>
                <TextInput
                  w={100}
                  title="Sigla Regional"
                  value={data.sigla_regional}
                />
              </div>
            </Box>

            <Box>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Checkbox
                  title="Declaro para os devidos fins que as informações contidas neste formulário de cadastro são verdadeiras e autênticas"
                  defaultChecked={data.declaro_verdadeiras}
                />
                <p style={{ color: ' rgba(0, 0, 0, 0.6)' }}>
                  Declaro para os devidos fins que as informações contidas neste
                  formulário de cadastro são verdadeiras e autênticas
                </p>
                <Checkbox
                  title="Declaro para os devidos fins que proponente à médico em especialização está quite com o pagamento da anuidade regional"
                  defaultChecked={data.declaro_quite_SAERJ}
                />
                <p style={{ color: ' rgba(0, 0, 0, 0.6)' }}>
                  Declaro para os devidos fins que proponente à médico em
                  especialização está quite com o pagamento da anuidade
                  regional
                </p>
              </div>
            </Box>
          </Fieldset>
        </fieldset>
      </form>
    </Container>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id }: any = context.params
  try {
    const data = await prisma.associados.findFirst({
      where: {
        id: Number(id),
      },
    })
    // const convertBigIntToString = (obj: any) => {
    //   for (const key in obj)
    //     typeof obj[key] === 'bigint' && (obj[key] = obj[key].toString())
    //   return obj
    // }

    const situacao = await prisma.tabelas.findMany({
      where: {
        codigo_tabela: 'Situação_Associado',
      },
    })
    const dataSituacao = situacao.map((item) => {
      return {
        label: item.ocorrencia_tabela,
      }
    })

    const convertBigIntToString = (obj: any) => {
      for (const key in obj) {
        if (typeof obj[key] === 'bigint') {
          obj[key] = obj[key].toString()
        }
        if (obj[key] instanceof Date) {
          obj[key] = format(obj[key], 'yyyy-MM-dd') // ou o formato desejado
        }
      }
      return obj
    }

    return {
      props: {
        data: convertBigIntToString(data),
        dataSituacao,
      },
    }
  } catch (error) {
    console.error('Erro ao obter dados de tipo de empresa:', error)
    return {
      props: {
        data: [],
      },
    }
  }
}
