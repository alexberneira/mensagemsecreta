// Botão para copiar o link da caixa anônima do usuário
import { useState } from 'react';

type BotaoCopiarLinkProps = {
  link: string;
};

export default function BotaoCopiarLink({ link }: BotaoCopiarLinkProps) {
  const [copiado, setCopiado] = useState(false);

  const copiar = async () => {
    await navigator.clipboard.writeText(link);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <button 
      onClick={copiar} 
      className="bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500 text-white px-8 py-4 rounded-2xl hover:from-amber-600 hover:via-orange-600 hover:to-yellow-600 transition-all duration-300 shadow-lg hover:shadow-xl font-serif font-semibold text-lg transform hover:scale-105"
    >
      {copiado ? '✅ Link copiado!' : '🔗 Copiar link da sua caixa anônima'}
    </button>
  );
} 