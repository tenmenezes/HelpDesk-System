"use client";

import { useState } from "react";
import { useLogin } from "@/hooks/useLogin";

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
import { FileUserIcon } from "lucide-react";

export default function Home() {
  const { login, loading, error } = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin() {
    login(email, password);
  }

  return (
    <>
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
              <Card>
                <CardHeader>
                  <CardTitle>Conta</CardTitle>
                  <CardDescription>Faça login aqui.</CardDescription>
                </CardHeader>

                <CardContent className="grid gap-6 p-4">
                  <div className="grid gap-3">
                    <Label>E-mail</Label>
                    <Input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="exemplo@email.com"
                    />
                  </div>

                  <div className="grid gap-3">
                    <Label>Senha</Label>
                    <Input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="***********"
                    />
                  </div>

                  {error && <p className="text-red-500">{error}</p>}
                </CardContent>

                <CardFooter>
                  <Button
                    className="w-full cursor-pointer"
                    onClick={handleLogin}
                    disabled={loading}
                  >
                    {loading ? "Carregando..." : "Logar"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="password">
              <Card>
                <CardHeader>
                  <CardTitle>Alterar senha</CardTitle>
                  <CardDescription>Mude sua senha aqui.</CardDescription>
                </CardHeader>

                <CardContent className="grid gap-6 p-4">
                  <div className="grid gap-3">
                    <Label>E-mail</Label>
                    <Input />
                  </div>
                  <div className="grid gap-3">
                    <Label>Nova senha</Label>
                    <Input type="password" />
                  </div>
                </CardContent>

                <CardFooter>
                  <Button className="w-full cursor-pointer">
                    Salvar senha
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
