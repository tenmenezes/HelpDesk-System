"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PatternFormat } from "react-number-format";
import { mutate } from "swr";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Usuario } from "../columns";

const formSchema = z.object({
  id: z.string().min(1, "ID é obrigatório"),
  username: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(1, "Telefone é obrigatório"),
  sector: z.string().min(1, "Setor é obrigatório"),
  type: z.string().min(1, "Tipo é obrigatório"),
});

type EditUserFormData = z.infer<typeof formSchema>;

interface EditUserProps {
  user: Usuario;
  onClose: () => void;
}

export function EditUserForm({ user, onClose }: EditUserProps) {
  const form = useForm<EditUserFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: String(user.id),
      username: user.nome,
      email: user.email,
      phone: user.telefone,
      sector: String(user.id_setor),
      type: user.tipo,
    },
  });

  const onSubmit = async (values: EditUserFormData) => {
    try {
      const payload = {
        id: parseInt(values.id),
        username: values.username,
        email: values.email,
        phone: values.phone,
        sector: parseInt(values.sector),
        type: values.type,
      };

      console.log("Enviando dados:", payload);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/routes/usuarios/edit.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      // Verifica se a resposta está OK
      if (!response.ok) {
        const text = await response.text();
        console.error("Resposta de erro:", response.status, text);
        toast.error(
          `Erro HTTP ${response.status}: ${text || "Erro ao atualizar"}`
        );
        return;
      }

      // Obtém o texto da resposta primeiro
      const responseText = await response.text();
      console.log("Resposta recebida:", responseText);

      // Verifica se a resposta está vazia
      if (!responseText || responseText.trim() === "") {
        console.error("Resposta vazia do servidor");
        toast.error("Erro: Servidor retornou resposta vazia");
        return;
      }

      // Tenta parsear o JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Erro ao parsear JSON:", parseError);
        console.error("Texto recebido:", responseText);
        toast.error("Erro: Resposta inválida do servidor");
        return;
      }

      if (data.success) {
        mutate("usuarios");
        toast.success("Funcionário atualizado!");
        onClose();
      } else {
        toast.error(data.error || "Erro ao atualizar.");
      }
    } catch (error) {
      console.error("Erro ao atualizar usuário:", error);
      toast.error("Erro ao atualizar usuário.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Nome..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email@exemplo.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telefone</FormLabel>
              <FormControl>
                <PatternFormat
                  format="(##) #####-####"
                  customInput={Input}
                  value={field.value}
                  onValueChange={(v) => field.onChange(v.formattedValue)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <FormField
            control={form.control}
            name="sector"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Setor</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Setor" />
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

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Tipo</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="comum">Comum</SelectItem>
                      <SelectItem value="suporte">Suporte</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full cursor-pointer">
          Salvar alterações
        </Button>
      </form>
    </Form>
  );
}
