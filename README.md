# HelpDesk System — Migrado para Vercel + Supabase

> **Backend PHP + MySQL → Next.js App Router + Prisma + Supabase Postgres + Supabase Storage**

---

## Visão Geral

Sistema de Help Desk corporativo com gestão de chamados (tickets), usuários e setores. Três perfis:

| Perfil | Acesso |
|---|---|
| `admin` | Dashboard, chamados, usuários (CRUD), incidentes |
| `suporte` | Dashboard, incidentes, chamados (visualização) |
| `comum` | Apenas seus próprios chamados |

---

## Stack Final

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 16 (App Router) |
| Linguagem | TypeScript |
| ORM | Prisma 5 |
| Banco de dados | Supabase Postgres |
| Storage (fotos) | Supabase Storage |
| Autenticação | JWT em cookie HTTP-only |
| Validação | Zod 3 |
| UI | React 19, Tailwind 4, shadcn/ui, Recharts, TanStack Table |
| Deploy | Vercel (free tier) |

---

## O que foi migrado / corrigido

### Backend PHP removido → API Routes internas

| PHP (removido) | Next.js Route Handler (novo) |
|---|---|
| `routes/auth/login.php` | `/api/auth/login/route.ts` |
| `routes/auth/change_password.php` | `/api/auth/change-password/route.ts` |
| `routes/chamados/read_all.php` | `GET /api/chamados` |
| `routes/chamados/insert.php` | `POST /api/chamados` |
| `routes/chamados/edit.php` | `PUT /api/chamados/[id]` |
| `routes/chamados/delete.php` | `DELETE /api/chamados/[id]` |
| `routes/chamados/getUser.php` | `GET /api/chamados/user/[id]` |
| `routes/usuarios/read.php` | `GET /api/usuarios` |
| `routes/usuarios/create_user.php` | `POST /api/usuarios/create` |
| `routes/usuarios/insert.php` | `POST /api/usuarios/register` |
| `routes/usuarios/edit.php` | `PUT /api/usuarios/[id]` |
| `routes/usuarios/delete.php` | `DELETE /api/usuarios/[id]` |
| `routes/usuarios/upload_photo.php` | `POST /api/usuarios/upload-photo` |

### Bugs corrigidos
- **Login mockado**: `/api/login/route.ts` tinha usuário hardcoded (`admin@admin.com/123456`) — substituído por autenticação real com bcrypt + banco
- **Schema SQL inconsistente**: FK referenciava `usuarios`/`setores` (plural) mas tabelas eram `usuario`/`setor` (singular) — corrigido no Prisma
- **localStorage para sessão**: vulnerável e sem suporte a SSR — substituído por cookie HTTP-only + `/api/me`
- **window.CURRENT_USER_ID**: hack sem persistência — substituído por prop `userId` do AuthContext
- **foto_perfil era path local**: incompatível com Vercel — migrado para Supabase Storage
- **ProfilePage com dados hardcoded** ("Yago Menezes") — conectado ao usuário real logado

### Visual preservado
Todas as páginas, componentes, classes CSS/Tailwind, bibliotecas visuais, rotas e UX permanecem idênticos ao original.

---

## Configuração Local

### 1. Instalar dependências
```bash
npm install
```

### 2. Criar .env.local
```bash
cp .env.example .env.local
# Edite .env.local com os valores do seu projeto Supabase
```

### 3. Gerar cliente Prisma
```bash
npm run db:generate
```

### 4. Rodar migrations
```bash
npm run db:migrate
```

### 5. Rodar seed
```bash
npm run db:seed
```
Cria os 10 setores e um admin inicial:
- **Email**: `admin@helpdesk.com`
- **Senha**: `Admin@123`
- ⚠️ Altere a senha após o primeiro login!

