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
    <main className="flex flex-col items-center min-h-screen p-4">
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-6 text-center">Responder Mensagem Anônima</h1>

        {/* Mensagem Original */}
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h2 className="font-semibold mb-2">Mensagem Original:</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{mensagem.content}</p>
          <div className="text-sm text-gray-500 mt-2">
            Enviada em: {new Date(mensagem.created_at).toLocaleString('pt-BR')}
          </div>
        </div>

        {/* Resposta existente */}
        {mensagem.response_text && (
          <div className="bg-blue-50 p-6 rounded-lg mb-6">
            <h2 className="font-semibold mb-2">Resposta Atual:</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{mensagem.response_text}</p>
            <div className="text-sm text-gray-500 mt-2">
              Respondida em: {new Date(mensagem.updated_at || mensagem.created_at).toLocaleString('pt-BR')}
            </div>
          </div>
        )}

        {/* Formulário de Resposta */}
        <form onSubmit={handleResponder} className="bg-white p-6 rounded-lg border">
          <h2 className="font-semibold mb-4">
            {mensagem.response_text ? 'Editar Resposta:' : 'Responder Anonimamente:'}
          </h2>
          <textarea
            value={resposta}
            onChange={(e) => setResposta(e.target.value)}
            placeholder="Digite sua resposta..."
            className="w-full p-3 border rounded-lg resize-none h-32 mb-4"
            maxLength={500}
          />
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={enviando || !resposta.trim()}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {enviando ? 'Enviando...' : (mensagem.response_text ? 'Atualizar Resposta' : 'Enviar Resposta')}
            </button>
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
            >
              Cancelar
            </button>
          </div>
        </form>

        {feedback && (
          <div className={`mt-4 p-3 rounded-lg ${feedback.includes('sucesso') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {feedback}
          </div>
        )}
      </div>
    </main>
  );
} 