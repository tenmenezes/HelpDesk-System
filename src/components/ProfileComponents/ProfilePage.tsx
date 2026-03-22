"use client";

import { UserRound } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import ComponentProfileCrop from "../comp-554";
import { Button } from "../ui/button";
import { useAuth } from "@/context/AuthContext";

export default function Profile() {
  const { user } = useAuth();

  return (
    <>
      <div className="mt-4 ml-4 md:ml-18 lg:ml-18 sm:ml-18 mr-4 mb-4 flex flex-col gap-2">
        <Card>
          <CardHeader>
            <div className="w-auto flex items-center justify-between">
              <CardTitle>Perfil do usuário</CardTitle>
              <UserRound className="h-6 w-6" />
            </div>
            <CardDescription>
              Perfil com dados sensíveis do usuário.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              Alterar foto de perfil
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-auto h-auto flex flex-col gap-5 items-center ">
              <ComponentProfileCrop userId={user?.id} />
              <ul>
                <li>Nome: {user?.nome ?? "—"}</li>
                <li>E-mail: {user?.email ?? "—"}</li>
                <li>Senha: **********</li>
              </ul>
              <Button className="w-auto cursor-pointer">Alterar senha</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
