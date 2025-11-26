# Help Desk Corp 🛠️

![GitHub repo size](https://img.shields.io/github/repo-size/iuricode/README-template?style=for-the-badge)
![GitHub language count](https://img.shields.io/github/languages/count/tenmenezes/HelpDesk-System?style=for-the-badge)
![GitHub forks](https://img.shields.io/github/forks/tenmenezes/HelpDesk-System?style=for-the-badge)
![Bitbucket open issues](https://img.shields.io/bitbucket/issues/tenmenezes/HelpDesk-System?style=for-the-badge)
![Bitbucket open pull requests](https://img.shields.io/bitbucket/pr-raw/tenmenezes/HelpDesk-System?style=for-the-badge)

<img src="./HelpDeskPrint.jpg" alt="Print da tela principal do site">

---

> Sistema de Help Desk para gestão de chamados internos — versão universitária, com backend em PHP e frontend em Next.js 16+.

---

## Índice

- [Sobre](#sobre)  
- [Funcionalidades](#funcionalidades)  
- [Tecnologias](#tecnologias)  
- [Pré-requisitos](#pré-requisitos)  
- [Como rodar localmente](#como-rodar-localmente)  
- [Estrutura do Projeto](#estrutura-do-projeto)  
- [Como contribuir](#como-contribuir)  
- [Licença](#licença)  
- [Autores](#autores)  

---

## Sobre

O **Help Desk Corp** é um sistema de chamado/ticket para uso interno (ex: atendimento de TI, suporte, helpdesk universitário, etc). O projeto tem como objetivo permitir:

- cadastro de usuários (técnicos, administradores e solicitantes);  
- abertura, edição e acompanhamento de chamados;  
- histórico de alterações por chamado;  
- interface web moderna com Next.js + React;  
- backend em PHP com MySQL;  

Este projeto está sendo desenvolvido no âmbito acadêmico como parte do curso de Análise e Desenvolvimento de Sistemas, e serve como um portfólio bem estruturado de full-stack (backend + frontend + banco).

---

## Funcionalidades

- ✅ Cadastro de usuários com diferentes papéis (usuário, técnico, administrador)  
- ✅ Autenticação / autorização básica  
- ✅ CRUD de chamados — criação, edição, atualização de status  
- ✅ Histórico de trocas / atualizações dos chamados  
- ✅ Listagem tabular de usuários e chamados com filtros, paginação e ordenação  
- ✅ Dashboard básico (dependendo da versão)  
- ✅ Interface responsiva (desktop / mobile)  
- ✅ Conexão com banco MySQL  

---

## Tecnologias

Este projeto utiliza as seguintes tecnologias:

- **Backend**  
  - PHP  
  - MySQL  
- **Frontend**  
  - Next.js 16+  
  - React
  - Shadcn UI | Origin UI (componentes)
  - TanStack Table (para tabelas)
  - React Hook Form (para formulários)
  - SWR (para fetch e mutação de dados)  
  - TypeScript
- **Outros**  
  - fetch para chamadas HTTP
  - TailwindCSS

---

## Pré-requisitos

> Antes de rodar o projeto localmente, certifique-se de ter instalado:

- PHP (versão compatível)  
- MySQL (ou MariaDB)  
- Node.js + npm/yarn (para o frontend)  
- (Opcional) Composer

---

## Como rodar localmente

### 1. Backend (PHP + MySQL)

```bash
# Clone o repositório (caso ainda não tenha feito)

git clone https://github.com/tenmenezes/HelpDesk-System.git

cd HelpDesk-System/backend

# Configure o banco de dados

# - crie uma base no MySQL
# - importe o script SQL (helpdesk.sql)
# - configure credenciais no arquivo de configuração (ex: .env / config.php)

# Inicie o servidor PHP (modo de desenvolvimento)

php -S localhost:8000   # ou conforme sua configuração
```
# 2. Frontend (Next.js)

```
cd ../frontend   # caminho para a pasta do frontend
npm install      # ou yarn / pnpm
npm run dev      # ou yarn dev / pnpm dev

# Abra no navegador: http://localhost:3000
```

> ⚠️ Certifique-se de que o backend esteja rodando e configurado corretamente antes de iniciar o frontend.

---

# Estrutura do Projeto

```
/HelpDesk-System
│
├── backend/           # código PHP + configuração do banco
│   ├── public/        # (se aplicável) arquivos públicos
│   ├── src/           # classes, controllers, rotas, etc.
│   ├── config/        # configuração do banco e do app
│   └── …              
│
├── frontend/          # código do Next.js + React
│   ├── pages/         # páginas da aplicação
│   ├── components/    # componentes React (formulário, tabela, etc.)
│   ├── hooks/         # hooks customizados (ex: para SWR)
│   ├── styles/        # estilos / CSS / SCSS
│   └── …              
│
├── .gitignore  
├── README.md          # este arquivo
└── LICENSE            # licença do projeto
```

> Essa estrutura separa claramente backend e frontend, facilitando manutenção e deploy modular.

---

# Colaboradores

> Agradecemos às seguintes pessoas que contribuíram para este projeto:

<table>
  <tr>
    <td align="center">
      <a href="#" title="Yago Menezes">
        <img src="https://github.com/tenmenezes.png" width="100px;" alt="Foto do Yago Menezes no GitHub"/><br>
        <sub>
          <b>Yago Menezes</b>
        </sub>
      </a>
    </td> 
  </tr>
</table>

---

# Como contribuir

## Contribuições são bem-vindas! Se quiser colaborar:

- 1. Faça um fork deste repositório.


- 2. Crie uma branch para sua feature ou bugfix (git checkout -b feature/minha-feature).


- 3. Faça suas alterações e commit (use mensagens claras).


- 4. Abra um pull request descrevendo a mudança.



> Se for bug fix, tente incluir testes (se aplicável). Se for feature, descreva o objetivo e o uso esperado.


---

# Licença

## Este projeto está licenciado sob a MIT License — sinta-se livre para usar, modificar e distribuir.

---

# Autores

- Yago Menezes, estudante de Análise e Desenvolvimento de Sistemas - [portfólio](https://tenmenezes.github.io).

- (Outros colaboradores) — sinta-se à vontade para adicionar seu nome se fizer contribuições significativas.



---

> 📝 Observação: este repositório está em desenvolvimento. Algumas funcionalidades ainda podem estar faltando ou instáveis. Use por sua conta e risco, e contribuições são mais do que bem-vindas 💪
