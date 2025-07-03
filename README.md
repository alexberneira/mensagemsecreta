# Inbox Secreta

Sistema de caixas de entrada anônimas onde usuários podem receber mensagens anônimas através de um link público.

## Funcionalidades

- ✅ Cadastro e login com email/senha
- ✅ Recuperação de senha
- ✅ Link público para envio de mensagens anônimas
- ✅ Dashboard privado para visualizar mensagens
- ✅ Sistema de resposta anônima
- ✅ Links únicos para visualizar respostas
- ✅ Sistema de pagamento simulado (paywall)

## Configuração do Supabase

### 1. Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

### 2. Configuração de Autenticação

No painel do Supabase, vá em **Authentication > Settings** e configure:

#### URLs de Redirecionamento
Adicione estas URLs em **Redirect URLs**:
```
http://localhost:3000/dashboard
http://localhost:3000/nova-senha
https://seu-dominio.vercel.app/dashboard
https://seu-dominio.vercel.app/nova-senha
```

#### Configuração de E-mail
Em **Email Templates**, configure o template de reset de senha:
- **Subject**: "Recuperação de Senha - Inbox Secreta"
- **Body**: Use o template padrão do Supabase

### 3. Banco de Dados

Execute o SQL em `supabase.sql` no SQL Editor do Supabase para criar as tabelas necessárias.

### 4. Políticas de Segurança (RLS)

Por enquanto, o RLS está desabilitado para facilitar o desenvolvimento. Para produção, configure as políticas adequadas.

## Como Usar

### Recuperação de Senha

1. Na página de login, clique em "Esqueci minha senha"
2. Digite seu e-mail cadastrado
3. Clique em "Enviar E-mail de Recuperação"
4. Verifique sua caixa de entrada
5. Clique no link do e-mail
6. Defina sua nova senha

### Fluxo de Mensagens

1. **Usuário se cadastra** → Recebe um link público (`/username`)
2. **Pessoas enviam mensagens anônimas** → Através do link público
3. **Usuário visualiza mensagens** → No dashboard privado
4. **Usuário responde** → Através do botão "Responder"
5. **Remetente vê a resposta** → Através do link único da mensagem

## Deploy no Vercel

1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático

## Tecnologias

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Supabase (Auth, Database)
- **Deploy**: Vercel

## Estrutura do Projeto

```
src/
├── app/                    # Páginas Next.js 15
│   ├── [username]/        # Link público para envio
│   ├── dashboard/         # Dashboard privado
│   ├── login/            # Página de login
│   ├── register/         # Página de cadastro
│   ├── recuperar-senha/  # Recuperação de senha
│   ├── nova-senha/       # Definir nova senha
│   ├── mensagem/[id]/    # Visualizar mensagem
│   └── responder/[id]/   # Responder mensagem
├── components/           # Componentes reutilizáveis
└── lib/                 # Configurações e hooks
```

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
