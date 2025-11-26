"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "./ui/button";
import Link from "next/link";
import {
  AlertTriangle,
  CpuIcon,
  Home,
  LogOut,
  MoonIcon,
  PanelLeft,
  Settings2,
  SunIcon,
  Tickets,
  TicketsIcon,
  TriangleAlert,
  Users,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useTheme } from "next-themes";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import {
  AlertDialogAction,
  AlertDialogCancel,
} from "@radix-ui/react-alert-dialog";
import { Separator } from "./ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useAuth } from "@/context/AuthContext";

export default function Sidebar() {
  const { setTheme } = useTheme();

  const { user, logout } = useAuth();

  return (
    <div className="flex flex-col w-full bg-muted/40">
      {/* Menu Desktop/Notebook */}
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 border-r bg-background sm:flex flex-col">
        <nav className="flex flex-col items-center gap-4 px-2 py-5">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  className="flex h-9 w-9 shrink-0 items-center justify-center bg-primary text-primary-foreground rounded-full"
                  href="/dashboard"
                >
                  <CpuIcon className="h-6 w-6 text-red-700" />
                  <span className="sr-only">HelpDesk - Corp logo</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">HelpDesk Corp</TooltipContent>
            </Tooltip>

            {user?.tipo === "comum" && (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-foreground transition-colors hover:text-muted-foreground"
                      href="/dashboard"
                    >
                      <Home className="h-5 w-5" />
                      <span className="sr-only">Início</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">Início</TooltipContent>
                </Tooltip>

                <Separator />

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-foreground transition-colors hover:text-muted-foreground"
                      href="/mySummons"
                    >
                      <TicketsIcon className="h-5 w-5" />
                      <span className="sr-only">Tickets</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">Meus Tickets</TooltipContent>
                </Tooltip>
              </>
            )}

            {user?.tipo === "suporte" && (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-foreground transition-colors hover:text-muted-foreground"
                      href="/dashboard"
                    >
                      <Home className="h-5 w-5" />
                      <span className="sr-only">Início</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">Início</TooltipContent>
                </Tooltip>

                <Separator />

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-foreground transition-colors hover:text-muted-foreground"
                      href="/problems"
                    >
                      <AlertTriangle className="h-5 w-5" />
                      <span className="sr-only">Incidentes</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">Incidentes</TooltipContent>
                </Tooltip>
              </>
            )}

            {user?.tipo === "admin" && (
              <>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-foreground transition-colors hover:text-muted-foreground"
                      href="/dashboard"
                    >
                      <Home className="h-5 w-5" />
                      <span className="sr-only">Início</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">Início</TooltipContent>
                </Tooltip>

                <Separator />

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-foreground transition-colors hover:text-muted-foreground"
                      href="/summons"
                    >
                      <TicketsIcon className="h-5 w-5" />
                      <span className="sr-only">Tickets</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">Tickets</TooltipContent>
                </Tooltip>

                <Separator />

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-foreground transition-colors hover:text-muted-foreground"
                      href="/problems"
                    >
                      <AlertTriangle className="h-5 w-5" />
                      <span className="sr-only">Incidentes</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">Incidentes</TooltipContent>
                </Tooltip>

                <Separator />

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-foreground transition-colors hover:text-muted-foreground"
                      href="/users"
                    >
                      <Users className="h-5 w-5" />
                      <span className="sr-only">Usuários</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">Usuários</TooltipContent>
                </Tooltip>
              </>
            )}

            {/* <Separator />
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-foreground transition-colors hover:text-muted-foreground"
                  href="/faq"
                >
                  <HelpCircle className="h-5 w-5" />
                  <span className="sr-only">Ajuda</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">FAQ</TooltipContent>
            </Tooltip> */}
          </TooltipProvider>
        </nav>

        <nav className="mt-auto flex flex-col items-center gap-4 px-2 py-5">
          <DropdownMenu>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="flex h-9 w-9 items-center justify-center rounded-full cursor-pointer"
                      aria-label="Preferências"
                    >
                      <Avatar className="w-9 h-9">
                        <AvatarImage
                          src={
                            user?.foto_perfil
                              ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/usuarios/${user.foto_perfil}`
                              : undefined
                          }
                          alt={user?.nome ?? "U"}
                        />
                        <AvatarFallback>
                          {user?.nome?.[0] ?? "U"}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent side="right">Preferências</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <DropdownMenuContent className="w-56" align="start">
              <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {/* <DropdownMenuGroup>
                <Link href="/profile">
                  <DropdownMenuItem className="cursor-pointer">
                    Perfil
                    <DropdownMenuShortcut>⇧ + P</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuGroup>
                 */}
              <DropdownMenuLabel>Acessibilidade</DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="cursor-pointer">
                    Alterar tema
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => setTheme("light")}
                      >
                        <SunIcon className="h-4 w-4" /> Claro
                        {/* <DropdownMenuShortcut>⇧ + L</DropdownMenuShortcut> */}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => setTheme("dark")}
                      >
                        <MoonIcon className="h-4 w-4" /> Escuro
                        {/* <DropdownMenuShortcut>⇧ + D</DropdownMenuShortcut> */}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => setTheme("system")}
                      >
                        <Settings2 className="h-4 w-4" /> Sistema
                        {/* <DropdownMenuShortcut>⇧ + S</DropdownMenuShortcut> */}
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <Separator />

          {/* Botão de log out */}

          <AlertDialog>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <AlertDialogTrigger className="cursor-pointer">
                    <LogOut className="h-4 w-4 text-red-700 hover:text-red-500" />
                  </AlertDialogTrigger>
                </TooltipTrigger>
                <TooltipContent side="right">Sair da conta</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Você tem certeza disso?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação não poderá ser desfeita, você terá que{" "}
                  <span className="font-bold text-red-700">
                    logar novamente nesta conta
                  </span>{" "}
                  após o logout.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <div className="w-full flex items-center justify-between">
                  <AlertDialogCancel className="cursor-pointer p-2 rounded-lg bg-transparent border flex items-center justify-center">
                    Cancelar
                  </AlertDialogCancel>
                  <AlertDialogAction className="cursor-pointer p-2 rounded-lg border bg-gray-900 text-white flex items-center justify-center"
                  onClick={logout}
                  >
                    Continuar
                  </AlertDialogAction>
                </div>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </nav>
      </aside>

      {/* Menu Mobile */}
      <div className="sm:hidden flex flex-col sm:gap-4 sm:py-4 sm:pl-14 ">
        <header className="sticky top-0 z-30 flex h-14 items-center px-4 border-b bg-background gap-4 sm:static sm:auto sm:border-0 sm:bg-transparent sm:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <PanelLeft className="w-5 h-5" />
                <span className="sr-only">Abrir / Fechar menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xl">
              <SheetHeader className="sr-only">
                <SheetTitle>Configurações do menu suspenso</SheetTitle>
              </SheetHeader>
              <SheetDescription className="sr-only">
                Aqui estão disponíveis os links de navegação entre páginas
              </SheetDescription>
              <nav className="grid gap-6 text-lg font-medium p-2">
                <div className="w-auto h-auto flex gap-2 items-center">
                  <Link
                    href="/dashboard"
                    className="flex h-10 w-10 bg-primary rounded-full text-lg items-center justify-center text-primary-foreground md:text-base gap-5"
                    prefetch={false}
                  >
                    <CpuIcon className="h-5 w-5 transition-all" />
                    <span className="sr-only">HelpDesk - Corp Logo</span>
                  </Link>

                  <span>HelpDesk Corp</span>
                </div>

                {user?.tipo === "comum" && (
                  <>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-4 px-2.5 text-foreground hover:text-muted-foreground"
                      prefetch={false}
                    >
                      <Home className="h-5 w-5 transition-all" />
                      Início
                    </Link>

                    <Separator />

                    <Link
                      href="/mySummons"
                      className="flex items-center gap-4 px-2.5 text-foreground hover:text-muted-foreground"
                      prefetch={false}
                    >
                      <Tickets className="h-5 w-5 transition-all" />
                      My Tickets
                    </Link>
                  </>
                )}

                {user?.tipo === "suporte" && (
                  <>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-4 px-2.5 text-foreground hover:text-muted-foreground"
                      prefetch={false}
                    >
                      <Home className="h-5 w-5 transition-all" />
                      Início
                    </Link>

                    <Separator />

                    <Link
                      href="/issues"
                      className="flex items-center gap-4 px-2.5 text-foreground hover:text-muted-foreground"
                      prefetch={false}
                    >
                      <TriangleAlert className="h-5 w-5 transition-all" />
                      Incidentes
                    </Link>
                  </>
                )}

                {user?.tipo === "admin" && (
                  <>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-4 px-2.5 text-foreground hover:text-muted-foreground"
                      prefetch={false}
                    >
                      <Home className="h-5 w-5 transition-all" />
                      Início
                    </Link>
                    <Separator orientation="horizontal" />
                    <Link
                      href="/summons"
                      className="flex items-center gap-4 px-2.5 text-foreground hover:text-muted-foreground"
                      prefetch={false}
                    >
                      <Tickets className="h-5 w-5 transition-all" />
                      Tickets
                    </Link>
                    <Separator orientation="horizontal" />
                    <Link
                      href="/problems"
                      className="flex items-center gap-4 px-2.5 text-foreground hover:text-muted-foreground"
                      prefetch={false}
                    >
                      <TriangleAlert className="h-5 w-5 transition-all" />
                      Incidentes
                    </Link>
                    <Separator orientation="horizontal" />
                    <Link
                      href="/users"
                      className="flex items-center gap-4 px-2.5 text-foreground hover:text-muted-foreground"
                      prefetch={false}
                    >
                      <Users className="h-5 w-5 transition-all" />
                      Usuários
                    </Link>
                  </>
                )}

                {/* <Separator orientation="horizontal" />
                <Link
                  href="/faq"
                  className="flex items-center gap-4 px-2.5 text-foreground hover:text-muted-foreground"
                  prefetch={false}
                >
                  <HelpCircleIcon className="h-5 w-5 transition-all" />
                  FAQ
                </Link> */}
              </nav>

              <nav className="mt-auto flex flex-col items-start gap-4 px-2 py-5">
                <Separator />

                <AlertDialog>
                  <AlertDialogTrigger className="cursor-pointer pl-1">
                    <div className="w-auto flex gap-2 items-center">
                      <LogOut className="h-4 w-4 text-red-700 hover:text-red-500" />{" "}
                      Sair
                    </div>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Você tem certeza disso?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta ação não poderá ser desfeita, você terá que{" "}
                        <span className="font-bold text-red-700">
                          logar novamente nesta conta
                        </span>{" "}
                        após o logout.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <div className="w-full flex items-center justify-between">
                        <AlertDialogCancel className="cursor-pointer p-2 rounded-lg bg-transparent border flex items-center justify-center">
                          Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction className="cursor-pointer p-2 rounded-lg border bg-gray-900 text-white flex items-center justify-center"
                        onClick={logout}
                        >
                          Continuar
                        </AlertDialogAction>
                      </div>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </nav>
            </SheetContent>
          </Sheet>
          <Separator orientation="vertical" />
          <div className="w-full flex items-center justify-between gap-2">
            <div>
              <h2>Menu</h2>
            </div>
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className=" cursor-pointer flex h-auto w-auto shrink-0 items-center justify-center bg-transparent border hover:bg-gray-100 hover:text-gray-600 rounded-full">
                    <Avatar className="w-9 h-9">
                      <AvatarImage
                        src={
                          user?.foto_perfil
                            ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/usuarios/${user.foto_perfil}`
                            : undefined
                        }
                        alt={user?.nome ?? "U"}
                      />
                      <AvatarFallback>{user?.nome?.[0] ?? "U"}</AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="start">
                  <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
                  {/* <DropdownMenuGroup>
                     <DropdownMenuItem className="cursor-pointer">
                      Perfil
                      <DropdownMenuShortcut>⇧ + P</DropdownMenuShortcut>
                    </DropdownMenuItem>
                  </DropdownMenuGroup> */}
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Acessibilidade</DropdownMenuLabel>
                  <DropdownMenuGroup>
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger className="cursor-pointer">
                        Alterar tema
                      </DropdownMenuSubTrigger>
                      <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => setTheme("light")}
                          >
                            <SunIcon className="h-4 w-4" /> Claro
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => setTheme("dark")}
                          >
                            <MoonIcon className="h-4 w-4" /> Escuro
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => setTheme("system")}
                          >
                            <Settings2 className="h-4 w-4" /> Sistema
                          </DropdownMenuItem>
                        </DropdownMenuSubContent>
                      </DropdownMenuPortal>
                    </DropdownMenuSub>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>
      </div>
    </div>
  );
}
