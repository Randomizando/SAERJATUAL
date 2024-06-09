import { Container, Box, TextAreaInput } from './styled'
import React, { useEffect, useState } from 'react'
import { z } from 'zod'
import { GetServerSideProps } from 'next'
import { prisma } from '@/lib/prisma'
import { TextInput } from '@/components/TextInput'
import { SwitchInput } from '@/components/SwitchInput'
import { CaretRight } from 'phosphor-react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/Button'
import { SelectOptions } from '@/components/SelectOptions'
import { api } from '@/lib/axios'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import axios from 'axios'
import { BackPage } from '@/components/BackPage'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormError } from '@/pages/pagamentos/cadastro/styled'
import { BasicModal } from './components/BasicModal'

const schemaEmpresaForm = z.object({
  id: z.number(),
  cod_empresa: z.string(),
  tipo_empresa: z.string(),
  patrocinadora: z.boolean(),
  faculdade_anestesiologia: z.boolean(),
  empresa_ativa: z.boolean(),
  cnpj: z.string(),
  razao_social: z.string(),
  nome_fantasia: z.string(),
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

interface shemaTabelas {
  id: number
  codigo_tabela: string
  ocorrencia_tabela: string
  complemento_ocorrencia_selecao: string
  ocorrencia_ativa: boolean
}
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
export default function Vizualizar({
  data,
  dataTipoEmpresa,
  dataUf,
  dataPais,
  dataCargo,
  dataTratamento,
}: any) {
  const router = useRouter()
  const [valoresFormulario, setValoresFormulario] = useState()
  const [parametros, setParametros] = useState<any>()
  const [disabledButtonCep, setDisabledButtonCep] = useState(false)
  const [disabledAddressEdition, setDisabledAddressEdition] = useState(true)
  const [errorsForm, setErrorsForm] = useState<schemaFormError>()

  const newDataTipoEmpresa = dataTipoEmpresa?.map((item: shemaTabelas) => {
    return {
      label: item.ocorrencia_tabela,
      id: item.id,
    }
  })

  const newDataUf = dataUf?.map((item: shemaTabelas) => {
    return {
      label: item.ocorrencia_tabela,
      id: item.id,
    }
  })

  const newDataPais = dataPais?.map((item: shemaTabelas) => {
    return {
      label: item.ocorrencia_tabela,
      id: item.id,
    }
  })

  const newDataCargo = dataCargo?.map((item: shemaTabelas) => {
    return {
      label: item.ocorrencia_tabela,
      id: item.id,
    }
  })

  const newDataTratamento = dataTratamento?.map((item: shemaTabelas) => {
    return {
      label: item.ocorrencia_tabela,
      id: item.id,
    }
  })

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<SchemaEmpresaForm>({
    resolver: zodResolver(schemaEmpresaForm),
  })

  // function checkErrors(errors) {
  //   const valuesErrors = () => {
  //     setValue('razao_social', 'xxxxx')
  //     setValue('cep', 'xxxxx')
  //     setValue('logradouro', 'xxxxx')
  //     setValue('numero', 'xxxxx')
  //     setValue('cidade', 'xxxxx')
  //     setValue('pais', 'xxxxx')
  //     setValue('bairro', 'xxxxx')
  //     setValue('uf', 'xxxxx')
  //   }

  //   if (
  //     errors.razao_social.message === '' ||
  //     errors.cep.message === '' ||
  //     errors.logradouro.message === '' ||
  //     errors.numero.message === '' ||
  //     errors.cidade.message === '' ||
  //     errors.pais.message === '' ||
  //     errors.bairro.message === '' ||
  //     errors.uf.message === '' ||
  //     errors.nome_contato_primario.message === ''
  //   ) {

  //   }
  // }

  async function OnSubmit(data: any) {
    const checkTamanhoCnpj = data.cnpj.replace(/[^\d]/g, '')
    const checkTamanhoCep = data.cep.replace(/[^\d]/g, '')
    if (disabledButtonCep === true) {
      return toast.warn('Não é possivel atualizar com CEP inválido')
    }

    try {
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
          await api.put('/empresa/update', {
            cnpj: checkTamanhoCnpj,
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
          cnpj: '',
          ...data,
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
          await api.put('/empresa/update', {
            cnpj: checkTamanhoCnpj,
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
      // const filteredErrors = Object.fromEntries(
      //   Object.entries(errorsForm).filter(([key, value]) => value.message !== false)
      // );

      // }
      // } else {
      //   if (parametros?.permitir_dado_invalido === false) {

      //     if (checkTamanhoCnpj === '') {
      //       localStorage.setItem('@modalStatus', 'true')
      //       const valuesForm = {
      //         cnpj: '',
      //         ...data,
      //       }
      //       return setValoresFormulario(valuesForm)
      //     }
      //   } else {
      //     if (parametros?.permitir_dado_invalido === false) {
      //       if (checkTamanhoCnpj === '') {
      //         return toast.warn('CNPJ inválido')
      //       }
      //     }
      //   }
      // }
    } catch (error) {
      console.log(error)
    }
  }
  // console.log(errorsForm)

  // API VIA CEP
  const cepValue = watch('cep')
  async function handleCheckCep(cep: any) {
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

  async function handleGetAllParams(): Promise<void> {
    try {
      const response = await api.get('/parametros')
      setParametros(response.data[0])
    } catch (error) {
      console.log(error)
    }
  }

  function checkedViaCep(dataViaCep: any) {
    if (dataViaCep.erro === true) {
      setDisabledAddressEdition(false)

      if (parametros?.cep_invalido === true) {
        toast.warn('Você optou: aceitar cep inválido')
      } else {
        setDisabledButtonCep(true)
        toast.warn('Você optou: não aceitar cep inválido')
        toast('Botão Enviar Desabilitado!')
      }
      toast.warn('Cep inválido')
      setValue('bairro', '')
      setValue('cidade', '')
      setValue('uf', '')
      setValue('logradouro', '')
      setValue('pais', '')
    } else {
      setDisabledButtonCep(false)
      setDisabledAddressEdition(!!dataViaCep.logradouro)
      setValue('bairro', dataViaCep.bairro)
      setValue('cidade', dataViaCep.localidade)
      setValue('uf', dataViaCep.uf)
      setValue('logradouro', dataViaCep.logradouro)
      setValue('pais', 'Brasil')
    }
  }
  // VALIDAR CNPJ
  const cnpj = watch('cnpj')
  async function handleCheckCnpj(cnpj: any) {
    try {
      const response = await api.get(`/util/checkCnpj?cnpj=${cnpj}`)
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
  function setInitialValues() {
    setValue('id', data.id)
    setValue('cod_empresa', data.cod_empresa || '')
    setValue('nome_fantasia', data.nome_fantasia || '')
    setValue('cnpj', data.cnpj || '')
    setValue('telefone_comercial', data.telefone_comercial || '')
    setValue('razao_social', data.razao_social || '')
    setValue('tipo_empresa', data.tipo_empresa || '')
    setValue('cep', data.cep || '')
    setValue('logradouro', data.logradouro || '')
    setValue('complemento', data.complemento || '')
    setValue('numero', data.numero || '')
    setValue('bairro', data.bairro || '')
    setValue('cidade', data.cidade || '')
    setValue('pais', data.pais || 'Brasil')
    setValue('uf', data.uf || '')
    setValue('nome_contato_primario', data.nome_contato_primario || '')
    setValue(
      'tratamento_contato_primario',
      data.tratamento_contato_primario || '',
    )
    setValue('cargo_contato_primario', data.cargo_contato_primario || '')
    setValue('email_contato_primario', data.email_contato_primario || '')
    setValue('telefone_contato_primario', data.telefone_contato_primario || '')
    setValue('nome_contato_secundario', data.nome_contato_secundario || '')
    setValue(
      'tratamento_contato_secundario',
      data.tratamento_contato_secundario || '',
    )
    setValue('cargo_contato_secundario', data.cargo_contato_secundario || '')
    setValue('email_contato_secundario', data.email_contato_secundario || '')
    setValue(
      'telefone_contato_secundario',
      data.telefone_contato_secundario || '',
    )
  }

  useEffect(() => {
    setInitialValues()
    handleGetAllParams()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <Container>
      <BasicModal valuesForm={valoresFormulario} />
      <form onSubmit={handleSubmit(OnSubmit)}>
        <BackPage backRoute="empresas" />
        <fieldset>
          <legend>
            {/* <input type="hidden" {...register('id')} value={Number(data.id)} /> */}
            <span>
              <Link href={'/empresas'}>Empresas</Link>
            </span>
            <CaretRight size={14} />
            <span>Ver/Atualizar</span>
          </legend>
          <Box>
            {/* <div>
              <TextInput w={60} title="ID" {...register('id')} disabled />
            </div> */}
            <div style={{ width: '10%' }}>
              <TextInput
                title="Codigo Empresa *"
                {...register('cod_empresa')}
                quantidadeCaracteres={20}
                error={!!errorsForm?.cod_empresa?.message}
                helperText={errorsForm?.cod_empresa?.message}
              />
            </div>

            <SelectOptions
              description="Tipo Empresa"
              data={newDataTipoEmpresa}
              quantidadeCaracteres={150}
              w={280}
              {...register('tipo_empresa')}
              defaultValue={{ label: data.tipo_empresa }}
            />

            <SwitchInput
              title="Patrocinadora?"
              {...register('patrocinadora')}
              defaultChecked={data.patrocinadora}
            />

            <SwitchInput
              title="Faculdade Anestesiologia?"
              {...register('faculdade_anestesiologia')}
              defaultChecked={data.faculdade_anestesiologia}
            />
            <SwitchInput
              title="Empresa Ativa?"
              {...register('empresa_ativa')}
              defaultChecked={data.empresa_ativa}
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
                mask="99.999.999/9999-99"
                error={!!errorsForm?.cnpj?.message}
                helperText={errorsForm?.cnpj?.message}
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
              title="Nome Fantasia *"
              {...register('nome_fantasia')}
              error={!!errorsForm?.nome_fantasia?.message}
              helperText={errorsForm?.nome_fantasia?.message}
            />

            <TextInput
              title="Razao Social *"
              {...register('razao_social')}
              error={!!errorsForm?.razao_social.message}
              helperText={errorsForm?.razao_social.message}
            />
            {/* <TextInput title="CNPJ" {...register('cnpj')} /> */}
            <div>
              <TextInput
                w={150}
                title="Inscrição Estadual"
                {...register('inscricao_estadual')}
                defaultValue={data.inscricao_estadual}
                quantidadeCaracteres={20}
              />
            </div>
            <div>
              <TextInput
                w={150}
                title="Inscrição Municipal"
                {...register('inscricao_municipal')}
                defaultValue={data.inscricao_municipal}
                quantidadeCaracteres={20}
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
                mask="99999-999"
                error={!!errorsForm?.cep?.message}
                helperText={errorsForm?.cep?.message}
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
              title="Logadouro *"
              disabled={disabledAddressEdition}
              {...register('logradouro')}
              quantidadeCaracteres={50}
              error={!!errorsForm?.logradouro?.message}
              helperText={errorsForm?.logradouro?.message}
            />
            <div style={{ width: '8%' }}>
              <TextInput
                title="Numero *"
                {...register('numero')}
                error={!!errorsForm?.numero?.message}
                helperText={errorsForm?.numero?.message}
              />
            </div>
            <TextInput
              title="Complemento"
              {...register('complemento')}
              quantidadeCaracteres={50}
            />
          </Box>

          <Box>
            <div>
              <TextInput
                w={450}
                title="Bairro *"
                disabled={disabledAddressEdition}
                {...register('bairro')}
                quantidadeCaracteres={50}
                error={!!errorsForm?.bairro?.message}
                helperText={errorsForm?.bairro?.message}
              />
            </div>

            <TextInput
              title="Cidade *"
              disabled={disabledAddressEdition}
              {...register('cidade')}
              error={!!errorsForm?.cidade?.message}
              helperText={errorsForm?.cidade?.message}
              quantidadeCaracteres={50}
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
                defaultValue={{
                  label: data.uf,
                }}
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
                defaultValue={{
                  label: data.pais,
                }}
                isDisabled={disabledAddressEdition}
                {...register('pais')}
              />
              <FormError>{errorsForm?.pais?.message}</FormError>
            </div>

            <div style={{ width: '15%' }}>
              <TextInput
                type="text"
                title="Telefone Comercial"
                mask="(99) 9999-9999"
                {...register('telefone_comercial')}
              />
            </div>
          </Box>

          <Box>
            <TextInput
              title="Nome do Contato Primario *"
              {...register('nome_contato_primario')}
              quantidadeCaracteres={150}
              error={!!errorsForm?.nome_contato_primario?.message}
              helperText={errorsForm?.nome_contato_primario?.message}
            />
            <SelectOptions
              description="Tratamento"
              data={newDataTratamento}
              w={300}
              {...register('tratamento_contato_primario')}
              defaultValue={{
                label: data.tratamento_contato_primario
                  ? data.tratamento_contato_primario
                  : '',
              }}
            />
            <SelectOptions
              description="Cargo"
              data={newDataCargo}
              w={180}
              {...register('cargo_contato_primario')}
              defaultValue={{
                label: data.cargo_contato_primario
                  ? data.cargo_contato_primario
                  : '',
              }}
            />
          </Box>

          <Box>
            <div>
              <TextInput
                type="email"
                title="Email"
                {...register('email_contato_primario')}
                quantidadeCaracteres={150}
              />
            </div>
            <div>
              <TextInput
                type="text"
                title="Telefone"
                mask="(99) 9.9999-9999"
                {...register('telefone_contato_primario')}
                quantidadeCaracteres={150}
              />
            </div>
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
              defaultValue={{
                label: data.tratamento_contato_secundario
                  ? data.tratamento_contato_secundario
                  : '',
              }}
            />
            {/* <TextInput
              title="Cargo"
              {...register('cargo_contato_secundario')}
            /> */}
            <SelectOptions
              data={newDataCargo}
              description="Cargo"
              w={180}
              {...register('cargo_contato_secundario')}
              defaultValue={{
                label: data.cargo_contato_secundario
                  ? data.cargo_contato_secundario
                  : '',
              }}
            />
          </Box>

          <Box>
            <div>
              <TextInput
                type="text"
                title="Email"
                {...register('email_contato_secundario')}
                quantidadeCaracteres={150}
              />
            </div>
            <div>
              <TextInput
                type="text"
                title="Telefone"
                mask="(99) 9.9999-9999"
                {...register('telefone_contato_secundario')}
              />
            </div>
          </Box>
          <TextInput
            title="Home Page"
            w="100%"
            {...register('home_page')}
            defaultValue={data.home_page}
            quantidadeCaracteres={150}
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
              <TextAreaInput
                {...register('observacoes')}
                defaultValue={data.observacoes}
                quantidadeCaracteres={150}
              />
            </label>
          </Box>

          <Button
            title={isSubmitting ? 'Enviando...' : 'Atualizar'}
            type="submit"
            disabled={isSubmitting}
          />
        </fieldset>
      </form>
    </Container>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id }: any = context.params

  try {
    const data = await prisma.empresa.findFirst({
      where: {
        id: Number(id),
      },
    })

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
        data,
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
        data: [],
      },
    }
  } finally {
    prisma.$disconnect()
  }
}
