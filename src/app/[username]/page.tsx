// Página pública dinâmica para envio anônimo de mensagem
// Acessível via /[username]
// Não requer autenticação
'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useParams } from 'next/navigation';

// Lista de palavras proibidas para moderação
const PALAVRAS_PROIBIDAS = ['palavrão1', 'palavrão2', 'ofensa'];

export default function PublicInboxPage() {
  const params = useParams();
  const username = params.username as string;
  
  console.log('PublicInboxPage - username recebido:', username);
  
  const [mensagem, setMensagem] = useState('');
  const [termos, setTermos] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Limite de envio por IP (simples, localStorage)
  const podeEnviar = () => {
    const ultima = localStorage.getItem('ultimaMsg_' + username);
    if (!ultima) return true;
    const diff = Date.now() - Number(ultima);
    return diff > 60000; // 1 minuto
  };

  const handleEnviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mensagem.trim()) {
      setFeedback('Digite uma mensagem.');
      return;
    }
    if (!termos) {
      setFeedback('Você deve aceitar os termos de uso.');
      return;
    }
    if (contemPalavraProibida(mensagem)) {
      setFeedback('Mensagem contém conteúdo inadequado.');
      return;
    }
    if (!podeEnviar()) {
      setFeedback('Aguarde 1 minuto entre mensagens.');
      return;
    }

    setEnviando(true);
    setFeedback(null);

    try {
      // Busca o usuário pelo username
      const { data: user } = await supabase
        .from('users')
        .select('id')
        .eq('username', username)
        .single();
      if (!user) {
        setFeedback('Usuário não encontrado.');
        setEnviando(false);
        return;
      }

      // Salva a mensagem
      const { data: messageData, error } = await supabase.from('messages').insert({
        user_id: user.id,
        content: mensagem,
        status: 'nova'
      }).select().single();

      if (error) {
        setFeedback('Erro ao enviar mensagem.');
      } else {
        // Gera o link único para ver a resposta
        const responseLink = `${window.location.origin}/mensagem/${messageData.id}`;
        setFeedback(`Mensagem enviada com sucesso! 
        
Para ver a resposta quando disponível, salve este link:
${responseLink}`);
        setMensagem('');
        localStorage.setItem('ultimaMsg_' + username, Date.now().toString());
      }
    } catch (error) {
      setFeedback('Erro ao enviar mensagem.');
    }
    setEnviando(false);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Enviar mensagem anônima para @{username}</h1>
      <form onSubmit={handleEnviar} className="flex flex-col gap-4 w-full max-w-md">
        <textarea
          placeholder="Digite sua mensagem..."
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
          className="p-3 border rounded-lg resize-none h-32"
          maxLength={500}
        />
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="termos"
            checked={termos}
            onChange={(e) => setTermos(e.target.checked)}
          />
          <label htmlFor="termos" className="text-sm">
            Aceito os termos de uso e política de privacidade
          </label>
        </div>
        <button
          type="submit"
          disabled={enviando}
          className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {enviando ? 'Enviando...' : 'Enviar Mensagem Anônima'}
        </button>
      </form>
      {feedback && (
        <div className={`mt-4 p-3 rounded-lg ${feedback.includes('sucesso') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {feedback}
        </div>
      )}
      <div className="mt-8 text-center text-sm text-gray-600">
        <p>• Sua mensagem é completamente anônima</p>
        <p>• Nenhum dado pessoal é coletado</p>
        <p>• Respeite os outros usuários</p>
      </div>
    </main>
  );
}

function contemPalavraProibida(texto: string) {
  return PALAVRAS_PROIBIDAS.some(palavra => texto.toLowerCase().includes(palavra));
} 