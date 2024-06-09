import upload from '@/lib/multerConfig'
import fs from 'fs'
import type { NextApiRequest, NextApiResponse } from 'next'
import path from 'path'

export const config = {
  api: {
    bodyParser: false,
  },
}

type FilePhoto = {
  fieldname: string
  originalname: string
  encoding: string
  mimetype: string
  buffer: Buffer
  size: number
  membro_chapa: string
}

const multFiles = upload.array('anexos')

export default async function handler(
  req: NextApiRequest & { files: Record<string, FilePhoto[]> } & any,
  res: NextApiResponse & any,
) {
  try {
    multFiles(req, res, (err) => {
      const file = req.files[0]
      if (err) {
        console.error(err)
        return res
          .status(400)
          .json({ success: false, error: 'Erro ao processar o arquivo' })
      }

      // Verifica as extensoes
      const accepetedFilesExtensions = ['png', 'jpeg']
      const extensionFileName = req.files[0]

      const acceptedFilesExtensions = req.files.find((file: FilePhoto) => {
        const extension = file.mimetype.split('/')[1]
        if (!accepetedFilesExtensions.includes(extension)) {
          return true
        }
      })

      if (acceptedFilesExtensions) {
        return res.status(400).json({
          success: false,
          error: 'Somente arquivos do tipo png ou jpeg são aceitos.',
        })
      }

      // Formata nome arquivo para evitar duplicidades
      req.files.forEach((file: FilePhoto) => {
        const getTypePhoto = file.mimetype.split('/')[1]
        file.originalname =
          file.originalname
            .replace(/\s/g, '')
            .replace(/(\.png)|(\.jpeg)|(\.jpg)/g, '') + `.jpeg`
      })

      const namesFiles: string[][] = []

      // Salva arquivo na pasta images
      req.files.forEach((file: FilePhoto) => {
        const chapa = file.originalname.split('-')[0]

        try {
          const dir = fs.statSync(
            path.resolve('./', 'public', 'upload', 'images', `${chapa}`),
          )
        } catch (error) {
          fs.mkdirSync(
            path.resolve('./', 'public', 'upload', 'images', `${chapa}`),
          )
          console.log(error)
        }

        const pathDir = path.join(
          process.cwd(),
          `public/upload/images/${chapa}`,
          `${file.originalname.split('-')[1]}`,
        )
        namesFiles.push(file.originalname.split('-'))
        try {
          fs.writeFileSync(pathDir, file.buffer)
        } catch (err) {
          console.log(err)
        }
      })
      return res.status(201).json(namesFiles)
    })
  } catch (error) {
    console.log(error)
    return res.status(404)
  }
}
