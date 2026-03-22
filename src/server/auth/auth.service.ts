// src/server/auth/auth.service.ts
// Autenticação: login, change password

import { prisma } from "@/lib/prisma";
import { getAvatarUrl } from "@/lib/supabase";
import { signToken, SessionPayload } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function loginUsuario(email: string, senha: string): Promise<{
  token: string;
  user: SessionPayload & { foto_url: string | null };
}> {
  const usuario = await prisma.usuario.findUnique({
    where: { email },
    include: { setor: true },
  });

  if (!usuario) throw new Error("Usuário não encontrado");

  const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
  if (!senhaCorreta) throw new Error("Senha incorreta");

  const payload: SessionPayload = {
    id: usuario.id,
    email: usuario.email,
    tipo: usuario.tipo,
    nome: usuario.nome,
    id_setor: usuario.id_setor,
    foto_perfil: usuario.foto_perfil,
  };

  const token = signToken(payload);

  return {
    token,
    user: {
      ...payload,
      foto_url: getAvatarUrl(usuario.foto_perfil),
    },
  };
}

export async function changePassword(
  email: string,
  senhaAtual: string,
  novaSenha: string
): Promise<void> {
  const usuario = await prisma.usuario.findUnique({ where: { email } });
  if (!usuario) throw new Error("Usuário não encontrado");

  const senhaCorreta = await bcrypt.compare(senhaAtual, usuario.senha);
  if (!senhaCorreta) throw new Error("Senha atual incorreta");

  const novaHash = await bcrypt.hash(novaSenha, 10);
  await prisma.usuario.update({
    where: { id: usuario.id },
    data: { senha: novaHash },
  });
}
