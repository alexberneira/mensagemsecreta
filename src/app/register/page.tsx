// Página de cadastro do Inbox Secreta
// Utiliza Supabase Auth para registro por e-mail e senha
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/authContext';
import { useEnsureUser } from '@/lib/useEnsureUser';
import Link from 'next/link';

function validarEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [usernameValid, setUsernameValid] = useState(true);
  const [usernameChecking, setUsernameChecking] = useState(false);
  const { user } = useAuth();

  // Garante o registro do usuário na tabela users após autenticação
  useEnsureUser(username);

  // Redireciona para dashboard se já estiver logado
  useEffect(() => {
    if (user) window.location.href = '/dashboard';
  }, [user]);

  // Validação de username em tempo real
  useEffect(() => {
    if (!username || username.length < 3) {
      setUsernameValid(false);
      return;
    }
    setUsernameChecking(true);
    const timeout = setTimeout(async () => {
      const { data: userExists } = await supabase
        .from('users')
        .select('id')
        .eq('username', username)
        .single();
      setUsernameValid(!userExists);
      setUsernameChecking(false);
    }, 500);
    return () => clearTimeout(timeout);
  }, [username]);

  // Função para registrar usuário com senha
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    
    console.log('=== INÍCIO DO CADASTRO ===');
    console.log('Dados do formulário:', { email, username, password: password.length + ' caracteres' });
    
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
    if (!usernameValid || username.trim().length < 3) {
      setMessage('Escolha um nome de usuário válido e único.');
      setLoading(false);
      return;
    }
    
    console.log('Validações passaram, verificando username...');
    
    // Verifica se o username está disponível
    const { data: userExists, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('username', username)
      .single();
      
    console.log('Verificação de username:', { userExists, checkError });
    
    if (userExists) {
      setMessage('Nome de usuário já está em uso. Escolha outro.');
      setLoading(false);
      return;
    }
    
    console.log('Username disponível, tentando cadastrar...');
    
    // Registra usuário com senha
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: {
          username: username
        }
      }
    });
    
    console.log('Resultado do signUp:', { data, error });
    
    if (error) {
      console.error('Erro no cadastro:', error);
      setMessage('Erro ao cadastrar: ' + error.message);
    } else {
      console.log('Usuário cadastrado com sucesso:', data);
      console.log('Dados do usuário:', data.user);
      console.log('Sessão:', data.session);
      
      if (data.user) {
        console.log('Tentando criar registro na tabela users...');
        
        // Cria o registro na tabela users
        const { error: insertError } = await supabase.from('users').insert({
          id: data.user.id,
          email: data.user.email,
          username: username,
        });
        
        console.log('Resultado da inserção na tabela users:', { insertError });
        
        if (insertError) {
          console.error('Erro ao criar registro na tabela users:', insertError);
          setMessage('Cadastro realizado, mas erro ao salvar dados. Tente fazer login.');
        } else {
          console.log('✅ Registro criado na tabela users com sucesso');
          setMessage('Cadastro realizado com sucesso! Faça login para continuar.');
        }
      } else {
        console.log('❌ data.user é null/undefined');
        setMessage('Erro: dados do usuário não encontrados.');
      }
      
      setEmail('');
      setPassword('');
      setUsername('');
    }
    
    console.log('=== FIM DO CADASTRO ===');
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Criar Conta</h1>
            <p className="text-purple-700 text-lg font-semibold mb-2">Descubra o que pensam sobre você.</p>
            <p className="text-gray-600 text-sm">Cadastre-se grátis, personalize seu link e comece a receber mensagens anônimas agora mesmo!</p>
          </div>
          
          <form onSubmit={handleRegister} className="space-y-4">
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
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Nome de usuário
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, '').toLowerCase())}
                required
                minLength={3}
                maxLength={20}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors duration-200 ${usernameValid ? 'border-gray-300' : 'border-red-400'}`}
                placeholder="ex: maria123"
                autoComplete="off"
              />
              <div className="text-xs mt-1">
                Seu link público será: <span className="font-mono text-purple-700">inboxsecreta.com/{username || 'seunome'}</span>
                {usernameChecking && <span className="ml-2 text-gray-400">Verificando...</span>}
                {!usernameChecking && username && (
                  usernameValid ? <span className="ml-2 text-green-600">Disponível</span> : <span className="ml-2 text-red-600">Indisponível</span>
                )}
              </div>
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
                minLength={6}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors duration-200"
                placeholder="Digite sua senha (mín. 6 caracteres)"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar Senha
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors duration-200"
                placeholder="Confirme sua senha"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50"
            >
              {loading ? 'Criando conta...' : 'Criar minha caixa secreta'}
            </button>
          </form>

          {message && (
            <div className={`mt-4 p-3 rounded-lg ${
              message.includes('sucesso') 
                ? 'bg-green-50 border border-green-200 text-green-800' 
                : 'bg-red-50 border border-red-200 text-red-800'
            } text-sm`}>
              {message}
            </div>
          )}

          <div className="mt-6 text-center">
            <Link href="/login" className="text-gray-600 hover:text-gray-900 text-sm transition-colors duration-200">
              Já tem uma conta? Entrar
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
} 