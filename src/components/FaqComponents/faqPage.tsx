"use client";

import { useEffect } from "react";
import {
  Clock3,
  HelpCircleIcon,
  KeyRound,
  LifeBuoy,
  ShieldAlert,
  Ticket,
  UserCog,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StaggerContainer, StaggerItem } from "@/components/motion-primitives";

const faqSections = [
  {
    title: "Acesso e conta",
    icon: KeyRound,
    description: "Perguntas comuns sobre login, senha e perfil.",
    items: [
      {
        question: "Como faco login no sistema?",
        answer:
          "Use seu e-mail corporativo e a senha cadastrada na tela inicial. Depois do login, o sistema redireciona automaticamente conforme o seu perfil de acesso.",
      },
      {
        question: "Esqueci minha senha. O que devo fazer?",
        answer:
          "Se voce ainda souber a senha atual, acesse Perfil e altere a senha na area de seguranca. Se nao tiver mais acesso, entre em contato com um administrador para redefinicao.",
      },
      {
        question: "Posso trocar minha foto de perfil?",
        answer:
          "Sim. Acesse Perfil no menu do usuario, clique na foto atual e envie uma nova imagem em JPG, PNG ou WEBP com ate 4 MB.",
      },
    ],
  },
  {
    title: "Chamados",
    icon: Ticket,
    description: "Fluxo basico para criar, acompanhar e entender chamados.",
    items: [
      {
        question: "Como abrir um novo chamado?",
        answer:
          "Va para a tela de chamados correspondente ao seu perfil, preencha titulo, descricao, prioridade e envie. O registro sera associado ao seu usuario e ao setor selecionado.",
      },
      {
        question: "Como acompanho o andamento de um chamado?",
        answer:
          "Os status aparecem nas listagens do sistema. Voce pode acompanhar se o chamado esta aberto, em andamento, resolvido ou cancelado.",
      },
      {
        question: "Qual a diferenca entre prioridade e status?",
        answer:
          "Prioridade indica urgencia do atendimento. Status mostra a etapa atual do chamado dentro do fluxo de trabalho.",
      },
    ],
  },
  {
    title: "Perfis e permissoes",
    icon: UserCog,
    description: "O que cada tipo de usuario consegue acessar.",
    items: [
      {
        question: "O que um usuario comum pode fazer?",
        answer:
          "Usuarios comuns normalmente acessam seus proprios chamados, perfil e historico basico de atendimento.",
      },
      {
        question: "O que muda para suporte e administradores?",
        answer:
          "Perfis de suporte e admin acessam telas operacionais como dashboard, incidentes e outros fluxos de atendimento. Administradores tambem gerenciam usuarios.",
      },
      {
        question: "Por que nao vejo certas paginas no menu?",
        answer:
          "A navegacao e liberada conforme o perfil autenticado. Se uma tela nao aparece, provavelmente ela nao faz parte das permissoes da sua conta.",
      },
    ],
  },
  {
    title: "Boas praticas",
    icon: ShieldAlert,
    description: "Recomendacoes para uso seguro e eficiente do sistema.",
    items: [
      {
        question: "Quando devo usar prioridade alta?",
        answer:
          "Use prioridade alta apenas quando o problema impactar operacao critica, bloqueio de trabalho ou risco real ao atendimento.",
      },
      {
        question: "O que escrever na descricao do chamado?",
        answer:
          "Descreva o problema com contexto, sintomas, impacto, horario da ocorrencia e, se possivel, os passos para reproduzir. Isso agiliza o atendimento.",
      },
      {
        question: "Devo sair da conta ao terminar?",
        answer:
          "Sim, principalmente em computadores compartilhados. O logout fica disponivel no menu do usuario e pede confirmacao antes de encerrar a sessao.",
      },
    ],
  },
];

const quickTips = [
  {
    title: "Tempo de resposta",
    description: "Chamados com mais contexto costumam ser tratados com mais rapidez.",
    icon: Clock3,
  },
  {
    title: "Suporte",
    description: "Em duvidas operacionais, consulte a FAQ antes de abrir um chamado administrativo.",
    icon: LifeBuoy,
  },
  {
    title: "Conta",
    description: "Mantenha sua senha atualizada e sua foto de perfil reconhecivel pela equipe.",
    icon: HelpCircleIcon,
  },
];

export default function Ajuda() {
  useEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration;

    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);

    return () => {
      window.history.scrollRestoration = previousScrollRestoration;
    };
  }, []);

  return (
    <main className="sm:ml-14 p-4">
      <StaggerContainer className="flex flex-col gap-4">
        <StaggerItem>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <CardTitle>FAQ e ajuda rapida</CardTitle>
                  <CardDescription>
                    Orientacoes para acesso, uso do sistema e duvidas frequentes
                    do dia a dia.
                  </CardDescription>
                </div>
                <HelpCircleIcon className="h-6 w-6" />
              </div>
            </CardHeader>
          </Card>
        </StaggerItem>

        <StaggerContainer className="grid gap-4 md:grid-cols-3">
          {quickTips.map((tip) => {
            const Icon = tip.icon;

            return (
              <StaggerItem key={tip.title}>
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between gap-3">
                      <CardTitle className="text-lg">{tip.title}</CardTitle>
                      <Icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <CardDescription>{tip.description}</CardDescription>
                  </CardHeader>
                </Card>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        <StaggerContainer className="grid gap-4 xl:grid-cols-2">
          {faqSections.map((section) => {
            const Icon = section.icon;

            return (
              <StaggerItem key={section.title}>
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <CardTitle>{section.title}</CardTitle>
                        <CardDescription>{section.description}</CardDescription>
                      </div>
                      <Icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 p-4">
                    {section.items.map((item, index) => (
                      <div key={item.question}>
                        <div className="space-y-2">
                          <h3 className="text-sm font-semibold leading-6">
                            {item.question}
                          </h3>
                          <p className="text-sm text-muted-foreground leading-6">
                            {item.answer}
                          </p>
                        </div>
                        {index < section.items.length - 1 && (
                          <Separator className="mt-4" />
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </StaggerContainer>
    </main>
  );
}
