// pages/api/verificarPasta.js

import fs from 'fs'
import path from 'path'
import { NextApiRequest, NextApiResponse } from 'next'

const pastaPath = 'public/upload/e-mail'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const pastaExiste = fs.existsSync(pastaPath)

    if (!pastaExiste) {
      res.status(404).json({ error: 'A pasta não existe' })
      return
    }

    const arquivos = fs.readdirSync(pastaPath)

    if (arquivos.length === 0) {
      res.status(404).json({ error: 'A pasta está vazia' })
      return
    }

    // Lendo o conteúdo de um arquivo específico
    const primeiroArquivo = arquivos[0]
    const arquivoPath = path.join(pastaPath, primeiroArquivo)
    const conteudoArquivo = fs.readFileSync(arquivoPath, 'utf-8')

    res.status(200).json({ arquivos, conteudoArquivo })
  } catch (error) {
    console.error('Erro ao verificar pasta:', error)
    res.status(500).json({ error: 'Erro interno do servidor' })
  }
}
