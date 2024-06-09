/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from '@/components/Button'
import { SwitchInput } from '@/components/SwitchInput'
import { TextInput } from '@/components/TextInput'
import { api } from '@/lib/axios'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ArrowBendDownLeft, CaretRight } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { z } from 'zod'
import { Box, Container } from './styled'
import { TextArea } from '@ignite-ui/react'
import { useEffect } from 'react'

const schemaCadastro = z.object({
  codigo_tabela: z.string().min(2, { message: 'Campo obrigatório' }),
  ocorrencia_tabela: z.string().min(2, { message: 'Campo obrigatório' }),
  complemento_ocorrencia_selecao: z.string(),
  ocorrencia_ativa: z.boolean(),
})

type SchemaCadastro = z.infer<typeof schemaCadastro>

export default function CadastroTabelas() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SchemaCadastro>({
    resolver: zodResolver(schemaCadastro),
  })

  async function OnSubmit(data: SchemaCadastro) {
    // console.log(data)
    try {
      await api.post('/tabelas/cadastro', { ...data })
      toast.success('Operação concluída com sucesso')
      router.push('/tabelas')
    } catch (error) {
      console.log(error)
      toast.error('Erro ao cadastrar a tabela...')
    }
  }

  // function initinalValue() {
  //   setValue('ocorrencia_ativa', true)
  // }
  // useEffect(() => {
  //   initinalValue()
  // }, [])
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
            <span>Incluir</span>
          </legend>
          <Box>
            <TextInput
              title="Código tabela *"
              {...register('codigo_tabela')}
              helperText={errors.codigo_tabela?.message}
              error={!!errors.codigo_tabela?.message}
            />
            <TextInput
              title="Ocorrência tabela *"
              {...register('ocorrencia_tabela')}
              helperText={errors.ocorrencia_tabela?.message}
              error={!!errors.ocorrencia_tabela?.message}
            />

            <SwitchInput
              title="Ocorrência Ativa?"
              defaultChecked={true}
              {...register('ocorrencia_ativa')}
            />
          </Box>
          {/* <Box>
            <TextInput
              title="Complemento ocorrência para seleção"
              {...register('complemento_ocorrencia_selecao')}
            />
          </Box> */}
          <Box>
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
            title={isSubmitting ? 'Enviando...' : 'Enviar'}
            type="submit"
            disabled={isSubmitting}
          />
        </fieldset>
      </form>
    </Container>
  )
}
