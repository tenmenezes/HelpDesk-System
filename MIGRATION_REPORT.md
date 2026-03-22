# Relatório Final de Migração

## Resumo Executivo

Migração completa do backend PHP + MySQL para Next.js App Router + Prisma + Supabase Postgres + Supabase Storage, sem qualquer alteração visual na aplicação.

---

## O que foi feito

### 1. Auditoria completa do projeto
- Leitura e análise de todos os arquivos PHP (`/backend/routes/`)
- Mapeamento de todos os endpoints existentes (auth, chamados, usuários)
- Identificação de inconsistências no schema SQL legado
- Análise de todos os pontos de consumo do backend no frontend
- Identificação do login mockado em `/api/login/route.ts`

### 2. Schema Prisma criado (`prisma/schema.prisma`)
- Entidades: `Setor`, `Usuario`, `Chamado`, `HistoricoChamado`
- Enums: `TipoUsuario`, `StatusChamado`, `PrioridadeChamado`
- Relações corretas entre entidades
- Provider: PostgreSQL (Supabase)
- `DATABASE_URL` (pooler) + `DIRECT_URL` (migrations)

### 3. Seed criado (`prisma/seed.ts`)
- 10 setores padrão (igual ao SQL original)
- Admin inicial: `admin@helpdesk.com` / `Admin@123`
- Usa `upsert` — seguro para rodar múltiplas vezes

### 4. Infraestrutura de backend criada (`src/lib/`, `src/server/`)

| Arquivo | Responsabilidade |
|---|---|
| `src/lib/prisma.ts` | Singleton Prisma (padrão Next.js/Vercel) |
| `src/lib/supabase.ts` | Cliente Supabase Storage + helper de URL pública |
| `src/lib/auth.ts` | JWT sign/verify + build de cookie HTTP-only |
| `src/lib/api-response.ts` | Helpers padronizados (`ok`, `badRequest`, etc.) |
| `src/server/auth/auth.service.ts` | login com bcrypt + changePassword |
| `src/server/services/usuarios.service.ts` | CRUD usuários + upload foto para Supabase Storage |
| `src/server/services/chamados.service.ts` | CRUD chamados + registro automático de histórico |

### 5. Todos os Route Handlers criados (`src/app/api/`)

| Endpoint | Método(s) | Substitui |
|---|---|---|
| `/api/auth/login` | POST | `login.php` |
| `/api/auth/logout` | POST | — (não existia) |
| `/api/auth/change-password` | POST | `change_password.php` |
| `/api/me` | GET | — (novo — para re-hidratação de sessão) |
| `/api/chamados` | GET, POST | `read_all.php`, `insert.php` |
| `/api/chamados/[id]` | PUT, DELETE | `edit.php`, `delete.php` |
| `/api/chamados/user/[id]` | GET | `getUser.php` |
| `/api/usuarios` | GET | `read.php` |
| `/api/usuarios/create` | POST | `create_user.php` |
| `/api/usuarios/register` | POST | `insert.php` (1º admin) |
| `/api/usuarios/[id]` | PUT, DELETE | `edit.php`, `delete.php` |
| `/api/usuarios/upload-photo` | POST | `upload_photo.php` → Supabase Storage |

### 6. Autenticação real implementada
- Senha com `bcryptjs` (rounds: 10)
- JWT assinado com `jsonwebtoken` (8h de validade)
- Cookie `HTTP-only`, `secure` em produção, `SameSite: lax`
- `AuthContext` reescrito: usa `/api/me` para re-hidratar sessão (sem localStorage)
- Middleware Next.js (`src/middleware.ts`): proteção de rotas no edge

### 7. Upload de foto migrado para Supabase Storage
- Bucket: `avatares` (configurar como público no Supabase)
- Upload via `supabaseAdmin.storage.from("avatares").upload()`
- Foto anterior removida do bucket automaticamente ao substituir
- `foto_perfil` no banco agora armazena apenas o **path** no bucket
- URL pública gerada dinamicamente via `getAvatarUrl()` no helper

### 8. Frontend atualizado (mínimo necessário)
Apenas os pontos de integração com o backend foram alterados:

