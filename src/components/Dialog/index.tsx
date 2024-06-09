import Dialog from '@mui/material/Dialog'

export interface Props {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  setOpen: (value: boolean) => void
  closeOnBackdropClick?: boolean
}

export default function DialogComponent({
  children,
  open,
  setOpen,
  onClose,
  closeOnBackdropClick = true,
}: Props) {
  const handleClose = (event: any, reason: any) => {
    if (!closeOnBackdropClick && reason === 'backdropClick') return
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      {children}
    </Dialog>
  )
}
