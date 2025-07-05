// Card para exibir uma mensagem recebida ou enviada
// Props: conteúdo, status, ações (copiar, repostar, denunciar, responder)
import React, { useState } from 'react';
import CardMemeGenerator from './CardMemeGenerator';

type CardMensagemProps = {
  conteudo: string;
  status: 'nova' | 'respondida' | 'visualizada';
  onCopiar?: () => void;
  onRepostar?: () => void;
  onDenunciar?: () => void;
  onResponder?: () => void;
  resposta?: string;
  numero?: number;
  feedback?: string | null;
  username?: string;
};

export default function CardMensagem({ conteudo, status, onCopiar, onRepostar, onDenunciar, onResponder, resposta, numero, feedback, username }: CardMensagemProps) {
  const [showMemeGenerator, setShowMemeGenerator] = useState(false);
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
    <>
      <div className="bg-gradient-to-br from-purple-100 via-pink-100 to-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
        {/* Header com numeração */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-gray-500 text-base font-bold">#{numero}</span>
            <div className={`px-3 py-1.5 rounded-full border text-sm font-semibold ${getStatusColor(status)}`}>
              <span className="capitalize">{status}</span>
            </div>
          </div>
        </div>

        {/* Conteúdo da mensagem */}
        <div className="mb-4">
          <div className="text-gray-900 leading-relaxed whitespace-pre-wrap text-base font-bold" style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap', width: '100%' }}>
            {conteudo}
          </div>
        </div>

        {/* Resposta */}
        {resposta && (
          <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-bold text-green-800 text-sm">🗨️ Resposta</span>
            </div>
            <div className="text-gray-800 leading-relaxed whitespace-pre-wrap text-base font-medium" style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
              {resposta}
            </div>
          </div>
        )}

        {/* Ações */}
        <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100">
          {onCopiar && (
            <button 
              onClick={onCopiar} 
              className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs font-medium hover:bg-gray-300 transition-colors duration-200"
            >
              Copiar
            </button>
          )}
          {onRepostar && (
            <button 
              onClick={() => setShowMemeGenerator(true)} 
              className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs font-medium hover:bg-gray-300 transition-colors duration-200"
            >
              Repostar
            </button>
          )}
          {onResponder && (
            <button 
              onClick={onResponder} 
              className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs font-medium hover:bg-gray-300 transition-colors duration-200"
            >
              Responder
            </button>
          )}
        </div>

        {/* Feedback local */}
        {feedback && (
          <div className="mt-3 p-2 rounded bg-gray-100 text-gray-700 text-xs text-center">
            {feedback}
          </div>
        )}
      </div>

      {/* Modal do gerador de cards memeáveis */}
      {showMemeGenerator && username && (
        <CardMemeGenerator
          message={conteudo}
          response={resposta}
          username={username}
          onClose={() => setShowMemeGenerator(false)}
        />
      )}
    </>
  );
} 