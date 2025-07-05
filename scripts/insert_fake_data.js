const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Configuração do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variáveis de ambiente do Supabase não encontradas!');
  console.log('Certifique-se de que o arquivo .env.local existe com:');
  console.log('NEXT_PUBLIC_SUPABASE_URL=sua_url');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Mensagens fake atrativas
const fakeMessages = [
  // Mensagens de elogios e admiração
  {
    content: "Você é uma das pessoas mais inspiradoras que conheço! Sua energia é contagiante e sempre me motiva a ser melhor. Como você consegue manter essa positividade? 🤩",
    response: "Obrigado! Acredito que a chave é focar nas pequenas vitórias diárias e sempre tentar aprender algo novo. Cada dia é uma oportunidade de crescimento! 💪"
  },
  {
    content: "Sua criatividade é incrível! Como você sempre consegue ter ideias tão inovadoras? Queria ter essa habilidade! 🎨",
    response: "A criatividade vem da curiosidade! Sempre tento ver as coisas de ângulos diferentes e não tenho medo de experimentar. Errar faz parte do processo! ✨"
  },

  // Confissões divertidas
  {
    content: "Confesso que fiquei com inveja quando vi seu último projeto. Mas no bom sentido! Você é muito talentoso e isso me inspira a estudar mais! 😅",
    response: "Haha, que elogio sincero! Mas saiba que também tenho meus momentos de dúvida. O importante é continuar evoluindo juntos! 💫"
  },
  {
    content: "Sempre quis te perguntar: como você consegue ser tão produtivo? Eu mal consigo fazer metade do que você faz em um dia! 😱",
    response: "Produtividade é sobre foco, não sobre tempo! Uso a técnica Pomodoro e elimino distrações. Mas cada um tem seu ritmo! 🎯"
  },

  // Curiosidade sobre vida pessoal
  {
    content: "Qual foi o momento mais desafiador da sua carreira e como você superou? Sua jornada é muito inspiradora! 💪",
    response: "O maior desafio foi quando perdi um projeto importante. Aprendi que fracassos são oportunidades disfarçadas. Hoje vejo que foi o melhor que aconteceu! 🌟"
  },
  {
    content: "Você tem algum ritual matinal? Parece que você sempre acorda com energia total! ☀️",
    response: "Sim! Acordo 1h antes, faço exercícios, medito e tomo um café da manhã nutritivo. Começar bem o dia faz toda diferença! 🧘‍♂️"
  },

  // Relacionamentos
  {
    content: "Como você consegue equilibrar trabalho e vida pessoal? Parece que você tem tudo sob controle! 👨‍💼",
    response: "Não é fácil! Mas aprendi a dizer não e priorizar o que realmente importa. Qualidade > quantidade em tudo! ⚖️"
  },
  {
    content: "Qual sua maior qualidade e seu maior defeito? Sempre fico curioso sobre autoconhecimento! 🤔",
    response: "Maior qualidade: persistência. Maior defeito: perfeccionismo (às vezes atrapalha!). Trabalho todos os dias para melhorar! 🔧"
  },

  // Sonhos e objetivos
  {
    content: "Qual é o seu maior sonho? E o que você está fazendo para alcançá-lo? 🚀",
    response: "Meu sonho é impactar positivamente a vida de milhares de pessoas através da tecnologia. Cada projeto é um passo nessa direção! 🌍"
  },
  {
    content: "Se você pudesse dar um conselho para sua versão de 5 anos atrás, qual seria? 📚",
    response: "Não tenha medo de tentar coisas novas e confie mais no seu instinto. Os erros são seus melhores professores! 📖"
  },

  // Hobbies e interesses
  {
    content: "Qual foi o último livro que te marcou? Sempre procuro recomendações interessantes! 📖",
    response: "Atomic Habits do James Clear! Mudou minha perspectiva sobre hábitos e produtividade. Super recomendo! 📚"
  },
  {
    content: "Você tem algum hobby que ninguém sabe? Adoro descobrir essas curiosidades! 🎭",
    response: "Sou apaixonado por fotografia! Mas só fotografo paisagens, nunca pessoas. É meu momento de paz! 📸"
  },

  // Tecnologia e inovação
  {
    content: "Qual tecnologia você acha que vai revolucionar o mundo nos próximos 5 anos? 🤖",
    response: "IA generativa vai democratizar a criação de conteúdo de forma impressionante. Mas precisamos usar com responsabilidade! 🤖"
  },
  {
    content: "Como você se mantém atualizado com as últimas tendências da tecnologia? 📱",
    response: "Sigo newsletters, podcasts e participo de comunidades online. Networking é fundamental para ficar por dentro! 🌐"
  },

  // Superação
  {
    content: "Qual foi o momento que você percebeu que estava no caminho certo? 🎯",
    response: "Quando comecei a receber mensagens de pessoas dizendo que meus projetos as inspiraram. Aí soube que estava fazendo diferença! ❤️"
  },
  {
    content: "Como você lida com a pressão e o estresse? Parece que nada te abala! 😌",
    response: "Não é bem assim! Mas aprendi a meditar e fazer exercícios regularmente. Saúde mental é prioridade! 🧘‍♂️"
  },

  // Futuro
  {
    content: "Onde você se vê daqui a 10 anos? Sua visão de futuro é muito inspiradora! 🔮",
    response: "Espero ter criado algo que realmente ajude as pessoas e ter uma família feliz. O resto é consequência! 🏠"
  },
  {
    content: "Qual é a sua filosofia de vida? Sempre fico impressionado com sua sabedoria! 🧠",
    response: "Viver com propósito, aprender sempre e tratar todos com respeito. Simples assim! ✨"
  },

  // Motivacionais
  {
    content: "Você é uma inspiração para muita gente! Continue sendo essa pessoa incrível que você é! 🌟",
    response: "Obrigado pelas palavras! Mas lembre-se: todos temos algo especial para oferecer ao mundo. Você também é inspiração! 💫"
  },
  {
    content: "Como você consegue ser tão autêntico nas redes sociais? É raro ver alguém tão real! 👏",
    response: "Acredito que autenticidade atrai autenticidade. Quando você é real, as pessoas se conectam de verdade! 🤝"
  }
];

