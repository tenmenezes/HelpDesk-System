// src/server/services/chamados.service.ts
// Toda a lógica de negócio relacionada a chamados

import { prisma } from "@/lib/prisma";
import { getAvatarUrl } from "@/lib/supabase";
import { PrioridadeChamado, StatusChamado } from "@prisma/client";

function mapChamado(c: {
  id_chamado: number;
  titulo: string;
  descricao: string;
  status: StatusChamado;
  prioridade: PrioridadeChamado;
  criado_em: Date;
  atualizado_em: Date;
  id_setor: number;
  id_usuario: number;
  setor?: { nome: string } | null;
  usuario?: { nome: string; foto_perfil: string | null } | null;
}) {
  return {
    id_chamado: c.id_chamado,
    titulo: c.titulo,
    descricao: c.descricao,
    status: c.status,
    prioridade: c.prioridade,
    criado_em: c.criado_em.toISOString(),
    atualizado_em: c.atualizado_em.toISOString(),
    id_setor: c.id_setor,
    setor_nome: c.setor?.nome ?? "",
    id_usuario: c.id_usuario,
    usuario_nome: c.usuario?.nome ?? "",
    usuario_foto: c.usuario?.foto_perfil ?? null,
    usuario_foto_url: getAvatarUrl(c.usuario?.foto_perfil ?? null),
  };
}

export async function getAllChamados() {
  const chamados = await prisma.chamado.findMany({
    include: { setor: true, usuario: true },
    orderBy: { criado_em: "desc" },
  });
  return chamados.map(mapChamado);
}

export async function getChamadosByUsuario(userId: number) {
  const chamados = await prisma.chamado.findMany({
    where: { id_usuario: userId },
    include: { setor: true, usuario: true },
    orderBy: { criado_em: "desc" },
  });
  return chamados.map(mapChamado);
}

export async function createChamado(data: {
  id_usuario: number;
  id_setor: number;
  titulo: string;
  descricao: string;
  status?: StatusChamado;
  prioridade?: PrioridadeChamado;
}) {
  const novo = await prisma.chamado.create({
    data: {
      id_usuario: data.id_usuario,
      id_setor: data.id_setor,
      titulo: data.titulo,
      descricao: data.descricao,
      status: data.status ?? "aberto",
      prioridade: data.prioridade ?? "baixa",
    },
    include: { setor: true, usuario: true },
  });
  return { success: true, message: "Chamado criado com sucesso", id: novo.id_chamado };
}

export async function updateChamado(
  id: number,
  data: {
    status?: StatusChamado;
    prioridade?: PrioridadeChamado;
    titulo?: string;
    descricao?: string;
  }
) {
  const current = await prisma.chamado.findUnique({ where: { id_chamado: id } });
  if (!current) throw new Error("Chamado não encontrado");

  // Registrar histórico se status mudou
  if (data.status && data.status !== current.status) {
    await prisma.historicoChamado.create({
      data: {
        id_chamado: id,
        status_antigo: current.status,
        status_novo: data.status,
      },
    });
  }

  await prisma.chamado.update({
    where: { id_chamado: id },
    data: {
      ...(data.status !== undefined && { status: data.status }),
      ...(data.prioridade !== undefined && { prioridade: data.prioridade }),
      ...(data.titulo !== undefined && { titulo: data.titulo }),
      ...(data.descricao !== undefined && { descricao: data.descricao }),
    },
  });

  return { success: true, message: "Chamado atualizado com sucesso" };
}

export async function deleteChamado(id: number) {
  await prisma.historicoChamado.deleteMany({ where: { id_chamado: id } });
  await prisma.chamado.delete({ where: { id_chamado: id } });
  return { success: true, message: "Chamado deletado com sucesso" };
}
