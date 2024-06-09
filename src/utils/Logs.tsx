import { prisma } from '@/lib/prisma'

interface schemaLogs {
  modulo: string
  descriptionLog: string
}

export async function Logs({ modulo, descriptionLog }: schemaLogs) {
  try {
    await prisma.logs.create({
      data: {
        cod_log: 'verificar codigo',
        ocorrencia_log: `${modulo} ${descriptionLog}`,
        data_hora_log: new Date(),
      },
    })
  } catch (error) {
    console.log(error)
  }
}
