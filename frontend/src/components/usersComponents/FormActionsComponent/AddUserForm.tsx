"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PatternFormat } from "react-number-format";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import { PasswordInput } from "./PasswordInput";
import { mutate } from "swr";

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
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/routes/usuarios/insert.php`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      }
    );

    const data = await res.json();

    if (data.success) {
       mutate("usuarios");
      toast.success("Usuário criado com sucesso!");
    } else {
      toast.error("Erro ao criar usuário.");
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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

          <div className="w-auto flex items-center justify-between gap-2">
            <FormField
              control={form.control}
              name="sector"
              render={({ field }) => (
                <FormItem>
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
                        <SelectItem value="1">Arquitetura</SelectItem>
                        <SelectItem value="2">Contabilidade</SelectItem>
                        <SelectItem value="3">Engenharia</SelectItem>
                        <SelectItem value="4">Empreendedorismo</SelectItem>
                        <SelectItem value="5">Tecnologia</SelectItem>
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
                <FormItem>
                  <FormLabel>Setor</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
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

          <div className="w-full flex justify-between items-center">
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer"
              onClick={() => form.reset()}
            >
              Resetar
            </Button>

            <Button type="submit" className="cursor-pointer">
              Enviar
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
