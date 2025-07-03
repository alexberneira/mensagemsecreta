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
        return 'bg-blue-100/80 border-blue-300 text-blue-800';
      case 'respondida':
        return 'bg-green-100/80 border-green-300 text-green-800';
      case 'visualizada':
        return 'bg-amber-100/80 border-amber-300 text-amber-800';
      default:
        return 'bg-gray-100/80 border-gray-300 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'nova':
        return '🆕';
      case 'respondida':
        return '💬';
      case 'visualizada':
        return '👁️';
      default:
        return '📝';
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-amber-200 p-6 hover:shadow-xl transition-all duration-300">
      {/* Conteúdo da mensagem */}
      <div className="mb-4">
        <div className="text-amber-900 font-serif text-lg leading-relaxed whitespace-pre-wrap">
          "{conteudo}"
        </div>
      </div>

      {/* Resposta */}
      {resposta && (
        <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-green-600 text-lg">💌</span>
            <span className="font-serif font-semibold text-green-800">Resposta:</span>
          </div>
          <div className="text-green-700 font-serif italic leading-relaxed whitespace-pre-wrap">
            "{resposta}"
          </div>
        </div>
      )}

      {/* Status e ações */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-amber-200">
        {/* Status */}
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(status)}`}>
          <span>{getStatusIcon(status)}</span>
          <span className="font-medium capitalize">{status}</span>
        </div>

        {/* Ações */}
        <div className="flex flex-wrap gap-2">
          {onCopiar && (
            <button 
              onClick={onCopiar} 
              className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-200 shadow-md hover:shadow-lg text-sm font-medium"
            >
              📋 Copiar
            </button>
          )}
          {onRepostar && (
            <button 
              onClick={onRepostar} 
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-md hover:shadow-lg text-sm font-medium"
            >
              🔄 Repostar
            </button>
          )}
          {onDenunciar && (
            <button 
              onClick={onDenunciar} 
              className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-200 shadow-md hover:shadow-lg text-sm font-medium"
            >
              ⚠️ Denunciar
            </button>
          )}
          {onResponder && (
            <button 
              onClick={onResponder} 
              className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-3 py-1 rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 shadow-md hover:shadow-lg text-sm font-medium"
            >
              ✍️ Responder
            </button>
          )}
        </div>
      </div>
    </div>
  );
} 