// Página para visualizar e responder uma mensagem específica
// Acesso privado do dono da caixa
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function MensagemPage() {
  const params = useParams();
  const router = useRouter();
  const [mensagem, setMensagem] = useState<any>(null);
  const [resposta, setResposta] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const fetchMensagem = async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select(`
            *,
            users!messages_user_id_fkey (
              username
            )
          `)
          .eq('id', params.id)
          .single();

        if (error) {
          setFeedback('Mensagem não encontrada.');
          return;
        }

        setMensagem(data);
        
        // Verificar se o usuário atual é o dono da mensagem
        const { data: { user } } = await supabase.auth.getUser();
        if (user && user.id === data.user_id) {
          setIsOwner(true);
        }
      } catch (error) {
        setFeedback('Erro ao carregar mensagem.');
      } finally {
        setCarregando(false);
      }
    };

    fetchMensagem();
  }, [params.id]);

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
      }
    } catch (error) {
      setFeedback('Erro ao enviar resposta.');
    }
    setEnviando(false);
  };

  if (carregando) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  if (!mensagem) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold mb-4">Mensagem não encontrada</h1>
        <button
          onClick={() => router.push('/')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Voltar ao início
        </button>
      </div>
    );
  }

  return (
    <main className="flex flex-col items-center min-h-screen p-4">
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {isOwner ? 'Sua Mensagem Anônima' : 'Responder Mensagem'}
        </h1>

        {/* Mensagem Original */}
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h2 className="font-semibold mb-2">Mensagem Original:</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{mensagem.content}</p>
          <div className="text-sm text-gray-500 mt-2">
            Enviada em: {new Date(mensagem.created_at).toLocaleString('pt-BR')}
          </div>
        </div>

        {/* Resposta */}
        {mensagem.response_text && (
          <div className="bg-blue-50 p-6 rounded-lg mb-6">
            <h2 className="font-semibold mb-2">Resposta:</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{mensagem.response_text}</p>
            <div className="text-sm text-gray-500 mt-2">
              Respondida em: {new Date(mensagem.updated_at || mensagem.created_at).toLocaleString('pt-BR')}
            </div>
          </div>
        )}

        {/* Formulário de Resposta (apenas para o dono) */}
        {isOwner && !mensagem.response_text && (
          <div className="bg-yellow-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-yellow-800 mb-2">
              ⏳ Aguardando resposta do dono da caixa...
            </p>
          </div>
        )}

        {!isOwner && !mensagem.response_text && (
          <form onSubmit={handleResponder} className="bg-white p-6 rounded-lg border">
            <h2 className="font-semibold mb-4">Responder Anonimamente:</h2>
            <textarea
              value={resposta}
              onChange={(e) => setResposta(e.target.value)}
              placeholder="Digite sua resposta..."
              className="w-full p-3 border rounded-lg resize-none h-32 mb-4"
              maxLength={500}
            />
            <button
              type="submit"
              disabled={enviando || !resposta.trim()}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {enviando ? 'Enviando...' : 'Enviar Resposta'}
            </button>
          </form>
        )}

        {feedback && (
          <div className={`mt-4 p-3 rounded-lg ${feedback.includes('sucesso') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {feedback}
          </div>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/')}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Voltar ao início
          </button>
        </div>
      </div>
    </main>
  );
} 