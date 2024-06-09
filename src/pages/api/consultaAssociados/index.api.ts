import { prisma } from '@/lib/prisma'

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método HTTP não permitido' })
  }

  const { cpfs } = req.body

  if (!cpfs || !Array.isArray(cpfs)) {
    return res
      .status(400)
      .json({ error: 'CPFs devem ser fornecidos como uma matriz' })
  }

  try {
    const cleanedCpfs = cpfs.map((cpf: string) => cpf.replace(/[.-]/g, ''))
    const data = await prisma.associados.findMany({
      where: {
        cpf: {
          in: cleanedCpfs,
        },
      },
      select: {
        nome_completo: true,
        matricula_SAERJ: true,
        cpf: true,
        situacao: true
      }
    });
    
    const foundCpfs = data.map((row: any) => {
      const cpfWithDotsAndHyphen = row.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      return cpfWithDotsAndHyphen;
    });
    const notFoundCpfs = cpfs.filter((cpf: string) => !foundCpfs.includes(cpf));
    res.status(200).json({ results: data, notFoundCpfs, foundCpfs });

  } catch (error: any) {
    res.status(500).json({ error: error.message })
  } finally {
    await prisma.$disconnect()
  }
}
