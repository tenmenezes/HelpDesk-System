import { Users2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function View() {
  return (
    <Card className="flex-1 md:max-w[600px]">
      <CardHeader>
        <div className="flex items-center justify-center">
          <CardTitle className="text-lg sm:text-xl">Últimos usuários</CardTitle>
          <Users2 className="ml-auto w-8 h-8" />
        </div>
        <CardDescription>Novos usuários nas últimas 24 horas</CardDescription>
      </CardHeader>

      <CardContent className="pl-5 pr-5">
        <article className="flex items-center gap-2 border-b py-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src="https://github.com/tenmenezes.png" />
            <AvatarFallback>IMG</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm sm:text-base font-semibold">Yago Menezes</p>
            <span className="text-[12px] sm:text-sm text-gray-400">
              yago@email.com
            </span>
          </div>
        </article>

        <article className="flex items-center gap-2 border-b py-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src="https://github.com/devfraga.png" />
            <AvatarFallback>IMG</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm sm:text-base font-semibold">
              Sujeito Programador
            </p>
            <span className="text-[12px] sm:text-sm text-gray-400">
              devfraga@email.com
            </span>
          </div>
        </article>

        <article className="flex items-center gap-2 border-b py-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src="https://github.com/yasmimmantovani.png" />
            <AvatarFallback>IMG</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm sm:text-base font-semibold">
              Yasmim Mantovani
            </p>
            <span className="text-[12px] sm:text-sm text-gray-400">
              yasmim@email.com
            </span>
          </div>
        </article>

        <article className="flex items-center gap-2 border-b py-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src="https://github.com/RyanFitzgerald.png" />
            <AvatarFallback>IMG</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm sm:text-base font-semibold">
              Ryan Fitzgerald
            </p>
            <span className="text-[12px] sm:text-sm text-gray-400">
              ryan@email.com
            </span>
          </div>
        </article>

        <article className="flex items-center gap-2 border-b py-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src="https://github.com/larabeatrizms.png" />
            <AvatarFallback>IMG</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm sm:text-base font-semibold">
              Lara Beatriz
            </p>
            <span className="text-[12px] sm:text-sm text-gray-400">
              lara@email.com
            </span>
          </div>
        </article>
      </CardContent>
    </Card>
  );
}
