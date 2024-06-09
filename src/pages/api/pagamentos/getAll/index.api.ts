import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const payments = await prisma.pagamentos.findMany();

    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ error: "Erro Interno do Servidor" });
  } finally {
    await prisma.$disconnect();
  }
};

export default handler;