### 6. Iniciar servidor
```bash
npm run dev
```
Acesse [http://localhost:3000](http://localhost:3000)

---

## Configuração do Supabase

### 1. Criar projeto
1. Acesse [supabase.com](https://supabase.com) → **New Project**
2. Escolha nome, senha e região (`South America - São Paulo` recomendado)
3. Aguarde ~2 minutos

### 2. Obter chaves de API
**Settings → API:**
- `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
- `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `service_role` → `SUPABASE_SERVICE_ROLE_KEY` (**nunca exponha no cliente**)

### 3. Obter connection strings
**Settings → Database → Connection string:**
- **Transaction** (pooler) → `DATABASE_URL` (runtime)
  ```
  postgresql://postgres.XXXX:PASSWORD@aws-0-REGION.pooler.supabase.com:6543/postgres?pgbouncer=true
  ```
- **Direct** → `DIRECT_URL` (migrations)
  ```
  postgresql://postgres.XXXX:PASSWORD@aws-0-REGION.supabase.com:5432/postgres
  ```

### 4. Criar bucket de avatares
1. **Storage → New bucket**
2. Nome: `avatares` (exato — hardcoded no código)
3. Marcar como **Public bucket**
4. Clique em **Save**

### 5. Policy do bucket (se fotos não aparecerem)
**Storage → Policies → avatares → New Policy:**
```sql
CREATE POLICY "Public read avatares"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatares');
```

---

## Deploy na Vercel

### 1. Push para GitHub e importar na Vercel
1. Push do projeto para um repositório GitHub
2. [vercel.com](https://vercel.com) → **Add New Project** → Import
3. Framework: **Next.js** (detectado automaticamente)
4. Root directory: deixar em branco

### 2. Variáveis de ambiente na Vercel
**Settings → Environment Variables:**

| Variável | Valor |
|---|---|
| `DATABASE_URL` | Connection string pooler (Transaction) |
| `DIRECT_URL` | Connection string direta |
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave anon |
| `SUPABASE_SERVICE_ROLE_KEY` | Chave service_role |
| `JWT_SECRET` | String aleatória forte (64+ chars) |

**Gerar JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3. Rodar migrations após deploy
```bash
# Instale a CLI da Vercel se necessário
npm i -g vercel
# Baixe as env vars de produção
vercel env pull .env.production.local
# Rode as migrations apontando para o banco de produção
DATABASE_URL="$(grep DIRECT_URL .env.production.local | cut -d= -f2-)" npm run db:migrate
npm run db:seed
```

---

## Comandos Prisma

```bash
npm run db:generate      # Gerar cliente (após mudanças no schema)
npm run db:migrate:dev   # Criar e aplicar migration (dev)
npm run db:migrate       # Aplicar migrations pendentes (produção)
npm run db:push          # Push direto (prototipagem sem migration)
npm run db:seed          # Rodar seed
npm run db:studio        # Abrir Prisma Studio (GUI)
```

---

## Estrutura do Projeto (nova)

```
.
├── prisma/
│   ├── schema.prisma          # Schema Postgres (Setor, Usuario, Chamado, Historico)
│   └── seed.ts                # Seed: 10 setores + admin inicial
├── src/
│   ├── app/
│   │   ├── api/               # Todos os Route Handlers (substituem PHP)
│   │   │   ├── auth/login, logout, change-password
│   │   │   ├── me/            # Sessão atual (GET)
│   │   │   ├── chamados/      # CRUD chamados
│   │   │   └── usuarios/      # CRUD usuários + upload foto
│   │   └── ...pages           # Páginas (inalteradas visualmente)
│   ├── lib/
│   │   ├── prisma.ts          # Singleton Prisma
│   │   ├── supabase.ts        # Cliente Supabase Storage
│   │   ├── auth.ts            # JWT + cookies HTTP-only
│   │   └── api-response.ts    # Helpers de resposta
│   ├── middleware.ts           # Proteção de rotas (edge)
│   └── server/
│       ├── services/          # Lógica de negócio (usuarios, chamados)
│       └── auth/              # Serviço de autenticação
└── .env.example               # Template de variáveis
```

---

## Variáveis de Ambiente

| Variável | Visibilidade | Descrição |
|---|---|---|
| `DATABASE_URL` | Servidor | Connection pooler (runtime serverless) |
| `DIRECT_URL` | Servidor | Conexão direta (migrations DDL) |
| `NEXT_PUBLIC_SUPABASE_URL` | Cliente + Servidor | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Cliente + Servidor | Chave anon pública |
| `SUPABASE_SERVICE_ROLE_KEY` | Servidor apenas | Chave privilegiada (upload, storage) |
| `JWT_SECRET` | Servidor apenas | Chave para assinar tokens JWT |

---

## O que depende de ação manual sua

### No Supabase
- [ ] Criar o projeto
- [ ] Criar bucket `avatares` (Storage → New bucket → Public)
- [ ] Adicionar RLS policy se fotos não aparecerem
- [ ] Copiar as connection strings e API keys

### Na Vercel
- [ ] Importar repositório
- [ ] Configurar todas as variáveis de ambiente
- [ ] Rodar migrations após primeiro deploy

### Localmente
- [ ] Criar `.env.local` com valores reais
- [ ] Rodar `npm install` + `db:generate` + `db:migrate` + `db:seed`
- [ ] **Alterar senha do admin** criado pelo seed

---

## Checklist de Produção

- [ ] Todas as variáveis de ambiente configuradas na Vercel
- [ ] `JWT_SECRET` com 64+ caracteres aleatórios
- [ ] `SUPABASE_SERVICE_ROLE_KEY` em variável **sem** prefixo `NEXT_PUBLIC_`
- [ ] Bucket `avatares` criado e configurado como público
- [ ] Migrations aplicadas em produção
- [ ] Seed rodado (ou admin criado pelo formulário de cadastro)
- [ ] Senha do admin inicial alterada
- [ ] Testar login
- [ ] Testar criação de chamado (perfil `comum`)
- [ ] Testar dashboard + gráficos (perfil `admin`)
- [ ] Testar upload de foto de perfil
- [ ] Testar CRUD de usuários (perfil `admin`)

---

## Troubleshooting

**`PrismaClientInitializationError` no build**
→ `DATABASE_URL` não está configurada nas env vars da Vercel.

**Migrations falham (`connection refused` ou `prepared statement`)**
→ Use `DIRECT_URL` para migrations, não `DATABASE_URL` (pooler não suporta DDL). Confirme `directUrl = env("DIRECT_URL")` no `schema.prisma`.

**Fotos não aparecem após upload**
→ Verifique se o bucket `avatares` é público. Se não, adicione a RLS policy de SELECT público.

**Login retorna 401 com credenciais corretas**
→ Rode `npm run db:seed` para garantir que o admin existe. Ou use o formulário de cadastro (disponível apenas quando não há usuários no banco).

**Cookie de sessão não persiste**
→ `JWT_SECRET` precisa ser igual em todos os deploys. Verifique que está configurada na Vercel.

**Build falha com `Cannot find module 'zod'`**
→ Projeto original usava `"xod"` (typo). Já corrigido para `"zod": "^3.23.8"`. Rode `npm install`.

**`@hookform/resolvers` incompatível com zod**
→ A migração usa `zod@^3.23.8`. Não faça upgrade para `zod@^4.x` sem verificar compatibilidade com `@hookform/resolvers`.
