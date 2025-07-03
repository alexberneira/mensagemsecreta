-- Tabela de usuários
create table if not exists users (
  id uuid primary key default uuid_generate_v4(),
  email text not null unique,
  username text not null unique
);

-- Tabela de mensagens
create table if not exists messages (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references users(id) on delete cascade,
  content text not null,
  created_at timestamp with time zone default timezone('utc', now()),
  responded boolean default false,
  response_text text,
  status text default 'nova' -- nova, respondida, visualizada
);

-- Tabela de pagamentos
create table if not exists payments (
  id uuid primary key default uuid_generate_v4(),
  message_id uuid references messages(id) on delete cascade,
  status text not null, -- ex: 'pendente', 'pago'
  created_at timestamp with time zone default timezone('utc', now())
); 