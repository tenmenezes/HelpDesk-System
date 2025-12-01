"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUserIcon, Loader } from "lucide-react";
import { useAuth } from "@/context/AuthContext"; // ajuste o path se necessário
import { toast } from "sonner";
import ChangePasswordForm from "@/components/LoginComponents/ChangePasswordForm";
import RegisterForm from "@/components/LoginComponents/RegisterForm";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e?: React.FormEvent) {
    e?.preventDefault();
    setLoading(true);

    try {
      // 1. Faz a requisição ao backend PHP
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/routes/auth/login.php`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            senha,
          }),
        }
      );

      const data = await res.json();

      if (!data.success) {
        toast.error("Credenciais inválidas");
        setLoading(false);
        return;
      }

      const userData = data.user; // <-- vindo do backend

      const user = {
        ...userData,
        id: userData.id_usuario || userData.id, // mapeando id_usuario para id (caso eu troque sem querer)
      }

      // salvando no AuthContext e localStorage
      login(user);

      // redirecionando por tipo
      if (user.tipo === "comum") {
        router.push("/mySummons");
      } else if (user.tipo === "suporte") {
        router.push("/dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (err: unknown) {
      console.error("Erro ao logar:", err);
      toast.error((err as Error).message || "Erro ao logar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-auto h-auto flex items-center justify-center flex-col gap-5 p-2 ">
      <div className="flex w-full max-w-lg flex-col gap-6 items-center justify-center">
        <Tabs defaultValue="account" className="w-full">
          <TabsList>
            <TabsTrigger value="account" className="cursor-pointer">
              Login
            </TabsTrigger>
            <TabsTrigger value="password" className="cursor-pointer">
              Mudança de Senha
            </TabsTrigger>
            <TabsTrigger value="register" className="cursor-pointer">
              Cadastro
            </TabsTrigger>
          </TabsList>

          <TabsContent value="account">
            <form onSubmit={handleLogin}>
              <Card>
                <CardHeader>
                  <CardTitle>Conta</CardTitle>
                  <Separator className="my-2" />
                  <CardDescription>
                    Faça login aqui. Clique em logar e entre na sua conta, caso
                    exista.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6 p-4">
                  <div className="grid gap-3">
                    <Label htmlFor="login-email">E-mail</Label>
                    <Input
                      id="login-email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="exemplo@email.com"
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="login-senha">Senha</Label>
                    <Input
                      id="login-senha"
                      type="password"
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      placeholder="senha forte"
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    type="submit"
                    className="w-full cursor-pointer"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="w-auto flex items center justify-between gap-4">
                        <Loader className="h-5 w-5 animate-spin transition" />
                        <p>Entrando...</p>
                      </div>
                    ) : (
                      <>
                        <p>Logar</p>
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </TabsContent>

          <TabsContent value="password">
            <ChangePasswordForm />
          </TabsContent>

          <TabsContent value="register">
            <RegisterForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
