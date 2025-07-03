// Página de cadastro do Inbox Secreta
// Utiliza Supabase Auth para registro por e-mail e senha
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/authContext';
import { useEnsureUser } from '@/lib/useEnsureUser';

function validarEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Cadastro</h1>
      <form onSubmit={handleRegister} className="flex flex-col gap-4 w-full max-w-xs">
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
          minLength={6}
          required
          className="border p-2 rounded"
        />
        <div className="relative">
          <input
            type="text"
            placeholder="Escolha um nome de usuário"
            value={username}
            onChange={e => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
            minLength={3}
            maxLength={20}
            required
            className={`border p-2 rounded w-full ${username && (!usernameValid || username.trim().length < 3) ? 'border-red-500' : ''}`}
          />
          <span className="absolute right-2 top-2 text-xs text-gray-400">{username.length}/20</span>
        </div>
        {username && username.length < 3 && (
          <span className="text-xs text-red-500">Mínimo 3 caracteres</span>
        )}
        {usernameChecking && <span className="text-xs text-gray-500">Verificando disponibilidade...</span>}
        {username && !usernameChecking && !usernameValid && (
          <span className="text-xs text-red-500">Nome de usuário já está em uso</span>
        )}
        <button
          type="submit"
          className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Cadastrando...' : 'Cadastrar'}
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
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-center text-blue-800 font-medium">
          Já tem uma conta? <a href="/login" className="text-blue-600 underline hover:text-blue-800 font-semibold">Faça login</a>
        </p>
      </div>
    </main>
  );
} 