import React, { useState } from 'react'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import { Button } from '../Button'
import { CircularProgress } from '@mui/material'

export default function TestConfirmationModal({
  open,
  onConfirm,
  onCancelOrClose,
  confirmationMessage,
}: any) {
  const [loader, setLoader] = useState(false)

  const handleOnConfirm = async (sendMultiple: boolean) => {
    setLoader(true)
    await onConfirm(sendMultiple)
    setLoader(false)
  }

  return (
    <Modal
      open={open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}
      >
        {!loader ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 10,
              marginTop: 10,
            }}
          >
            <p id="modal-modal-description" style={{ textAlign: 'center' }}>
              {confirmationMessage}
            </p>
          </div>
        ) : (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              marginTop: '1rem',
            }}
          >
            <CircularProgress color="primary" />
          </Box>
        )}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 10,
            marginTop: 30,
          }}
        >
          <Button
            style={{
              margin: '0px',
              fontSize: '12px',
              width: '6rem',
              border: 'solid 1px',
              padding: '0.5rem',
            }}
            title="E-mail único"
            onClick={() => handleOnConfirm(false)}
            disabled={loader}
          />
          <Button
            style={{
              margin: '0px',
              fontSize: '12px',
              width: '7.5rem',
              border: 'solid 1px',
              padding: '0.5rem',
            }}
            title="Múltiplos e-mails"
            onClick={() => handleOnConfirm(true)}
            disabled={loader}
          />
          <Button
            style={{
              margin: '0px',
              fontSize: '12px',
              width: '6rem',
              border: 'solid 1px',
              padding: '0.5rem',
            }}
            title="Cancelar"
            onClick={onCancelOrClose}
            disabled={loader}
          />
        </div>
      </Box>
    </Modal>
  )
}
