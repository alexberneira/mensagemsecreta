// Página para desbloquear e visualizar a resposta de uma mensagem (paywall)
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function DesbloquearRespostaPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [mensagem, setMensagem] = useState<any>(null);
  const [pagou, setPagou] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchMsg = async () => {
      setCarregando(true);
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('id', id)
        .single();
      setMensagem(data);
      setCarregando(false);
    };
    fetchMsg();
  }, [id]);

  // Simulação de pagamento (Stripe fictício)
  const handlePagar = async () => {
    setFeedback(null);
    setPagou(true);
    // Atualiza status para visualizada
    await supabase.from('messages').update({ status: 'visualizada' }).eq('id', id);
  };

  if (carregando || !mensagem) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Mensagem enviada</h1>
      <div className="border rounded p-4 mb-4 bg-gray-50 shadow w-full max-w-lg">
        <div className="mb-2 text-gray-800">{mensagem.content}</div>
        <div className="text-xs text-gray-400 mb-2">Status: {mensagem.status}</div>
        {mensagem.response_text && pagou ? (
          <div className="mt-2 p-2 bg-green-50 border-l-4 border-green-400 text-green-800">
            <strong>Resposta recebida:</strong> {mensagem.response_text}
          </div>
        ) : mensagem.response_text ? (
          <div className="mt-2 p-2 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800">
            <strong>Resposta disponível!</strong> <br />
            <button
              onClick={handlePagar}
              className="mt-2 px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600"
            >
              Desbloquear resposta (R$1,99)
            </button>
            <div className="text-xs mt-2">Pagamento simulado para MVP.</div>
          </div>
        ) : (
          <div className="mt-2 text-gray-500">Ainda sem resposta do destinatário.</div>
        )}
        {feedback && <div className="text-center text-sm text-gray-600 mt-2">{feedback}</div>}
      </div>
      <p className="text-gray-500 mt-4 text-sm">A resposta é liberada apenas após o pagamento.</p>
    </main>
  );
} 