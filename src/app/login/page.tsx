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
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Entrar</h1>
            <p className="text-gray-600 text-sm">Acesse sua caixa secreta</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                E-mail
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors duration-200"
                placeholder="Digite seu e-mail"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors duration-200"
                placeholder="Digite sua senha"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          {message && (
            <div className={`mt-4 p-3 rounded-lg ${
              message.includes('sucesso') 
                ? 'bg-green-100 text-green-800 border border-green-300' 
                : 'bg-red-100 text-red-800 border border-red-300'
            }`}>
              <p className="font-semibold">{message}</p>
            </div>
          )}

          <div className="mt-6 text-center space-y-2">
            <Link href="/register" className="block text-gray-600 hover:text-gray-900 text-sm transition-colors duration-200">
              Não tem uma conta? Cadastre-se
            </Link>
            <Link href="/recuperar-senha" className="block text-gray-600 hover:text-gray-900 text-sm transition-colors duration-200">
              Esqueci minha senha
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
} 