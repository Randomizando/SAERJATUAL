import { prisma } from '@/lib/prisma'
import { Logs } from '@/utils/Logs'
import { useArrayDate } from '@/utils/useArrayDate'
import { Resend } from 'resend'

const resend = new Resend(process.env.EMAIL_API_KEY)

export interface AssociateDTO {
  id: number
  email: string
}

export interface SendEmailAniversarioBody {
  associates: AssociateDTO[]
  htmlBody: string
}

const wait = (ms: number) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => resolve(), ms)
  })
}

export default async function sendEmailAniversario(req: any, res: any) {
  const data: SendEmailAniversarioBody = req.body

  try {
    if (data.associates.length === 0) {
      throw new Error('A lista de e-mails está vazia')
    }

    const parametros = await prisma.parametros.findFirst()
    if (!parametros) {
      throw new Error('Erro ao extrair parâmetros')
    }

    const successfulEmails: string[] = []
    const failedEmails: string[] = []
    const errors: any[] = []

    for (const associate of data.associates) {
      try {
        const sendEmail = async () => {
          return resend.emails.send({
            from: `${parametros?.nome_email_remetente} <${parametros?.endereco_email_remetente}>`,
            to: associate.email,
            subject: parametros?.assunto_email_aniversario,
            html: data.htmlBody,
          })
        }

        // O resend tem um limite de 2 requests por segundo
        const [response] = await Promise.all([sendEmail(), wait(700)])

        if (response.error) {
          failedEmails.push(associate.email)
          errors.push(response.error)
        } else {
          try {
            const today = new Date()
            const formattedTodaysDate = useArrayDate.MontarDate(
              today.getFullYear(),
              today.getMonth() + 1,
              today.getDate(),
            )
            await prisma.associados.updateMany({
              where: {
                id: associate.id,
              },
              data: {
                data_ultimo_envio_email_aniversario: formattedTodaysDate,
              },
            })

            Logs({
              modulo: 'ASSOCIADO UPDATE',
              descriptionLog: `Atualização associados email: ${associate.email}`,
            })
          } catch (error) {
            console.error(error)
            const MessageError = `Error connect db`
            return res.status(500).json({ message: `${MessageError}`, error })
          }
          successfulEmails.push(associate.email)
        }
      } catch (error) {
        // console.error(`Erro ao enviar e-mail para ${email}:`, error)
        failedEmails.push(associate.email)
        errors.push(error)
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
  } finally {
    prisma.$disconnect()
  }
}
