import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
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
import { Loader } from "lucide-react";
import { Separator } from "../ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    sector: "",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/routes/usuarios/insert.php`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            type: "admin", // Será ignorado pelo backend, mas incluído
          }),
        }
      );

      const data = await res.json();

      if (data.success) {
        toast.success("Administrador criado! Faça login para continuar.");
        setFormData({
          username: "",
          email: "",
          password: "",
          phone: "",
          sector: "",
        });

        // Mudar para aba de login
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
      <>
        <form onSubmit={handleRegister}>
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
              <div className="grid gap-3">
                <Label htmlFor="reg-username">Nome</Label>
                <Input
                  id="reg-username"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  placeholder="Seu nome completo"
                  required
                  minLength={2}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="reg-email">E-mail</Label>
                <Input
                  id="reg-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="exemplo@email.com"
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="reg-password">Senha</Label>
                <Input
                  id="reg-password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="Mínimo 6 caracteres"
                  required
                  minLength={6}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="reg-phone">Telefone</Label>
                <Input
                  id="reg-phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="(21) 99999-9999"
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="reg-sector">Setor</Label>
                <Select value={formData.sector} onValueChange={(value) => setFormData({ ...formData, sector: value })}>
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
                    <p>Cadastrando...</p>
                  </div>
                ) : (
                  "Cadastrar Administrador"
                )}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </>
    );
}
