/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from '@/components/Button'
import { SwitchInput } from '@/components/SwitchInput'
import { TextInput } from '@/components/TextInput'
import { api } from '@/lib/axios'
import { prisma } from '@/lib/prisma'
import { GetServerSideProps } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ArrowBendDownLeft, CaretRight } from 'phosphor-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { z } from 'zod'
import { Box, Container } from './styled'
import { TextArea } from '@ignite-ui/react'

const schemaCargos = z.object({
  id: z.number(),
  codigo_tabela: z.string(),
  ocorrencia_tabela: z.string(),
  complemento_ocorrencia_selecao: z.string(),
  ocorrencia_ativa: z.string(),
})

type SchemaCategoria = z.infer<typeof schemaCargos>

interface schemaCategoria {
  data: SchemaCategoria
}

export default function Vizualizar({ data }: schemaCategoria) {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { isSubmitting, errors },
  } = useForm<SchemaCategoria>()

  async function OnSubmit(data: SchemaCategoria) {
    try {
      if (data.codigo_tabela === '' && data.ocorrencia_tabela === '') {
        setError('codigo_tabela', {
          type: 'manual',
          message: 'Campo Obrigatório',
        })
        setError('ocorrencia_tabela', {
          type: 'manual',
          message: 'Campo Obrigatório',
        })
        return
      }
      if (data.codigo_tabela === '') {
        return setError('codigo_tabela', {
          type: 'manual',
          message: 'Campo Obrigatório',
        })
      }
      if (data.ocorrencia_tabela === '') {
        return setError('ocorrencia_tabela', {
          type: 'manual',
          message: 'Campo Obrigatório',
        })
      }
      await api.put('/tabelas/update', { ...data })
      toast.success('Operação concluída com sucesso')

      // await new Promise(resolve => setTimeout(resolve, 6000));

      router.push('/tabelas')
    } catch (error) {
      console.log(error)
      toast.success('Oops... algo deu errado!')
    }
  }

  useEffect(() => {
    setValue('id', data.id)
    setValue('codigo_tabela', data.codigo_tabela || '')
    setValue('ocorrencia_tabela', data.ocorrencia_tabela || '')
    setValue(
      'complemento_ocorrencia_selecao',
      data.complemento_ocorrencia_selecao,
    )
  }, [])

  return (
    <Container>
      <form onSubmit={handleSubmit(OnSubmit)}>
        <Box style={{ justifyContent: 'flex-end' }}>
          <Link
            href="/tabelas"
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
              <Link href={'/tabelas'}>Tabelas</Link>
            </span>
            <CaretRight size={14} />
            {/* <Link href={'/tabelas/tratamentos'}>Tratamento</Link>
            <CaretRight size={14} /> */}
            <span>Ver/Atualizar</span>
          </legend>
          <Box>
            <TextInput
              title="Código tabela"
              {...register('codigo_tabela')}
              helperText={errors.codigo_tabela?.message}
              error={!!errors.codigo_tabela?.message}
            />
            <TextInput
              title="Ocorrência tabela"
              {...register('ocorrencia_tabela')}
              helperText={errors.ocorrencia_tabela?.message}
              error={!!errors.ocorrencia_tabela?.message}
            />
            <SwitchInput
              title="Ocorrência Ativa?"
              defaultChecked={data.ocorrencia_ativa}
              {...register('ocorrencia_ativa')}
            />
          </Box>

          <Box>
            {/* <TextInput
              title="Complemento ocorrência para seleção"
              {...register('complemento_ocorrencia_selecao')}
            /> */}
            <label
              style={{
                display: 'flex',
                flexDirection: 'column',
                color: 'rgba(0, 0, 0, 0.6)',
                fontFamily: 'Roboto',
                width: '100%',
              }}
            >
              Complemento ocorrência para seleção
              <TextArea
                style={{
                  backgroundColor: 'white',
                  color: 'rgba(0, 0, 0, 0.6)',
                  border: 'solid 1px rgba(82, 82, 82, 0.6)',
                }}
                {...register('complemento_ocorrencia_selecao')}
              />
            </label>
          </Box>
          <Button
            title={isSubmitting ? 'Atualizando...' : 'Atualizar'}
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
    const data = await prisma.tabelas.findFirst({
      where: {
        id: Number(id),
      },
    })
    return {
      props: {
        data,
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
