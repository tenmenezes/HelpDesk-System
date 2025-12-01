"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { insertChamado, updateChamado } from "../services/chamados";
import { Chamado } from "./types";
import { useAuth } from "@/context/AuthContext";
import { FileWarning } from "lucide-react";

const formSchema = z.object({
  titulo: z.string().min(3, "Mínimo de 3 caracteres").max(100),
  descricao: z.string().min(10, "Mínimo de 10 caracteres"),
  id_setor: z.string().min(1, "Selecione um setor"),
  status: z.enum(["aberto", "andamento", "resolvido", "cancelado"]).optional(),
  prioridade: z.enum(["baixa", "media", "alta"]).optional(),
});

interface ChamadoFormProps {
  chamado?: Chamado | null;
  onSuccess: () => void;
}

export function ChamadoForm({ chamado, onSuccess }: ChamadoFormProps) {
  const { user } = useAuth();

  console.log("Chamado feito pro usuário com id:", user?.id);

  // Verifica se o usuário pode editar status e prioridade
  const canEditStatusAndPriority =
    user?.tipo === "admin" || user?.tipo === "suporte";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titulo: chamado?.titulo || "",
      descricao: chamado?.descricao || "",
      id_setor:
        chamado?.id_setor.toString() || user?.id_setor?.toString() || "",
      status: chamado?.status || "aberto",
      prioridade: chamado?.prioridade || "baixa",
    },
  });

  // validando se usuário está logado
  if (!user?.id) {
    return (
      <div className="text-center py-4 w-auto flex items-center justify-center gap-4">
        <FileWarning className="h-8 w-8 text-red-800 animate-pulse" />
        <p className="text-red-600">Erro: Usuário não autenticado</p>
      </div>
    );
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (chamado) {
        // Editar
        const updateData: any = {
          id_chamado: chamado.id_chamado,
          titulo: values.titulo,
          descricao: values.descricao,
        };

        // Apenas admin e suporte podem atualizar status e prioridade
        if (canEditStatusAndPriority) {
          updateData.status = values.status;
          updateData.prioridade = values.prioridade;
        }

        const res = await updateChamado(updateData);

        if (res.success) {
          toast.success("Chamado atualizado com sucesso!");
          onSuccess();
        } else {
          toast.error(res.message || "Erro ao atualizar chamado");
        }
      } else {
        // Criar - sempre com valores padrão mais baixos
        const res = await insertChamado({
          id_usuario: Number(user?.id),
          id_setor: Number(values.id_setor),
          titulo: values.titulo,
          descricao: values.descricao,
          status: "aberto", // Sempre o mais baixo por padrão
          prioridade: "baixa", // Sempre o mais baixo por padrão
        });

        if (res.success) {
          toast.success("Chamado criado com sucesso!");
          form.reset();
          onSuccess();
        } else {
          toast.error(res.message || "Erro ao criar chamado.");
        }
      }
    } catch (error) {
      toast.error("Erro ao processar chamado");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="titulo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input placeholder="Título do chamado" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="descricao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descreva o problema ou solicitação"
                  {...field}
                  rows={5}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="id_setor"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Setor</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um setor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Recursos Humanos</SelectItem>
                      <SelectItem value="2">Financeiro</SelectItem>
                      <SelectItem value="3">Atendimento ao Cliente</SelectItem>
                      <SelectItem value="4">Comercial / Vendas</SelectItem>
                      <SelectItem value="5">Logística</SelectItem>
                      <SelectItem value="6">
                        Tecnologia da Informação
                      </SelectItem>
                      <SelectItem value="7">Infraestrutura</SelectItem>
                      <SelectItem value="8">Marketing</SelectItem>
                      <SelectItem value="9">Compras</SelectItem>
                      <SelectItem value="10">Jurídico</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Status - apenas para admin e suporte */}
          {canEditStatusAndPriority && (
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="aberto">Aberto</SelectItem>
                        <SelectItem value="andamento">Em Andamento</SelectItem>
                        <SelectItem value="resolvido">Resolvido</SelectItem>
                        <SelectItem value="cancelado">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {/* Prioridade - apenas para admin e suporte */}
          {canEditStatusAndPriority && (
            <FormField
              control={form.control}
              name="prioridade"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Prioridade</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="baixa">Baixa</SelectItem>
                        <SelectItem value="media">Média</SelectItem>
                        <SelectItem value="alta">Alta</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <div className="flex justify-between gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              form.reset();
              onSuccess();
            }}
          >
            Cancelar
          </Button>
          <Button type="submit">{chamado ? "Atualizar" : "Criar"}</Button>
        </div>
      </form>
    </Form>
  );
}
