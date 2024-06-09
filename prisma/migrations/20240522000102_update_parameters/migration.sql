/*
  Warnings:

  - Added the required column `assunto_email_aniversario` to the `Parametros` table without a default value. This is not possible if the table is not empty.
  - Added the required column `remetente_email` to the `Parametros` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Associados` MODIFY `numero` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Parametros` ADD COLUMN `assunto_email_aniversario` VARCHAR(191) NOT NULL,
    ADD COLUMN `remetente_email` VARCHAR(191) NOT NULL;
