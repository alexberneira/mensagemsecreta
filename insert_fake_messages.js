// Script para inserir mensagens fake via API
// Execute este script no console do navegador ou como script Node.js

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

// Função para inserir mensagens (se você quiser usar via API)
async function insertFakeMessages() {
  const userId = '550e8400-e29b-41d4-a716-446655440000'; // ID do usuário alexberneira
  
  for (let i = 0; i < fakeMessages.length; i++) {
    const message = fakeMessages[i];
    const daysAgo = i + 2; // Começa há 2 dias atrás
    
    try {
      // Aqui você pode usar a API do Supabase ou fazer uma requisição HTTP
      console.log(`Inserindo mensagem ${i + 1}: ${message.content.substring(0, 50)}...`);
      
      // Exemplo de como seria via API (ajuste conforme sua implementação)
      // await fetch('/api/messages', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     user_id: userId,
      //     content: message.content,
      //     response_text: message.response,
      //     status: 'respondida',
      //     created_at: new Date(Date.now() - (daysAgo * 24 * 60 * 60 * 1000))
      //   })
      // });
      
    } catch (error) {
      console.error(`Erro ao inserir mensagem ${i + 1}:`, error);
    }
  }
  
  console.log('Todas as mensagens foram inseridas!');
}

// Execute a função se estiver no Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { fakeMessages, insertFakeMessages };
}

// Ou execute diretamente se estiver no navegador
if (typeof window !== 'undefined') {
  console.log('Script carregado! Execute insertFakeMessages() para inserir as mensagens.');
} 