async function insertFakeData() {
  console.log('🚀 Iniciando inserção de dados fake...\n');

  try {
    // 1. Criar ou verificar se o usuário existe
    console.log('📝 Verificando/criando usuário...');
    
    const { data: existingUser, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', 'alexberneira@gmail.com')
      .single();

    let userId;
    
    if (existingUser) {
      userId = existingUser.id;
      console.log('✅ Usuário já existe:', userId);
    } else {
      // Criar usuário se não existir
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert([
          {
            email: 'alexberneira@gmail.com',
            username: 'alexberneira'
          }
        ])
        .select('id')
        .single();

      if (createError) {
        throw new Error(`Erro ao criar usuário: ${createError.message}`);
      }

      userId = newUser.id;
      console.log('✅ Usuário criado:', userId);
    }

    // 2. Inserir mensagens
    console.log('\n📨 Inserindo mensagens...');
    
    for (let i = 0; i < fakeMessages.length; i++) {
      const message = fakeMessages[i];
      const daysAgo = i + 2; // Começa há 2 dias atrás
      const createdAt = new Date();
      createdAt.setDate(createdAt.getDate() - daysAgo);

      const { error: insertError } = await supabase
        .from('messages')
        .insert([
          {
            user_id: userId,
            content: message.content,
            response_text: message.response,
            status: 'respondida',
            created_at: createdAt.toISOString()
          }
        ]);

      if (insertError) {
        console.error(`❌ Erro ao inserir mensagem ${i + 1}:`, insertError.message);
      } else {
        console.log(`✅ Mensagem ${i + 1} inserida: ${message.content.substring(0, 50)}...`);
      }

      // Pequeno delay para não sobrecarregar
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // 3. Verificar resultado
    console.log('\n🔍 Verificando resultado...');
    
    const { data: messages, error: countError } = await supabase
      .from('messages')
      .select('id')
      .eq('user_id', userId);

    if (countError) {
      console.error('❌ Erro ao contar mensagens:', countError.message);
    } else {
      console.log(`🎉 Sucesso! ${messages.length} mensagens inseridas para o usuário alexberneira@gmail.com`);
    }

  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

// Executar o script
insertFakeData(); 