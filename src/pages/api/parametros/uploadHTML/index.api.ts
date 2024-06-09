import fs from 'fs'
import formidable from 'formidable'
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next'
import path from 'path'

export const config = {
  api: {
    bodyParser: false,
  },
}

const uploadDir = path.join(process.cwd(), '/public/upload/e-mail')
const deleteExistingFile = async (): Promise<void> => {
  try {
    const files = await fs.promises.readdir(uploadDir)
    if (files.length > 0) {
      const filePath = path.join(uploadDir, files[0])
      await fs.promises.unlink(filePath)
    }
  } catch (error: any) {
    throw new Error('Erro ao excluir arquivo existente: ' + error.message)
  }
}

const readFile = (
  req: NextApiRequest,
  saveLocally?: boolean,
): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
  const options: formidable.Options = {}

  if (saveLocally) {
    options.uploadDir = uploadDir
    options.keepExtensions = true
    options.filename = function (req, file) {
      return req + file
    }
  }

  const form = formidable(options)
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err)
      resolve({ fields, files })
    })
  })
}

const handler: NextApiHandler = async (req, res) => {
  try {
    await fs.promises.mkdir(uploadDir, { recursive: true })
  } catch (err) {
    console.error('Erro ao criar o diretório:', err)
    return res.status(500).json({ error: 'Erro ao criar o diretório' })
  }
  try {
    await deleteExistingFile()
    await readFile(req, true)
    res.json({ done: 'ok' })
  } catch (err) {
    console.error('Erro ao processar o arquivo:', err)
    return res.status(500).json({ error: 'Erro ao processar o arquivo' })
  }
}

export default handler
