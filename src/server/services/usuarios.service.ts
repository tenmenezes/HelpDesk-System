// src/server/services/usuarios.service.ts
// Toda a lógica de negócio relacionada a usuários

import { prisma } from "@/lib/prisma";
import { getAvatarUrl, supabaseAdmin, AVATAR_BUCKET } from "@/lib/supabase";
import bcrypt from "bcryptjs";

// Mapeamento de usuário para resposta pública (sem senha)
function mapUsuario(u: {
  id: number;
  nome: string;
  email: string;
  telefone: string | null;
  id_setor: number;
  tipo: string;
  foto_perfil: string | null;
  setor?: { nome: string } | null;
  criado_em?: Date;
}) {
  return {
    id: u.id,
    nome: u.nome,
    email: u.email,
    telefone: u.telefone ?? "",
    id_setor: u.id_setor,
    setor: u.setor?.nome ?? "",
    tipo: u.tipo,
    foto: u.foto_perfil,
    foto_url: getAvatarUrl(u.foto_perfil),
  };
}

export async function getAllUsuarios() {
  const usuarios = await prisma.usuario.findMany({
    include: { setor: true },
    orderBy: { nome: "asc" },
  });
  return usuarios.map(mapUsuario);
}

export async function getUsuarioById(id: number) {
  const u = await prisma.usuario.findUnique({
    where: { id },
    include: { setor: true },
  });
  if (!u) return null;
  return mapUsuario(u);
}

export async function createUsuario(data: {
  username: string;
  email: string;
  password: string;
  phone: string;
  sector: number;
  type: "comum" | "suporte" | "admin";
}) {
  // Checar email duplicado
  const emailExist = await prisma.usuario.findUnique({ where: { email: data.email } });
  if (emailExist) throw new Error("Email já cadastrado");

  // Checar telefone duplicado
  const phoneExist = await prisma.usuario.findFirst({ where: { telefone: data.phone } });
  if (phoneExist) throw new Error("Telefone já cadastrado");

  const senhaHash = await bcrypt.hash(data.password, 10);

  const novoUsuario = await prisma.usuario.create({
    data: {
      nome: data.username,
      email: data.email,
      senha: senhaHash,
      telefone: data.phone,
      id_setor: data.sector,
      tipo: data.type,
    },
    include: { setor: true },
  });

  return mapUsuario(novoUsuario);
}

export async function registerFirstAdmin(data: {
  username: string;
  email: string;
  password: string;
  phone: string;
  sector: number;
}) {
  // Só permite se não houver usuários ainda
  const count = await prisma.usuario.count();
  if (count > 0) {
    throw new Error("Cadastro de novos usuários está desabilitado. Contate um administrador.");
  }

  const senhaHash = await bcrypt.hash(data.password, 10);

  const novoAdmin = await prisma.usuario.create({
    data: {
      nome: data.username,
      email: data.email,
      senha: senhaHash,
      telefone: data.phone,
      id_setor: data.sector,
      tipo: "admin",
    },
    include: { setor: true },
  });

  return mapUsuario(novoAdmin);
}

export async function updateUsuario(
  id: number,
  data: {
    username: string;
    email: string;
    phone: string;
    sector: number;
    type: "comum" | "suporte" | "admin";
  }
) {
  const updated = await prisma.usuario.update({
    where: { id },
    data: {
      nome: data.username,
      email: data.email,
      telefone: data.phone,
      id_setor: data.sector,
      tipo: data.type,
    },
    include: { setor: true },
  });
  return mapUsuario(updated);
}

export async function deleteUsuario(id: number) {
  // Deletar chamados relacionados (e seu histórico) antes de deletar o usuário
  const chamados = await prisma.chamado.findMany({ where: { id_usuario: id } });
  for (const c of chamados) {
    await prisma.historicoChamado.deleteMany({ where: { id_chamado: c.id_chamado } });
  }
  await prisma.chamado.deleteMany({ where: { id_usuario: id } });
  await prisma.usuario.delete({ where: { id } });
}

export async function uploadFotoPerfil(userId: number, fileBuffer: Buffer, mimeType: string) {
  const ext = mimeType === "image/png" ? "png" : mimeType === "image/webp" ? "webp" : "jpg";
  const path = `user_${userId}_${Date.now()}.${ext}`;

  // Fazer upload para o Supabase Storage
  const { error } = await supabaseAdmin.storage
    .from(AVATAR_BUCKET)
    .upload(path, fileBuffer, {
      contentType: mimeType,
      upsert: false,
    });

  if (error) throw new Error(`Erro no upload: ${error.message}`);

  // Buscar foto anterior para remover
  const usuario = await prisma.usuario.findUnique({ where: { id: userId }, select: { foto_perfil: true } });
  if (usuario?.foto_perfil && !usuario.foto_perfil.startsWith("http")) {
    await supabaseAdmin.storage.from(AVATAR_BUCKET).remove([usuario.foto_perfil]);
  }

  // Atualizar no banco
  const updated = await prisma.usuario.update({
    where: { id: userId },
    data: { foto_perfil: path },
    include: { setor: true },
  });

  return {
    ...mapUsuario(updated),
    foto_url: getAvatarUrl(path)!,
  };
}
