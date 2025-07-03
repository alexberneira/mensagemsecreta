// Página de teste para verificar conexões
'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function TestPage() {
  const [results, setResults] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const testSupabaseConnection = async () => {
    setLoading(true);
    const newResults: any = {};

    try {
      // Teste 1: Conexão básica
      console.log('Testando conexão básica...');
      const { data, error } = await supabase.from('users').select('count').limit(1);
      newResults.connection = error ? `Erro: ${error.message}` : '✅ Conexão OK';
      console.log('Resultado conexão:', { data, error });

      // Teste 2: Verificar tabelas (método alternativo)
      console.log('Verificando tabelas...');
      const { data: usersData, error: usersError } = await supabase.from('users').select('*').limit(1);
      const { data: messagesData, error: messagesError } = await supabase.from('messages').select('*').limit(1);
      const { data: paymentsData, error: paymentsError } = await supabase.from('payments').select('*').limit(1);
      
      const tablesStatus = [];
      if (usersError) tablesStatus.push(`users: ${usersError.message}`);
      else tablesStatus.push('users: ✅ OK');
      if (messagesError) tablesStatus.push(`messages: ${messagesError.message}`);
      else tablesStatus.push('messages: ✅ OK');
      if (paymentsError) tablesStatus.push(`payments: ${paymentsError.message}`);
      else tablesStatus.push('payments: ✅ OK');
      
      newResults.tables = tablesStatus.join(' | ');
      console.log('Tabelas:', { usersData, messagesData, paymentsData });

      // Teste 3: Testar inserção com UUID válido
      console.log('Testando inserção...');
      const testUser = {
        id: crypto.randomUUID(), // UUID válido
        email: 'test@test.com',
        username: 'testuser' + Date.now()
      };
      const { error: insertError } = await supabase.from('users').insert(testUser);
      newResults.insert = insertError ? `Erro: ${insertError.message}` : '✅ Inserção OK';
      console.log('Inserção:', { testUser, insertError });

      // Teste 4: Testar autenticação
      console.log('Testando autenticação...');
      const { data: authData, error: authError } = await supabase.auth.getUser();
      newResults.auth = authError ? `Erro: ${authError.message}` : `✅ Auth OK - Usuário: ${authData.user?.email || 'Nenhum'}`;
      console.log('Auth:', { authData, authError });

      // Teste 5: Verificar variáveis de ambiente
      newResults.env = {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Configurada' : '❌ Não configurada',
        supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Configurada' : '❌ Não configurada'
      };

    } catch (error) {
      console.error('Erro geral:', error);
      newResults.general = `Erro geral: ${error}`;
    }

    setResults(newResults);
    setLoading(false);
  };

  const testInsert = async () => {
    setLoading(true);
    const newResults: any = {};

    try {
      // Teste 1: Verificar se conseguimos inserir um registro de teste
      const timestamp = Date.now();
      const testUser = {
        id: '00000000-0000-0000-0000-000000000001', // UUID válido
        email: `test${timestamp}@example.com`, // Email único
        username: 'testuser' + timestamp,
      };
      
      newResults.insert = `Testando inserção...\nTentando inserir: ${JSON.stringify(testUser, null, 2)}\n`;
      
      const { data, error } = await supabase
        .from('users')
        .insert(testUser)
        .select();
      
      if (error) {
        newResults.insert += `❌ Erro na inserção: ${error.message}\n`;
        console.error('Erro na inserção:', error);
      } else {
        newResults.insert += `✅ Inserção bem-sucedida: ${JSON.stringify(data, null, 2)}\n`;
        console.log('Inserção bem-sucedida:', data);
      }
      
      // Teste 2: Verificar se conseguimos buscar o registro
      newResults.insert += '\nTestando busca...\n';
      
      const { data: searchData, error: searchError } = await supabase
        .from('users')
        .select('*')
        .eq('id', testUser.id)
        .single();
      
      if (searchError) {
        newResults.insert += `❌ Erro na busca: ${searchError.message}\n`;
      } else {
        newResults.insert += `✅ Busca bem-sucedida: ${JSON.stringify(searchData, null, 2)}\n`;
      }
      
      // Teste 3: Limpar o registro de teste
      newResults.insert += '\nLimpando registro de teste...\n';
      
      const { error: deleteError } = await supabase
        .from('users')
        .delete()
        .eq('id', testUser.id);
      
      if (deleteError) {
        newResults.insert += `❌ Erro ao deletar: ${deleteError.message}\n`;
      } else {
        newResults.insert += `✅ Registro de teste removido\n`;
      }
      
    } catch (err) {
      newResults.insert += `❌ Erro geral: ${err}\n`;
      console.error('Erro geral:', err);
    }
    
    setResults(newResults);
    setLoading(false);
  };

  const checkTables = async () => {
    setLoading(true);
    const newResults: any = {};

    try {
      // Verificar tabela users
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('*')
        .limit(1);
      
      newResults.tables = `Tabela users: ${usersError ? '❌ ' + usersError.message : '✅ Acessível'}\n`;
      
      if (!usersError && users && users.length > 0) {
        newResults.tables += `Colunas da tabela users: ${Object.keys(users[0]).join(', ')}\n`;
      }
      
      // Verificar tabela messages
      const { data: messages, error: messagesError } = await supabase
        .from('messages')
        .select('*')
        .limit(1);
      
      newResults.tables += `Tabela messages: ${messagesError ? '❌ ' + messagesError.message : '✅ Acessível'}\n`;
      
      if (!messagesError && messages && messages.length > 0) {
        newResults.tables += `Colunas da tabela messages: ${Object.keys(messages[0]).join(', ')}\n`;
      }
      
      // Verificar tabela payments
      const { data: payments, error: paymentsError } = await supabase
        .from('payments')
        .select('*')
        .limit(1);
      
      newResults.tables += `Tabela payments: ${paymentsError ? '❌ ' + paymentsError.message : '✅ Acessível'}\n`;
      
      if (!paymentsError && payments && payments.length > 0) {
        newResults.tables += `Colunas da tabela payments: ${Object.keys(payments[0]).join(', ')}\n`;
      }
      
    } catch (err) {
      newResults.tables += `❌ Erro geral: ${err}\n`;
    }
    
    setResults(newResults);
    setLoading(false);
  };

  const testAuth = async () => {
    setLoading(true);
    const newResults: any = {};

    try {
      const timestamp = Date.now();
      const testEmail = `test${timestamp}@example.com`;
      const testPassword = '123456';
      const testUsername = `testuser${timestamp}`;

      newResults.auth = `Testando cadastro...\nEmail: ${testEmail}\nUsername: ${testUsername}\n`;

      // Teste de cadastro
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
        options: {
          data: {
            username: testUsername
          }
        }
      });

      if (signUpError) {
        newResults.auth += `❌ Erro no cadastro: ${signUpError.message}\n`;
      } else {
        newResults.auth += `✅ Cadastro bem-sucedido\n`;
        newResults.auth += `Usuário criado: ${signUpData.user?.id}\n`;
        newResults.auth += `Sessão: ${signUpData.session ? 'Sim' : 'Não'}\n`;

        // Teste de login
        newResults.auth += '\nTestando login...\n';
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: testEmail,
          password: testPassword
        });

        if (signInError) {
          newResults.auth += `❌ Erro no login: ${signInError.message}\n`;
        } else {
          newResults.auth += `✅ Login bem-sucedido\n`;
          newResults.auth += `Usuário logado: ${signInData.user?.email}\n`;
        }

        // Limpar usuário de teste
        await supabase.auth.signOut();
      }

    } catch (err) {
      newResults.auth += `❌ Erro geral: ${err}\n`;
    }

    setResults(newResults);
    setLoading(false);
  };

  const testAuthSettings = async () => {
    setLoading(true);
    const newResults: any = {};

    try {
      newResults.authSettings = 'Verificando configurações de autenticação...\n';

      // Teste 1: Verificar se conseguimos criar um usuário
      const timestamp = Date.now();
      const testEmail = `test${timestamp}@example.com`;
      const testPassword = '123456';
      const testUsername = `testuser${timestamp}`;

      newResults.authSettings += `\nTestando cadastro:\nEmail: ${testEmail}\nUsername: ${testUsername}\n`;

      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
        options: {
          data: {
            username: testUsername
          }
        }
      });

      if (signUpError) {
        newResults.authSettings += `❌ Erro no cadastro: ${signUpError.message}\n`;
        newResults.authSettings += `Código do erro: ${signUpError.status}\n`;
      } else {
        newResults.authSettings += `✅ Cadastro bem-sucedido\n`;
        newResults.authSettings += `Usuário criado: ${signUpData.user?.id}\n`;
        newResults.authSettings += `Email confirmado: ${signUpData.user?.email_confirmed_at ? 'Sim' : 'Não'}\n`;
        newResults.authSettings += `Sessão criada: ${signUpData.session ? 'Sim' : 'Não'}\n`;

        if (!signUpData.user?.email_confirmed_at) {
          newResults.authSettings += `⚠️ Email não confirmado - verifique as configurações do Supabase\n`;
        }

        if (signUpData.session) {
          newResults.authSettings += `✅ Sessão criada automaticamente - login funcionando\n`;
        } else {
          newResults.authSettings += `⚠️ Sessão não criada - pode precisar confirmar email\n`;
        }

        // Teste de login imediato
        newResults.authSettings += '\nTestando login imediato...\n';
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: testEmail,
          password: testPassword
        });

        if (signInError) {
          newResults.authSettings += `❌ Erro no login: ${signInError.message}\n`;
        } else {
          newResults.authSettings += `✅ Login bem-sucedido\n`;
        }

        // Limpar usuário de teste
        await supabase.auth.signOut();
      }

    } catch (err) {
      newResults.authSettings += `❌ Erro geral: ${err}\n`;
    }

    setResults(newResults);
    setLoading(false);
  };

  const testUserCreation = async () => {
    setLoading(true);
    const newResults: any = {};

    try {
      const timestamp = Date.now();
      const testEmail = `test${timestamp}@example.com`;
      const testPassword = '123456';
      const testUsername = `testuser${timestamp}`;

      newResults.userCreation = `Testando criação de usuário...\nEmail: ${testEmail}\nUsername: ${testUsername}\n`;

      // Teste de cadastro
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
        options: {
          data: {
            username: testUsername
          }
        }
      });

      if (signUpError) {
        newResults.userCreation += `❌ Erro no cadastro: ${signUpError.message}\n`;
      } else {
        newResults.userCreation += `✅ Cadastro bem-sucedido\n`;
        newResults.userCreation += `ID do usuário: ${signUpData.user?.id}\n`;

        // Criar o usuário na tabela users (simulando o que acontece no cadastro real)
        if (signUpData.user) {
          newResults.userCreation += '\nCriando usuário na tabela users...\n';
          const { error: insertError } = await supabase.from('users').insert({
            id: signUpData.user.id,
            email: signUpData.user.email,
            username: testUsername,
          });

          if (insertError) {
            newResults.userCreation += `❌ Erro ao criar na tabela users: ${insertError.message}\n`;
          } else {
            newResults.userCreation += `✅ Usuário criado na tabela users\n`;
          }
        }

        // Verificar se o usuário foi criado na tabela users
        newResults.userCreation += '\nVerificando tabela users...\n';
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', signUpData.user?.id)
          .single();

        if (userError) {
          newResults.userCreation += `❌ Erro ao buscar na tabela users: ${userError.message}\n`;
        } else if (userData) {
          newResults.userCreation += `✅ Usuário encontrado na tabela users\n`;
          newResults.userCreation += `Dados: ${JSON.stringify(userData, null, 2)}\n`;
        } else {
          newResults.userCreation += `❌ Usuário não encontrado na tabela users\n`;
        }

        // Teste de login
        newResults.userCreation += '\nTestando login...\n';
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: testEmail,
          password: testPassword
        });

        if (signInError) {
          newResults.userCreation += `❌ Erro no login: ${signInError.message}\n`;
        } else {
          newResults.userCreation += `✅ Login bem-sucedido\n`;
          newResults.userCreation += `Usuário logado: ${signInData.user?.email}\n`;
        }

        // Limpar usuário de teste
        await supabase.auth.signOut();
        
        // Remover usuário de teste da tabela users
        if (signUpData.user) {
          await supabase.from('users').delete().eq('id', signUpData.user.id);
        }
      }

    } catch (err) {
      newResults.userCreation += `❌ Erro geral: ${err}\n`;
    }

    setResults(newResults);
    setLoading(false);
  };

  const checkDuplicates = async () => {
    setLoading(true);
    const newResults: any = {};

    try {
      newResults.duplicates = 'Verificando registros duplicados...\n';

      // Buscar todos os registros na tabela users
      const { data: allUsers, error: allUsersError } = await supabase
        .from('users')
        .select('*');

      if (allUsersError) {
        newResults.duplicates += `❌ Erro ao buscar usuários: ${allUsersError.message}\n`;
      } else {
        newResults.duplicates += `Total de usuários na tabela: ${allUsers?.length || 0}\n`;
        
        if (allUsers && allUsers.length > 0) {
          newResults.duplicates += '\nUsuários na tabela:\n';
          allUsers.forEach((user, index) => {
            newResults.duplicates += `${index + 1}. ID: ${user.id}, Email: ${user.email}, Username: ${user.username}\n`;
          });

          // Verificar duplicados por ID
          const ids = allUsers.map(u => u.id);
          const uniqueIds = [...new Set(ids)];
          
          if (ids.length !== uniqueIds.length) {
            newResults.duplicates += `\n⚠️ ENCONTRADOS DUPLICADOS!\n`;
            newResults.duplicates += `IDs únicos: ${uniqueIds.length}\n`;
            newResults.duplicates += `Total de registros: ${ids.length}\n`;
          } else {
            newResults.duplicates += `\n✅ Nenhum duplicado encontrado por ID\n`;
          }

          // Verificar duplicados por email
          const emails = allUsers.map(u => u.email);
          const uniqueEmails = [...new Set(emails)];
          
          if (emails.length !== uniqueEmails.length) {
            newResults.duplicates += `⚠️ ENCONTRADOS DUPLICADOS POR EMAIL!\n`;
          } else {
            newResults.duplicates += `✅ Nenhum duplicado por email\n`;
          }
        }
      }

    } catch (err) {
      newResults.duplicates += `❌ Erro geral: ${err}\n`;
    }

    setResults(newResults);
    setLoading(false);
  };

  const clearAllUsers = async () => {
    setLoading(true);
    const newResults: any = {};

    try {
      newResults.clearUsers = 'Limpando todos os usuários...\n';

      // Buscar todos os usuários primeiro
      const { data: allUsers, error: fetchError } = await supabase
        .from('users')
        .select('*');

      if (fetchError) {
        newResults.clearUsers += `❌ Erro ao buscar usuários: ${fetchError.message}\n`;
      } else {
        newResults.clearUsers += `Encontrados ${allUsers?.length || 0} usuários na tabela\n`;

        if (allUsers && allUsers.length > 0) {
          // Deletar todos os usuários
          const { error: deleteError } = await supabase
            .from('users')
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000'); // Deleta todos exceto um ID impossível

          if (deleteError) {
            newResults.clearUsers += `❌ Erro ao deletar usuários: ${deleteError.message}\n`;
          } else {
            newResults.clearUsers += `✅ Todos os usuários foram removidos da tabela\n`;
          }
        } else {
          newResults.clearUsers += `ℹ️ Nenhum usuário encontrado para deletar\n`;
        }
      }

    } catch (err) {
      newResults.clearUsers += `❌ Erro geral: ${err}\n`;
    }

    setResults(newResults);
    setLoading(false);
  };

  const clearAllData = async () => {
    setLoading(true);
    const newResults: any = {};

    try {
      newResults.clearAll = 'Limpando todos os dados...\n';

      // Limpar mensagens primeiro (devido à foreign key)
      newResults.clearAll += '\nLimpando mensagens...\n';
      const { error: messagesError } = await supabase
        .from('messages')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (messagesError) {
        newResults.clearAll += `❌ Erro ao limpar mensagens: ${messagesError.message}\n`;
      } else {
        newResults.clearAll += `✅ Mensagens removidas\n`;
      }

      // Limpar pagamentos
      newResults.clearAll += '\nLimpando pagamentos...\n';
      const { error: paymentsError } = await supabase
        .from('payments')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (paymentsError) {
        newResults.clearAll += `❌ Erro ao limpar pagamentos: ${paymentsError.message}\n`;
      } else {
        newResults.clearAll += `✅ Pagamentos removidos\n`;
      }

      // Limpar usuários
      newResults.clearAll += '\nLimpando usuários...\n';
      const { error: usersError } = await supabase
        .from('users')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (usersError) {
        newResults.clearAll += `❌ Erro ao limpar usuários: ${usersError.message}\n`;
      } else {
        newResults.clearAll += `✅ Usuários removidos\n`;
      }

      newResults.clearAll += '\n🎉 Todos os dados foram limpos!';

    } catch (err) {
      newResults.clearAll += `❌ Erro geral: ${err}\n`;
    }

    setResults(newResults);
    setLoading(false);
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Teste de Conexões - Inbox Secreta</h1>
        
        <button
          onClick={checkTables}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 mb-8"
        >
          {loading ? 'Testando...' : 'Verificar Tabelas'}
        </button>

        <button
          onClick={testInsert}
          disabled={loading}
          className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 mb-8 ml-4"
        >
          {loading ? 'Testando...' : 'Testar Inserção'}
        </button>

        <button
          onClick={testSupabaseConnection}
          disabled={loading}
          className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 mb-8 ml-4"
        >
          {loading ? 'Testando...' : 'Executar Todos os Testes'}
        </button>

        <button
          onClick={testAuth}
          disabled={loading}
          className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 disabled:opacity-50 mb-8 ml-4"
        >
          {loading ? 'Testando...' : 'Testar Autenticação'}
        </button>

        <button
          onClick={testAuthSettings}
          disabled={loading}
          className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 disabled:opacity-50 mb-8 ml-4"
        >
          {loading ? 'Testando...' : 'Testar Configurações de Autenticação'}
        </button>

        <button
          onClick={testUserCreation}
          disabled={loading}
          className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 disabled:opacity-50 mb-8 ml-4"
        >
          {loading ? 'Testando...' : 'Testar Criação de Usuário'}
        </button>

        <button
          onClick={checkDuplicates}
          disabled={loading}
          className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 disabled:opacity-50 mb-8 ml-4"
        >
          {loading ? 'Testando...' : 'Testar Verificação de Duplicados'}
        </button>

        <button
          onClick={clearAllUsers}
          disabled={loading}
          className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 disabled:opacity-50 mb-8 ml-4"
        >
          {loading ? 'Limpando...' : 'Limpar Todos os Usuários'}
        </button>

        <button
          onClick={clearAllData}
          disabled={loading}
          className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 disabled:opacity-50 mb-8 ml-4"
        >
          {loading ? 'Limpando...' : 'Limpar Todos os Dados'}
        </button>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Variáveis de Ambiente</h2>
            <div className="space-y-2">
              <div>Supabase URL: {results.env?.supabaseUrl || 'Não testado'}</div>
              <div>Supabase Key: {results.env?.supabaseKey || 'Não testado'}</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Conexão Supabase</h2>
            <div className="p-3 bg-gray-100 rounded">
              {results.connection || 'Não testado'}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Tabelas do Banco</h2>
            <div className="p-3 bg-gray-100 rounded">
              {results.tables || 'Não testado'}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Teste de Inserção</h2>
            <div className="p-3 bg-gray-100 rounded">
              {results.insert || 'Não testado'}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Autenticação</h2>
            <div className="p-3 bg-gray-100 rounded">
              {results.auth || 'Não testado'}
            </div>
          </div>

          {results.authSettings && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Configurações de Autenticação</h2>
              <div className="p-3 bg-gray-100 rounded">
                {results.authSettings}
              </div>
            </div>
          )}

          {results.userCreation && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Criação de Usuário</h2>
              <div className="p-3 bg-gray-100 rounded">
                {results.userCreation}
              </div>
            </div>
          )}

          {results.duplicates && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Verificação de Duplicados</h2>
              <div className="p-3 bg-gray-100 rounded">
                {results.duplicates}
              </div>
            </div>
          )}

          {results.clearUsers && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Limpeza de Usuários</h2>
              <div className="p-3 bg-gray-100 rounded">
                {results.clearUsers}
              </div>
            </div>
          )}

          {results.clearAll && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Limpeza de Dados</h2>
              <div className="p-3 bg-gray-100 rounded">
                {results.clearAll}
              </div>
            </div>
          )}

          {results.general && (
            <div className="bg-red-100 p-6 rounded-lg border border-red-300">
              <h2 className="text-xl font-semibold mb-4 text-red-800">Erro Geral</h2>
              <div className="p-3 bg-red-50 rounded text-red-700">
                {results.general}
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold mb-2">Como usar:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Clique em "Executar Testes"</li>
            <li>Verifique os resultados de cada seção</li>
            <li>Abra o console do navegador (F12) para logs detalhados</li>
            <li>Se houver erros, verifique as configurações do Supabase</li>
          </ol>
        </div>
      </div>
    </main>
  );
} 