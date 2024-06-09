/* eslint-disable no-useless-escape */
import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'
// ESSA ROTA VERIFICA O CNPJ NA RECEITA FEDERAL, A REQUEST É FEITA PELO LADO DO SERVIDOR PARA EVITAR ERRO DE CORS
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== `GET`) {
    const MessageErrorMethodInvalid = `Error method invalid`
    return res.status(405).json({ message: `${MessageErrorMethodInvalid}` })
  }

  function removerCaracteresEspeciais(texto: any): any {
    // Use uma expressão regular para encontrar os caracteres especiais e substituí-los por uma string vazia
    const textoSemEspeciais = texto.replace(/[.\-\/]/g, '')

    return textoSemEspeciais
  }

  const data = req.query.cnpj
  const cnpjLimpo = removerCaracteresEspeciais(data)

  await axios
    .get(`https://www.receitaws.com.br/v1/cnpj/${cnpjLimpo}`)
    .then((response) => {
      // console.log(response.data)
      return res.status(200).json(response.data)
    })
    .catch((error) => {
      const MessageError = `Error connect API Receita`
      res.status(500).json({ message: `${MessageError}`, error })
    })
}
