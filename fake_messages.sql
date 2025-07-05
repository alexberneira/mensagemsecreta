-- Script para inserir mensagens fake atrativas
-- Execute este script no Supabase SQL Editor

-- Primeiro, vamos garantir que o usuário existe
INSERT INTO users (id, email, username) 
VALUES (
  '550e8400-e29b-41d4-a716-446655440000', 
  'alexberneira@gmail.com', 
  'alexberneira'
) 
ON CONFLICT (email) DO NOTHING;

-- Agora vamos inserir 20 mensagens fake atrativas
INSERT INTO messages (user_id, content, status, response_text, created_at) VALUES
-- Mensagens de elogios e admiração
(
  '550e8400-e29b-41d4-a716-446655440000',
  'Você é uma das pessoas mais inspiradoras que conheço! Sua energia é contagiante e sempre me motiva a ser melhor. Como você consegue manter essa positividade? 🤩',
  'respondida',
  'Obrigado! Acredito que a chave é focar nas pequenas vitórias diárias e sempre tentar aprender algo novo. Cada dia é uma oportunidade de crescimento! 💪',
  NOW() - INTERVAL '2 days'
),
(
  '550e8400-e29b-41d4-a716-446655440000',
  'Sua criatividade é incrível! Como você sempre consegue ter ideias tão inovadoras? Queria ter essa habilidade! 🎨',
  'respondida',
  'A criatividade vem da curiosidade! Sempre tento ver as coisas de ângulos diferentes e não tenho medo de experimentar. Errar faz parte do processo! ✨',
  NOW() - INTERVAL '3 days'
),

-- Mensagens de confissões divertidas
(
  '550e8400-e29b-41d4-a716-446655440000',
  'Confesso que fiquei com inveja quando vi seu último projeto. Mas no bom sentido! Você é muito talentoso e isso me inspira a estudar mais! 😅',
  'respondida',
  'Haha, que elogio sincero! Mas saiba que também tenho meus momentos de dúvida. O importante é continuar evoluindo juntos! 💫',
  NOW() - INTERVAL '4 days'
),
(
  '550e8400-e29b-41d4-a716-446655440000',
  'Sempre quis te perguntar: como você consegue ser tão produtivo? Eu mal consigo fazer metade do que você faz em um dia! 😱',
  'respondida',
  'Produtividade é sobre foco, não sobre tempo! Uso a técnica Pomodoro e elimino distrações. Mas cada um tem seu ritmo! 🎯',
  NOW() - INTERVAL '5 days'
),

-- Mensagens de curiosidade sobre vida pessoal
(
  '550e8400-e29b-41d4-a716-446655440000',
  'Qual foi o momento mais desafiador da sua carreira e como você superou? Sua jornada é muito inspiradora! 💪',
  'respondida',
  'O maior desafio foi quando perdi um projeto importante. Aprendi que fracassos são oportunidades disfarçadas. Hoje vejo que foi o melhor que aconteceu! 🌟',
  NOW() - INTERVAL '6 days'
),
(
  '550e8400-e29b-41d4-a716-446655440000',
  'Você tem algum ritual matinal? Parece que você sempre acorda com energia total! ☀️',
  'respondida',
  'Sim! Acordo 1h antes, faço exercícios, medito e tomo um café da manhã nutritivo. Começar bem o dia faz toda diferença! 🧘‍♂️',
  NOW() - INTERVAL '7 days'
),

-- Mensagens sobre relacionamentos
(
  '550e8400-e29b-41d4-a716-446655440000',
  'Como você consegue equilibrar trabalho e vida pessoal? Parece que você tem tudo sob controle! 👨‍💼',
  'respondida',
  'Não é fácil! Mas aprendi a dizer não e priorizar o que realmente importa. Qualidade > quantidade em tudo! ⚖️',
  NOW() - INTERVAL '8 days'
),
(
  '550e8400-e29b-41d4-a716-446655440000',
  'Qual sua maior qualidade e seu maior defeito? Sempre fico curioso sobre autoconhecimento! 🤔',
  'respondida',
  'Maior qualidade: persistência. Maior defeito: perfeccionismo (às vezes atrapalha!). Trabalho todos os dias para melhorar! 🔧',
  NOW() - INTERVAL '9 days'
),

