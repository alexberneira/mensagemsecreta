// Página de login do Inbox Secreta
// Utiliza Supabase Auth para autenticação por e-mail e senha
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/authContext';
import { useEnsureUser } from '@/lib/useEnsureUser';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function validarEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  // Garante o registro do usuário na tabela users (sem username, pois login)
  useEnsureUser();

  // Após login, verifica se o usuário tem username. Se não tiver, redireciona para página de escolha de username.
  useEffect(() => {
    const checkUsername = async () => {
      if (user) {
        const { data } = await supabase
          .from('users')
          .select('username')
          .eq('id', user.id)
          .single();
        if (!data || !data.username) {
          window.location.href = '/escolher-username';
        } else {
          window.location.href = '/dashboard';
        }
      }
    };
    checkUsername();
  }, [user]);

  // Função para fazer login com senha
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    
    console.log('=== INÍCIO DO LOGIN ===');
    console.log('Dados do formulário:', { email, password: password.length + ' caracteres' });
    
    if (!validarEmail(email)) {
      setMessage('E-mail inválido.');
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setMessage('Senha deve ter pelo menos 6 caracteres.');
      setLoading(false);
      return;
    }
    
    console.log('Validações passaram, tentando fazer login...');
    
    // Faz login com senha
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    console.log('Resultado do login:', { data, error });
    
    if (error) {
      console.error('Erro no login:', error);
      setMessage('Erro ao fazer login: ' + error.message);
    } else {
      console.log('Login bem-sucedido:', data);
      console.log('Usuário:', data.user);
      console.log('Sessão:', data.session);
      
      if (data.user) {
        console.log('Tentando garantir que usuário existe na tabela users...');
        
        // Garante que o usuário existe na tabela users
        const { error: insertError } = await supabase.from('users').upsert({
          id: data.user.id,
          email: data.user.email,
          username: data.user.user_metadata?.username || 'user_' + data.user.id.slice(0, 8),
        });
        
        console.log('Resultado da inserção na tabela users:', { insertError });
        
        if (insertError) {
          console.error('Erro ao criar/verificar usuário na tabela:', insertError);
        } else {
          console.log('✅ Usuário verificado/criado na tabela users');
        }
        
        setMessage('Login realizado com sucesso! Redirecionando...');
        router.push('/dashboard');
      } else {
        console.log('❌ data.user é null/undefined');
        setMessage('Erro: dados do usuário não encontrados.');
      }
    }
    
    console.log('=== FIM DO LOGIN ===');
    setLoading(false);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full max-w-xs">
        <input
          type="email"
          placeholder="Seu e-mail"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className={`border p-2 rounded ${email && !validarEmail(email) ? 'border-red-500' : ''}`}
        />
        {email && !validarEmail(email) && (
          <span className="text-xs text-red-500">E-mail inválido</span>
        )}
        <input
          type="password"
          placeholder="Sua senha"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
        {message && (
          <div className={`text-center p-3 rounded-lg ${
            message.includes('sucesso') 
              ? 'bg-green-100 text-green-800 border border-green-300' 
              : 'bg-red-100 text-red-800 border border-red-300'
          }`}>
            <p className="font-semibold">{message}</p>
          </div>
        )}
      </form>
      <div className="mt-6 text-center">
        <Link href="/register" className="text-blue-500 hover:text-blue-600 text-sm">
          Não tem uma conta? Cadastre-se
        </Link>
        <div className="mt-2">
          <Link href="/recuperar-senha" className="text-blue-500 hover:text-blue-600 text-sm">
            Esqueci minha senha
          </Link>
        </div>
      </div>
    </main>
  );
} 