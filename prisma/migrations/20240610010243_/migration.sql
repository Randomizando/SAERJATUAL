/*
  Warnings:

  - The primary key for the `Chapas_Eleicoes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `cod_chapa` on the `Chapas_Eleicoes` table. All the data in the column will be lost.
  - Added the required column `chapasId` to the `Chapas_Eleicoes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `eleicoesId` to the `Chapas_Eleicoes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id` to the `Chapas_Eleicoes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Chapas` ADD COLUMN `eleicoesId` INTEGER NULL;

-- AlterTable
ALTER TABLE `Chapas_Eleicoes` DROP PRIMARY KEY,
    DROP COLUMN `cod_chapa`,
    ADD COLUMN `chapasId` INTEGER NOT NULL,
    ADD COLUMN `eleicoesId` INTEGER NOT NULL,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `numero_eleicao` INTEGER NULL,
    MODIFY `titulo_chapa` VARCHAR(50) NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Parametros` MODIFY `assunto_email_aniversario` VARCHAR(191) NULL,
    MODIFY `endereco_email_remetente` VARCHAR(191) NULL,
    MODIFY `nome_email_remetente` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Chapas_Eleicoes` ADD CONSTRAINT `Chapas_Eleicoes_eleicoesId_fkey` FOREIGN KEY (`eleicoesId`) REFERENCES `Eleicoes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Chapas_Eleicoes` ADD CONSTRAINT `Chapas_Eleicoes_chapasId_fkey` FOREIGN KEY (`chapasId`) REFERENCES `Chapas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
