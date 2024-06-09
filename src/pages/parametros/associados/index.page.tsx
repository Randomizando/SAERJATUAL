import { Box, Container } from './styled'
import React, { useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/Button'
import { TextInput } from '@/components/TextInput'
import { prisma } from '@/lib/prisma'
import { GetServerSideProps } from 'next'
import { ArrowBendDownLeft, CaretRight } from 'phosphor-react'
import { api } from '@/lib/axios'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useArrayDate } from '@/utils/useArrayDate'

const schemaParams = z.object({
  numero_proposta_SBA: z.number(),
  matricula_SAERJ: z.number(),
  matricula_SBA: z.number(),
  situacao: z.string(),
  uf_crm: z.string(),
  crm: z.string(),
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

  data_nascimento: z.string(),
  data_inicio_especializacao: z.string(),
  data_previsao_conclusao: z.string(),
})

type SchemaParametros = z.infer<typeof schemaParams>

interface schemaParametrosProps {
  data: any
}
export default function Associados({ data }: schemaParametrosProps) {
  const router = useRouter()
  const dataAssociados = data[0]

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = useForm<SchemaParametros>()

  async function handleOnSubmit(data: SchemaParametros) {
    try {
      await api.put('/associados/update', {
        ...data,
        id: 1,
        data_nascimento: useArrayDate.MontarDate(
          data.data_nascimento,
          '1',
          '1',
        ),
        data_inicio_especializacao: useArrayDate.MontarDate(
          data.data_inicio_especializacao,
          '1',
          '1',
        ),
        data_previsao_conclusao: useArrayDate.MontarDate(
          data.data_previsao_conclusao,
          '1',
          '1',
        ),
      })
      toast.success('Atualizado!')
      router.push('/parametros')
    } catch (error) {
      console.log(error)
      toast.error('Oops algo deu errado...')
    }
  }

  const dateNascimento = useArrayDate.DesestruturarDate(
    dataAssociados.data_nascimento,
  )

  useEffect(() => {
    setValue(
      'data_inicio_especializacao',
      useArrayDate.DesestruturarDate(dataAssociados.data_inicio_especializacao)
        .ano,
    )
    setValue('data_nascimento', dateNascimento.ano)
    setValue(
      'data_previsao_conclusao',
      useArrayDate.DesestruturarDate(dataAssociados.data_previsao_conclusao)
        .ano,
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <Container>
      <form onSubmit={handleSubmit(handleOnSubmit)}>
        <Box style={{ justifyContent: 'end' }}>
          <Link
            href="/parametros"
            style={{
              textDecoration: 'none',
              fontFamily: 'Roboto',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1rem',
              color: '#000',
            }}
          >
            <ArrowBendDownLeft size={32} />
            Retornar
          </Link>
        </Box>
        <fieldset>
          <legend>
            <Link href="/parametros">Parametros</Link>
            <CaretRight size={14} />
            <span>Associados</span>
            <CaretRight size={14} />
            <span>Atualizar</span>
          </legend>

          <fieldset
            style={{
              border: 'solid 1px',
              padding: '2rem',
              marginTop: '1rem',
              borderRadius: '8px',
            }}
          >
            <legend>
              <h2>Gerais</h2>
            </legend>

            <Box>
              <div>
                <TextInput
                  w={130}
                  title="Número proposta SBA"
                  {...register('numero_proposta_SBA', {
                    valueAsNumber: true,
                  })}
                  defaultValue={dataAssociados.numero_proposta_SBA}
                />
              </div>
              <div>
                <TextInput
                  w={130}
                  title="Matrícula SAERJ"
                  {...register('matricula_SAERJ', {
                    valueAsNumber: true,
                  })}
                  defaultValue={dataAssociados.matricula_SAERJ}
                />
              </div>
              <div>
                <TextInput
                  w={130}
                  title="Matrícula SBA"
                  {...register('matricula_SBA', {
                    valueAsNumber: true,
                  })}
                  defaultValue={dataAssociados.matricula_SBA}
                />
              </div>
              <TextInput
                w={130}
                title="Categoria"
                {...register('categoria')}
                defaultValue={dataAssociados.categoria}
              />
            </Box>

            <Box>
              <div>
                <TextInput
                  w={130}
                  title="Residencia MEC-CNRM"
                  {...register('residencia_mec_cnrm')}
                  defaultValue={dataAssociados.residencia_mec_cnrm}
                />
              </div>
              <div>
                <TextInput
                  w={130}
                  title="Nível Residencia"
                  {...register('nivel_residencia')}
                  defaultValue={dataAssociados.nivel_residencia}
                />
              </div>
              <div>
                <TextInput
                  w={130}
                  title="Nome Hospital MEC"
                  {...register('nome_hospital_mec')}
                  defaultValue={dataAssociados.nome_hospital_mec}
                />
              </div>
              <div>
                <TextInput
                  w={130}
                  title="UF PRM"
                  {...register('uf_prm')}
                  defaultValue={dataAssociados.uf_prm}
                />
              </div>
              <div>
                <TextInput
                  w={130}
                  title="Comprovante Endereço"
                  {...register('comprovante_endereco')}
                  defaultValue={dataAssociados.comprovante_endereco}
                />
              </div>
              <div>
                <TextInput
                  w={180}
                  title="Carta Indicação 2 membros"
                  {...register('carta_indicacao_2_membros')}
                  defaultValue={dataAssociados.carta_indicacao_2_membros}
                />
              </div>

              <div>
                <TextInput
                  w={130}
                  title="Declaração Hospital"
                  {...register('declaracao_hospital')}
                  defaultValue={dataAssociados.declaracao_hospital}
                />
              </div>
            </Box>

            <Box>
              <div>
                <TextInput
                  w={130}
                  title="Diploma Medicina"
                  {...register('diploma_medicina')}
                  defaultValue={dataAssociados.diploma_medicina}
                />
              </div>

              <div>
                <TextInput
                  w={130}
                  title="Certidão Quitação CRM"
                  {...register('certidao_quitacao_crm')}
                  defaultValue={dataAssociados.certidao_quitacao_crm}
                />
              </div>
              <div>
                <TextInput
                  w={220}
                  title="Certificado Conclusão Especialização"
                  {...register('certificado_conclusao_especializacao')}
                  defaultValue={
                    dataAssociados.certificado_conclusao_especializacao
                  }
                />
              </div>
              <div>
                <TextInput
                  w={130}
                  title="Declaro Verdadeiras"
                  {...register('declaro_verdadeiras')}
                  defaultValue={dataAssociados.declaro_verdadeiras}
                />
              </div>
              <div>
                <TextInput
                  w={130}
                  title="Declaro Quite SAERJ"
                  {...register('declaro_quite_SAERJ')}
                  defaultValue={dataAssociados.declaro_quite_SAERJ}
                />
              </div>
              <div>
                <TextInput
                  w={130}
                  title="Pendências SAERJ"
                  {...register('pendencias_SAERJ')}
                  defaultValue={dataAssociados.pendencias_SAERJ}
                />
              </div>
              <div>
                <TextInput
                  w={150}
                  title="Nome Presidente Regional"
                  {...register('nome_presidente_regional')}
                  defaultValue={dataAssociados.nome_presidente_regional}
                />
              </div>

              <div>
                <TextInput
                  w={100}
                  title="Sigla Regional"
                  {...register('sigla_regional')}
                  defaultValue={dataAssociados.sigla_regional}
                />
              </div>
            </Box>
          </fieldset>

          <fieldset
            style={{
              border: 'solid 1px',
              padding: '2rem',
              marginTop: '-2rem',
              borderRadius: '8px',
            }}
          >
            <legend>
              <h2>Pessoais</h2>
            </legend>

            <Box>
              <div>
                <TextInput
                  w={130}
                  title="Nome Completo"
                  {...register('nome_completo')}
                  defaultValue={dataAssociados.nome_completo}
                />
              </div>
              <div>
                <TextInput
                  w={130}
                  title="CPF"
                  {...register('cpf')}
                  defaultValue={dataAssociados.cpf}
                />
              </div>
              <div>
                <TextInput
                  w={130}
                  title="Comprovante CPF"
                  {...register('comprovante_cpf')}
                  defaultValue={dataAssociados.comprovante_cpf}
                />
              </div>
              <div>
                <TextInput
                  w={130}
                  title="Data nascimento"
                  {...register('data_nascimento')}
                  defaultValue={dataAssociados.data_nascimento}
                />
              </div>
            </Box>

            <Box>
              <div>
                <TextInput
                  w={130}
                  title="Nome Profissional"
                  {...register('nome_profissional')}
                  defaultValue={dataAssociados.nome_profissional}
                />
              </div>
              <div>
                <TextInput
                  w={130}
                  title="Sexo"
                  {...register('sexo')}
                  defaultValue={dataAssociados.sexo}
                />
              </div>
              <div>
                <TextInput
                  w={130}
                  title="Situação"
                  {...register('situacao')}
                  defaultValue={dataAssociados.situacao}
                />
              </div>
              <div>
                <TextInput
                  w={130}
                  title="UF CRM"
                  {...register('uf_crm')}
                  defaultValue={dataAssociados.uf_crm}
                />
              </div>
              <div>
                <TextInput
                  w={130}
                  title="CRM"
                  {...register('crm')}
                  defaultValue={dataAssociados.crm}
                />
              </div>
            </Box>

            <Box>
              <div>
                <TextInput
                  w={220}
                  title="Nome Instituição de Ensino Graduação"
                  {...register('nome_instituicao_ensino_graduacao')}
                  defaultValue={
                    dataAssociados.nome_instituicao_ensino_graduacao
                  }
                />
              </div>
              <div>
                <TextInput
                  w={170}
                  title="Ano de Conclusão Graduação"
                  {...register('ano_conclusao_graduacao')}
                  defaultValue={dataAssociados.ano_conclusao_graduacao}
                />
              </div>
            </Box>
            <Box>
              <div>
                <TextInput
                  w={150}
                  title="Data Início Especialização"
                  {...register('data_inicio_especializacao')}
                  defaultValue={dataAssociados.data_inicio_especializacao}
                />
              </div>

              <div>
                <TextInput
                  w={150}
                  title="Data Previsão Conclusão"
                  {...register('data_previsao_conclusao')}
                  defaultValue={dataAssociados.data_previsao_conclusao}
                />
              </div>
            </Box>
          </fieldset>

          <fieldset
            style={{
              border: 'solid 1px',
              padding: '2rem',
              marginTop: '-2rem',
              borderRadius: '8px',
            }}
          >
            <legend>
              <h2>Endereço</h2>
            </legend>

            <Box>
              <div>
                <TextInput
                  w={130}
                  title="Cep *"
                  {...register('cep')}
                  defaultValue={dataAssociados.cep}
                />
              </div>

              <div>
                <TextInput
                  w={130}
                  title="Logradouro *"
                  {...register('logradouro')}
                  defaultValue={dataAssociados.logradouro}
                />
              </div>
              <div>
                <TextInput
                  w={130}
                  title="Número *"
                  {...register('numero', {
                    valueAsNumber: true,
                  })}
                  defaultValue={dataAssociados.numero}
                />
              </div>

              <div>
                <TextInput
                  w={130}
                  title="Complemento"
                  {...register('complemento')}
                  defaultValue={dataAssociados.complemento}
                />
              </div>
            </Box>

            <Box>
              <div>
                <TextInput
                  w={130}
                  title="Bairro *"
                  {...register('bairro')}
                  defaultValue={dataAssociados.bairro}
                />
              </div>

              <div>
                <TextInput
                  w={130}
                  title="Cidade *"
                  {...register('cidade')}
                  defaultValue={dataAssociados.cidade}
                />
              </div>

              <div>
                <TextInput
                  w={130}
                  title="UF *"
                  {...register('uf')}
                  defaultValue={dataAssociados.uf}
                />
              </div>

              <div>
                <TextInput
                  w={130}
                  title="País *"
                  {...register('pais')}
                  defaultValue={dataAssociados.pais}
                />
              </div>
            </Box>
          </fieldset>

          <fieldset
            style={{
              border: 'solid 1px',
              padding: '2rem',
              marginTop: '-2rem',
              borderRadius: '8px',
            }}
          >
            <legend>
              <h2>Contato</h2>
            </legend>

            <Box>
              <div>
                <TextInput
                  title="Telefone Celular"
                  {...register('telefone_celular')}
                  defaultValue={dataAssociados.telefone_celular}
                />
              </div>
              <div>
                <TextInput
                  title="Telefone Residencial"
                  {...register('telefone_residencial')}
                  defaultValue={dataAssociados.telefone_residencial}
                />
              </div>
              <div>
                <TextInput
                  title="Email"
                  {...register('email')}
                  defaultValue={dataAssociados.email}
                />
              </div>
            </Box>
          </fieldset>

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
    const data = await prisma.associados.findMany({
      where: {
        id: 1,
      },
    })

    const convertBigIntToString = (obj: any) => {
      return obj.map((item: any) => {
        const convertedItem: any = {}

        for (const key in item) {
          if (typeof item[key] === 'bigint') {
            convertedItem[key] = item[key].toString()
          } else if (item[key] instanceof Date) {
            // Se for um campo de data, converta para string usando toISOString
            convertedItem[key] = item[key].toISOString()
          } else {
            convertedItem[key] = item[key]
          }
        }

        return convertedItem
      })
    }

    return {
      props: {
        data: convertBigIntToString(data),
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
