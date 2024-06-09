-- CreateTable
CREATE TABLE `Parametros` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `random` VARCHAR(191) NOT NULL,
    `cep_invalido` BOOLEAN NOT NULL DEFAULT false,
    `data_limite_pgto_antecipado_anuidade` DATETIME(3) NULL,
    `percent_desc_pgto_antecipado_anuidade` INTEGER NOT NULL,
    `taxa_pgto_atrasado_anuidade` INTEGER NOT NULL,
    `parcelamento_permitido_anuidade` VARCHAR(191) NOT NULL,
    `data_limite_pgto_antecipado_JAER` DATETIME(3) NULL,
    `percent_desc_pgto_antecipado_JAER` INTEGER NOT NULL,
    `taxa_pgto_atrasado_JAER` INTEGER NOT NULL,
    `parcelamento_permitido_JAER` VARCHAR(191) NOT NULL,
    `presidente_pode_se_reeleger` BOOLEAN NOT NULL,
    `demais_podem_se_reeleger` BOOLEAN NOT NULL,
    `duracao_mandato` INTEGER NOT NULL,
    `exite_listas_imediato` BOOLEAN NOT NULL,
    `quantidade_linhas_listas` INTEGER NOT NULL,
    `acesso_externo_sis` BOOLEAN NOT NULL,
    `endereco_IP_primario` VARCHAR(191) NOT NULL,
    `endereco_IP_secundario` VARCHAR(191) NOT NULL,
    `permitir_dado_invalido` BOOLEAN NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Empresa` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cod_empresa` VARCHAR(191) NULL,
    `tipo_empresa` VARCHAR(191) NULL,
    `patrocinadora` BOOLEAN NULL,
    `faculdade_anestesiologia` BOOLEAN NULL,
    `empresa_ativa` BOOLEAN NULL,
    `cnpj` VARCHAR(191) NULL,
    `razao_social` VARCHAR(191) NULL,
    `nome_fantasia` VARCHAR(191) NULL,
    `cep` VARCHAR(191) NULL,
    `logradouro` VARCHAR(191) NULL,
    `numero` VARCHAR(191) NULL,
    `complemento` VARCHAR(191) NULL,
    `cidade` VARCHAR(191) NULL,
    `uf` VARCHAR(191) NULL,
    `pais` VARCHAR(191) NULL,
    `bairro` VARCHAR(191) NULL,
    `telefone_comercial` VARCHAR(191) NULL,
    `tratamento_contato_primario` VARCHAR(191) NULL,
    `nome_contato_primario` VARCHAR(191) NULL,
    `cargo_contato_primario` VARCHAR(191) NULL,
    `email_contato_primario` VARCHAR(191) NULL,
    `telefone_contato_primario` VARCHAR(191) NULL,
    `tratamento_contato_secundario` VARCHAR(191) NULL,
    `nome_contato_secundario` VARCHAR(191) NULL,
    `cargo_contato_secundario` VARCHAR(191) NULL,
    `email_contato_secundario` VARCHAR(191) NULL,
    `telefone_contato_secundario` VARCHAR(191) NULL,
    `home_page` VARCHAR(191) NULL,
    `inscricao_estadual` VARCHAR(191) NULL,
    `inscricao_municipal` VARCHAR(191) NULL,
    `observacoes` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tabelas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `codigo_tabela` VARCHAR(191) NOT NULL,
    `ocorrencia_tabela` VARCHAR(191) NOT NULL,
    `complemento_ocorrencia_selecao` LONGTEXT NULL,
    `ocorrencia_ativa` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Associados` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `data_nascimento` DATETIME(3) NULL,
    `data_inicio_especializacao` DATETIME(3) NULL,
    `data_previsao_conclusao` DATETIME(3) NULL,
    `comprovante_cpf` VARCHAR(191) NULL,
    `numero_proposta_SBA` BIGINT NULL,
    `matricula_SAERJ` INTEGER NULL,
    `matricula_SBA` INTEGER NULL,
    `situacao` VARCHAR(191) NULL,
    `uf_crm` VARCHAR(191) NULL,
    `crm` VARCHAR(191) NULL,
    `nome_completo` VARCHAR(191) NULL,
    `cpf` VARCHAR(191) NULL,
    `sexo` VARCHAR(191) NULL,
    `nome_profissional` VARCHAR(191) NULL,
    `categoria` VARCHAR(191) NULL,
    `cep` VARCHAR(191) NULL,
    `logradouro` VARCHAR(191) NULL,
    `numero` INTEGER NULL,
    `complemento` VARCHAR(191) NULL,
    `bairro` VARCHAR(191) NULL,
    `cidade` VARCHAR(191) NULL,
    `uf` VARCHAR(191) NULL,
    `pais` VARCHAR(191) NULL,
    `telefone_celular` VARCHAR(191) NULL,
    `telefone_residencial` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `nome_instituicao_ensino_graduacao` VARCHAR(191) NULL,
    `ano_conclusao_graduacao` VARCHAR(191) NULL,
    `residencia_mec_cnrm` VARCHAR(191) NULL,
    `nivel_residencia` VARCHAR(191) NULL,
    `nome_hospital_mec` VARCHAR(191) NULL,
    `uf_prm` VARCHAR(191) NULL,
    `comprovante_endereco` VARCHAR(191) NULL,
    `carta_indicacao_2_membros` VARCHAR(191) NULL,
    `declaracao_hospital` VARCHAR(191) NULL,
    `diploma_medicina` VARCHAR(191) NULL,
    `certidao_quitacao_crm` VARCHAR(191) NULL,
    `certificado_conclusao_especializacao` VARCHAR(191) NULL,
    `declaro_verdadeiras` VARCHAR(191) NULL,
    `declaro_quite_SAERJ` VARCHAR(191) NULL,
    `pendencias_SAERJ` VARCHAR(191) NULL,
    `nome_presidente_regional` VARCHAR(191) NULL,
    `sigla_regional` VARCHAR(191) NULL,
    `senha` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Adicionais_SAERJ` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `matricula_saerj` INTEGER NULL,
    `admissao_saerj` DATETIME(3) NULL,
    `categoria_saerj` VARCHAR(191) NULL,
    `situacao` VARCHAR(191) NULL,
    `cooperativa` VARCHAR(191) NULL,
    `nome_pai` VARCHAR(191) NULL,
    `nome_mae` VARCHAR(191) NULL,
    `tsa` VARCHAR(191) NULL,
    `observacao_1` VARCHAR(191) NULL,
    `observacao_2` VARCHAR(191) NULL,
    `observacao_3` VARCHAR(191) NULL,
    `hospital_1` VARCHAR(191) NULL,
    `nome_responsavel` VARCHAR(191) NULL,
    `tratamento` VARCHAR(191) NULL,
    `nacionalidade` VARCHAR(191) NULL,
    `foto_associado` VARCHAR(191) NULL,
    `cet_data_inicio` VARCHAR(191) NULL,
    `cet_data_fim` VARCHAR(191) NULL,
    `ano_ult_pgto_sba` VARCHAR(191) NULL,
    `cet` VARCHAR(191) NULL,
    `ano_ult_pgto_regional` VARCHAR(191) NULL,
    `cat_saerj` VARCHAR(191) NULL,
    `declaro_verdadeiras` BOOLEAN NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pagamentos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `matricula_saerj` VARCHAR(191) NOT NULL,
    `tipo_pagamento` VARCHAR(191) NOT NULL,
    `forma_pagamento` VARCHAR(191) NULL,
    `ano_anuidade` VARCHAR(191) NULL,
    `data_processamento` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `data_pagto_unico` DATETIME(3) NULL,
    `valor_pagto_unico` DECIMAL(10, 2) NULL,
    `data_pagto_parcela_1` DATETIME(3) NULL,
    `valor_pagto_parcela_1` DECIMAL(10, 2) NULL,
    `data_pagto_parcela_2` DATETIME(3) NULL,
    `valor_pagto_parcela_2` DECIMAL(10, 2) NULL,
    `data_pagto_parcela_3` DATETIME(3) NULL,
    `valor_pagto_parcela_3` DECIMAL(10, 2) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Protocolos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `assunto_protocolo` VARCHAR(255) NULL,
    `tipo_protocolo` VARCHAR(191) NULL,
    `remetente` VARCHAR(191) NULL,
    `destinatario` VARCHAR(191) NULL,
    `data_recebimento` DATETIME(3) NULL,
    `data_envio` DATETIME(3) NULL,
    `meio_recebimento` VARCHAR(191) NULL,
    `meio_envio` VARCHAR(191) NULL,
    `quem_redigiu_envio` VARCHAR(191) NULL,
    `entregue_em_maos` BOOLEAN NULL,
    `num_protocolo` VARCHAR(191) NULL,
    `obrigatoria_resp_receb` BOOLEAN NULL,
    `anexos` VARCHAR(191) NULL,
    `anexos2` VARCHAR(191) NULL,
    `data_encerramento` DATETIME(3) NULL,
    `usuario_encerramento` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Votacao` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `matricula_saerj` VARCHAR(191) NOT NULL,
    `data_votacao_inicio` VARCHAR(191) NOT NULL,
    `data_votacao_fim` VARCHAR(191) NOT NULL,
    `chapas` JSON NOT NULL,
    `status` ENUM('ATIVA', 'INATIVA') NOT NULL DEFAULT 'ATIVA',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Voto` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome_chapa` VARCHAR(191) NOT NULL,
    `usuario_id` INTEGER NOT NULL,
    `votacao_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Chapas_Eleicoes` (
    `cod_chapa` VARCHAR(191) NOT NULL,
    `numero_eleicao` INTEGER NOT NULL,
    `titulo_chapa` VARCHAR(50) NOT NULL,
    `descricao_chapa` VARCHAR(255) NULL,
    `quantidade_votos` INTEGER NULL,
    `chapa_vencedora` BOOLEAN NULL DEFAULT false,

    PRIMARY KEY (`cod_chapa`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Chapas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome_chapa` VARCHAR(191) NOT NULL,
    `membros_chapa` JSON NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Diretorias` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `numero_eleicao` INTEGER NOT NULL,
    `cod_chapa` VARCHAR(255) NOT NULL,
    `matricula_saerj` INTEGER NOT NULL,
    `candidato_cargo` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Eleicoes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `numero_eleicao` VARCHAR(191) NOT NULL,
    `titulo_eleicao` VARCHAR(255) NOT NULL,
    `votacao_inicio` DATETIME(3) NOT NULL,
    `votacao_fim` DATETIME(3) NOT NULL,
    `mandato_inicio` DATETIME(3) NOT NULL,
    `mandato_fim` DATETIME(3) NOT NULL,
    `status` ENUM('ATIVA', 'INATIVA') NOT NULL DEFAULT 'INATIVA',
    `chapas` JSON NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cod_log` VARCHAR(191) NOT NULL,
    `ocorrencia_log` VARCHAR(191) NOT NULL,
    `data_hora_log` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
