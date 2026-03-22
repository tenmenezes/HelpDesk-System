// prisma/seed.ts
// Seed inicial para desenvolvimento
// Cria os 10 setores padrão do sistema e um usuário admin inicial

import { PrismaClient, TipoUsuario } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const setores = [
  "Recursos Humanos",
  "Financeiro",
  "Atendimento ao Cliente",
  "Comercial / Vendas",
  "Logística",
  "Tecnologia da Informação",
  "Infraestrutura",
  "Marketing",
  "Compras",
  "Jurídico",
];

async function main() {
  console.log("🌱 Iniciando seed...");

  // Criar setores
  for (const nome of setores) {
    await prisma.setor.upsert({
      where: { nome },
      update: {},
      create: { nome },
    });
  }
  console.log(`✅ ${setores.length} setores criados/verificados`);

  // Verificar se já existe admin
  const adminExistente = await prisma.usuario.findFirst({
    where: { tipo: TipoUsuario.admin },
  });

  if (!adminExistente) {
    const tiSetor = await prisma.setor.findFirst({
      where: { nome: "Tecnologia da Informação" },
    });

    if (!tiSetor) throw new Error("Setor TI não encontrado");

    const senhaHash = await bcrypt.hash("Admin@123", 10);

    await prisma.usuario.create({
      data: {
        nome: "Administrador",
        email: "admin@helpdesk.com",
        senha: senhaHash,
        telefone: "(00) 00000-0000",
        tipo: TipoUsuario.admin,
        id_setor: tiSetor.id,
      },
    });

    console.log("✅ Usuário admin criado:");
    console.log("   Email: admin@helpdesk.com");
    console.log("   Senha: Admin@123");
    console.log("   ⚠️  Altere a senha após o primeiro login!");
  } else {
    console.log("ℹ️  Admin já existe, pulando criação.");
  }

  console.log("🎉 Seed concluído!");
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
