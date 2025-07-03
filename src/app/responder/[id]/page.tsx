'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/authContext';

export default function ResponderPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [mensagem, setMensagem] = useState<any>(null);
  const [resposta, setResposta] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
      return;
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchMensagem = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('id', params.id)
          .eq('user_id', user.id) // Apenas mensagens do usuário logado
          .single();

        if (error) {
          setFeedback('Mensagem não encontrada ou você não tem permissão.');
          return;
        }

        setMensagem(data);
      } catch (error) {
        setFeedback('Erro ao carregar mensagem.');
      } finally {
        setCarregando(false);
      }
    };

    fetchMensagem();
  }, [params.id, user]);

  const handleResponder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resposta.trim()) return;

    setEnviando(true);
    try {
      const { error } = await supabase
        .from('messages')
        .update({
          response_text: resposta,
          status: 'respondida'
        })
        .eq('id', params.id);

      if (error) {
        setFeedback('Erro ao enviar resposta.');
      } else {
        setFeedback('Resposta enviada com sucesso!');
        setMensagem((prev: any) => ({ ...prev, response_text: resposta, status: 'respondida' }));
        setResposta('');
        
        // Redirecionar para o dashboard após 2 segundos
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      }
    } catch (error) {
      setFeedback('Erro ao enviar resposta.');
    }
    setEnviando(false);
  };

  if (loading || carregando) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Redirecionando...</div>;
  }

  if (!mensagem) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">Mensagem não encontrada</h1>
        <button
          onClick={() => router.push('/dashboard')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Voltar ao Dashboard
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Responder Mensagem</h1>
          </div>

          {/* Mensagem Original */}
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <h2 className="font-semibold text-gray-900 mb-3">Mensagem Original:</h2>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {mensagem.content}
            </p>
            <div className="text-sm text-gray-500 mt-3">
              Enviada em: {new Date(mensagem.created_at).toLocaleString('pt-BR')}
            </div>
          </div>

          {/* Formulário de Resposta */}
          <form onSubmit={handleResponder} className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="font-semibold text-gray-900 mb-4">Responder Anonimamente:</h2>
            <textarea
              value={resposta}
              onChange={(e) => setResposta(e.target.value)}
              placeholder="Digite sua resposta..."
              className="w-full p-3 border border-gray-300 rounded-lg resize-none h-32 focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors duration-200"
              maxLength={500}
            />
            <button
              type="submit"
              disabled={enviando || !resposta.trim()}
              className="mt-4 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 disabled:opacity-50 font-medium transition-colors duration-200"
            >
              {enviando ? 'Enviando...' : 'Enviar Resposta'}
            </button>
          </form>

          {feedback && (
            <div className={`mt-4 p-3 rounded-lg ${
              feedback.includes('sucesso') 
                ? 'bg-green-50 border border-green-200 text-green-800' 
                : 'bg-red-50 border border-red-200 text-red-800'
            } text-sm`}>
              {feedback}
            </div>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors duration-200 font-medium"
            >
              Voltar ao Dashboard
            </button>
          </div>
        </div>
      </div>
    </main>
  );
} 