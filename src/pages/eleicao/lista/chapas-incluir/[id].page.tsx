import { Button } from '@/components/Button'
import DataGridDemo from '@/components/TableList'
import { useContextCustom } from '@/context'
import { prisma } from '@/lib/prisma'
import { GridColDef } from '@mui/x-data-grid'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import { z } from 'zod'
import { Box, Container } from './styled'
import { Chapas, Eleicoes } from '@prisma/client'
import { useForm } from 'react-hook-form'
import { SelectOptions } from '@/components/SelectOptions'
import format from 'date-fns/format'
import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowBendDownLeft, CaretRight } from 'phosphor-react'
import Link from 'next/link'
import { api } from '@/lib/axios'
import { Typography } from '@mui/material'
import { TextInput } from '@/components/TextInput'

interface VerChapasProps {
  data: Eleicoes[] // Defina o tipo correto para os dados recebidos do servidor
}

export default function IncluirChapas({ chapas, Eleicao }: any) {
  const [selects, setSelects] = useState([{ id: 0 }]) // Estado para gerenciar os SelectOptions
  const router = useRouter()
  const [eleicao, setEleicao] = useState(Eleicao)
  const { id } = router.query
  console.log(id)
  console.log(Eleicao.Chapas_Eleicoes)
  console.log(chapas)

  const chapasIds = Eleicao.Chapas_Eleicoes.map((chapa: any) => chapa.chapasId)

  // const chapasIncluidas = chapas.filter((chapa: any) =>
  //   chapasIds.includes(chapa.id),
  // )

  const chapasIncluidas = Eleicao.Chapas_Eleicoes.map((chapaEleicao: any) => ({
    id: chapaEleicao.id, // ID da relação Chapa_Eleicoes
    chapa: chapas.find((chapa: any) => chapa.id === chapaEleicao.chapasId), // Dados da chapa associada
  }))

  console.log(chapasIncluidas)
  console.log(chapasIncluidas)
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    control,
  } = useForm()

  const addSelect = () => {
    setSelects([...selects, { id: selects.length }]) // Adiciona um novo objeto com id único ao estado
  }

  const removeSelect = (id: number) => {
    setSelects(selects.filter((select) => select.id !== id)) // Remove o objeto com id correspondente do estado
  }

  async function handleOnSubmit(data: any) {
    console.log(data)
    const selectedLabels = Object.keys(data)
      .filter((key) => key.startsWith('chapa_id_'))
      .map((key) => data[key])

    const selectedIds = chapas
      .filter((chapa: any) => selectedLabels.includes(chapa.label))
      .map((chapa: any) => chapa.id)

    // console.log(selectedIds)

    try {
      await api.post('eleicao/relation-chapa-eleicao', {
        id: Number(Eleicao.id),
        Chapas: selectedIds,
      })
      toast.success('Operação concluída com sucesso')
      router.push(`/eleicao/lista/chapas-incluir/${id}`)
    } catch (error) {
      console.log(error)
    }
  }

  async function handleDeleteChapa(Id: number) {
    try {
      const response = await api.delete('eleicao/relation-chapa-eleicao', {
        data: {
          id: Number(Id),
        },
      })
      toast.success(`Atualizado com sucesso`)
      router.push(`/eleicao/lista/chapas-incluir/${id}`)
      console.log(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Container>
      <form onSubmit={handleSubmit(handleOnSubmit)}>
        <Box style={{ justifyContent: 'space-between' }}>
          <legend>
            <span>
              <Link href={'/eleicao/lista'}>Eleição</Link>
            </span>
            <CaretRight size={14} />
            <span>Incluir Chapa</span>
          </legend>
          <Link
            href="/eleicao/lista"
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

        <section>
          <Typography variant="h6" component="div">
            Informações sobre a eleição:
          </Typography>
          <div>
            <Box>
              <TextInput
                disabled={true}
                title={`Número eleição`}
                value={Eleicao.numero_eleicao}
              />
              <TextInput
                disabled={true}
                title={`Titúlo eleição`}
                value={Eleicao.titulo_eleicao}
              />
            </Box>
            <Box>
              <TextInput
                disabled={true}
                title={`Início da votação`}
                value={Eleicao.votacao_inicio}
              />
              <TextInput
                disabled={true}
                title={`Final da votação`}
                value={Eleicao.votacao_fim}
              />
            </Box>
            <Box>
              <TextInput
                disabled={true}
                title={`Início do mandatoo`}
                value={Eleicao.mandato_inicio}
              />
              <TextInput
                disabled={true}
                title={`Final do mandatoo`}
                value={Eleicao.mandato_fim}
              />
            </Box>
          </div>
        </section>

        <section>
          <Typography variant="h6" component="div">
            Chapas incluidas:
          </Typography>
          <Box style={{ justifyContent: 'flex-start' }}>
            {chapasIncluidas.map((chapa: any) => {
              return (
                <div key={chapa.id} style={{ display: 'flex' }}>
                  <TextInput
                    disabled={true}
                    title={`Chapa`}
                    value={chapa.chapa.label}
                  />
                  <Button
                    type="button"
                    title="Remover"
                    onClick={() => {
                      handleDeleteChapa(chapa.id)
                    }}
                    style={{ marginLeft: '8px' }}
                  />
                </div>
              )
            })}
          </Box>
        </section>

        <Box style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" component="div">
            Adicionar chapas na eleição
          </Typography>

          <Button
            type="button"
            title="Adicionar Chapa"
            onClick={addSelect}
            disabled={isSubmitting}
          />
        </Box>
        <Box
          style={{
            flexWrap: 'wrap',
            justifyContent: 'flex-start',
            paddingTop: '2rem',
            paddingBottom: '2rem',
          }}
        >
          {selects.map((select, index) => (
            <div
              key={select.id}
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <SelectOptions
                w={200}
                style={{ flex: 1 }}
                description={`Incluir Chapa ${index + 1}`}
                data={chapas}
                {...register(`chapa_id_${select.id}`)}
              />
              <Button
                type="button"
                title="Remover"
                onClick={() => removeSelect(select.id)}
                disabled={isSubmitting}
                style={{ marginLeft: '8px' }}
              />
            </div>
          ))}
        </Box>

        <Button
          style={{ width: '50%' }}
          title="Cadastrar chapas"
          type="submit"
          disabled={isSubmitting}
        />
      </form>
    </Container>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id }: any = context.params
  try {
    const eleicao = await prisma.eleicoes.findMany({
      where: {
        id: Number(id),
      },
      include: {
        Chapas_Eleicoes: true,
      },
    })

    const Eleicao = {
      ...eleicao[0],
      votacao_inicio:
        eleicao && format(new Date(eleicao[0].votacao_inicio), 'dd/MM/yyyy'),
      votacao_fim:
        eleicao && format(new Date(eleicao[0].votacao_fim), 'dd/MM/yyyy'),
      mandato_inicio:
        eleicao && format(new Date(eleicao[0].mandato_inicio), 'dd/MM/yyyy'),
      mandato_fim:
        eleicao && format(new Date(eleicao[0].mandato_fim), 'dd/MM/yyyy'),
    }

    const response = await prisma.chapas.findMany({
      select: {
        id: true,
        nome_chapa: true,
      },
    })

    const chapas = response.map((item: { nome_chapa: string; id: number }) => {
      return {
        label: item.nome_chapa,
        id: item.id,
      }
    })
    console.log(chapas)

    // const eleicoes = await prisma.eleicoes.findMany({
    //   where: {
    //     id: Number(id),
    //   },

    // })

    return {
      props: {
        chapas,
        Eleicao,
      },
    }
  } catch (error) {
    console.error('Erro ao obter dados da chapa:', error)
    return {
      props: {
        data: [],
      },
    }
  }
}
