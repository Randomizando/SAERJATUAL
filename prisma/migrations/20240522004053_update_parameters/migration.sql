/*
  Warnings:

  - You are about to drop the column `remetente_email` on the `Parametros` table. All the data in the column will be lost.
  - Added the required column `endereco_email_remetente` to the `Parametros` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nome_email_remetente` to the `Parametros` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Parametros` DROP COLUMN `remetente_email`,
    ADD COLUMN `endereco_email_remetente` VARCHAR(191) NOT NULL,
    ADD COLUMN `nome_email_remetente` VARCHAR(191) NOT NULL;
