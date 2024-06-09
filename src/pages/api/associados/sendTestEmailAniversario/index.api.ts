import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'

const resend = new Resend(process.env.EMAIL_API_KEY)

export interface SendTestEmailAniversarioBody {
  emailList: string[]
  htmlBody: string
  sendMultiple: boolean
}

const wait = (ms: number) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), ms)
  })
}

export default async function sendTestEmailAniversario(req: any, res: any) {
  const data: SendTestEmailAniversarioBody = req.body

  try {
    if (data.emailList.length === 0) {
      throw new Error('A lista de e-mails está vazia')
    }

    const parametros = await prisma.parametros.findFirst()
    if (!parametros) {
      throw new Error('Erro ao extrair parâmetros')
    }

    const successfulEmails: string[] = []
    const failedEmails: string[] = []
    const errors: any[] = []

    const emailListNumber = data.sendMultiple ? data.emailList.length : 1

    for (let i = 0; i < emailListNumber; i++) {
      try {
        const sendEmail = async () => {
          return resend.emails.send({
            from: `${parametros.nome_email_remetente} <${parametros.endereco_email_remetente}>`,
            to: parametros.endereco_email_remetente,
            subject: parametros.assunto_email_aniversario,
            html: data.htmlBody,
          })
        }

        // O resend tem um limite de 2 requests por segundo
        const [response] = await Promise.all([sendEmail(), wait(700)])

        if (response.error) {
          failedEmails.push(parametros.endereco_email_remetente)
          errors.push(response.error)
        } else {
          successfulEmails.push(parametros.endereco_email_remetente)
        }
      } catch (error) {
        failedEmails.push(parametros.endereco_email_remetente)
        errors.push(parametros.endereco_email_remetente)
      }
    }

    if (failedEmails.length > 0) {
      res.status(200).json({
        message: 'Alguns e-mails não puderam ser enviados!',
        failedEmails,
        errors,
      })
    } else {
      res.status(200).json({
        message: 'Todos os e-mails foram enviados com sucesso!',
        successfulEmails,
      })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Erro ao enviar os e-mails!' })
  }
}
