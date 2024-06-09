import { NextApiRequest, NextApiResponse } from "next";
import formidable, { File, IncomingForm } from "formidable";
import fs from "fs";
import Papa from "papaparse";
import { prisma } from "@/lib/prisma";
import { Logs } from "@/utils/Logs";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("Início do processamento da solicitação, método:", req.method);

  if (req.method !== "POST") {
    console.log("Método não POST recebido, método atual:", req.method);
    res.status(405).json({ message: "Somente método POST permitido" });
    return;
  }

  const form = new IncomingForm();

  form.parse(req, async (err, fields, files) => {
    console.log("Processamento do formulário iniciado");

    if (err) {
      console.log("Erro ao processar o formulário:", err);
      res.status(500).json({ message: "Erro ao processar o arquivo" });
      return;
    }

    if (!files.file || !Array.isArray(files.file) || files.file.length === 0) {
      console.log("Falha na validação do arquivo: nenhum arquivo enviado");
      res.status(400).json({ message: "Nenhum arquivo foi enviado." });
      return;
    }

    const file = files.file[0] as formidable.File;

    if (!file.originalFilename || !file.originalFilename.endsWith(".csv")) {
      console.log("Arquivo não CSV enviado");
      res.status(400).json({ message: "Por favor, envie um arquivo .csv." });
      return;
    }

    try {
      const csvFilePath = file.filepath;
      console.log("Leitura do arquivo CSV no caminho:", csvFilePath);

      const csvData = fs.readFileSync(csvFilePath, "utf8");
      console.log("Arquivo CSV lido com sucesso");

      const records = Papa.parse(csvData, {
        header: true,
        delimiter: ',',
        skipEmptyLines: true,
      }).data;

      console.log("Parse do CSV concluído, número de registros:", records.length);

      let linhasModificadas = 0;
      let linhasDuplicadas = 0;
      let linhasNaoEncontradas = 0;
      let linhasNaoPagas = 0;

      for (const record of records as any[]) {
        if (record.status && record.status.toLowerCase() === "completed") {
          let cpf = record.customer_note.substring("CPF TITULAR: ".length).trim();
          cpf = cpf.replace(/\D/g, "");

          const associado = await prisma.associados.findFirst({
            where: { cpf: cpf },
          });

          if (associado && associado.matricula_SAERJ !== null) {
            console.log("Associado encontrado, CPF:", cpf);

            const pagamentoExistente = await prisma.pagamentos.findFirst({
              where: { matricula_saerj: associado.matricula_SAERJ.toString() },
            });

            if (!pagamentoExistente) {
              console.log("Criando novo pagamento para o associado, CPF:", cpf);
              await prisma.pagamentos.create({
                data: {
                  matricula_saerj: associado.matricula_SAERJ.toString(),
                  tipo_pagamento: "",
                  forma_pagamento: record.payment_method ?? "",
                  ano_anuidade: new Date(record.order_date).getFullYear().toString(),
                  data_pagto_unico: record.order_date ? new Date(record.order_date).toISOString().split("T")[0] : "2024-01-01 00:00:00",
                  valor_pagto_unico: record.order_total ? record.order_total.toString() : "",
                  data_pagto_parcela_1: "",
                  valor_pagto_parcela_1: "",
                  data_pagto_parcela_2: "",
                  valor_pagto_parcela_2: "",
                  data_pagto_parcela_3: "",
                  valor_pagto_parcela_3: "",
                },
              });
              linhasModificadas++;
            } else {
              linhasDuplicadas++;
              console.log("Pagamento já existente para o CPF:", cpf);
            }
          } else {
            linhasNaoEncontradas++;
            console.log("CPF não encontrado na base de dados:", cpf);
          }
        } else {
          linhasNaoPagas++;
          console.log("Linha com status diferente de 'completed', ignorando");
        }
      }

      console.log("Processamento concluído, resumo:", { linhasModificadas, linhasDuplicadas, linhasNaoEncontradas, linhasNaoPagas });
      res.status(200).json({
        message: "Dados do CSV importados com sucesso!",
        linhasModificadas,
        linhasDuplicadas,
        linhasNaoEncontradas,
        linhasNaoPagas
      });
    } catch (processError) {
      console.log("Erro durante o processamento:", processError);
      res.status(500).json({ message: "Erro ao processar os dados", error: processError });
    }
  });
}