-- Mensagens sobre sonhos e objetivos
(
  '550e8400-e29b-41d4-a716-446655440000',
  'Qual é o seu maior sonho? E o que você está fazendo para alcançá-lo? 🚀',
  'respondida',
  'Meu sonho é impactar positivamente a vida de milhares de pessoas através da tecnologia. Cada projeto é um passo nessa direção! 🌍',
  NOW() - INTERVAL '10 days'
),
(
  '550e8400-e29b-41d4-a716-446655440000',
  'Se você pudesse dar um conselho para sua versão de 5 anos atrás, qual seria? 📚',
  'respondida',
  'Não tenha medo de tentar coisas novas e confie mais no seu instinto. Os erros são seus melhores professores! 📖',
  NOW() - INTERVAL '11 days'
),

-- Mensagens sobre hobbies e interesses
(
  '550e8400-e29b-41d4-a716-446655440000',
  'Qual foi o último livro que te marcou? Sempre procuro recomendações interessantes! 📖',
  'respondida',
  'Atomic Habits do James Clear! Mudou minha perspectiva sobre hábitos e produtividade. Super recomendo! 📚',
  NOW() - INTERVAL '12 days'
),
(
  '550e8400-e29b-41d4-a716-446655440000',
  'Você tem algum hobby que ninguém sabe? Adoro descobrir essas curiosidades! 🎭',
  'respondida',
  'Sou apaixonado por fotografia! Mas só fotografo paisagens, nunca pessoas. É meu momento de paz! 📸',
  NOW() - INTERVAL '13 days'
),

-- Mensagens sobre tecnologia e inovação
(
  '550e8400-e29b-41d4-a716-446655440000',
  'Qual tecnologia você acha que vai revolucionar o mundo nos próximos 5 anos? 🤖',
  'respondida',
  'IA generativa vai democratizar a criação de conteúdo de forma impressionante. Mas precisamos usar com responsabilidade! 🤖',
  NOW() - INTERVAL '14 days'
),
(
  '550e8400-e29b-41d4-a716-446655440000',
  'Como você se mantém atualizado com as últimas tendências da tecnologia? 📱',
  'respondida',
  'Sigo newsletters, podcasts e participo de comunidades online. Networking é fundamental para ficar por dentro! 🌐',
  NOW() - INTERVAL '15 days'
),

-- Mensagens sobre superação
(
  '550e8400-e29b-41d4-a716-446655440000',
  'Qual foi o momento que você percebeu que estava no caminho certo? 🎯',
  'respondida',
  'Quando comecei a receber mensagens de pessoas dizendo que meus projetos as inspiraram. Aí soube que estava fazendo diferença! ❤️',
  NOW() - INTERVAL '16 days'
),
(
  '550e8400-e29b-41d4-a716-446655440000',
  'Como você lida com a pressão e o estresse? Parece que nada te abala! 😌',
  'respondida',
  'Não é bem assim! Mas aprendi a meditar e fazer exercícios regularmente. Saúde mental é prioridade! 🧘‍♂️',
  NOW() - INTERVAL '17 days'
),

-- Mensagens sobre futuro
(
  '550e8400-e29b-41d4-a716-446655440000',
  'Onde você se vê daqui a 10 anos? Sua visão de futuro é muito inspiradora! 🔮',
  'respondida',
  'Espero ter criado algo que realmente ajude as pessoas e ter uma família feliz. O resto é consequência! 🏠',
  NOW() - INTERVAL '18 days'
),
(
  '550e8400-e29b-41d4-a716-446655440000',
  'Qual é a sua filosofia de vida? Sempre fico impressionado com sua sabedoria! 🧠',
  'respondida',
  'Viver com propósito, aprender sempre e tratar todos com respeito. Simples assim! ✨',
  NOW() - INTERVAL '19 days'
),

-- Mensagens finais motivacionais
(
  '550e8400-e29b-41d4-a716-446655440000',
  'Você é uma inspiração para muita gente! Continue sendo essa pessoa incrível que você é! 🌟',
  'respondida',
  'Obrigado pelas palavras! Mas lembre-se: todos temos algo especial para oferecer ao mundo. Você também é inspiração! 💫',
  NOW() - INTERVAL '20 days'
),
(
  '550e8400-e29b-41d4-a716-446655440000',
  'Como você consegue ser tão autêntico nas redes sociais? É raro ver alguém tão real! 👏',
  'respondida',
  'Acredito que autenticidade atrai autenticidade. Quando você é real, as pessoas se conectam de verdade! 🤝',
  NOW() - INTERVAL '21 days'
);

-- Verificar se as mensagens foram inseridas
SELECT COUNT(*) as total_mensagens FROM messages WHERE user_id = '550e8400-e29b-41d4-a716-446655440000'; 