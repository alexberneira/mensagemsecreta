// Dashboard privado do usuário
// Mostra mensagens recebidas e permite responder
'use client';

import { useAuth } from '@/lib/authContext';
import { useEnsureUser } from '@/lib/useEnsureUser';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import CardMensagem from '@/components/CardMensagem';
import BotaoCopiarLink from '@/components/BotaoCopiarLink';

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [mensagens, setMensagens] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbacksCard, setFeedbacksCard] = useState<{ [id: string]: string | null }>({});
  const [username, setUsername] = useState('');
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState<Date>(new Date());

  // Garante que o usuário existe na tabela users
  useEnsureUser();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  // Função para buscar dados do usuário
  const fetchData = async () => {
    if (!user) return;
    
    console.log('Dashboard - buscando dados do usuário:', user.id);
    
    // Busca username
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('username')
      .eq('id', user.id)
      .single();
      
    console.log('Dashboard - resultado da busca de username:', { userData, userError });
    setUsername(userData?.username || '');
    
    // Log do link gerado
    const link = typeof window !== 'undefined' ? window.location.origin + '/' + (userData?.username || '') : '';
    console.log('Dashboard - link gerado:', link);
    
    // Busca mensagens
    const { data: msgs, error: msgsError } = await supabase
      .from('messages')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
      
    console.log('Dashboard - resultado da busca de mensagens:', { msgs, msgsError });
    
    // Verifica se há novas mensagens (apenas para atualização automática)
    const temNovasMensagens = msgs && msgs.length > mensagens.length;
    
    // Sempre atualiza as mensagens
    setMensagens(msgs || []);
    
    // Mostra feedback apenas se há novas mensagens
    if (temNovasMensagens) {
      setFeedback('Nova mensagem recebida! 🎉');
      setTimeout(() => setFeedback(null), 3000);
    }
    
    setCarregando(false);
    setUltimaAtualizacao(new Date());
  };

  // Busca inicial
  useEffect(() => {
    fetchData();
  }, [user]);

  // Função de logout
  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  // Função para atualizar manualmente
  const handleAtualizar = async () => {
    setFeedback('Atualizando...');
    await fetchData();
    setFeedback('Atualizado!');
    setTimeout(() => setFeedback(null), 1500);
  };

  // Ações dos cards
  const copiarMensagem = (id: string, conteudo: string) => {
    navigator.clipboard.writeText(conteudo);
    setFeedbacksCard((prev) => ({ ...prev, [id]: 'Mensagem copiada!' }));
    setTimeout(() => setFeedbacksCard((prev) => ({ ...prev, [id]: null })), 1500);
  };

  const denunciarMensagem = (id: string) => {
    // Simula denúncia (pode marcar no banco ou enviar alerta)
    setFeedback('Mensagem denunciada!');
    setTimeout(() => setFeedback(null), 1500);
  };
  const responderMensagem = (id: string) => {
    router.push(`/responder/${id}`);
  };

  if (loading || carregando || !user) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Inbox Secreta</h1>
              <p className="text-gray-600 text-sm">Suas mensagens anônimas</p>
            </div>
            <button
              onClick={handleLogout}
              title="Sair"
              className="flex items-center gap-1 p-2 rounded-md hover:bg-gray-100 transition-colors duration-200 text-xs text-gray-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-500">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M18 12h-9m0 0l3-3m-3 3l3 3" />
              </svg>
              <span>Sair</span>
            </button>
          </div>
        </div>
        
        {/* Status de atualização */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-gray-700 text-sm">Última atualização:</span>
                <span className="text-gray-500 font-mono text-sm">{ultimaAtualizacao.toLocaleTimeString('pt-BR')}</span>
              </div>
              {feedback && (
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  feedback.includes('Nova mensagem') 
                    ? 'bg-green-100 text-green-700 border border-green-200' 
                    : feedback.includes('Atualizando')
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : feedback.includes('Atualizado')
                    ? 'bg-gray-100 text-gray-700 border border-gray-200'
                    : 'bg-green-100 text-green-700 border border-green-200'
                }`}>
                  {feedback}
                </div>
              )}
            </div>
            <button
              onClick={handleAtualizar}
              className="bg-gradient-to-r from-purple-600 to-pink-400 hover:from-purple-700 hover:to-pink-500 text-white px-3 py-1.5 rounded-md transition-colors duration-200 font-medium text-sm"
            >
              Atualizar
            </button>
          </div>
        </div>
        
        {/* Link da caixa */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Seu Link Público</h2>
            <BotaoCopiarLink link={typeof window !== 'undefined' ? window.location.origin + '/' + username : ''} />
          </div>
        </div>
        
        {/* Mensagens */}
        <div className="space-y-4">
          {mensagens.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
              <div className="text-3xl mb-3 text-gray-400">📭</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhuma mensagem</h3>
              <p className="text-gray-600 text-sm">Compartilhe seu link para começar a receber mensagens anônimas</p>
            </div>
          ) : (
            mensagens.map((msg, index) => (
              <CardMensagem
                key={msg.id}
                numero={mensagens.length - index}
                conteudo={msg.content}
                status={msg.status || 'nova'}
                resposta={msg.response_text}
                onCopiar={() => copiarMensagem(msg.id, msg.content)}
                onRepostar={() => {}}
                onDenunciar={() => denunciarMensagem(msg.id)}
                onResponder={() => responderMensagem(msg.id)}
                feedback={feedbacksCard[msg.id]}
                username={username}
              />
            ))
          )}
        </div>
      </div>
    </main>
  );
} 