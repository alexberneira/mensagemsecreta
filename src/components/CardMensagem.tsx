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
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'nova':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'respondida':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'visualizada':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
      {/* Conteúdo da mensagem */}
      <div className="mb-4">
        <div className="text-gray-900 leading-relaxed whitespace-pre-wrap">
          {conteudo}
        </div>
      </div>

      {/* Resposta */}
      {resposta && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-semibold text-gray-900 text-sm">Resposta</span>
          </div>
          <div className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm">
            {resposta}
          </div>
        </div>
      )}

      {/* Status e ações */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-100">
        {/* Status */}
        <div className={`flex items-center gap-2 px-2 py-1 rounded-full border text-xs ${getStatusColor(status)}`}>
          <span className="font-medium capitalize">{status}</span>
        </div>

        {/* Ações */}
        <div className="flex flex-wrap gap-2">
          {onCopiar && (
            <button 
              onClick={onCopiar} 
              className="bg-gray-900 text-white px-3 py-1.5 rounded-md hover:bg-gray-800 transition-colors duration-200 text-xs font-medium"
            >
              Copiar
            </button>
          )}
          {onRepostar && (
            <button 
              onClick={onRepostar} 
              className="bg-gray-900 text-white px-3 py-1.5 rounded-md hover:bg-gray-800 transition-colors duration-200 text-xs font-medium"
            >
              Repostar
            </button>
          )}
          {onDenunciar && (
            <button 
              onClick={onDenunciar} 
              className="bg-red-600 text-white px-3 py-1.5 rounded-md hover:bg-red-700 transition-colors duration-200 text-xs font-medium"
            >
              Denunciar
            </button>
          )}
          {onResponder && (
            <button 
              onClick={onResponder} 
              className="bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 transition-colors duration-200 text-xs font-medium"
            >
              Responder
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 