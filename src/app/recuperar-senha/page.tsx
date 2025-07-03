'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

function validarEmail(email: string) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleRecuperarSenha = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!validarEmail(email)) {
      setMessage('E-mail inválido.');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/nova-senha`,
      });

      if (error) {
        setMessage('Erro ao enviar e-mail de recuperação: ' + error.message);
      } else {
        setMessage('E-mail de recuperação enviado! Verifique sua caixa de entrada.');
        setEmail('');
      }
    } catch (error) {
      setMessage('Erro inesperado. Tente novamente.');
    }

    setLoading(false);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-center mb-6">Recuperar Senha</h1>
          
          <form onSubmit={handleRecuperarSenha} className="space-y-4">
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
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Digite seu e-mail"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 font-medium"
            >
              {loading ? 'Enviando...' : 'Enviar E-mail de Recuperação'}
            </button>
          </form>

          {message && (
            <div className={`mt-4 p-3 rounded-lg ${
              message.includes('enviado') 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {message}
            </div>
          )}

          <div className="mt-6 text-center">
            <Link href="/login" className="text-blue-500 hover:text-blue-600 text-sm">
              ← Voltar para o login
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
} 