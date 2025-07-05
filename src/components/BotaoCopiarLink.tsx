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
      className="bg-gradient-to-r from-purple-600 to-pink-400 hover:from-purple-700 hover:to-pink-500 text-white px-4 py-2 rounded-md transition-colors duration-200 font-medium text-sm"
    >
      {copiado ? 'Link copiado!' : 'Copiar link da sua caixa anônima'}
    </button>
  );
} 