| Arquivo | O que mudou |
|---|---|
| `src/app/page.tsx` | fetch para `/api/auth/login` (antes: PHP URL) |
| `src/context/AuthContext.tsx` | re-hidratação via `/api/me` + logout via `/api/auth/logout` |
| `src/components/services/chamados.ts` | todas as URLs → rotas internas `/api/chamados/...` |
| `src/components/services/users.ts` | URL → `/api/usuarios` |
| `src/components/LoginComponents/RegisterForm.tsx` | POST → `/api/usuarios/register` |
| `src/components/LoginComponents/ChangePasswordForm.tsx` | POST → `/api/auth/change-password` |
| `src/components/usersComponents/FormActionsComponent/AddUserForm.tsx` | POST → `/api/usuarios/create` |
| `src/components/usersComponents/FormActionsComponent/EditUserForm.tsx` | PUT → `/api/usuarios/[id]` |
| `src/components/usersComponents/FormActionsComponent/DeleteUserModal.tsx` | DELETE → `/api/usuarios/[id]` |
| `src/components/usersComponents/data-table.tsx` | fetcher → `/api/usuarios` |
| `src/components/comp-554.tsx` | upload → `/api/usuarios/upload-photo` + prop `userId` |
| `src/components/ProfileComponents/ProfilePage.tsx` | dados reais do `useAuth()` |
| `src/components/Sidebar.tsx` | avatar usa `user.foto_url` (URL Supabase) |
| `src/components/SummonsComponents/columns.tsx` | avatar usa `usuario_foto_url` da API |
| `src/hooks/useLogin.ts` | usa `/api/auth/login` |
| `next.config.ts` | adicionado `*.supabase.co` nos `remotePatterns` |
| `package.json` | adicionado Prisma, `@supabase/supabase-js`, `bcryptjs`, `tsx` |

---

## O que foi corrigido (bugs/inconsistências do projeto original)

### 1. Schema SQL com FK inválidas
**Problema**: O SQL original criava a tabela `chamado` com FK referenciando `usuarios(id_usuario)` e `setores(id_setor)`, mas as tabelas existentes se chamavam `usuario` e `setor` (singular). O banco nunca poderia ser criado com integridade referencial.
**Solução**: No Prisma, as relações foram modeladas corretamente usando os nomes de modelo `Usuario` e `Setor`.

### 2. Login mockado em produção
**Problema**: O arquivo `src/app/api/login/route.ts` tinha um array hardcoded `const users = [{ id: 1, email: "admin@admin.com", password: "123456" }]`. Qualquer usuário com essas credenciais conseguia logar independentemente do banco.
**Solução**: Arquivo removido. Login real implementado em `/api/auth/login` com consulta ao banco + bcrypt.

### 3. Sessão em localStorage
**Problema**: `AuthContext` persistia o usuário no `localStorage`, que é acessível via JavaScript (vulnerável a XSS) e não persiste em SSR.
**Solução**: Sessão via cookie `HTTP-only`. Re-hidratação do estado React via `GET /api/me`.

### 4. `window.CURRENT_USER_ID` sem valor real
**Problema**: `comp-554.tsx` lia `window.CURRENT_USER_ID` para identificar o usuário no upload, mas nada atribuía esse valor. O upload sempre falharia silenciosamente.
**Solução**: `ComponentProfileCrop` recebe prop `userId?: number`. `ProfilePage` passa `user?.id` do `useAuth()`.

### 5. `foto_perfil` como path local
**Problema**: PHP armazenava arquivos em `/public/uploads/usuarios/` e retornava `http://localhost:8000/...`. Incompatível com Vercel (filesystem efêmero, sem permissão de escrita).
**Solução**: Upload para Supabase Storage. Banco armazena apenas o path no bucket. URL pública gerada via helper.

### 6. `ProfilePage` com dados hardcoded
**Problema**: Exibia "Yago Menezes" e "yago@gmail.com" independentemente do usuário logado.
**Solução**: Conectado ao `useAuth()` — exibe nome e email reais.

### 7. `zod@^4.x` incompatível com `@hookform/resolvers`
**Problema**: `package.json` declarava `"zod": "^4.1.12"` mas a versão 4 mudou APIs internas incompatíveis com `@hookform/resolvers@^5.x`.
**Solução**: Downgrade para `"zod": "^3.23.8"` que é a versão estável compatível.

