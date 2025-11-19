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
  HelpCircle,
  Home,
  LayoutDashboard,
  LogOut,
  MoonIcon,
  Package,
  PanelLeft,
  Rabbit,
  Settings,
  Settings2,
  ShoppingBag,
  SunIcon,
  TicketsIcon,
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
  DropdownMenuShortcut,
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

export default function Sidebar() {
  const { setTheme } = useTheme();

  return (
    <div className="flex flex-col w-full bg-muted/40">
      {/* Menu Desktop/Notebook */}
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 border-r bg-background sm:flex flex-col">
        <nav className="flex flex-col items-center gap-4 px-2 py-5">
          <TooltipProvider>
            <Link
              className="flex h-9 w-9 shrink-0 items-center justify-center bg-primary text-primary-foreground rounded-full"
              href="/"
            >
              <Rabbit className="h-6 w-6" />
              <span className="sr-only">HelpDesk - Corp logo</span>
            </Link>

            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-foreground transition-colors hover:text-muted-foreground"
                  href="/"
                >
                  <Home className="h-5 w-5" />
                  <span className="sr-only">Início</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Início</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-foreground transition-colors hover:text-muted-foreground"
                  href="/summons"
                >
                  <TicketsIcon className="h-5 w-5" />
                  <span className="sr-only">Chamados</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Chamados</TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-foreground transition-colors hover:text-muted-foreground"
                  href="/problems"
                >
                  <AlertTriangle className="h-5 w-5" />
                  <span className="sr-only">Problemas</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Problemas</TooltipContent>
            </Tooltip>

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
            </Tooltip>
          </TooltipProvider>
        </nav>

        <nav className="mt-auto flex flex-col items-center gap-4 px-2 py-5">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className=" cursor-pointer flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-transparent border text-gray-500 hover:bg-gray-100 hover:text-gray-600"
                    >
                      <Settings className="h-5 w-5" />
                      <span className="sr-only">Configurações</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="start">
                    <DropdownMenuLabel>Minha conta</DropdownMenuLabel>
                    <DropdownMenuGroup>
                      <DropdownMenuItem className="cursor-pointer">
                        Perfil
                        <DropdownMenuShortcut>⇧ + P</DropdownMenuShortcut>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
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
              </TooltipTrigger>
              <TooltipContent side="right">Configurações</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <AlertDialog>
            <AlertDialogTrigger className="cursor-pointer">
              <LogOut className="h-4 w-4 text-red-700 hover:text-red-500" />
            </AlertDialogTrigger>
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
                  <AlertDialogCancel>
                    <Button variant="outline" className="cursor-pointer">
                      Cancelar
                    </Button>
                  </AlertDialogCancel>
                  <AlertDialogAction>
                    <Button className="cursor-pointer">Continuar</Button>
                  </AlertDialogAction>
                </div>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </nav>
      </aside>

      {/* Menu Mobile */}
      <div className="sm:hidden flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
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
                <Link
                  href="#"
                  className="flex h-10 w-10 bg-primary rounded-full text-lg items-center justify-center text-primary-foreground md:text-base gap-5"
                  prefetch={false}
                >
                  <LayoutDashboard className="h-5 w-5 transition-all" />
                  <span className="sr-only">Logo do projeto</span>
                </Link>

                <Link
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-foreground hover:text-muted-foreground"
                  prefetch={false}
                >
                  <Home className="h-5 w-5 transition-all" />
                  Início
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-foreground hover:text-muted-foreground"
                  prefetch={false}
                >
                  <ShoppingBag className="h-5 w-5 transition-all" />
                  Pedidos
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-foreground hover:text-muted-foreground"
                  prefetch={false}
                >
                  <Package className="h-5 w-5 transition-all" />
                  Produtos
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-foreground hover:text-muted-foreground"
                  prefetch={false}
                >
                  <Users className="h-5 w-5 transition-all" />
                  Clientes
                </Link>
              </nav>

              <nav className="mt-auto flex flex-col items-start gap-4 px-2 py-5">
                <Link
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-foreground hover:text-muted-foreground"
                  prefetch={false}
                >
                  <Settings className="h-5 w-5 transition-all" />
                  Configurações
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <h2>Menu</h2>
        </header>
      </div>
    </div>
  );
}
