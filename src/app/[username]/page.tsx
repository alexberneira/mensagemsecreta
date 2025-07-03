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
  const [linkResposta, setLinkResposta] = useState<string | null>(null);

  // Limite de envio por IP (simples, localStorage)
  const podeEnviar = () => {
    const ultima = localStorage.getItem('ultimaMsg_' + username);
    if (!ultima) return true;
    const diff = Date.now() - Number(ultima);
    return diff > 5000; // 5 segundos
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
      setFeedback('Aguarde 5 segundos entre mensagens.');
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
        setLinkResposta(responseLink);
        setFeedback(`Mensagem enviada com sucesso! 
        
Para ver a resposta quando disponível, salve este link:
${responseLink}`);
        setMensagem('');
        localStorage.setItem('ultimaMsg_' + username, Date.now().toString());
        
        // Função para copiar o link
        const copiarLink = async () => {
          try {
            await navigator.clipboard.writeText(responseLink);
            setFeedback('Mensagem enviada com sucesso! Link copiado para a área de transferência! 📋');
          } catch (err) {
            setFeedback('Mensagem enviada com sucesso! Copie o link manualmente.');
          }
        };
        
        // Copia automaticamente o link
        setTimeout(copiarLink, 100);
      }
    } catch (error) {
      setFeedback('Erro ao enviar mensagem.');
    }
    setEnviando(false);
  };

  const copiarLinkManual = async () => {
    if (!linkResposta) return;
    try {
      await navigator.clipboard.writeText(linkResposta);
      setFeedback('Link copiado para a área de transferência! 📋');
      setTimeout(() => setFeedback(null), 2000);
    } catch (err) {
      setFeedback('Erro ao copiar link. Copie manualmente.');
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Enviar mensagem anônima</h1>
            <p className="text-gray-600 text-sm">Para @{username}</p>
          </div>
          
          <form onSubmit={handleEnviar} className="space-y-4">
            <div>
              <label htmlFor="mensagem" className="block text-sm font-medium text-gray-700 mb-1">
                Mensagem
              </label>
              <textarea
                id="mensagem"
                placeholder="Digite sua mensagem..."
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg resize-none h-32 focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors duration-200"
                maxLength={500}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="termos"
                checked={termos}
                onChange={(e) => setTermos(e.target.checked)}
                className="rounded border-gray-300 focus:ring-gray-500"
              />
              <label htmlFor="termos" className="text-sm text-gray-700">
                Aceito os termos de uso e política de privacidade
              </label>
            </div>
            
            <button
              type="submit"
              disabled={enviando}
              className="w-full bg-gray-900 text-white p-3 rounded-lg hover:bg-gray-800 disabled:opacity-50 font-medium transition-colors duration-200"
            >
              {enviando ? 'Enviando...' : 'Enviar Mensagem Anônima'}
            </button>
          </form>
          
          {feedback && (
            <div className={`mt-4 p-3 rounded-lg ${
              feedback.includes('sucesso') 
                ? 'bg-green-50 border border-green-200 text-green-800' 
                : 'bg-red-50 border border-red-200 text-red-800'
            } text-sm`}>
              {feedback}
              {linkResposta && feedback.includes('sucesso') && (
                <div className="mt-3">
                  <button
                    onClick={copiarLinkManual}
                    className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors duration-200 text-xs"
                  >
                    Copiar Link Novamente
                  </button>
                </div>
              )}
            </div>
          )}
          
          <div className="mt-8 text-center space-y-2 text-xs text-gray-600">
            <p>• Sua mensagem é completamente anônima</p>
            <p>• Nenhum dado pessoal é coletado</p>
            <p>• Respeite os outros usuários</p>
          </div>
        </div>
      </div>
    </main>
  );
}

function contemPalavraProibida(texto: string) {
  return PALAVRAS_PROIBIDAS.some(palavra => texto.toLowerCase().includes(palavra));
} 