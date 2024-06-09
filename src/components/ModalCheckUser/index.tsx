import { api } from '@/lib/axios'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useRouter } from 'next/router'
import * as React from 'react'
import { toast } from 'react-toastify'
import { Button } from '@/components/Button'
import { Container } from './styled'
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
interface schemaModal {
  title: string
  bgColor?: string
  data: any
  routeDelete?: string
  fnDelete?: () => void
  redirectRouter?: string
  plural?: boolean
  message: string
}

export default function ModalCheckUser({
  title,
  bgColor,
  data,
  routeDelete,
  redirectRouter,
  fnDelete,
  plural = true,
  message,
}: schemaModal) {
  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const checkAuthenticate = false

  const router = useRouter()
  async function handleDeleteItemsSelected(data: any) {
    try {
      await api.delete(`${routeDelete}`, { data })
      setOpen(false)
      toast.success('Operação concluída com sucesso')
      router.push(`${redirectRouter}`)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <Button
        type="button"
        style={{ backgroundColor: `${bgColor}` }}
        title={title}
        onClick={() => {
          if (data.length === 0) {
            toast.warn('Selecione um item para Excluir')
          } else {
            handleOpen()
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
          <Typography id="modal-modal-title" component="p">
            {checkAuthenticate
              ? plural
                ? `Você deseja realmente excluir o(s) ${data.length} registro(s) selecionado(s)?`
                : 'Você deseja realmente excluir esse item?'
              : message}
          </Typography>
          {checkAuthenticate ? (
            <>
              <Button
                type="button"
                title="Sim"
                onClick={() => {
                  routeDelete
                    ? handleDeleteItemsSelected(data)
                    : fnDelete && fnDelete()
                  handleClose()
                }}
              />
            </>
          ) : null}

          <Button
            type="button"
            title={checkAuthenticate ? 'Não' : 'Ok'}
            onClick={handleClose}
          />
        </Box>
      </Container>
    </div>
  )
}
