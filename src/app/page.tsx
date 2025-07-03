import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">Inbox Secreta</h1>
            <div className="flex gap-4">
              <Link href="/login" className="text-gray-600 hover:text-gray-900 transition-colors duration-200 font-medium">
                Entrar
              </Link>
              <Link href="/register" className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200 font-medium">
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
            Receba mensagens anônimas de forma segura
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Crie sua caixa de entrada secreta e descubra o que as pessoas realmente pensam sobre você.
          </p>
          <Link href="/register" className="bg-gray-900 text-white px-8 py-4 rounded-lg hover:bg-gray-800 transition-colors duration-200 font-medium text-lg">
            Criar minha caixa secreta
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 text-center">
            <div className="text-3xl mb-4">🔒</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">100% Anônimo</h3>
            <p className="text-gray-600 text-sm">Nenhum dado do remetente é armazenado. Anonimato total garantido.</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 text-center">
            <div className="text-3xl mb-4">💬</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Respostas Secretas</h3>
            <p className="text-gray-600 text-sm">Responda anonimamente e libere as respostas através de um paywall.</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 text-center">
            <div className="text-3xl mb-4">🚀</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Viral e Divertido</h3>
            <p className="text-gray-600 text-sm">Compartilhe seu link e receba mensagens de quem quiser.</p>
          </div>
        </div>

        {/* How it works */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <h3 className="text-2xl font-semibold text-gray-900 mb-8 text-center">Como funciona?</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-gray-900 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 font-semibold">1</div>
              <h4 className="font-semibold text-gray-900 mb-2">Crie sua caixa</h4>
              <p className="text-gray-600 text-sm">Cadastre-se com e-mail e senha, escolha um username único para sua URL pública.</p>
            </div>
            <div className="text-center">
              <div className="bg-gray-900 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 font-semibold">2</div>
              <h4 className="font-semibold text-gray-900 mb-2">Compartilhe o link</h4>
              <p className="text-gray-600 text-sm">Qualquer pessoa pode enviar mensagens anônimas através do seu link.</p>
            </div>
            <div className="text-center">
              <div className="bg-gray-900 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 font-semibold">3</div>
              <h4 className="font-semibold text-gray-900 mb-2">Responda e monetize</h4>
              <p className="text-gray-600 text-sm">Responda anonimamente e libere as respostas através de pagamento.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
