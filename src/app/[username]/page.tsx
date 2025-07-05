// Página pública dinâmica para envio anônimo de mensagem
// Acessível via /[username]
// Não requer autenticação
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useParams } from 'next/navigation';

// Lista de palavras proibidas para moderação
const PALAVRAS_PROIBIDAS = ['palavrão1', 'palavrão2', 'ofensa'];

export default function PublicInboxPage() {
  const params = useParams();
  const username = params.username as string;
  
  console.log('PublicInboxPage - username recebido:', username);
  
  const [mensagem, setMensagem] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [linkResposta, setLinkResposta] = useState<string | null>(null);
  const [mensagensCount, setMensagensCount] = useState<number | null>(null);
  const [fakeCount, setFakeCount] = useState<number>(0);
  const [userId, setUserId] = useState<string | null>(null);

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

  useEffect(() => {
    const fetchUserAndCount = async () => {
      // Busca o usuário pelo username
      const { data: user } = await supabase
        .from('users')
        .select('id')
        .eq('username', username)
        .single();
      if (user && user.id) {
        setUserId(user.id);
        // Busca a contagem de mensagens
        const { count } = await supabase
          .from('messages')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id);
        setMensagensCount(count ?? 0);
      }
    };
    fetchUserAndCount();
  }, [username]);

  useEffect(() => {
    if (mensagensCount === 0 || mensagensCount === null) {
      setFakeCount(Math.floor(Math.random() * 10) + 3); // 3 a 12
    }
  }, [mensagensCount]);

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-md sm:max-w-md mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-8">
          {/* Topo do card: avatar, username e convite */}
          <div className="flex flex-col items-center mb-6 sm:mb-8">
            <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center mb-2">
              {/* Ícone de usuário padrão (SVG) */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-gray-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9A3.75 3.75 0 1 1 8.25 9a3.75 3.75 0 0 1 7.5 0ZM4.5 19.25a7.25 7.25 0 0 1 15 0v.25a.75.75 0 0 1-.75.75h-13.5a.75.75 0 0 1-.75-.75v-.25Z" />
              </svg>
            </div>
            <div className="text-gray-900 font-semibold text-base sm:text-lg">@{username}</div>
            <div className="text-black font-bold text-sm sm:text-base mt-1 text-center">me mande mensagens anônimas!</div>
            {typeof mensagensCount === 'number' && (
              <div className="mt-2 text-xs sm:text-sm text-gray-700 font-medium text-center">
                {(() => {
                  const count = mensagensCount > 0 ? mensagensCount : fakeCount;
                  return `${count} ${count === 1 ? 'mensagem já recebida!' : 'mensagens já recebidas!'}`;
                })()}
              </div>
            )}
          </div>
          {/* Fim do topo do card */}
          <form onSubmit={handleEnviar} className="space-y-3 sm:space-y-4">
            <div>
              <label htmlFor="mensagem" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Mensagem
              </label>
              <textarea
                id="mensagem"
                placeholder="Ex: Qual seu maior sonho? (ou envie qualquer pergunta anônima)"
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                className="w-full p-2 sm:p-3 border border-gray-300 rounded-lg resize-none h-24 sm:h-32 focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-colors duration-200 text-base sm:text-lg font-sans text-purple-700 placeholder-gray-400"
                maxLength={500}
              />
            </div>
            <button
              type="submit"
              disabled={enviando}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-400 hover:from-purple-700 hover:to-pink-500 text-white p-2 sm:p-3 rounded-lg disabled:opacity-50 font-medium transition-colors duration-200 text-sm sm:text-base"
            >
              {enviando ? 'Enviando...' : 'Enviar Mensagem Anônima'}
            </button>
          </form>
          {feedback && (
            <div className={`mt-4 p-2 sm:p-3 rounded-lg ${
              feedback.includes('sucesso') 
                ? 'bg-green-50 border border-green-200 text-green-800' 
                : 'bg-red-50 border border-red-200 text-red-800'
            } text-xs sm:text-sm`}>
              {feedback}
              {linkResposta && feedback.includes('sucesso') && (
                <div className="mt-3">
                  <button
                    onClick={copiarLinkManual}
                    className="bg-gray-100 text-gray-700 border border-gray-300 px-3 py-1 rounded hover:bg-gray-200 transition-colors duration-200 text-xs font-normal shadow-none"
                  >
                    Copiar Link Novamente
                  </button>
                </div>
              )}
            </div>
          )}
          <div className="mt-6 sm:mt-8 text-center space-y-1 sm:space-y-2 text-xs text-gray-600">
            <p>• Nenhum dado pessoal é coletado</p>
            <p>• Respeite os outros usuários</p>
            <p>Termos de Uso • Política de Privacidade</p>
          </div>
          {/* Microcopy de privacidade */}
          <div className="flex flex-col items-center mt-3 sm:mt-4 mb-2">
            <div className="flex items-center gap-1 text-gray-700 text-xs sm:text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-700">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V7.5a4.5 4.5 0 10-9 0v3m12 0v7.125A2.625 2.625 0 0116.875 20.25h-9.75A2.625 2.625 0 014.5 17.625V10.5h15z" />
              </svg>
              perguntas e respostas anônimas
            </div>
          </div>
        </div>
        {/* CTA para criar conta */}
        <div className="w-full flex flex-col items-center my-6">
          <div className="text-center text-sm sm:text-base font-medium text-gray-800 mb-2">
            Quer receber mensagens anônimas também?
          </div>
          <a href="/register" className="inline-block bg-gradient-to-r from-purple-600 to-pink-400 hover:from-purple-700 hover:to-pink-500 text-white px-5 py-2 rounded-lg font-semibold text-sm sm:text-base shadow transition-colors duration-200">
            Quero meu link secreto!
          </a>
        </div>
      </div>
    </main>
  );
}

function contemPalavraProibida(texto: string) {
  return PALAVRAS_PROIBIDAS.some(palavra => texto.toLowerCase().includes(palavra));
} 