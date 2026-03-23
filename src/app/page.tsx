"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import ChangePasswordForm from "@/components/LoginComponents/ChangePasswordForm";
import RegisterForm from "@/components/LoginComponents/RegisterForm";
import { Separator } from "@/components/ui/separator";
import { PageTransition } from "@/components/motion-primitives";

export default function Home() {
  const { login, refreshUser } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("account");

  async function handleLogin(e?: React.FormEvent) {
    e?.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ email, senha }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.message || "Credenciais inválidas");
        setLoading(false);
        return;
      }

      const userData = data.user;
      const user = {
        ...userData,
        id: userData.id,
      };

      // Salva no AuthContext (cookie já foi setado pelo servidor)
      login(user);
      await refreshUser();

      const destino = user.tipo === "comum" ? "/mySummons" : "/dashboard";
      router.replace(destino);
      router.refresh();
    } catch (err: unknown) {
      console.error("Erro ao logar:", err);
      toast.error((err as Error).message || "Erro ao logar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageTransition className="flex min-h-screen items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.985 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="flex w-full max-w-lg flex-col gap-6 items-center justify-center"
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
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
        </Tabs>

        <div className="relative w-full min-h-[34rem]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="w-full"
            >
              {activeTab === "account" ? (
                <motion.form
                  layout
                  onSubmit={handleLogin}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.18 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Conta</CardTitle>
                      <Separator className="my-2" />
                      <CardDescription>
                        Faça login aqui. Clique em logar e entre na sua conta,
                        caso exista.
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
                          <p>Logar</p>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.form>
              ) : activeTab === "password" ? (
                <motion.div layout whileHover={{ y: -2 }} transition={{ duration: 0.18 }}>
                  <ChangePasswordForm />
                </motion.div>
              ) : (
                <motion.div layout whileHover={{ y: -2 }} transition={{ duration: 0.18 }}>
                  <RegisterForm />
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </PageTransition>
  );
}