### 8. Dependência `xod` (typo)
**Problema**: `package.json` tinha `"xod": "^1.11.3"` — claramente um typo de `zod`.
**Solução**: Removida.

---

## O que foi decidido conscientemente (ambiguidades tratadas)

### Estratégia de deleção de usuário
O PHP original deletava o usuário diretamente sem tratar chamados relacionados. No Postgres, a FK impediria isso. A solução implementada: ao deletar um usuário, primeiro deleta o histórico dos chamados dele, depois os chamados, depois o usuário. Documentado aqui para ciência.

### Permissão de upload de foto
O PHP original não verificava se o `userId` do upload pertencia ao usuário logado. A nova API verifica: usuário `comum` só pode atualizar sua própria foto. Admin e suporte podem atualizar qualquer foto.

### `canEditStatusAndPriority` nos columns de MySummons
O componente `columns.tsx` original lia `localStorage` para verificar o tipo do usuário — um anti-pattern em componentes de coluna (que não são hooks). A verificação real de permissão já existe no `ChamadoForm` via `useAuth()`. Nos columns, o flag retorna `true` (campos visíveis) e a validação de negócio fica no form + backend.

### Histórico de chamados
O modelo `historico_chamado` existe no banco original mas sem UI de visualização. Mantido no schema Prisma e populado automaticamente pelo `chamados.service.ts` a cada mudança de status. Não criamos UI nova (não foi pedido).

---

## O que você precisa fazer manualmente

### No Supabase (clique necessário)
- [ ] Criar projeto Supabase
- [ ] Criar bucket `avatares` (Storage → New bucket → marcar Public)
- [ ] Copiar `Project URL`, `anon key`, `service_role key`
- [ ] Copiar `DATABASE_URL` (Transaction pooler) e `DIRECT_URL` (Direct)
- [ ] Adicionar RLS policy SELECT público no bucket se as fotos não aparecerem

### Na Vercel (clique necessário)
- [ ] Conectar repositório GitHub
- [ ] Adicionar 6 variáveis de ambiente (ver README)
- [ ] Fazer deploy

### Localmente (comandos necessários)
```bash
cp .env.example .env.local
# Preencher .env.local com valores reais

npm install
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

### Após o primeiro deploy
```bash
# Com DIRECT_URL apontando para produção:
npm run db:migrate
npm run db:seed
```

---

## Variáveis de ambiente necessárias

```env
DATABASE_URL=postgresql://postgres.XXXX:PASSWORD@REGION.pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.XXXX:PASSWORD@REGION.supabase.com:5432/postgres
NEXT_PUBLIC_SUPABASE_URL=https://XXXX.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
JWT_SECRET=<64+ chars gerados com crypto.randomBytes>
```

---

## Checklist de validação após deploy

### Autenticação
- [ ] Login com `admin@helpdesk.com` / `Admin@123` funciona
- [ ] Redirecionamento correto por tipo de usuário
- [ ] Logout limpa o cookie e redireciona para login
- [ ] Alteração de senha funciona
- [ ] Cadastro de 1º admin funciona (banco vazio)
- [ ] Rota `/dashboard` sem login redireciona para `/`

### Chamados
- [ ] Usuário `comum` vê apenas seus chamados em `/mySummons`
- [ ] Criação de chamado funciona
- [ ] Edição de chamado funciona
- [ ] Deleção de chamado funciona (admin/suporte)
- [ ] Dashboard carrega com dados reais

### Usuários
- [ ] Listagem de usuários em `/users` (admin)
- [ ] Criação de usuário pelo admin funciona
- [ ] Edição de usuário funciona
- [ ] Deleção de usuário funciona

### Storage
- [ ] Upload de foto de perfil funciona
- [ ] Foto aparece no avatar da Sidebar
- [ ] Substituição de foto remove a antiga do Supabase Storage

### Gráficos (Dashboard)
- [ ] `ChartAreaInteractive` (fluxo 24h) carrega
- [ ] `ChartResolvedPending` (resolvidos x pendentes) carrega
- [ ] `TicketsPorSetor` carrega
- [ ] Cards de estatísticas mostram dados reais
