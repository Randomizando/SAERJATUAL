// pages/api/votar.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import checkVoterCategory from '../../middlewares/checkVoterCategory';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  // Simula a autenticação e adição do usuário ao request
  // Em produção, isso deve ser feito com autenticação real
  req.user = {
    categoria: req.body.categoria, // Exemplo de como o usuário poderia ser adicionado ao request
  };

  // Chama o middleware para verificar a categoria do votante
  checkVoterCategory(req, res, async () => {
    try {
      const { associadoId, eleicaoId, chapaId } = req.body;

      // Verificar se o associado já votou nesta eleição
      const votoExistente = await prisma.voto.findFirst({
        where: {
          associadoId,
          eleicaoId,
        },
      });

      if (votoExistente) {
        return res.status(400).json({ error: 'Você já votou nesta eleição.' });
      }

      // Registrar o voto
      const voto = await prisma.voto.create({
        data: {
          associadoId,
          eleicaoId,
          chapaId,
        },
      });

      res.status(201).json(voto);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao registrar voto.' });
    }
  });
}
