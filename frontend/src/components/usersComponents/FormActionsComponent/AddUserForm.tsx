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

const formSchema = z.object({
  username: z.string().min(2, { message: "Min 2 caracteres." }).max(50),
  email: z.string().email("E-mail inválido."),
  password: z
    .string()
    .min(6, "Erro: Mínimo de 6 caracteres.")
    .regex(/[A-Z]/, "A senha deve conter uma letra maiúscula.")
    .regex(/[a-z]/, "A senha deve conter uma letra minúscula.")
    .regex(/[0-9]/, "A senha deve conter um número.")
    .regex(/[^A-Za-z0-9]/, "A senha deve conter um caractere especial."),
  phone: z
    .string()
    .min(14, "O celular é obrigatório.")
    .regex(/^\(d{2}\)\s\d{4,5}-\d{4}$/, "Formato inválido."),
  sector: z.string().min(1, "Selecione um setor."),
  type: z.string().min(1, "Selecione o tipo de funcionário.")
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

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast.success("Funcionário criado com sucesso!");
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Nome do funcionário" {...field} />
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
                  onValueChange={(v) => field.onChange(v.value)}
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
                      <SelectItem value="arquitetura">Arquitetura</SelectItem>
                      <SelectItem value="contabilidade">
                        Contabilidade
                      </SelectItem>
                      <SelectItem value="engenharia">Engenharia</SelectItem>
                      <SelectItem value="empreendedorismo">
                        Empreendedorismo
                      </SelectItem>
                      <SelectItem value="tecnologia">Tecnologia</SelectItem>
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
                      <SelectValue placeholder="Selecione o tipo de funcionário" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="comum">Funcionário comum</SelectItem>
                      <SelectItem value="suporte">
                        Suporte técnico
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormDescription>
          Este é o formulário de criação de cadastro de funcionário.
        </FormDescription>

        <div className="w-full flex justify-between items-center">
          <Button type="reset" variant="outline" className="cursor-pointer">
            Resetar
          </Button>

          <Button type="submit" className="cursor-pointer">
            Enviar
          </Button>
        </div>
      </form>
    </Form>
  );
}
