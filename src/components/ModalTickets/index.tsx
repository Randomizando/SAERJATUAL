import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Container } from './styled'
import { Button } from '../Button'
import { api } from '@/lib/axios'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { EtiquetaPDFCompany } from '@/utils/ticketsCompany'
import { Modal } from '@mui/material'
import { Button as ButtonModal } from '@ignite-ui/react'

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #f3f3f3',
  boxShadow: 24,
  p: 4,
  borderRadius: '8px',
}

interface EtiquetaProps {
  id: number
  cod_empresa?: string
  tipo_empresa?: string
  patrocinadora?: boolean
  faculdade_anestesiologia?: boolean
  empresa_ativa?: boolean
  cnpj?: string
  razao_social?: string
  nome_fantasia?: string
  cep?: string
  logradouro?: string
  numero?: number
  complemento?: string
  cidade?: string
  uf?: string
  pais?: string
  bairro?: string
  telefone_comercial?: string
  tratamento_contato_primario?: string
  nome_contato_primario?: string
  cargo_contato_primario?: string
  email_contato_primario?: string
  telefone_contato_primario?: string
  tratamento_contato_secundario?: string
  nome_contato_secundario?: string
  cargo_contato_secundario?: string
  email_contato_secundario?: string
  telefone_contato_secundario?: string
  home_page?: string
  inscricao_estadual?: string
  inscricao_municipal?: string
  observacoes?: string
}

interface schemaModal {
  title: string
  bgColor?: string
  data: any
  route?: any
}
export default function ModalTickets({
  title,
  bgColor,
  route,
  data,
}: schemaModal) {
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const [openConfirma, setOpenConfirma] = useState(false)
  const handleOpenConfirma = () => setOpenConfirma(true)
  const handleCloseConfirma = () => setOpenConfirma(false)

  const gerarEtiqueta = (primario: boolean) => {
    EtiquetaPDFCompany(data, primario)
  }

  return (
    <div
      style={{
        textWrap: 'nowrap',
        display: 'flex',
        alignItems: 'end',
        justifyContent: 'center',
      }}
    >
      <Button
        style={{
          backgroundColor: `${bgColor}`,
          margin: '0px',
          fontSize: '12px',
          border: 'solid 1px',
          padding: '0.5rem',
        }}
        title={title}
        onClick={() => {
          if (data.length === 0) {
            toast.warn('Selecione um item para gerar etiqueta.')
          } else {
            handleOpenConfirma()
          }
        }}
      />
      <Container
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Deseja emitir etiquetas para contato primária ou secundário?
          </Typography>
          <Button
            title="Primário"
            onClick={() => {
              gerarEtiqueta(true)
              handleClose()
            }}
          />
          <Button
            title="Secundário"
            onClick={() => {
              gerarEtiqueta(false)
              handleClose()
            }}
          />
        </Box>
      </Container>

      <Modal
        open={openConfirma}
        onClose={handleCloseConfirma}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: 'absolute' as const,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            p: 4,
          }}
        >
          <p style={{ fontFamily: 'Roboto' }}>
            Confirma a impressão de etiquetas para as empresas selecionadas?
          </p>
          <Box
            style={{
              marginTop: '1.5rem',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'flex-end',
              justifyContent: 'center',
              gap: '2rem',
              width: '100%',
            }}
          >
            <ButtonModal
              style={{
                padding: '0.5rem',
                height: 'auto',
                backgroundColor: '#0DA9A4',
              }}
              onClick={() => {
                handleOpen()
                handleCloseConfirma()
              }}
            >
              Ok
            </ButtonModal>
            <ButtonModal
              style={{
                padding: '0.5rem',
                height: 'auto',
                backgroundColor: '#0DA9A4',
              }}
              onClick={handleCloseConfirma}
            >
              Cancelar
            </ButtonModal>
          </Box>
        </Box>
      </Modal>
    </div>
  )
}
