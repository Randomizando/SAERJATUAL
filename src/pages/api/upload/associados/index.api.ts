import upload from '@/lib/multerConfig'
import { prisma } from '@/lib/prisma'
import { saveSingleFile } from '@/utils/fileSave'
import { rm } from 'fs'
import type { NextApiRequest, NextApiResponse } from 'next'
import { join } from 'path'

export const config = {
  api: {
    bodyParser: false,
  },
}

interface MulterFile {
  fieldname: string
  originalname: string
  encoding: string
  mimetype: string
  buffer: Buffer
  size: number
}

interface Fields {
  comprovante_cpf?: string
  comprovante_endereco?: string
  carta_indicacao_2_membros?: string
  certidao_quitacao_crm?: string
  certificado_conclusao_especializacao?: string
  declaracao_hospital?: string
  diploma_medicina?: string
}

const multerUpload = upload.fields([
  { name: 'comprovante_cpf', maxCount: 1 },
  { name: 'comprovante_endereco', maxCount: 1 },
  { name: 'carta_indicacao_2_membros', maxCount: 1 },
  { name: 'certidao_quitacao_crm', maxCount: 1 },
  { name: 'certificado_conclusao_especializacao', maxCount: 1 },
  { name: 'declaracao_hospital', maxCount: 1 },
  { name: 'diploma_medicina', maxCount: 1 },
])

function generateRandomCode(): string {
  const min = 100000 // Mínimo valor de 6 dígitos
  const max = 999999 // Máximo valor de 6 dígitos
  const randomCode = Math.floor(Math.random() * (max - min + 1)) + min

  return String(randomCode)
}

export default async function handler(
  req: NextApiRequest & { files: Record<string, MulterFile[]> } & any,
  res: NextApiResponse & any,
) {
  try {
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Método não permitido' })
    }

    if (!Number(req.headers.id)) {
      return res.status(400).json({ message: 'ID não encontrado' })
    }

    multerUpload(req, res, async (err: any) => {
      if (err) {
        return res
          .status(400)
          .json({ success: false, error: 'Erro ao processar o arquivo' })
      }

      const fileFields = [
        'comprovante_cpf',
        'comprovante_endereco',
        'carta_indicacao_2_membros',
        'certidao_quitacao_crm',
        'certificado_conclusao_especializacao',
        'declaracao_hospital',
        'diploma_medicina',
      ]

      const isNotPdf = fileFields.some((field) => {
        const file = req.files[field]?.[0]
        return file && file.mimetype !== 'application/pdf'
      })

      if (isNotPdf) {
        return res.status(400).json({
          success: false,
          error: 'Todos os arquivos devem ser no formato PDF.',
        })
      }

      const timestamp = new Date().getTime()
      const idRamdom = generateRandomCode()

      const files = fileFields.map((field) => {
        if (req.files[field]?.[0]) {
          return {
            fieldname: field,
            filename: `${field.toUpperCase()}_ID-${idRamdom}${timestamp}.pdf`,
            originalname: req.files[field]?.[0].originalname,
            buffer: req.files[field]?.[0].buffer,
          }
        }
      })

      const filesError: string[] = []
      const filesSaved: any = {}

      files.forEach((file) => {
        if (file) {
          try {
            saveSingleFile(file.filename, file.buffer)
            filesSaved[file.fieldname] = file.filename
          } catch (error) {
            return filesError.push(file.fieldname)
          }
        }
      })

      if (Object.keys(filesSaved)) {
        const actualFiles = await prisma.associados.findUnique({
          where: {
            id: Number(req.headers.id),
          },
          select: {
            comprovante_cpf: true,
            comprovante_endereco: true,
            carta_indicacao_2_membros: true,
            certidao_quitacao_crm: true,
            certificado_conclusao_especializacao: true,
            declaracao_hospital: true,
            diploma_medicina: true,
          },
        })

        const fileNames = Object.entries(actualFiles!).filter(([key]) =>
          Object.keys(filesSaved).includes(key),
        )

        fileNames.forEach(([key, value]) => {
          if (value) {
            const annexUploadPath = join(process.cwd(), 'public/upload', value!)

            rm(annexUploadPath, () => {})
          }
        })

        await prisma.associados.update({
          where: {
            id: Number(req.headers.id),
          },
          data: filesSaved as Fields,
        })

        return res
          .status(200)
          .json({ success: true, errorInFiles: filesError, filesSaved })
      }
    })
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: 'Erro ao lidar com os arquivos' })
  }
}
