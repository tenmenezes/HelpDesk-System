"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PatternFormat } from "react-number-format";

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
import { toast } from "sonner";
import { PasswordInput } from "../../PasswordInput";
import { mutate } from "swr";
import { Loader } from "lucide-react";
import { useState } from "react";

const formSchema = z.object({
  username: z.string().min(2, { message: "Min 2 caracteres." }).max(50),

  // validando email
  email: z
    .string()
    .min(1, "O e-mail é obrigatório.")
    .regex(
      /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
      "Digite um e-mail válido (ex: nome@dominio.com)."
    ),

  // validando senha
  password: z
    .string()
    .min(6, "Erro: Mínimo de 6 caracteres.")
    .regex(/[A-Z]/, "A senha deve conter uma letra maiúscula.")
    .regex(/[a-z]/, "A senha deve conter uma letra minúscula.")
    .regex(/[0-9]/, "A senha deve conter um número.")
    .regex(/[^A-Za-z0-9]/, "A senha deve conter um caractere especial."),

  // validando telefone
  phone: z
    .string()
    .min(15, "O celular é obrigatório.")
    .regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, "Formato inválido."),

  sector: z.string().min(1, "Selecione um setor."),
  type: z.string().min(1, "Selecione o tipo de usuário."),
});

export default function ProfileForm() {
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      phone: "",
      sector: "",
      type: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);

      const res = await fetch("/api/usuarios/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: values.username,
          email: values.email,
          password: values.password,
          phone: values.phone,
          sector: parseInt(values.sector),
          type: values.type,
        }),
      });

      const data = await res.json();

      if (data.success) {
        mutate("usuarios");
        form.reset();
        toast.success("Usuário criado com sucesso!");
      } else {
        toast.error(data.message || "Erro ao criar usuário.");
      }
    } catch {
      toast.error("Erro ao criar usuário.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex h-auto w-full max-w-full flex-col space-y-8"
        >
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do usuário" {...field} />
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
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input placeholder="email@exemplo.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <PasswordInput field={field} />
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
                <FormLabel>Celular</FormLabel>
                <FormControl>
                  <PatternFormat
                    format="(##) #####-####"
                    placeholder="(21) 99999-9999"
                    mask="_"
                    customInput={Input}
                    value={field.value}
                    onValueChange={(v) => field.onChange(v.formattedValue)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <FormField
              control={form.control}
              name="sector"
              render={({ field }) => (
                <FormItem className="w-full min-w-0">
                  <FormLabel>Setor</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione um setor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Recursos Humanos</SelectItem>
                        <SelectItem value="2">Financeiro</SelectItem>
                        <SelectItem value="3">
                          Atendimento ao Cliente
                        </SelectItem>
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
                <FormItem className="w-full min-w-0">
                  <FormLabel>Tipo de usuário</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione o tipo de suário" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="comum">Usuário comum</SelectItem>
                        <SelectItem value="suporte">Suporte técnico</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex w-full items-center justify-between gap-2">
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer"
              disabled={loading}
              onClick={() => form.reset()}
            >
              Resetar
            </Button>

            <Button type="submit" className="cursor-pointer" disabled={loading}>
              {loading ? (
                <div className="flex items-center gap-3">
                  <Loader className="h-4 w-4 animate-spin transition" />
                  <span>Enviando...</span>
                </div>
              ) : (
                "Enviar"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
