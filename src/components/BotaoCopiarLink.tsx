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
      className="bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors duration-200 font-medium"
    >
      {copiado ? 'Link copiado!' : 'Copiar link da sua caixa anônima'}
    </button>
  );
} 