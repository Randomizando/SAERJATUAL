import { File, IncomingForm } from 'formidable'
import fs from 'fs'
import { NextApiRequest, NextApiResponse } from 'next'
import path from 'path'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    throw new Error('Método inválido.')
  }

  const form = new IncomingForm()

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Erro ao processar formulário:', err)
      res.status(500).json({ error: 'Erro ao processar formulário.' })
      return
    }

    const pastaDestino = 'public/upload'
    const nomesArquivosSalvos: string[] = []

    // Função para salvar um arquivo
    const salvarArquivo = (file: File, tipoArquivo: string) => {
      return new Promise<void>((resolve, reject) => {
        if (!file.originalFilename) {
          reject(new Error('Nome do arquivo original não encontrado.'))
          return
        }

        // const novoNome = `${tipoArquivo}_${file.originalFilename}${path.extname(file.originalFilename)}`;
        const novoNome = `${tipoArquivo}_${file.originalFilename}`
        const novoCaminho = path.join(pastaDestino, novoNome)

        // Renomear e mover arquivo
        fs.rename(file.filepath, novoCaminho, (err) => {
          if (err) {
            console.error(
              `Erro ao renomear o arquivo ${file.originalFilename}:`,
              err,
            )
            reject(err)
          } else {
            console.log(
              `Arquivo ${file.originalFilename} renomeado para ${novoNome} e salvo em ${pastaDestino}`,
            )
            nomesArquivosSalvos.push(novoNome)
            resolve()
          }
        })
      })
    }

    // Salvar arquivos
    const promises: any[] = []
    Object.entries(files).forEach(([tipo, upload]) => {
      upload?.forEach((file) => {
        const tipoArquivo = tipo === 'entrada_0' ? 'ENTRADA_0' : 'SAIDA_1'
        promises.push(salvarArquivo(file, tipoArquivo))
      })
    })

    // Aguardar todas as Promises serem resolvidas antes de enviar a resposta JSON
    Promise.all(promises)
      .then(() => {
        res.status(200).json({ files: nomesArquivosSalvos })
      })
      .catch((err) => {
        res
          .status(500)
          .json({ error: 'Erro ao salvar arquivos.', details: err })
      })
  })
}
