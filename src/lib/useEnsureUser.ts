// Hook para garantir que o usuário autenticado tenha registro na tabela users
import { useEffect } from 'react';
import { supabase } from './supabase';
import { useAuth } from './authContext';

export function useEnsureUser(username?: string) {
  const { user } = useAuth();

  useEffect(() => {
    console.log('useEnsureUser - user:', user);
    if (!user) return;
    
    // Busca o registro do usuário na tabela users
    const ensure = async () => {
      try {
        console.log('useEnsureUser - verificando se usuário existe na tabela users...');
        const { data, error } = await supabase
          .from('users')
          .select('id')
          .eq('id', user.id)
          .single();
        
        console.log('useEnsureUser - resultado da busca:', { data, error });
        
        if (!data) {
          console.log('useEnsureUser - usuário não encontrado na tabela, criando...');
          // Cria o registro se não existir
          const usernameToUse = username || user.user_metadata?.username;
          console.log('useEnsureUser - username a usar:', usernameToUse);
          
          if (usernameToUse) {
            // Usa upsert para evitar duplicados
            const { error: insertError } = await supabase.from('users').upsert({
              id: user.id,
              email: user.email,
              username: usernameToUse,
            });
            console.log('useEnsureUser - resultado da inserção:', { insertError });
            if (insertError) {
              console.error('Erro ao criar usuário:', insertError);
            } else {
              console.log('✅ useEnsureUser - usuário criado com sucesso na tabela users');
            }
          } else {
            console.log('❌ useEnsureUser - username não encontrado');
          }
        } else {
          console.log('✅ useEnsureUser - usuário já existe na tabela users');
        }
      } catch (error) {
        console.error('Erro ao verificar/criar usuário:', error);
      }
    };
    
    ensure();
  }, [user, username]);
} 