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
    <button onClick={copiar} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
      {copiado ? 'Link copiado!' : 'Copiar link da sua caixa anônima'}
    </button>
  );
} 