-- CreateEnum
CREATE TYPE "TipoUsuario" AS ENUM ('comum', 'suporte', 'admin');

-- CreateEnum
CREATE TYPE "StatusChamado" AS ENUM ('aberto', 'andamento', 'resolvido', 'cancelado');

-- CreateEnum
CREATE TYPE "PrioridadeChamado" AS ENUM ('baixa', 'media', 'alta');

-- CreateTable
CREATE TABLE "setor" (
    "id" SERIAL NOT NULL,
    "nome" VARCHAR(50) NOT NULL,

    CONSTRAINT "setor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuario" (
    "id" SERIAL NOT NULL,
    "id_setor" INTEGER NOT NULL,
    "nome" VARCHAR(100) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "senha" VARCHAR(255) NOT NULL,
    "telefone" VARCHAR(20),
    "foto_perfil" VARCHAR(500),
    "tipo" "TipoUsuario" NOT NULL DEFAULT 'comum',
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chamado" (
    "id_chamado" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "id_setor" INTEGER NOT NULL,
    "titulo" VARCHAR(100) NOT NULL,
    "descricao" TEXT NOT NULL,
    "status" "StatusChamado" NOT NULL DEFAULT 'aberto',
    "prioridade" "PrioridadeChamado" NOT NULL DEFAULT 'media',
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chamado_pkey" PRIMARY KEY ("id_chamado")
);

-- CreateTable
CREATE TABLE "historico_chamado" (
    "id_historico" SERIAL NOT NULL,
    "id_chamado" INTEGER NOT NULL,
    "status_antigo" "StatusChamado",
    "status_novo" "StatusChamado",
    "obs" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "historico_chamado_pkey" PRIMARY KEY ("id_historico")
);

-- CreateIndex
CREATE UNIQUE INDEX "setor_nome_key" ON "setor"("nome");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");

-- AddForeignKey
ALTER TABLE "usuario" ADD CONSTRAINT "usuario_id_setor_fkey" FOREIGN KEY ("id_setor") REFERENCES "setor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chamado" ADD CONSTRAINT "chamado_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chamado" ADD CONSTRAINT "chamado_id_setor_fkey" FOREIGN KEY ("id_setor") REFERENCES "setor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historico_chamado" ADD CONSTRAINT "historico_chamado_id_chamado_fkey" FOREIGN KEY ("id_chamado") REFERENCES "chamado"("id_chamado") ON DELETE RESTRICT ON UPDATE CASCADE;
