import { Loader } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { Separator } from "../ui/separator";

export default function ChangePasswordForm() {
  const [email, setEmail] = useState("");
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/routes/auth/change_password.php`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            senhaAtual,
            novaSenha,
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        toast.success("Senha alterada com sucesso! Faça login novamente.");
        setEmail("");
        setSenhaAtual("");
        setNovaSenha("");
      } else {
        toast.error(data.error || "Erro ao alterar senha");
      }
    } catch (err: unknown) {
      console.error("Erro ao alterar senha:", err);
      toast.error("Erro ao alterar senha");
    } finally {
      setLoading(false);
    }
  }

    return (
      <>
        <form onSubmit={handleChangePassword}>
          <Card>
            <CardHeader>
              <CardTitle>Alterar senha</CardTitle>
              <Separator className="my-2" />
              <CardDescription>
                Mude sua senha aqui. Depois de salvá-la, você precisará fazer
                login novamente.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6 p-4">
              <div className="grid gap-3">
                <Label htmlFor="change-email">E-mail</Label>
                <Input
                  id="change-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemplo@email.com"
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="change-senha-atual">Senha Atual</Label>
                <Input
                  id="change-senha-atual"
                  type="password"
                  value={senhaAtual}
                  onChange={(e) => setSenhaAtual(e.target.value)}
                  placeholder="Sua senha atual"
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="change-nova-senha">Nova Senha</Label>
                <Input
                  id="change-nova-senha"
                  type="password"
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  placeholder="Nova senha forte"
                  minLength={6}
                  required
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
                  <div className="w-auto flex items-center justify-between gap-4">
                    <Loader className="h-5 w-5 animate-spin transition" />
                    <p>Alterando...</p>
                  </div>
                ) : (
                  "Salvar senha"
                )}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </>
    );
}
