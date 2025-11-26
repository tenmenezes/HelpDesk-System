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
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/routes/auth/login.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          senha,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        toast.error("Credenciais inválidas");
        setLoading(false);
        return;
      }

      const user = data.user; // <-- vindo do backend

      // 2. salva no AuthContext e localStorage
      login(user);

      // 3. redireciona por tipo
      if (user.tipo === "comum") {
        router.push("/mySummons");
      } else if (user.tipo === "suporte") {
        router.push("/problems");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      toast.error(err.message || "Erro ao logar");
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="w-screen h-screen flex items-center justify-center flex-col gap-5 p-2">
      <Card className="w-full sm:w-1/2">
        <CardHeader>
          <div className="w-auto flex items-center justify-between">
            <CardTitle>Login do usuário</CardTitle>
            <FileUserIcon className="w-8 h-8" />
          </div>
          <CardDescription>
            Realize o login para prosseguir para o site.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="flex w-full max-w-lg flex-col gap-6 items-center justify-center">
        <Tabs defaultValue="account" className="w-full">
          <TabsList>
            <TabsTrigger value="account" className="cursor-pointer">
              Login
            </TabsTrigger>
            <TabsTrigger value="password" className="cursor-pointer">
              Mudança de Senha
            </TabsTrigger>
          </TabsList>

          <TabsContent value="account">
            <form onSubmit={handleLogin}>
              <Card>
                <CardHeader>
                  <CardTitle>Conta</CardTitle>
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
            <Card>
              <CardHeader>
                <CardTitle>Alterar senha</CardTitle>
                <CardDescription>
                  Mude sua senha aqui. Depois de salva-la, você precisará logar
                  novamente.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 p-4">
                <div className="grid gap-3">
                  <Label htmlFor="tabs-demo-current">E-mail</Label>
                  <Input id="tabs-demo-current" type="password" placeholder="exemplo@gamil.com" />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="tabs-demo-new">Nova senha</Label>
                  <Input id="tabs-demo-new" type="password" placeholder="senha forte" />
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full cursor-pointer">Salvar senha</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
