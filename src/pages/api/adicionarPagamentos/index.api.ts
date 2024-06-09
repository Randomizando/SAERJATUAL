// importe o cliente Prisma
import { PrismaClient } from '@prisma/client';

// crie uma instância do cliente Prisma
const prisma = new PrismaClient();

// defina sua função de manipulação de solicitação
export default async function handler(req: any, res: any) {
  try {
    const { pagamentoUnico } = req.body;
    if (!pagamentoUnico || pagamentoUnico.length === 0) {
      throw new Error('Nenhum pagamento único fornecido no corpo da solicitação.');
    }

    // console.log('Iniciando processamento de pagamentos únicos...');
    // console.log('Pagamentos Únicos Recebidos:', pagamentoUnico);

    let existingMatricula: any[] = []
let existingDataPedido: any [] = []
let existingValor: any[] = []


    for (const pagamento of pagamentoUnico) {
      // console.log('Processando pagamento único:', pagamento);

      const matriculaSAERJ = String(pagamento.matricula_SAERJ);
      // console.log('Matrícula SAERJ:', matriculaSAERJ);

      const dataPagtoUnico = new Date(pagamento.data_pagto_unico).toISOString();
      // console.log('Data de Pagamento Único:', dataPagtoUnico);

      const existingPagamento = await prisma.pagamentos.findFirst({
        where: {
          matricula_saerj: matriculaSAERJ,
          tipo_pagamento: pagamento.tipo_pagamento,
          forma_pagamento: pagamento.forma_pagamento,
          ano_anuidade: pagamento.ano_anuidade,
          //data_pagto_unico: dataPagtoUnico,
          //valor_pagto_unico: pagamento.valor_pagto_unico,
        },
      });

      // se não houver um pagamento existente, insira um novo
      if (!existingPagamento) {
        // console.log('Nenhum pagamento encontrado, criando novo registro...');
        await prisma.pagamentos.create({
          data: {
            matricula_saerj: matriculaSAERJ,
            tipo_pagamento: pagamento.tipo_pagamento,
            forma_pagamento: pagamento.forma_pagamento,
            ano_anuidade: pagamento.ano_anuidade,
            data_pagto_unico: dataPagtoUnico,
            valor_pagto_unico: pagamento.valor_pagto_unico,
          },
        });
        // console.log('Novo pagamento criado com sucesso.');
      } else {
        // console.log('Pagamento existente encontrado, nenhum registro adicionado.');
      }
      //  console.log(existingPagamento?.matricula_saerj)
      if (existingPagamento) {
    existingMatricula.push(existingPagamento.matricula_saerj);
    existingDataPedido.push(existingPagamento.data_pagto_unico);
    existingValor.push(existingPagamento.valor_pagto_unico);
  }
    }

    // console.log('Processamento concluído.');
    //console.log(existingMatricula);
    //console.log(existingDataPedido);
    //console.log(existingValor);

    res.status(200).json({ existingMatricula, existingDataPedido, existingValor});
  } catch (error: any) {
    console.error('Erro durante a manipulação da solicitação:', error);
    res.status(500).json({ error: error.message });
  } finally {
    // feche a conexão do Prisma
    await prisma.$disconnect();
    console.log('Conexão Prisma fechada.');
  }
}
