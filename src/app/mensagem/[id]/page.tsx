// Página para visualizar uma mensagem específica
// Acesso público para ver mensagem e resposta
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function MensagemPage() {
  const params = useParams();
  const router = useRouter();
  const [mensagem, setMensagem] = useState<any>(null);
  const [carregando, setCarregando] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);

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
      } catch (error) {
        setFeedback('Erro ao carregar mensagem.');
      } finally {
        setCarregando(false);
      }
    };

    fetchMensagem();
  }, [params.id]);

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
          Sua Mensagem Anônima
        </h1>

        {/* Mensagem Original */}
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h2 className="font-semibold mb-2">Mensagem Enviada:</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{mensagem.content}</p>
          <div className="text-sm text-gray-500 mt-2">
            Enviada em: {new Date(mensagem.created_at).toLocaleString('pt-BR')}
          </div>
        </div>

        {/* Resposta */}
        {mensagem.response_text ? (
          <div className="bg-green-50 p-6 rounded-lg mb-6">
            <h2 className="font-semibold mb-2 text-green-800">✅ Resposta Recebida:</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{mensagem.response_text}</p>
            <div className="text-sm text-gray-500 mt-2">
              Respondida em: {new Date(mensagem.updated_at || mensagem.created_at).toLocaleString('pt-BR')}
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 p-6 rounded-lg mb-6">
            <h2 className="font-semibold mb-2 text-yellow-800">⏳ Aguardando Resposta</h2>
            <p className="text-yellow-700">
              Sua mensagem foi enviada com sucesso! 
              O dono da caixa ainda não respondeu. 
              Volte mais tarde para verificar se há uma resposta.
            </p>
          </div>
        )}

        {feedback && (
          <div className={`mt-4 p-3 rounded-lg ${feedback.includes('sucesso') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {feedback}
          </div>
        )}

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/')}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Voltar ao início
          </button>
        </div>
      </div>
    </main>
  );
} 