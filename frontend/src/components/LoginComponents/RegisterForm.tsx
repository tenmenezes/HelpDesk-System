import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PatternFormat } from "react-number-format";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader } from "lucide-react";
import { Separator } from "../ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PasswordInput } from "./PasswordInput";

const formSchema = z.object({
  username: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z
    .string()
    .min(1, "O e-mail é obrigatório.")
    .email("Digite um e-mail válido"),
  password: z
    .string()
    .min(6, "Mínimo de 6 caracteres")
    .regex(/[A-Z]/, "A senha deve conter uma letra maiúscula")
    .regex(/[a-z]/, "A senha deve conter uma letra minúscula")
    .regex(/[0-9]/, "A senha deve conter um número")
    .regex(/[^A-Za-z0-9]/, "A senha deve conter um caractere especial"),
  phone: z
    .string()
    .min(15, "Telefone é obrigatório")
    .regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, "Formato inválido"),
  sector: z.string().min(1, "Selecione um setor"),
});

export default function RegisterForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      phone: "",
      sector: "",
    },
  });

  const [loading, setLoading] = useState(false);

  async function handleRegister(values: z.infer<typeof formSchema>) {
    setLoading(true);

    try {
      // Verificar duplicatas antes de enviar
      const checkRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/routes/usuarios/read.php`
      );
      const usuarios = await checkRes.json();

      const emailExists = usuarios.some((u: any) => u.email === values.email);
      const phoneExists = usuarios.some(
        (u: any) => u.telefone === values.phone
      );

      if (emailExists) {
        form.setError("email", { message: "Email já cadastrado" });
        setLoading(false);
        return;
      }

      if (phoneExists) {
        form.setError("phone", { message: "Telefone já cadastrado" });
        setLoading(false);
        return;
      }

      // Enviar dados
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/routes/usuarios/insert.php`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...values,
            type: "admin",
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        toast.success("Administrador criado! Faça login para continuar.");
        form.reset();

        setTimeout(() => {
          const loginTab = document.querySelector(
            '[value="account"]'
          ) as HTMLElement;
          loginTab?.click();
        }, 1500);
      } else {
        toast.error(data.message || "Erro ao criar conta");
      }
    } catch (err: unknown) {
      console.error("Erro ao criar conta:", err);
      toast.error("Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleRegister)}>
        <Card>
          <CardHeader>
            <CardTitle>Cadastro</CardTitle>
            <Separator className="my-2" />
            <CardDescription>
              Cadastre-se como primeiro administrador do sistema. Este
              formulário só estará disponível se não houver usuários
              cadastrados.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 p-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Seu nome completo" {...field} />
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
                    <Input
                      type="email"
                      placeholder="exemplo@email.com"
                      {...field}
                    />
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
                  <FormLabel>Telefone</FormLabel>
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

            <FormField
              control={form.control}
              name="sector"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Setor</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
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
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={loading}
            >
              {loading ? (
                <div className="w-auto flex items-center justify-between gap-4">
                  <Loader className="h-5 w-5 animate-spin transition" />
                  <p>Cadastrando...</p>
                </div>
              ) : (
                "Cadastrar Administrador"
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
