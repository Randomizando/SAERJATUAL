import Dialog from '@/components/Dialog'
import {
  BoxCandidates,
  BoxOptionName,
  BoxOptions,
  CanditateName,
  CanditatePosition,
  Checkbox,
  ConfirmationModal,
  Container,
  NulableButton,
  WelcomeModal,
  WhiteButton,
  OutlinedButton,
  VotationButton,
  PopUpButton,
  Box,
  ContainerInside,
} from './styled'
import { Avatar, Typography } from '@mui/material'
import { Button } from '@/components/Button'
import { useEffect, useState } from 'react'
import { api } from '@/lib/axios'
import { GetServerSideProps } from 'next'
import { prisma } from '@/lib/prisma'
import { ExibirReciboVoto } from '@/utils/voteReceipt'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { ArrowBendDownLeft } from 'phosphor-react'

type Votation = {
  data: any
}

export default function Votacao({ data }: Votation) {
  const [open, setOpen] = useState(true)
  const [showVotation, setShowVotation] = useState(false)
  const [showVoteReceipt, setShowVoteReceipt] = useState(false)
  const [selected, setSelected] = useState('' as any)
  const [votation, setVotation] = useState(data)
  const router = useRouter()
  const today = new Date()
  const yesterday = today.setDate(today.getDate() - 1) // sem esse cálculo o dia de encerramento é considerado já encerrado
  const votationIsOver = new Date(votation?.votacao_fim) < new Date(yesterday)

  const handleClick = (item: string) => {
    if (votationIsOver) {
      return
    }
    setShowVotation(true)
    setSelected(item)
  }

  const genareteVoteReceipt = async () => {
    setShowVoteReceipt(true)
    setShowVotation(false)
    await api.post('/votos/cadastro', {
      nome_chapa: selected,
      votacao_id: votation.id,
      usuario_id: 1,
    })
  }

  const saveVotaionInPdf = () => {
    ExibirReciboVoto({
      nome: 'Roberto da Silva',
      cpf: '857.260.010-87',
      matricula_saerj: votation?.titulo_eleicao,
      chapaVote: selected,
      autenticacao: '0x0000000',
    })
  }

  const expandCandidates = (index: number) => {
    const expanded = votation.chapas.chapas.map((item: any, i: number) => {
      if (i === index) {
        return {
          ...item,
          expandend: !item.expandend,
        }
      }
      return item
    })

    setVotation({
      ...votation,
      chapas: {
        chapas: expanded,
      },
    })
  }

  const revertVote = () => {
    setShowVotation(false)
    setSelected('')
  }

  const reset = () => {
    setShowVoteReceipt(false)
    setShowVotation(false)
    setOpen(true)
    setSelected('')
  }

  useEffect(() => {
    // Adiciona a verificação de categoria no frontend
    const verifyUserCategory = async () => {
      try {
        const response = await api.get('/api/user')
        const user = response.data

        if (user.categoria !== 'Ativo' && user.categoria !== 'Remido') {
          router.push('/not-authorized')
        }
      } catch (error) {
        console.error('Erro ao verificar categoria do usuário:', error)
      }
    }

    verifyUserCategory()
  }, [router])

  if (showVoteReceipt) {
    return (
      <Container>
        <Box style={{ justifyContent: 'end' }}>
          <Link
            href="/"
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
        <div
          style={{
            maxWidth: 700,
            margin: '20px auto',
            padding: '1.2rem',
          }}
        >
          <h1
            style={{
              textAlign: 'center',
              marginBottom: 32,
            }}
          >
            Comprovante de votação
          </h1>
          <div>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Nome: Roberto da Silva
            </Typography>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              CPF: 857.260.010-87
            </Typography>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Eleição: {votation?.titulo_eleicao}
            </Typography>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Chapa Votada: {selected}
            </Typography>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Autentication: 0x0000000
            </Typography>
          </div>

          <div
            style={{
              display: 'flex',
              gap: 10,
            }}
          >
            <div
              onClick={saveVotaionInPdf}
              style={{ width: '60%', margin: 'auto' }}
            >
              <Button title="Imprimir / Salvar" />
            </div>
          </div>
        </div>
      </Container>
    )
  }

  return (
    <Container>
      <Box style={{ justifyContent: 'end' }}>
        <Link
          href="/"
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

      <h1 style={{ textAlign: 'center' }}>
        Votação {votation?.titulo_eleicao}
      </h1>

      <Dialog open={open} onClose={() => setOpen(false)} setOpen={setOpen}>
        <WelcomeModal>
          {(votation && !votationIsOver && (
            <div>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Bem-Vindo as Eleições {votation?.titulo_eleicaoj}
              </Typography>

              <Typography id="modal-modal-title" variant="h6" component="h2">
                Perído de Votação
              </Typography>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Início :{' '}
                {new Date(votation?.votacao_inicio).toLocaleDateString()}
              </Typography>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Encerramento:{' '}
                {new Date(votation?.votacao_fim).toLocaleDateString()}
              </Typography>

              <PopUpButton
                style={{
                  backgroundColor: 'rgb(82, 128, 53)',
                }}
                onClick={() => setOpen(false)}
              >
                Ver votação
              </PopUpButton>
            </div>
          )) ||
            (votationIsOver && (
              <div>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Bem-Vindo as Eleições da SAERJ
                </Typography>

                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Ainda não existe nenhuma eleição ativa
                </Typography>

                <PopUpButton
                  style={{
                    backgroundColor: '#528035',
                  }}
                  onClick={() => router.push(`/eleicao/resultado/${data?.id}`)}
                >
                  Ver resultado
                </PopUpButton>
                <PopUpButton
                  style={{
                    backgroundColor: '#0DA9A4',
                  }}
                  onClick={() => setOpen(false)}
                >
                  Prosseguir
                </PopUpButton>
              </div>
            )) || (
              <div>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Bem-Vindo as Eleições da SAERJ
                </Typography>

                <Typography id="modal-modal-title" variant="h6" component="h2">
                  Ainda não existe nenhuma eleição ativa
                </Typography>
                <PopUpButton
                  style={{
                    backgroundColor: '#0DA9A4',
                  }}
                  onClick={() => setOpen(false)}
                >
                  Prosseguir
                </PopUpButton>
              </div>
            )}
        </WelcomeModal>
      </Dialog>

      <Dialog
        closeOnBackdropClick={false}
        open={showVotation}
        onClose={() => setShowVotation(false)}
        setOpen={setShowVotation}
      >
        <ConfirmationModal>
          <Typography variant="h6" component="h2">
            Confirmar o envio do voto?
          </Typography>

          <Typography variant="h6" component="h5">
            Após a confirmação, não será possível alterar o voto.
          </Typography>

          <VotationButton
            style={{
              backgroundColor: 'rgb(82, 128, 53)',
            }}
            onClick={genareteVoteReceipt}
          >
            CONFIRMA
          </VotationButton>

          <VotationButton
            onClick={revertVote}
            style={{
              backgroundColor: '#ED7D31',
            }}
          >
            CORRIGE
          </VotationButton>
        </ConfirmationModal>
      </Dialog>

      <ContainerInside>
        {votation &&
          votation.chapas?.map((item: any, index: number) => (
            <>
              <div key={index}>
                <BoxOptions>
                  <Checkbox
                    onClick={() => handleClick(item.nome_chapa)}
                    type="radio"
                    name="voto"
                    value="1"
                    checked={selected === item.nome_chapa}
                  />

                  <div style={{ flex: 1 }}>
                    <BoxOptionName onClick={() => expandCandidates(index)}>
                      <p>{item.nome_chapa}</p>

                      <Typography
                        onClick={() => expandCandidates(index)}
                        id="modal-modal-title"
                        variant="h6"
                        component="h2"
                      >
                        +
                      </Typography>
                    </BoxOptionName>

                    {item.expandend && (
                      <div>
                        {item.membros_chapa.map(
                          (canditate: any, index: number) => (
                            <BoxCandidates key={index}>
                              <Avatar
                                alt="Remy Sharp"
                                src={`${item.nome_chapa}/${canditate.image}`}
                              />

                              <CanditateName>{canditate.nome}</CanditateName>
                              <CanditatePosition>
                                {canditate.cargo}
                              </CanditatePosition>
                            </BoxCandidates>
                          ),
                        )}
                      </div>
                    )}
                  </div>
                </BoxOptions>
              </div>
            </>
          ))}

        {votation && (
          <>
            <BoxOptions>
              <Checkbox
                onClick={() => handleClick('BRANCO')}
                checked={selected === 'BRANCO'}
                type="radio"
              />

              <WhiteButton>
                <p>BRANCO</p>
              </WhiteButton>
            </BoxOptions>

            <BoxOptions>
              <Checkbox
                onClick={() => handleClick('NULO')}
                type="radio"
                name="voto"
                checked={selected === 'NULO'}
              />

              <NulableButton>
                <p>NULO</p>
              </NulableButton>
            </BoxOptions>
          </>
        )}
      </ContainerInside>

      {!votation && (
        <Typography style={{ textAlign: 'center' }} variant="h6" component="h2">
          Ainda não existe nenhuma eleição ativa para votação, volte mais tarde.
        </Typography>
      )}
    </Container>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    let data = await prisma.eleicoes.findFirst({
      where: {
        status: 'ATIVA',
      },
    })

    if (!data) return { props: { data: null } }

    data = JSON.parse(JSON.stringify(data))

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
  } finally {
    prisma.$disconnect()
  }
}
