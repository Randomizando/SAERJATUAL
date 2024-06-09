import { Resend } from 'resend'

const resend = new Resend(process.env.EMAIL_API_KEY)

interface DataBody {
  emailList: string[]
  htmlBody: string
}

export default async function sendEmail(req: any, res: any) {
  const data: DataBody = req.body

  try {
    if (data.emailList.length === 0) {
      throw new Error('A lista de e-mails está vazia')
    }

    const successfulEmails: string[] = []
    const failedEmails: string[] = []

    for (const email of data.emailList) {
      // console.log(`Enviando e-mail para: ${email}`)
      try {
        const response = await resend.emails.send({
          from: `${process.env.EMAIL_FROM_NAME} <${process.env.EMAIL_FROM_EMAIL}>`,
          to: [email],
          subject: `${process.env.EMAIL_FROM_NAME} `,
          html: `${data.htmlBody}`,
        })

        // console.log('Resposta do serviço Resend:', response)

        if (response.error) {
          failedEmails.push(email)
        } else {
          successfulEmails.push(email)
        }
      } catch (error) {
        // console.error(`Erro ao enviar e-mail para ${email}:`, error)
        failedEmails.push(email)
      }
    }

    if (failedEmails.length > 0) {
      res.status(200).json({
        message: 'Alguns e-mails não puderam ser enviados!',
        failedEmails,
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
