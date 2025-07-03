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
  const [username, setUsername] = useState('');

  // Garante que o usuário existe na tabela users
  useEnsureUser();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  // Busca username e mensagens do usuário
  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      setCarregando(true);
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
      setMensagens(msgs || []);
      setCarregando(false);
    };
    fetchData();
  }, [user]);

  // Função de logout
  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  // Ações dos cards
  const copiarMensagem = (conteudo: string) => {
    navigator.clipboard.writeText(conteudo);
    setFeedback('Mensagem copiada!');
    setTimeout(() => setFeedback(null), 1500);
  };
  const repostarMensagem = (conteudo: string) => {
    // Simula repostar (pode abrir modal ou compartilhar)
    setFeedback('Função de repostar em breve!');
    setTimeout(() => setFeedback(null), 1500);
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
    <main className="flex flex-col items-center min-h-screen p-4">
      <div className="w-full max-w-xl flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Seu Inbox Secreta</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Sair
        </button>
      </div>
      <div className="mb-4">
        <BotaoCopiarLink link={typeof window !== 'undefined' ? window.location.origin + '/' + username : ''} />
      </div>
      {feedback && <div className="mb-2 text-green-600">{feedback}</div>}
      <div className="w-full max-w-xl">
        {mensagens.length === 0 && <p className="text-gray-500">Nenhuma mensagem recebida ainda.</p>}
        {mensagens.map(msg => (
          <CardMensagem
            key={msg.id}
            conteudo={msg.content}
            status={msg.status || 'nova'}
            resposta={msg.response_text}
            onCopiar={() => copiarMensagem(msg.content)}
            onRepostar={() => repostarMensagem(msg.content)}
            onDenunciar={() => denunciarMensagem(msg.id)}
            onResponder={() => responderMensagem(msg.id)}
          />
        ))}
      </div>
    </main>
  );
} 