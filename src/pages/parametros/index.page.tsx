import { Box, Container, Text } from './styled'
import React, { useEffect, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/Button'
import { TextInput } from '@/components/TextInput'
import { SwitchInput } from '@/components/SwitchInput'
import { prisma } from '@/lib/prisma'
import { GetServerSideProps } from 'next'
import { SelectOptions } from '@/components/SelectOptions'
import { api } from '@/lib/axios'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import { useArrayDate } from '@/utils/useArrayDate'
import { BackPage } from '@/components/BackPage'
import { EyeSlash, Eye } from 'phosphor-react'
interface schemaCategorias {
  label: string
}

const schemaParams = z.object({
  // random: z.string(),
  cep_invalido: z.boolean(),
  data_limite_pgto_antecipado_anuidade: z.date(),
  percent_desc_pgto_antecipado_anuidade: z.number(),
  taxa_pgto_atrasado_anuidade: z.number(),
  categorias: z.string(),
  parcelamento_permitido_anuidade: z.string(),
  parcelamento_permitido_JAER: z.string(),
  data_limite_pgto_antecipado_JAER: z.date(),
  percent_desc_pgto_antecipado_JAER: z.number(),
  taxa_pgto_atrasado_JAER: z.number(),
  presidente_pode_se_reeleger: z.boolean(),
  demais_podem_se_reeleger: z.boolean(),
  duracao_mandato: z.number(),
  exite_listas_imediato: z.boolean(),
  quantidade_linhas_listas: z.number(),
  acesso_externo_sis: z.boolean(),
  endereco_IP_primario: z.string(),
  endereco_IP_secundario: z.string(),
  day: z.string(),
  month: z.string(),
  year: z.string(),
  dayJaer: z.string(),
  monthJaer: z.string(),
  yearJaer: z.string(),
  permitir_dado_invalido: z.boolean(),
  assunto_email_aniversario: z.string(),
  nome_email_remetente: z.string(),
  endereco_email_remetente: z.string(),
})

type SchemaParametros = z.infer<typeof schemaParams>

interface schemeDataParametros {
  id: number
  random: string
  cep_invalido: boolean
  data_limite_pgto_antecipado_anuidade: Date
  percent_desc_pgto_antecipado_anuidade: any
  taxa_pgto_atrasado_anuidade: any
  categorias: string
  parcelamento_permitido_anuidade: any
  parcelamento_permitido_JAER: any
  data_limite_pgto_antecipado_JAER: Date
  percent_desc_pgto_antecipado_JAER: any
  taxa_pgto_atrasado_JAER: any
  presidente_pode_se_reeleger: boolean
  demais_podem_se_reeleger: boolean
  duracao_mandato: any
  exite_listas_imediato: boolean
  quantidade_linhas_listas: any
  acesso_externo_sis: boolean
  endereco_IP_primario: string
  endereco_IP_secundario: string
  permitir_dado_invalido: boolean
  assunto_email_aniversario: string
  nome_email_remetente: string
  endereco_email_remetente: string
}

interface schemaParametrosProps {
  newDataCategory: schemaCategorias[]
  dataParametros: schemeDataParametros
}
export default function Parametros({
  newDataCategory,
  dataParametros,
}: schemaParametrosProps) {
  const router = useRouter()
  const [viewRandom, setViewRandom] = useState<boolean>(false)
  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<SchemaParametros>()

  const newDateAnuidade = useArrayDate.DesestruturarDate(
    dataParametros.data_limite_pgto_antecipado_anuidade,
  )

  const newDateAnuidadeJaer = useArrayDate.DesestruturarDate(
    dataParametros.data_limite_pgto_antecipado_JAER,
  )

  async function handleOnSubmit(data: SchemaParametros) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { day, month, year, dayJaer, monthJaer, yearJaer, ...newData } =
        data

      const response = await api.put('/parametros/update', {
        ...newData,
        data_limite_pgto_antecipado_anuidade: useArrayDate.MontarDate(
          data.year,
          data.month,
          data.day,
        ),
        cep_invalido: data.cep_invalido,
        data_limite_pgto_antecipado_JAER: useArrayDate.MontarDate(
          data.yearJaer,
          data.monthJaer,
          data.dayJaer,
        ),
      })
      if (response.status === 200) {
        toast.success('Alterado com sucesso!')
      } else {
        toast.error('Algo deu errado')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const dataDays = useArrayDate.Dia()
  const dataMonths = useArrayDate.Mes()
  const dataYears = useArrayDate.AnoAtualMaior()

  function handleNextPage() {
    router.push('/parametros/associados')
  }

  useEffect(() => {
    setValue('day', newDateAnuidade.dia)
    setValue('month', newDateAnuidade.mes)
    setValue('year', newDateAnuidade.ano)

    setValue('dayJaer', newDateAnuidadeJaer.dia)
    setValue('monthJaer', newDateAnuidadeJaer.mes)
    setValue('yearJaer', newDateAnuidadeJaer.ano)

    setValue(
      'parcelamento_permitido_JAER',
      dataParametros.parcelamento_permitido_JAER,
    )
    setValue(
      'parcelamento_permitido_anuidade',
      dataParametros.parcelamento_permitido_anuidade,
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <Container>
      <form onSubmit={handleSubmit(handleOnSubmit)}>
        <BackPage backRoute="/" />

        <fieldset>
          <legend>
            <span>Parametros</span>
            {/* <CaretRight size={14} />
            <span>Atualizar</span> */}
          </legend>

          <Box>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <TextInput
                type={viewRandom === false ? 'password' : 'text'}
                title="Random"
                w={100}
                disabled
                defaultValue={dataParametros.random}
              />
              {viewRandom === false ? (
                <EyeSlash
                  style={{
                    cursor: 'pointer',
                  }}
                  size={21}
                  onClick={() => {
                    setViewRandom(true)
                  }}
                />
              ) : (
                <Eye
                  size={21}
                  style={{
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    setViewRandom(false)
                  }}
                />
              )}
            </div>
            <div style={{ flex: 0.8 }}>
              <SwitchInput
                title="CEP inválido: Aceita preenchimento manual do endereço?"
                {...register('cep_invalido')}
                defaultChecked={dataParametros.cep_invalido}
              />
            </div>

            <div style={{ flex: 0.8 }}>
              <SwitchInput
                title="Dados inválido: Aceita cadastrar dado inválido?"
                {...register('permitir_dado_invalido')}
                defaultChecked={dataParametros.permitir_dado_invalido}
              />
            </div>

            <Button
              style={{ width: '100%' }}
              type="button"
              title="Associados"
              onClick={handleNextPage}
            />
          </Box>
          <Box>
            <div style={{ display: 'flex', alignItems: 'end', width: '38rem' }}>
              <Text>
                Data limite para pagamento antecipado da Anuidade com desconto?
              </Text>

              <SelectOptions
                description="Dia"
                data={dataDays}
                w={90}
                {...register('day')}
                defaultValue={{ label: newDateAnuidade.dia }}
              />

              <SelectOptions
                data={dataMonths}
                description="Mês"
                w={90}
                {...register('month')}
                defaultValue={{ label: newDateAnuidade.mes }}
              />

              <SelectOptions
                w={120}
                description="Ano"
                data={dataYears}
                {...register('year')}
                defaultValue={{ label: newDateAnuidade.ano }}
              />
            </div>
            <TextInput
              w={380}
              type="number"
              title="Percentual de desconto para pagamento antecipado da Anuidade"
              {...register('percent_desc_pgto_antecipado_anuidade', {
                valueAsNumber: true,
              })}
              defaultValue={
                dataParametros.percent_desc_pgto_antecipado_anuidade
              }
            />
          </Box>
          <Box>
            <div>
              <TextInput
                w={330}
                title="Taxa (valor) para pagamento da Anuidade após o prazo"
                {...register('taxa_pgto_atrasado_anuidade', {
                  valueAsNumber: true,
                })}
                defaultValue={dataParametros.taxa_pgto_atrasado_anuidade}
              />
            </div>
            <SelectOptions
              {...register('parcelamento_permitido_anuidade')}
              w={440}
              data={newDataCategory}
              description="Parcelamento Anuidade Permitido para Categorias"
              defaultValue={{
                label: dataParametros.parcelamento_permitido_anuidade,
              }}
            />

            <div style={{ display: 'flex', alignItems: 'end', width: '38rem' }}>
              <Text>
                Data limite para pagamento antecipado da JAER com desconto?
              </Text>

              <SelectOptions
                description="Dia"
                data={dataDays}
                w={90}
                {...register('dayJaer')}
                defaultValue={{ label: newDateAnuidadeJaer.dia }}
              />

              <SelectOptions
                data={dataMonths}
                description="Mês"
                w={90}
                {...register('monthJaer')}
                defaultValue={{ label: newDateAnuidadeJaer.mes }}
              />

              <SelectOptions
                w={120}
                description="Ano"
                data={dataYears}
                {...register('yearJaer')}
                defaultValue={{ label: newDateAnuidadeJaer.ano }}
              />
            </div>
            <TextInput
              type="number"
              title="Percentual de desconto para pagamento antecipado da JAER"
              {...register('percent_desc_pgto_antecipado_JAER', {
                valueAsNumber: true,
              })}
              defaultValue={dataParametros.percent_desc_pgto_antecipado_JAER}
            />
          </Box>

          <Box>
            <div>
              <TextInput
                w={330}
                title="Taxa (valor) para pagamento da JAER após o prazo"
                {...register('taxa_pgto_atrasado_JAER', {
                  valueAsNumber: true,
                })}
                defaultValue={dataParametros.taxa_pgto_atrasado_JAER}
              />
            </div>
            <div>
              <SelectOptions
                data={newDataCategory}
                w={440}
                description="Parcelamento JAER Permitido para Categorias"
                {...register('parcelamento_permitido_JAER')}
                defaultValue={{
                  label: dataParametros.parcelamento_permitido_JAER,
                }}
              />
            </div>

            <SwitchInput
              title="Presidente pode se reeleger?"
              {...register('presidente_pode_se_reeleger')}
              defaultChecked={dataParametros.presidente_pode_se_reeleger}
            />

            <SwitchInput
              title="Demais membros da diretoria podem se reeleger?"
              {...register('demais_podem_se_reeleger')}
              defaultChecked={dataParametros.demais_podem_se_reeleger}
            />
          </Box>

          <Box>
            <div>
              <TextInput
                w={200}
                title="Duração Mandato Diretoria em anos"
                {...register('duracao_mandato', { valueAsNumber: true })}
                defaultValue={dataParametros.duracao_mandato}
              />
            </div>
            <SwitchInput
              title="Exibe LIstas na imediato ou aguarda clicar botão pesquisar?"
              {...register('exite_listas_imediato')}
              defaultChecked={dataParametros.exite_listas_imediato}
            />
            <div>
              <TextInput
                w={300}
                type="number"
                title="Quantidade de linhas por pagina nas listas"
                {...register('quantidade_linhas_listas', {
                  valueAsNumber: true,
                })}
                defaultValue={dataParametros.quantidade_linhas_listas}
              />
            </div>
          </Box>

          <Box>
            <div>
              <SwitchInput
                title="Acesso externo ao sistema autorizado?"
                {...register('acesso_externo_sis')}
                defaultChecked={dataParametros.acesso_externo_sis}
              />
            </div>
            <div>
              <TextInput
                title="Endereco IP primario"
                w={280}
                {...register('endereco_IP_primario')}
                defaultValue={dataParametros.endereco_IP_primario}
              />
            </div>
            <div>
              <TextInput
                title="Endereco IP secundario SAERJ"
                w={280}
                {...register('endereco_IP_secundario')}
                defaultValue={dataParametros.endereco_IP_secundario}
              />
            </div>
          </Box>

          <Box>
            <div>
              <TextInput
                title="Assunto e-mail aniversário"
                type="text"
                w={480}
                {...register('assunto_email_aniversario')}
                defaultValue={dataParametros.assunto_email_aniversario}
              />
            </div>
            <div>
              <TextInput
                title="Endereço e-mail remetente"
                type="email"
                w={280}
                {...register('endereco_email_remetente')}
                defaultValue={dataParametros.endereco_email_remetente}
              />
            </div>
            <div>
              <TextInput
                title="Nome e-mail remetente"
                type="text"
                w={280}
                {...register('nome_email_remetente')}
                defaultValue={dataParametros.nome_email_remetente}
              />
            </div>
          </Box>
          <Button
            disabled={isSubmitting}
            title={isSubmitting ? 'Atualizando...' : 'Atualizar'}
          />
        </fieldset>
      </form>
    </Container>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const dataCategory = await prisma.tabelas.findMany({
      where: {
        codigo_tabela: 'Categoria_Associado',
      },
    })
    const newDataCategory = dataCategory.map((item) => {
      return {
        label: item.ocorrencia_tabela,
      }
    })
    const dataParametros = await prisma.parametros.findMany({
      where: {
        id: 1,
      },
    })

    const dataLimitePgtoAntecipadoAnuidade =
      dataParametros[0].data_limite_pgto_antecipado_anuidade instanceof Date
        ? dataParametros[0].data_limite_pgto_antecipado_anuidade
        : null

    const formattedDataLimitePgtoAntecipadoAnuidade =
      dataLimitePgtoAntecipadoAnuidade
        ? dataLimitePgtoAntecipadoAnuidade.toISOString()
        : null

    const dataLimitePgtoAntecipadoAnuidadeJAER =
      dataParametros[0].data_limite_pgto_antecipado_JAER instanceof Date
        ? dataParametros[0].data_limite_pgto_antecipado_JAER
        : null

    const formattedDataLimitePgtoAntecipadoAnuidadeJAER =
      dataLimitePgtoAntecipadoAnuidadeJAER
        ? dataLimitePgtoAntecipadoAnuidadeJAER.toISOString()
        : null

    return {
      props: {
        newDataCategory,
        dataParametros: {
          ...dataParametros[0], // mantém as outras propriedades intactas
          data_limite_pgto_antecipado_anuidade:
            formattedDataLimitePgtoAntecipadoAnuidade,
          data_limite_pgto_antecipado_JAER:
            formattedDataLimitePgtoAntecipadoAnuidadeJAER,
        },
      },
    }
  } catch (error) {
    console.error('Erro ao obter dados de tipo de empresa:', error)
    return {
      props: {
        newDataCategory: [],
        dataParametros: [],
      },
    }
  }
}
