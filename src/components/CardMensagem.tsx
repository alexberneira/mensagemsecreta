// Card para exibir uma mensagem recebida ou enviada
// Props: conteúdo, status, ações (copiar, repostar, denunciar, responder)
import React from 'react';

type CardMensagemProps = {
  conteudo: string;
  status: 'nova' | 'respondida' | 'visualizada';
  onCopiar?: () => void;
  onRepostar?: () => void;
  onDenunciar?: () => void;
  onResponder?: () => void;
  resposta?: string;
};

export default function CardMensagem({ conteudo, status, onCopiar, onRepostar, onDenunciar, onResponder, resposta }: CardMensagemProps) {
  return (
    <div className="border rounded p-4 mb-4 bg-gray-50 shadow">
      <div className="mb-2 text-gray-800">{conteudo}</div>
      {resposta && (
        <div className="mt-2 p-2 bg-green-50 border-l-4 border-green-400 text-green-800">
          <strong>Resposta:</strong> {resposta}
        </div>
      )}
      <div className="flex gap-2 mt-2 text-sm">
        <span className={`px-2 py-1 rounded ${status === 'nova' ? 'bg-blue-100 text-blue-700' : status === 'respondida' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{status}</span>
        {onCopiar && <button onClick={onCopiar} className="ml-2 underline">Copiar</button>}
        {onRepostar && <button onClick={onRepostar} className="underline">Repostar</button>}
        {onDenunciar && <button onClick={onDenunciar} className="text-red-500 underline">Denunciar</button>}
        {onResponder && <button onClick={onResponder} className="text-blue-500 underline">Responder</button>}
      </div>
    </div>
  );
} 