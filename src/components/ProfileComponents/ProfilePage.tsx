"use client";

import { BadgeCheck, KeyRound, Mail, Shield, UserRound } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import ComponentProfileCrop from "../comp-554";
import { useAuth } from "@/context/AuthContext";
import ChangePasswordForm from "../LoginComponents/ChangePasswordForm";
import { Separator } from "../ui/separator";
import { StaggerContainer, StaggerItem } from "@/components/motion-primitives";

export default function Profile() {
  const { user } = useAuth();

  const tipoLabel =
    user?.tipo === "admin"
      ? "Administrador"
      : user?.tipo === "suporte"
        ? "Suporte"
        : "Usuario comum";

  return (
    <main className="sm:ml-14 p-4">
      <StaggerContainer className="flex flex-col gap-4">
        <StaggerItem>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <CardTitle>Perfil do usuario</CardTitle>
                  <CardDescription>
                    Gerencie sua foto, visualize seus dados atuais e mantenha sua
                    conta atualizada.
                  </CardDescription>
                </div>
                <UserRound className="h-6 w-6" />
              </div>
            </CardHeader>
          </Card>
        </StaggerItem>

        <StaggerContainer className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <StaggerItem>
            <Card>
              <CardHeader>
                <CardTitle>Informacoes da conta</CardTitle>
                <CardDescription>
                  Esta area exibe os dados principais usados pela aplicacao.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center gap-4 rounded-xl border border-border/60 bg-muted/20 p-5">
                  <ComponentProfileCrop
                    userId={user?.id}
                    currentImageUrl={user?.foto_url}
                    userName={user?.nome}
                  />
                  <Separator />
                  <div className="grid w-full gap-3 sm:grid-cols-2">
                    <div className="rounded-lg border bg-card p-4">
                      <div className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <BadgeCheck className="h-4 w-4" />
                        Nome
                      </div>
                      <p className="text-base font-semibold">{user?.nome ?? "—"}</p>
                    </div>

                    <div className="rounded-lg border bg-card p-4">
                      <div className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        E-mail
                      </div>
                      <p className="break-all text-base font-semibold">
                        {user?.email ?? "—"}
                      </p>
                    </div>

                    <div className="rounded-lg border bg-card p-4">
                      <div className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <Shield className="h-4 w-4" />
                        Perfil de acesso
                      </div>
                      <p className="text-base font-semibold">{tipoLabel}</p>
                    </div>

                    <div className="rounded-lg border bg-card p-4">
                      <div className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <KeyRound className="h-4 w-4" />
                        Senha
                      </div>
                      <p className="text-base font-semibold">Protegida por segurança</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </StaggerItem>

          <StaggerItem>
            <ChangePasswordForm initialEmail={user?.email ?? ""} />
          </StaggerItem>
        </StaggerContainer>
      </StaggerContainer>
    </main>
  );
}
