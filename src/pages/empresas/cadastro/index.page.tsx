import { Container, Box } from './styled'
import React, { useEffect, useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { GetStaticProps } from 'next'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/Button'
import { api } from '@/lib/axios'
import axios from 'axios'
import { TextInput } from '@/components/TextInput'
import { SelectOptions } from '@/components/SelectOptions'
import { SwitchInput } from '@/components/SwitchInput'
import { ArrowBendDownLeft, CaretRight } from 'phosphor-react'
import Link from 'next/link'
import { toast } from 'react-toastify'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/router'
import { TextAreaInput } from '../atualizar/styled'
import { BasicModal } from './components/BasicModal'
import { FormError } from '@/pages/pagamentos/cadastro/styled'

interface schemaTipoEmpresa {
  id: number
  codigo_tabela: string
  ocorrencia_tabela: string
  complemento_ocorrencia_selecao: string
  ocorrencia_ativa: boolean
}
interface schemaEndereco {
  id: number
  codigo_tabela: string
  ocorrencia_tabela: string
  complemento_ocorrencia_selecao: string
  ocorrencia_ativa: boolean
}
interface schemaTratamento {
  id: number
  codigo_tabela: string
  ocorrencia_tabela: string
  complemento_ocorrencia_selecao: string
  ocorrencia_ativa: boolean
}
interface schemaCargo {
  id: number
  codigo_tabela: string
  ocorrencia_tabela: string
  complemento_ocorrencia_selecao: string
  ocorrencia_ativa: boolean
}
interface schemaEmpresasProps {
  dataTipoEmpresa: schemaTipoEmpresa[]
  dataBairro: schemaEndereco[]
  dataCidade: schemaEndereco[]
  dataUf: schemaEndereco[]
  dataPais: schemaEndereco[]
  dataCargo: schemaCargo[]
  dataTratamento: schemaTratamento[]
}

interface schemaParametros {
  id: number
  random: string
  cep_invalido: boolean
  data_limite_pgto_antecipado_anuidade: Date
  percent_desc_pgto_antecipado_anuidade: number
  taxa_pgto_atrasado_anuidade: number
  parcelamento_permitido_anuidade: string
  data_limite_pgto_antecipado_JAER: Date
  percent_desc_pgto_antecipado_JAER: number
  taxa_pgto_atrasado_JAER: number
  parcelamento_permitido_JAER: string
  presidente_pode_se_reeleger: boolean
  demais_podem_se_reeleger: true
  duracao_mandato: number
  exite_listas_imediato: boolean
  quantidade_linhas_listas: number
  acesso_externo_sis: boolean
  endereco_IP_primario: string
  endereco_IP_secundario: string
  permitir_dado_invalido: boolean
}

const schemaEmpresaForm = z.object({
  cod_empresa: z.string().min(1, { message: 'Campo obrigatório' }),
  tipo_empresa: z.string(),
  patrocinadora: z.boolean(),
  faculdade_anestesiologia: z.boolean(),
  empresa_ativa: z.boolean(),
  cnpj: z.string(),
  razao_social: z.string(),
  nome_fantasia: z.string().min(4, { message: 'Campo obrigatório' }),
  cep: z.string(),
  logradouro: z.string(),
  numero: z.string(),
  complemento: z.string(),
  cidade: z.string(),
  pais: z.string(),
  bairro: z.string(),
  uf: z.string(),
  telefone_comercial: z.string(),
  tratamento_contato_primario: z.string(),
  nome_contato_primario: z.string(),
  cargo_contato_primario: z.string(),
  email_contato_primario: z.string(),
  telefone_contato_primario: z.string(),
  tratamento_contato_secundario: z.string(),
  nome_contato_secundario: z.string(),
  cargo_contato_secundario: z.string(),
  email_contato_secundario: z.string(),
  telefone_contato_secundario: z.string(),

  home_page: z.string(),
  inscricao_estadual: z.string(),
  inscricao_municipal: z.string(),
  observacoes: z.string(),
})

type SchemaEmpresaForm = z.infer<typeof schemaEmpresaForm>

interface schemaFormError {
  razao_social: { message: string | boolean }
  cep: { message: string | boolean }
  logradouro: { message: string | boolean }
  numero: { message: string | boolean }
  cidade: { message: string | boolean }
  pais: { message: string | boolean }
  bairro: { message: string | boolean }
  uf: { message: string | boolean }
  nome_contato_primario: { message: string | boolean }
  nome_fantasia: { message: string | boolean }
  tipo_empresa: { message: string | boolean }
  cod_empresa: { message: string | boolean }
  cnpj: { message: string | boolean }
}
export default function Empresas({
  dataTipoEmpresa,
  dataUf,
  dataPais,
  dataCargo,
  dataTratamento,
}: schemaEmpresasProps) {
  const [parametros, setParametros] = useState<schemaParametros>()
  const [valoresFormulario, setValoresFormulario] = useState()
  const [errorsForm, setErrorsForm] = useState<schemaFormError>()
  const [disabledAddressEdition, setDisabledAddressEdition] = useState(false)

  const router = useRouter()
  const newDataTipoEmpresa = dataTipoEmpresa?.map((item) => {
    return {
      label: item.ocorrencia_tabela,
      id: item.id,
    }
  })

  const newDataUf = dataUf?.map((item) => {
    return {
      label: item.ocorrencia_tabela,
      id: item.id,
    }
  })

  const newDataPais = dataPais?.map((item) => {
    return {
      label: item.ocorrencia_tabela,
      id: item.id,
    }
  })

  const newDataCargo = dataCargo?.map((item) => {
    return {
      label: item.ocorrencia_tabela,
      id: item.id,
    }
  })

  const newDataTratamento = dataTratamento?.map((item) => {
    return {
      label: item.ocorrencia_tabela,
      id: item.id,
    }
  })

  async function handleGetAllParams(): Promise<void> {
    try {
      const response = await api.get('/parametros')
      setParametros(response.data[0])
    } catch (error) {
      console.log(error)
    }
  }

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<SchemaEmpresaForm>({
    resolver: zodResolver(schemaEmpresaForm),
  })

  async function handleOnSubmit(data: SchemaEmpresaForm) {
    try {
      const checkTamanhoCnpj = data.cnpj.replace(/[^\d]/g, '')
      const checkTamanhoCep = data.cep.replace(/[^\d]/g, '')

      data.telefone_comercial = data.telefone_comercial.replace(/[^\d]/g, '')
      data.telefone_contato_primario = data.telefone_contato_primario.replace(
        /[^\d]/g,
        '',
      )
      data.telefone_contato_secundario =
        data.telefone_contato_secundario.replace(/[^\d]/g, '')

      const response = await handleCheckCnpj(checkTamanhoCnpj)

      if (response?.data.message === 'CNPJ inválido') {
        return response
      }

      if (parametros?.permitir_dado_invalido === true) {
        if (
          data.razao_social !== '' &&
          data.cod_empresa !== '' &&
          data.cep !== '' &&
          data.logradouro !== '' &&
          data.numero !== '' &&
          data.cidade !== '' &&
          data.nome_fantasia !== '' &&
          data.pais !== '' &&
          data.bairro !== '' &&
          data.uf !== '' &&
          data.nome_contato_primario !== '' &&
          data.cnpj !== '' &&
          data.tipo_empresa !== ''
        ) {
          await api.put('/empresa/cadastro', {
            ...data,
          })
          toast.success('Operação concluída com sucesso', {
            style: {
              width: '20rem',
            },
          })
          return router.push('/empresas')
        }

        setErrorsForm({
          razao_social:
            data.razao_social !== ''
              ? { message: false }
              : { message: 'Campo obrigatório' },
          cep:
            data.cep !== ''
              ? { message: false }
              : { message: 'Campo obrigatório' },
          logradouro:
            data.logradouro !== ''
              ? { message: false }
              : { message: 'Campo obrigatório' },
          numero:
            data.numero !== ''
              ? { message: false }
              : { message: 'Campo obrigatório' },
          cidade:
            data.cidade !== ''
              ? { message: false }
              : { message: 'Campo obrigatório' },
          pais:
            data.pais !== ''
              ? { message: false }
              : { message: 'Campo obrigatório' },
          bairro:
            data.bairro !== ''
              ? { message: false }
              : { message: 'Campo obrigatório' },
          uf:
            data.uf !== ''
              ? { message: false }
              : { message: 'Campo obrigatório' },
          nome_contato_primario:
            data.nome_contato_primario !== ''
              ? { message: false }
              : { message: 'Campo obrigatório' },
          nome_fantasia:
            data.nome_fantasia !== ''
              ? { message: false }
              : { message: 'Campo obrigatório' },
          tipo_empresa:
            data.nome_fantasia !== ''
              ? { message: false }
              : { message: 'Campo obrigatório' },
          cod_empresa:
            data.cod_empresa !== ''
              ? { message: false }
              : { message: 'Campo obrigatório' },
          cnpj:
            data.cnpj !== ''
              ? { message: false }
              : { message: 'Campo obrigatório' },
        })
        localStorage.setItem('@modalStatus', 'true')
        const valuesForm = {
          ...(data as any),
        }
        setValoresFormulario(valuesForm)
      } else {
        if (
          data.razao_social !== '' &&
          data.cod_empresa !== '' &&
          data.cep !== '' &&
          data.logradouro !== '' &&
          data.numero !== '' &&
          data.cidade !== '' &&
          data.nome_fantasia !== '' &&
          data.pais !== '' &&
          data.bairro !== '' &&
          data.uf !== '' &&
          data.nome_contato_primario !== '' &&
          data.cnpj !== '' &&
          data.tipo_empresa !== ''
        ) {
          await api.put('/empresa/cadastro', {
            ...data,
            cnpj: checkTamanhoCnpj,
            cepValue: checkTamanhoCep,
          })
          toast.success('Operação concluída com sucesso', {
            style: {
              width: '20rem',
            },
          })
          return router.push('/empresas')
        }

        setErrorsForm({
          razao_social: { message: 'Campo obrigatório' },
          nome_fantasia: { message: 'Campo obrigatório' },
          cep: { message: 'Campo obrigatório' },
          cod_empresa: { message: 'Campo obrigatório' },
          logradouro: { message: 'Campo obrigatório' },
          numero: { message: 'Campo obrigatório' },
          cidade: { message: 'Campo obrigatório' },
          pais: { message: 'Campo obrigatório' },
          bairro: { message: 'Campo obrigatório' },
          uf: { message: 'Campo obrigatório' },
          nome_contato_primario: { message: 'Campo obrigatório' },
          tipo_empresa: { message: 'Campo obrigatório' },
          cnpj: { message: 'Campo obrigatório' },
        })
        if (checkTamanhoCnpj.length !== 14 && checkTamanhoCep.length !== 8) {
          return toast.warn('CNPJ inválido')
        }
        return toast.warn('Campos obrigatórios')
      }

      // await api.post('/empresa/cadastro', { ...data })
    } catch (error) {
      console.log(error)
      return toast.error('Ops algo deu errado...')
    }
  }

  const cepValue = watch('cep')
  const cnpj = watch('cnpj')

  // API VIA CEP
  async function handleCheckCep(cep: string) {
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`)
      checkedViaCep(response.data)
    } catch (error) {
      console.log(error)
      toast.warn('Cep inválido')
      setValue('bairro', '')
      setValue('cidade', '')
      setValue('uf', '')
      setValue('logradouro', '')
      setValue('pais', '')
    }
  }

  async function handleCheckCnpj(cnpj: any) {
    try {
      const ClaerCnpj = cnpj.replace(/[^\d]/g, '')
      const response = await api.get(`/util/checkCnpj?cnpj=${ClaerCnpj}`)
      // console.log(response)
      if (response.data.message) {
        toast.warn('CNPJ Inválido')
      } else {
        toast.success('CNPJ Válido')
      }

      return response
    } catch (error) {
      console.log(error)
    }
  }

  function checkedViaCep(dataViaCep: any) {
    if (dataViaCep.erro === true) {
      setDisabledAddressEdition(false)

      if (parametros?.cep_invalido === true) {
        toast.warn('você optou: aceitar cep inválido')
      } else {
        toast.warn('você optou: não aceitar cep inválido')
      }
      toast.warn('Cep inválido')
      setValue('bairro', '')
      setValue('cidade', '')
      setValue('uf', '')
      setValue('logradouro', '')
      setValue('pais', '')
    } else {
      setDisabledAddressEdition(!!dataViaCep.logradouro)
      setValue('bairro', dataViaCep.bairro)
      setValue('cidade', dataViaCep.localidade)
      setValue('uf', dataViaCep.uf)
      setValue('logradouro', dataViaCep.logradouro)
      setValue('pais', 'Brasil')
    }
  }

  useEffect(() => {
    handleGetAllParams()
  }, [])

  return (
    <Container>
      <BasicModal valuesForm={valoresFormulario} />

      <form onSubmit={handleSubmit(handleOnSubmit)}>
        <Box style={{ justifyContent: 'end' }}>
          <Link
            href="/empresas"
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
            <span>
              <Link href={'/empresas'}>Empresas</Link>
            </span>
            <CaretRight size={14} />
            <span>Incluir</span>
          </legend>
          <Box>
            <TextInput
              title="Codigo Empresa *"
              quantidadeCaracteres={20}
              {...register('cod_empresa')}
              helperText={errors?.cod_empresa?.message}
              error={!!errors?.cod_empresa?.message}
            />

            <SelectOptions
              description="Tipo Empresa"
              data={newDataTipoEmpresa}
              w={280}
              {...register('tipo_empresa')}
            />

            <SwitchInput
              title="Patrocinadora?"
              {...register('patrocinadora')}
            />

            <SwitchInput
              title="Faculdade Anestesiologia?"
              {...register('faculdade_anestesiologia')}
            />

            <SwitchInput
              title="Empresa Ativa?"
              {...register('empresa_ativa')}
            />
          </Box>

          <Box>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <TextInput
                title="CNPJ *"
                {...register('cnpj')}
                helperText={errorsForm?.cnpj?.message}
                error={!!errorsForm?.cnpj?.message}
                mask="99.999.999/9999-99"
              />
              <Button
                type="button"
                onClick={() => {
                  handleCheckCnpj(cnpj)
                }}
                title="Validar"
                style={{
                  margin: '0px',
                  width: '100%',
                  fontSize: '12px',
                }}
              />
            </div>

            <TextInput
              title="Razao Social *"
              {...register('razao_social')}
              helperText={errorsForm?.razao_social?.message}
              error={!!errorsForm?.razao_social?.message}
              quantidadeCaracteres={150}
            />
            <TextInput
              title="Nome Fantasia *"
              {...register('nome_fantasia')}
              helperText={errors?.nome_fantasia?.message}
              error={!!errors?.nome_fantasia?.message}
              quantidadeCaracteres={150}
            />
            <div>
              <TextInput
                w={150}
                title="Inscrição Estadual"
                {...register('inscricao_estadual')}
              />
            </div>

            <div>
              <TextInput
                w={150}
                title="Inscrição Municipal"
                {...register('inscricao_municipal')}
              />
            </div>
          </Box>
          <Box>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <TextInput
                title="Cep *"
                {...register('cep')}
                helperText={errorsForm?.cep?.message}
                error={!!errorsForm?.cep?.message}
                mask="99999-999"
              />
              <Button
                type="button"
                onClick={() => {
                  handleCheckCep(cepValue)
                }}
                title="Buscar"
                style={{
                  margin: '0px',
                  width: '100%',
                  fontSize: '12px',
                }}
              />
            </div>

            <TextInput
              w={'100%'}
              title="Logradouro *"
              {...register('logradouro')}
              quantidadeCaracteres={50}
              disabled={disabledAddressEdition}
              helperText={errorsForm?.logradouro?.message}
              error={!!errorsForm?.logradouro?.message}
            />
            <div style={{ width: '8%' }}>
              <TextInput
                title="Número *"
                {...register('numero')}
                w="40"
                helperText={errorsForm?.numero?.message}
                error={!!errorsForm?.numero?.message}
              />
            </div>

            <TextInput
              title="Complemento"
              {...register('complemento')}
              quantidadeCaracteres={50}
            />
          </Box>

          <Box>
            <TextInput
              w={450}
              title="Bairro *"
              {...register('bairro')}
              quantidadeCaracteres={50}
              disabled={disabledAddressEdition}
              helperText={errorsForm?.bairro?.message}
              error={!!errorsForm?.bairro?.message}
            />

            <TextInput
              title="Cidade *"
              {...register('cidade')}
              quantidadeCaracteres={50}
              disabled={disabledAddressEdition}
              helperText={errorsForm?.cidade?.message}
              error={!!errorsForm?.cidade?.message}
            />

            <div style={{ display: 'none' }}>
              <TextInput
                title="UF *"
                {...register('uf')}
                error={!!errorsForm?.uf?.message}
                helperText={errorsForm?.uf?.message}
              />
            </div>

            <div>
              <SelectOptions
                w={75}
                description="UF *"
                data={newDataUf}
                isDisabled={disabledAddressEdition}
                {...register('uf')}
              />
              <FormError>{errorsForm?.uf?.message}</FormError>
            </div>

            <div style={{ display: 'none' }}>
              <TextInput
                title="País *"
                {...register('pais')}
                error={!!errorsForm?.pais?.message}
                helperText={errorsForm?.pais?.message}
              />
            </div>

            <div>
              <SelectOptions
                w={140}
                description="País *"
                data={newDataPais}
                isDisabled={disabledAddressEdition}
                {...register('pais')}
              />
              <FormError>{errorsForm?.pais?.message}</FormError>
            </div>

            <TextInput
              type="text"
              w={'100%'}
              title="Telefone Comercial"
              mask="(99) 9999-9999"
              {...register('telefone_comercial')}
              quantidadeCaracteres={150}
            />
          </Box>

          <Box>
            <TextInput
              type="text"
              title="Nome do Contato Primario *"
              {...register('nome_contato_primario')}
              helperText={errorsForm?.nome_contato_primario?.message}
              error={!!errorsForm?.nome_contato_primario?.message}
              quantidadeCaracteres={150}
            />

            <SelectOptions
              description="Tratamento"
              data={newDataTratamento}
              w={300}
              {...register('tratamento_contato_primario')}
              quantidadeCaracteres={150}
            />
            <SelectOptions
              description="Cargo"
              data={newDataCargo}
              w={180}
              {...register('cargo_contato_primario')}
              quantidadeCaracteres={150}
            />
          </Box>

          <Box>
            <div>
              <TextInput
                w={180}
                type="text"
                title="Telefone"
                mask="(99) 9.9999-9999"
                {...register('telefone_contato_primario')}
              />
            </div>
            <TextInput
              w={300}
              type="text"
              title="Email"
              {...register('email_contato_primario')}
              quantidadeCaracteres={150}
            />
          </Box>

          <Box>
            <TextInput
              type="text"
              title="Nome do Contato Secundario"
              {...register('nome_contato_secundario')}
              quantidadeCaracteres={150}
            />

            <SelectOptions
              data={newDataTratamento}
              w={300}
              description="Tratamento"
              {...register('tratamento_contato_secundario')}
            />
            <SelectOptions
              data={newDataCargo}
              description="Cargo"
              w={180}
              {...register('cargo_contato_secundario')}
            />
          </Box>

          <Box>
            <div>
              <TextInput
                type="text"
                w={180}
                title="Telefone"
                mask="(99) 9.9999-9999"
                {...register('telefone_contato_secundario')}
              />
            </div>
            <TextInput
              w={300}
              type="email"
              title="Email"
              {...register('email_contato_secundario')}
              quantidadeCaracteres={150}
            />
          </Box>

          <TextInput
            title="Home Page"
            {...register('home_page')}
            quantidadeCaracteres={225}
          />

          <Box>
            <label
              style={{
                display: 'flex',
                flexDirection: 'column',
                fontFamily: 'Roboto',
                fontSize: '12px',
                color: 'rgba(0, 0, 0, 0.6)',
                width: '100%',
              }}
            >
              Observações
              <TextAreaInput {...register('observacoes')} />
            </label>
          </Box>

          <Button
            title={isSubmitting ? 'Enviando...' : 'Enviar'}
            type="submit"
            disabled={isSubmitting}
          />
        </fieldset>
      </form>
    </Container>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const dataTipoEmpresa = await prisma.tabelas.findMany({
      where: {
        codigo_tabela: 'Tipo_Empresa',
      },
    })

    const dataUf = await prisma.tabelas
      .findMany({
        select: {
          id: true,
          ocorrencia_tabela: true,
        },
        where: {
          codigo_tabela: 'UF',
          ocorrencia_ativa: true,
        },
      })
      .then((result) =>
        result.sort((a, b) => {
          const parsedA = a.ocorrencia_tabela.toLowerCase()
          const parsedB = b.ocorrencia_tabela.toLowerCase()

          if (parsedA < parsedB) return -1 // Se A vem antes de B
          if (parsedA > parsedB) return 1 // Se B vem antes de A
          return 0 // Se A e B são iguais
        }),
      )

    const dataPais = await prisma.tabelas.findMany({
      where: {
        codigo_tabela: 'pais',
      },
    })

    const dataCargo = await prisma.tabelas.findMany({
      where: {
        codigo_tabela: 'Cargos_Empresa',
      },
    })
    const dataTratamento = await prisma.tabelas.findMany({
      where: {
        codigo_tabela: 'Tratamento',
      },
    })
    return {
      props: {
        dataTipoEmpresa,
        dataUf,
        dataPais,
        dataCargo,
        dataTratamento,
      },
    }
  } catch (error) {
    console.error('Erro ao obter dados de tipo de empresa:', error)
    return {
      props: {
        dataTipoEmpresa: [],
        dataUf: [],
        dataPais: [],
        dataCargo: [],
        dataTratamento: [],
      },
    }
  } finally {
    prisma.$disconnect()
  }
}
