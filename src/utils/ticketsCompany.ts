'use client'

import { jsPDF } from 'jspdf'
import { toast } from 'react-toastify'

interface EtiquetaProps {
  id: number
  cod_empresa?: string
  tipo_empresa?: string
  patrocinadora?: boolean
  faculdade_anestesiologia?: boolean
  empresa_ativa?: boolean
  cnpj?: string
  razao_social?: string
  nome_fantasia?: string
  cep?: string
  logradouro?: string
  numero?: number
  complemento?: string
  cidade?: string
  uf?: string
  pais?: string
  bairro?: string
  telefone_comercial?: string
  tratamento_contato_primario?: string
  nome_contato_primario?: string
  cargo_contato_primario?: string
  email_contato_primario?: string
  telefone_contato_primario?: string
  tratamento_contato_secundario?: string
  nome_contato_secundario?: string
  cargo_contato_secundario?: string
  email_contato_secundario?: string
  telefone_contato_secundario?: string
  home_page?: string
  inscricao_estadual?: string
  inscricao_municipal?: string
  observacoes?: string
}

export const EtiquetaPDFCompany = async (
  linhas: number[],
  exibirContatoPrimario: boolean,
) => {
  const doc = new jsPDF({
    unit: 'mm',
    format: 'a4',
  })

  const verticalSpacing = 40 // Aumentei o espaçamento vertical para 40 unidades

  for (let index = 0; index < linhas.length; index++) {
    try {
      const response = await fetch(`/api/empresa/get/${linhas[index]}`)
      const data: EtiquetaProps = await response.json()

      const {
        cod_empresa,
        bairro,
        cep,
        cidade,
        complemento,
        logradouro,
        numero,
        uf,
        nome_contato_primario,
        tratamento_contato_primario,
        nome_contato_secundario,
        tratamento_contato_secundario,
        razao_social,
      } = data

      const contato = exibirContatoPrimario
        ? nome_contato_primario
        : nome_contato_secundario
      const tratamento = exibirContatoPrimario
        ? tratamento_contato_primario
        : tratamento_contato_secundario

      // Calculate the space required for the current label
      const spaceRequired = verticalSpacing

      // Check if there is enough space on the current page
      if (
        spaceRequired >
        doc.internal.pageSize.height - index * verticalSpacing
      ) {
        // If not enough space, start a new page
        doc.addPage()
      }

      const startX = 10
      const startY = index * verticalSpacing

      doc.setFontSize(12)
      const splitNome = doc.splitTextToSize(
        `${cod_empresa ? `${cod_empresa} - ` : ''}${razao_social}`,
        80,
      )
      const nomeHeight = doc.getTextDimensions(splitNome).h

      doc.text(splitNome, startX + 4, 12 + startY)

      doc.setFontSize(10)
      const splitEndereco = doc.splitTextToSize(
        `${logradouro} , ${numero} ${complemento}`,
        80,
      )
      const enderecoHeight = doc.getTextDimensions(splitEndereco).h

      doc.text(splitEndereco, startX + 4, 12 + startY + nomeHeight + 2)

      const splitBairro = doc.splitTextToSize(`${bairro}`, 80)
      const bairroHeight = doc.getTextDimensions(splitBairro).h

      doc.text(
        splitBairro,
        startX + 4,
        12 + startY + nomeHeight + 2 + enderecoHeight + 2,
      )

      const parsedCep = `${cep?.slice(0, 5)}-${cep?.slice(5)}`
      const splitCidade = doc.splitTextToSize(
        `${parsedCep} - ${cidade} / ${uf}`,
        80,
      )
      const cidadeHeight = doc.getTextDimensions(splitCidade).h

      doc.text(
        splitCidade,
        startX + 4,
        12 + startY + nomeHeight + 2 + enderecoHeight + 2 + bairroHeight + 2,
      )

      const splitContato = doc.splitTextToSize(`${tratamento} ${contato}`, 80)
      const contatoHeight = doc.getTextDimensions(splitContato).h

      doc.text(
        splitContato,
        startX + 4,
        12 +
          startY +
          nomeHeight +
          2 +
          enderecoHeight +
          2 +
          bairroHeight +
          2 +
          cidadeHeight +
          2,
      )
    } catch (error) {
      toast.error('Erro ao gerar etiquetas')
      console.error('Erro ao buscar empresas:', error)
    }
  }

  doc.autoPrint()
  doc.output('dataurlnewwindow')
}
