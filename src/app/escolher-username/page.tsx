// Página para o usuário escolher um username único após login
'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/authContext';

export default function EscolherUsernamePage() {
  const { user } = useAuth();
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    // Verifica se o username está disponível
    const { data: userExists } = await supabase
      .from('users')
      .select('id')
      .eq('username', username)
      .single();
    if (userExists) {
      setMessage('Nome de usuário já está em uso. Escolha outro.');
      setLoading(false);
      return;
    }
    // Atualiza o registro do usuário
    const { error } = await supabase
      .from('users')
      .update({ username })
      .eq('id', user.id);
    if (error) {
      setMessage('Erro ao salvar username: ' + error.message);
    } else {
      setMessage('Username salvo com sucesso! Redirecionando...');
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1200);
    }
    setLoading(false);
  };

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Escolha seu nome de usuário</h1>
      <form onSubmit={handleSave} className="flex flex-col gap-4 w-full max-w-xs">
        <input
          type="text"
          placeholder="Seu username único"
          value={username}
          onChange={e => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
          minLength={3}
          maxLength={20}
          required
          className="border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Salvando...' : 'Salvar username'}
        </button>
        {message && <p className="text-center text-sm text-gray-600">{message}</p>}
      </form>
      <p className="text-gray-500 mt-4 text-sm">Esse será o link público da sua caixa: <span className="font-mono">/seu_username</span></p>
    </main>
  );
} 