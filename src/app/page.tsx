import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-6">
          Inbox Secreta
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Receba mensagens anônimas de forma segura e divertida. 
          Crie sua caixa de entrada secreta e descubra o que as pessoas realmente pensam.
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link 
            href="/register" 
            className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Criar minha caixa secreta
          </Link>
          <Link 
            href="/login" 
            className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold border-2 border-blue-600 hover:bg-blue-50 transition-colors"
          >
            Já tenho uma conta
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-4">🔒</div>
            <h3 className="text-xl font-semibold mb-2">100% Anônimo</h3>
            <p className="text-gray-600">Nenhum dado do remetente é armazenado. Anonimato total garantido.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-4">💬</div>
            <h3 className="text-xl font-semibold mb-2">Respostas Secretas</h3>
            <p className="text-gray-600">Responda anonimamente e libere as respostas através de um paywall.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-3xl mb-4">🚀</div>
            <h3 className="text-xl font-semibold mb-2">Viral e Divertido</h3>
            <p className="text-gray-600">Compartilhe seu link e receba mensagens de quem quiser.</p>
          </div>
        </div>

        {/* How it works */}
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Como funciona?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <h3 className="font-semibold mb-2">Crie sua caixa</h3>
              <p className="text-gray-600">Cadastre-se com e-mail e senha, escolha um username único para sua URL pública.</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold">2</span>
              </div>
              <h3 className="font-semibold mb-2">Compartilhe o link</h3>
              <p className="text-gray-600">Qualquer pessoa pode enviar mensagens anônimas através do seu link.</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold">3</span>
              </div>
              <h3 className="font-semibold mb-2">Responda e monetize</h3>
              <p className="text-gray-600">Responda anonimamente e libere as respostas através de pagamento.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
