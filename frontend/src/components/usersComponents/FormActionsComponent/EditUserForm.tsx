"use client";

import { z } from "zod";
import { SubmitHandler, useForm } from "react-hook-form";
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
  id: z.number(),
  username: z.string().min(2),
  email: z.string().email(),
  phone: z.string(),
  sector: z.string(),
  type: z.string(),
});

interface EditUserProps {
  user: Usuario;
  onClose: () => void;
}

type EditUserFormData = {
  id: number;
  username: string;
  email: string;
  phone: string;
  sector: string;
  type: string;
};

export function EditUserForm({ user, onClose }: EditUserProps) {
  const form = useForm<EditUserFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: user.id_usuario,
      username: user.nome,
      email: user.email,
      phone: user.telefone,
      sector: user.id_setor,
      type: user.tipo,
    },
  });

  const onSubmit: SubmitHandler<EditUserFormData> = async (values) => {
    console.log("submit chamado", values);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/routes/usuarios/edit.php`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      }
    );

    const data = await response.json();

    if (data.success) {
      console.log(data);
      mutate("usuarios");
      toast.success("Usuário atualizado!");
      onClose();
    } else {
      console.log(data);
      toast.error("Erro ao atualizar.");
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Setor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Arquitetura</SelectItem>
                      <SelectItem value="2">Contabilidade</SelectItem>
                      <SelectItem value="3">Engenharia</SelectItem>
                      <SelectItem value="4">Empreendedorismo</SelectItem>
                      <SelectItem value="5">Tecnologia</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
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
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="comum">Comum</SelectItem>
                      <SelectItem value="suporte">Suporte</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
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
