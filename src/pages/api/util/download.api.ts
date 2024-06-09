// api/download.ts
import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { fileName } = req.body

  // Correção no caminho do arquivo
  const filePath = path.resolve(process.cwd(), 'upload', fileName)

  console.log('Caminho do arquivo:', filePath)

  try {
    // Verificar se o arquivo existe
    await fs.promises.access(filePath, fs.constants.F_OK)

    // Configurar os headers
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`)

    // Criar e enviar o stream do arquivo
    const fileStream = fs.createReadStream(filePath)
    fileStream.pipe(res)
  } catch (error) {
    console.error('Erro ao servir o arquivo:', error)
    res.status(404).end('Not Found')
  }
}
