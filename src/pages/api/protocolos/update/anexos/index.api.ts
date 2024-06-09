import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";

const updateFilesBodySchema = z.object({
  id: z.coerce.number(),
  anexos: z.string()
});

export default async function UpdateFilesAnnex(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const bodySchema = updateFilesBodySchema.safeParse(req.body);

  if (!bodySchema.success) {
    return res.status(417).json({ message: 'Invalid body' });
  }

  const { id, anexos } = bodySchema.data;

  try {
    await prisma.protocolos.update({
      where: {
        id
      },
      data: {
        anexos
      }
    });

    return res.end();
  } catch (error) {
    return res.status(400).json({ message: error });
  }
}