/* eslint-disable camelcase */
// pages/api/upload.ts
import upload from '@/lib/multerConfig'
import fs from 'fs'
import type { NextApiRequest, NextApiResponse } from 'next'
import path from 'path'

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

const multerUpload = upload.fields([
  { name: 'comprovante_cpf', maxCount: 1 },
  { name: 'comprovante_endereco', maxCount: 1 },
  { name: 'carta_indicacao_2_membros', maxCount: 1 },
  { name: 'certidao_quitacao_crm', maxCount: 1 },
  { name: 'certificado_conclusao_especializacao', maxCount: 1 },
  { name: 'declaracao_hospital', maxCount: 1 },
  { name: 'diploma_medicina', maxCount: 1 },
  { name: 'anexos', maxCount: 1 },
  { name: 'foto_associado', maxCount: 1 },
])

export default async function handler(
  req: NextApiRequest & { files: Record<string, MulterFile[]> } & any,
  res: NextApiResponse & any,
) {
  try {
    multerUpload(req, res, (err: any) => {
      if (err) {
        console.error(err)
        return res
          .status(400)
          .json({ success: false, error: 'Erro ao processar o arquivo' })
      }
      // Lista de todos os campos de arquivo
      const fileFields = [
        'comprovante_cpf',
        'comprovante_endereco',
        'carta_indicacao_2_membros',
        'certidao_quitacao_crm',
        'certificado_conclusao_especializacao',
        'declaracao_hospital',
        'diploma_medicina',
        'anexos',
        'foto_associado',
      ]

      const cpfFile = req.files.comprovante_cpf?.[0]
      const enderecoFile = req.files.comprovante_endereco?.[0]
      const fileCartaIndicacao = req.files.carta_indicacao_2_membros?.[0]
      const fileCertidaoQuitacao = req.files.certidao_quitacao_crm?.[0]
      const fileCertificadoConclusaoEspecializacao =
        req.files.certificado_conclusao_especializacao?.[0]
      const fileDeclaracaoHospital = req.files.declaracao_hospital?.[0]
      const fileDiplomaMedicina = req.files.diploma_medicina?.[0]
      const fileAnexos = req.files.anexos?.[0]
      const fileFotoAssociado = req.files.foto_associado?.[0]

      // Verifica se algum arquivo não é um PDF
      // const isNotPdf = fileFields.some((field) => {
      //  const file = req.files[field]?.[0];
      //  return file && file.mimetype !== 'application/pdf';
      // });

      // if (isNotPdf && !fileFotoAssociado) {
      //  return res.status(400).json({
      //    success: false,
      //    error: 'Todos os arquivos devem ser no formato PDF.',
      //  });
      // }

      // console.log(fileAnexosProtocolos)

      // if (
      //   !cpfFile ||
      //   !enderecoFile ||
      //   !fileCartaIndicacao ||
      //   !fileCertidaoQuitacao ||
      //   !fileCertificadoConclusaoEspecializacao ||
      //   !fileDeclaracaoHospital ||
      //   !fileDiplomaMedicina
      // ) {
      //   return res.status(400).json({
      //     success: false,
      //     error: 'Você precisa enviar todos os arquivos',
      //   })
      // }

      //  Modifique o nome do arquivo (adicionando um timestamp, por exemplo)
      // const timestamp = new Date().getTime()

      // function generateRandomCode(): string {
      //   const min = 100000 // Mínimo valor de 6 dígitos
      //   const max = 999999 // Máximo valor de 6 dígitos
      //   const randomCode = Math.floor(Math.random() * (max - min + 1)) + min

      //   return String(randomCode)
      // }
      // const idRamdom = generateRandomCode()
      // const cpfFileName = `COMPROVANTE_CPF_id-${idRamdom}${timestamp}.pdf`
      // const enderecoFileName = `COMPROVANTE_ENDERECO_id-${idRamdom}${timestamp}.pdf`
      // const cartaIndicacaoFileName = `CARTA_INDICACAO_MEMBROS_id-${idRamdom}${timestamp}.pdf`
      // const certidaoQuitacaoFileName = `CERTIDAO_QUITACAO_CRM_id-${idRamdom}${timestamp}.pdf`
      // const certificadoConclusaoEspecializacaoFileName = `CERTIFICADO_CONCLUSAO_ESPECIALIZACAO_id-${idRamdom}${timestamp}.pdf`
      // const declaracaoHospitalFileName = `DECLARACAO_HOSPITAL_id-${idRamdom}${timestamp}.pdf`
      // const diplomaMedicinaFileName = `DIPLOMA_MEDICINA_id-${idRamdom}${timestamp}.pdf`

      // const uploadPath = path.join(process.cwd(), 'upload')
      // const cpfUploadPath = path.join(uploadPath, cpfFileName)
      // const enderecoUploadPath = path.join(uploadPath, enderecoFileName)
      // // new
      // const cartaIndicacaoUploadPath = path.join(
      //   uploadPath,
      //   cartaIndicacaoFileName,
      // )
      // const certidaoQuitacaoUploadPatch = path.join(
      //   uploadPath,
      //   certidaoQuitacaoFileName,
      // )
      // const certificadoConclusaoEspecializacaoUploadPatch = path.join(
      //   uploadPath,
      //   certificadoConclusaoEspecializacaoFileName,
      // )
      // const declaracaoHospitalUploadPatch = path.join(
      //   uploadPath,
      //   declaracaoHospitalFileName,
      // )
      // const diplomaMedicinaUploadPatch = path.join(
      //   uploadPath,
      //   diplomaMedicinaFileName,
      // )
      // // Salve os arquivos
      // fs.writeFileSync(cpfUploadPath, cpfFile.buffer)
      // fs.writeFileSync(enderecoUploadPath, enderecoFile.buffer)
      // fs.writeFileSync(cartaIndicacaoUploadPath, fileCartaIndicacao.buffer)

      // fs.writeFileSync(certidaoQuitacaoUploadPatch, fileCertidaoQuitacao.buffer)
      // fs.writeFileSync(
      //   certificadoConclusaoEspecializacaoUploadPatch,
      //   fileCertificadoConclusaoEspecializacao.buffer,
      // )
      // fs.writeFileSync(
      //   declaracaoHospitalUploadPatch,
      //   fileDeclaracaoHospital.buffer,
      // )
      // fs.writeFileSync(diplomaMedicinaUploadPatch, fileDiplomaMedicina.buffer)

      const timestamp = new Date().getTime()

      function generateRandomCode(): string {
        const min = 100000 // Mínimo valor de 6 dígitos
        const max = 999999 // Máximo valor de 6 dígitos
        const randomCode = Math.floor(Math.random() * (max - min + 1)) + min

        return String(randomCode)
      }

      const idRamdom = generateRandomCode()

      const names_arquivos = []

      if (fileAnexos) {
        const anexosFileName = `${fileAnexos.originalname.replaceAll(
          '.pdf',
          '',
        )}_ID-${idRamdom}${timestamp}.pdf`
        const anexosUploadPath = path.join(
          process.cwd(),
          'public/upload',
          anexosFileName,
        )
        fs.writeFileSync(anexosUploadPath, fileAnexos.buffer)
        names_arquivos.push({ anexoProtocolo: anexosFileName })
      }
      // Processar e salvar apenas os arquivos que foram enviados
      if (cpfFile) {
        const cpfFileName = `COMPROVANTE_CPF_id-${idRamdom}${timestamp}.pdf`
        const cpfUploadPath = path.join(
          process.cwd(),
          'public/upload',
          cpfFileName,
        )
        fs.writeFileSync(cpfUploadPath, cpfFile.buffer)
        names_arquivos.push(cpfFileName)
      }

      if (enderecoFile) {
        const enderecoFileName = `COMPROVANTE_ENDERECO_id-${idRamdom}${timestamp}.pdf`
        const enderecoUploadPath = path.join(
          process.cwd(),
          'public/upload',
          enderecoFileName,
        )
        fs.writeFileSync(enderecoUploadPath, enderecoFile.buffer)
        names_arquivos.push(enderecoFileName)
      }

      if (fileCartaIndicacao) {
        const cartaIndicacaoFileName = `CARTA_INDICACAO_MEMBROS_id-${idRamdom}${timestamp}.pdf`
        const cartaIndicacaoUploadPath = path.join(
          process.cwd(),
          'public/upload',
          cartaIndicacaoFileName,
        )
        fs.writeFileSync(cartaIndicacaoUploadPath, fileCartaIndicacao.buffer)
        names_arquivos.push(cartaIndicacaoFileName)
      }

      if (fileCertidaoQuitacao) {
        const certidaoQuitacaoFileName = `CERTIDAO_QUITACAO_CRM_id-${idRamdom}${timestamp}.pdf`
        const certidaoQuitacaoUploadPatch = path.join(
          process.cwd(),
          'public/upload',
          certidaoQuitacaoFileName,
        )
        fs.writeFileSync(
          certidaoQuitacaoUploadPatch,
          fileCertidaoQuitacao.buffer,
        )
        // eslint-disable-next-line camelcase
        names_arquivos.push(certidaoQuitacaoFileName)
      }

      if (fileCertificadoConclusaoEspecializacao) {
        const certificadoConclusaoEspecializacaoFileName = `CERTIFICADO_CONCLUSAO_ESPECIALIZACAO_id-${idRamdom}${timestamp}.pdf`
        const certificadoConclusaoEspecializacaoUploadPatch = path.join(
          process.cwd(),
          'public/upload',
          certificadoConclusaoEspecializacaoFileName,
        )
        fs.writeFileSync(
          certificadoConclusaoEspecializacaoUploadPatch,
          fileCertificadoConclusaoEspecializacao.buffer,
        )
        names_arquivos.push(certificadoConclusaoEspecializacaoFileName)
      }

      if (fileDeclaracaoHospital) {
        const declaracaoHospitalFileName = `DECLARACAO_HOSPITAL_id-${idRamdom}${timestamp}.pdf`
        const declaracaoHospitalUploadPatch = path.join(
          process.cwd(),
          'public/upload',
          declaracaoHospitalFileName,
        )
        fs.writeFileSync(
          declaracaoHospitalUploadPatch,
          fileDeclaracaoHospital.buffer,
        )
        names_arquivos.push(declaracaoHospitalFileName)
      }

      if (fileDiplomaMedicina) {
        const diplomaMedicinaFileName = `DIPLOMA_MEDICINA_id-${idRamdom}${timestamp}.pdf`
        const diplomaMedicinaUploadPatch = path.join(
          process.cwd(),
          'public/upload',
          diplomaMedicinaFileName,
        )
        fs.writeFileSync(diplomaMedicinaUploadPatch, fileDiplomaMedicina.buffer)
        names_arquivos.push(diplomaMedicinaFileName)
      }

      if (fileFotoAssociado) {
        const fotoAssociadoFileName = `FOTO_ASSOCIADO_id-${idRamdom}${timestamp}.jpg`
        const fotoAssociadoUploadPatch = path.join(
          process.cwd(),
          '/public/upload',
          fotoAssociadoFileName,
        )
        fs.writeFile(
          fotoAssociadoUploadPatch,
          fileFotoAssociado.buffer,
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          () => {},
        )
        names_arquivos.push(fotoAssociadoFileName)
      }

      res.status(200).json({
        success: true,
        message: 'Arquivos recebidos e salvos com sucesso',
        names_arquivos,
      })
    })
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .json({ success: false, error: 'Erro ao lidar com os arquivos' })
  }
}
