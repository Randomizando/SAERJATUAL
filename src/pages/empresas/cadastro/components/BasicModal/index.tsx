/* eslint-disable react-hooks/exhaustive-deps */
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import { Button } from '@/components/Button'
import { useEffect, useState } from 'react'
import { api } from '@/lib/axios'
import { toast } from 'react-toastify'
import { useRouter } from 'next/router'

const style = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: '8px',
}
interface schema {
  valuesForm: any
}

export function BasicModal({ valuesForm }: schema) {
  const [open, setOpen] = useState<boolean>(false)
  const [data, setData] = useState()
  const router = useRouter()
  function handleIsActive(isActive: any) {
    setOpen(isActive)
  }

  async function OnSubmit() {
    try {
      const response = await api.post('empresa/cadastro', data)
      console.log(response.data)
      toast.success('Operação concluída com sucesso', {
        style: {
          width: '20rem',
        },
      })
      localStorage.removeItem('@modalStatus')
      return router.push('/empresas')
    } catch (error) {
      console.log(error)
      return toast.error('Ops, algo deu errado')
    }
  }

  const getStatusModal =
    typeof window !== 'undefined'
      ? localStorage.getItem('@modalStatus' || null)
      : null

  useEffect(() => {
    if (getStatusModal) {
      console.log(getStatusModal)
      handleIsActive(JSON.parse(getStatusModal))
    }
    if (valuesForm) {
      setData(valuesForm)
    }
  }, [getStatusModal])

  return (
    <div>
      <Modal
        open={open}
        onClose={handleIsActive}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Campos em vermelhos são obrigatórios ou estão inválidos ⚠️
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Confirma Atualização?
          </Typography>
          <Button title="Sim" onClick={OnSubmit} />
          <Button
            title="Não"
            onClick={() => {
              setOpen(false)
              localStorage.removeItem('@modalStatus')
            }}
          />
        </Box>
      </Modal>
    </div>
  )
}
