import multer from 'multer'

const storage = multer.memoryStorage()

const fileFilter = (req: any, file: any, cb: any) => {
  if (
    file.mimetype === 'application/pdf' ||
    file.mimetype.startsWith('image/')
  ) {
    cb(null, true)
  } else {
    cb(new Error('Formato de arquivo não suportado'), false)
  }
}

const upload = multer({ storage, fileFilter })

export default upload
