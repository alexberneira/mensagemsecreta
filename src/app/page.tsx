import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Inbox Secreta - Receba Mensagens Anônimas | 100% Seguro e Divertido",
  description: "Receba mensagens anônimas, confissões e elogios de forma segura. Crie sua caixa secreta gratuita e descubra o que as pessoas realmente pensam sobre você!",
  keywords: "mensagens anônimas, confissões anônimas, inbox secreta, perguntas anônimas, elogios anônimos, segredos, anônimo, viral",
  openGraph: {
    title: "Inbox Secreta - Receba Mensagens Anônimas",
    description: "Receba mensagens anônimas, confissões e elogios de forma segura. Descubra o que as pessoas realmente pensam sobre você!",
    type: 'website',
    locale: 'pt_BR',
  },
};

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Inbox Secreta",
    "description": "Receba mensagens anônimas, confissões e elogios de forma segura e divertida",
    "url": "https://inboxsecreta.com",
    "applicationCategory": "SocialNetworkingApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "BRL"
    },
    "creator": {
      "@type": "Organization",
      "name": "Inbox Secreta"
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">Inbox Secreta</h1>
            <div className="flex gap-2 items-center flex-nowrap">
              <Link href="/login" className="text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium flex items-center">
                Entrar
              </Link>
              <Link href="/register" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all">
                Criar conta
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-semibold text-gray-900 mb-4">
            Descubra o que as pessoas realmente pensam sobre você.
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Receba mensagens anônimas, confissões, elogios e segredos.<br/>
            É fácil, seguro e totalmente anônimo.<br/>
            <span className="font-semibold text-purple-600">Desafie seus amigos, surpreenda-se com as respostas e compartilhe nas redes!</span>
          </p>
          <Link href="/register" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-lg font-medium text-lg hover:from-purple-600 hover:to-pink-600 transition-all">
            Quero minha caixa secreta agora
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 text-center">
            <div className="text-3xl mb-4">🔒</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">100% Anônimo</h3>
            <p className="text-gray-600 text-sm">Ninguém descobre quem enviou. Nem você, nem ninguém.<br/>Sinta a liberdade de perguntar e responder sem julgamentos.</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 text-center">
            <div className="text-3xl mb-4">💬</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Respostas Secretas</h3>
            <p className="text-gray-600 text-sm">Responda anonimamente e crie conversas misteriosas.<br/>Só você controla o que aparece.</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 text-center">
            <div className="text-3xl mb-4">🚀</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Viral e Divertido</h3>
            <p className="text-gray-600 text-sm">Compartilhe seu link, desafie seus amigos e veja o que viraliza.<br/>Os melhores prints bombam no Instagram!</p>
          </div>
        </div>

        {/* How it works */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <h3 className="text-2xl font-semibold text-gray-900 mb-8 text-center">Como funciona?</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 font-semibold">1</div>
              <h4 className="font-semibold text-gray-900 mb-2">Crie sua caixa secreta</h4>
              <p className="text-gray-600 text-sm">Cadastre-se em segundos e personalize seu link exclusivo.</p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 font-semibold">2</div>
              <h4 className="font-semibold text-gray-900 mb-2">Compartilhe e receba mensagens</h4>
              <p className="text-gray-600 text-sm">Poste seu link onde quiser. Receba perguntas, elogios e confissões anônimas.</p>
            </div>
            <div className="text-center">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 font-semibold">3</div>
              <h4 className="font-semibold text-gray-900 mb-2">Responda e compartilhe</h4>
              <p className="text-gray-600 text-sm">Responda como quiser e compartilhe os melhores momentos nas redes.</p>
            </div>
          </div>
        </div>

        {/* CTA Final */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-purple-700 mb-4">Pronto para descobrir o que pensam sobre você?</h3>
          <p className="text-lg text-gray-700 mb-6">Não fique de fora. Milhares de pessoas já estão se divertindo com o Inbox Secreta!</p>
          <Link href="/register" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-lg font-medium text-lg hover:from-purple-600 hover:to-pink-600 transition-all">
            Quero participar agora
          </Link>
        </div>
      </div>
    </main>
  );
}
