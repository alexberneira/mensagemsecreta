'use client';

import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';

interface CardMemeGeneratorProps {
  message: string;
  response?: string;
  username: string;
  onClose: () => void;
}

const CardMemeGenerator = ({ message, response, username, onClose }: CardMemeGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Frases memeáveis aleatórias
  const memePhrases = [
    "Tive coragem de perguntar... e recebi isso 👀",
    "Respondi anonimamente no Inbox Secreta!",
    "O que você perguntaria sem medo?",
    "Desafio: Responde aí também!",
    "Confissões anônimas são as melhores 😏"
  ];

  const randomPhrase = memePhrases[Math.floor(Math.random() * memePhrases.length)];

  // Função para truncar texto muito longo
  const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  const generateCard = async () => {
    if (!cardRef.current) return;
    
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        width: 1080,
        height: 1080,
        scale: 2, // Melhor qualidade
        backgroundColor: '#ffffff',
        useCORS: true,
        allowTaint: true,
        foreignObjectRendering: false,
      });
      
      const imageUrl = canvas.toDataURL('image/png');
      setGeneratedImage(imageUrl);
    } catch (error) {
      console.error('Erro ao gerar card:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadImage = () => {
    if (!generatedImage) return;
    
    const link = document.createElement('a');
    link.download = `inbox-secreta-${username}.png`;
    link.href = generatedImage;
    link.click();
  };

  const copyToClipboard = async () => {
    if (!generatedImage) return;
    
    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ]);
      alert('Imagem copiada para a área de transferência!');
    } catch (error) {
      console.error('Erro ao copiar:', error);
      alert('Erro ao copiar imagem');
    }
  };

  // Card visual (preview)
  const CardVisual = ({ message, response, username, randomPhrase }: { message: string, response?: string, username: string, randomPhrase: string }) => (
    <div
      style={{
        width: '360px',
        height: '360px',
        borderRadius: '16px',
        padding: '10px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #ffffff 100%)',
        boxSizing: 'border-box',
      }}
    >
      {/* Cabeçalho */}
      <div style={{ textAlign: 'center', marginBottom: '4px' }}>
        <div style={{ fontSize: '22px', fontWeight: 'bold', color: 'white', marginBottom: '2px', letterSpacing: '1px' }}>
          🔒 INBOX SECRETA
        </div>
        <div style={{ width: '100%', height: '2px', backgroundColor: 'white', opacity: 0.3 }}></div>
      </div>
      {/* Mensagem Principal */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '0' }}>
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.93)',
          borderRadius: '12px',
          padding: '8px 12px',
          marginBottom: response ? '8px' : '0',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.10)',
          maxWidth: '270px',
          width: '100%',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            fontSize: '15px',
            fontWeight: '500',
            color: '#1f2937',
            wordBreak: 'break-word',
            textAlign: 'center',
            lineHeight: 1.2,
            whiteSpace: 'pre-line',
            width: '100%',
          }}>
            💬 {message}
          </div>
        </div>
        {/* Resposta (se houver) */}
        {response && (
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            borderRadius: '8px',
            padding: '10px',
            boxShadow: '0 1px 4px rgba(0, 0, 0, 0.08)',
            maxWidth: '220px',
            width: '100%',
            marginTop: '6px',
            marginBottom: '0',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            <div style={{ fontSize: '10px', color: '#6b7280', marginBottom: '3px', fontWeight: 600 }}>
              🗨️ Resposta:
            </div>
            <div style={{
              fontSize: '12px',
              color: '#1f2937',
              wordBreak: 'break-word',
              textAlign: 'center',
              lineHeight: 1.2,
              whiteSpace: 'pre-line',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              maxHeight: '36px',
            }}>
              💭 {truncateText(response, 60)}
            </div>
          </div>
        )}
      </div>
      {/* Rodapé */}
      <div style={{ textAlign: 'center', marginTop: '4px', minHeight: '30px' }}>
        <div style={{ width: '100%', height: '2px', backgroundColor: 'white', opacity: 0.3, marginBottom: '2px' }}></div>
        <div style={{ fontSize: '13px', fontWeight: 'bold', color: 'white', marginBottom: '2px' }}>
          🔥 100% ANÔNIMO
        </div>
        <div style={{ fontSize: '10px', color: 'white', opacity: 0.95, marginBottom: '1px', fontWeight: 500 }}>
          📱 {randomPhrase}
        </div>
        <div style={{ fontSize: '10px', color: 'white', opacity: 0.9, fontWeight: 500 }}>
          inboxsecreta.com/{username}
        </div>
      </div>
    </div>
  );

  // Card invisível (para captura)
  const CardHidden = ({ message, response, username, randomPhrase }: { message: string, response?: string, username: string, randomPhrase: string }) => (
    <div
      ref={cardRef}
      style={{
        width: '1080px',
        height: '1080px',
        borderRadius: '40px',
        padding: '30px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'absolute',
        left: '-9999px',
        top: 0,
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #ffffff 100%)',
        boxSizing: 'border-box',
        zIndex: -1,
      }}
    >
      {/* Cabeçalho */}
      <div style={{ textAlign: 'center', marginBottom: '12px' }}>
        <div style={{ fontSize: '64px', fontWeight: 'bold', color: 'white', marginBottom: '4px', letterSpacing: '1px' }}>
          🔒 INBOX SECRETA
        </div>
        <div style={{ width: '100%', height: '3px', backgroundColor: 'white', opacity: 0.3 }}></div>
      </div>
      {/* Mensagem Principal */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '0' }}>
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.93)',
          borderRadius: '32px',
          padding: '18px 32px',
          marginBottom: response ? '16px' : '0',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.10)',
          maxWidth: '800px',
          width: '100%',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            fontSize: '44px',
            fontWeight: '500',
            color: '#1f2937',
            wordBreak: 'break-word',
            textAlign: 'center',
            lineHeight: 1.2,
            whiteSpace: 'pre-line',
            width: '100%',
          }}>
            💬 {message}
          </div>
        </div>
        {/* Resposta (se houver) */}
        {response && (
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            borderRadius: '24px',
            padding: '32px',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
            maxWidth: '700px',
            width: '100%',
            marginTop: '16px',
            marginBottom: '0',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
            <div style={{ fontSize: '28px', color: '#6b7280', marginBottom: '8px', fontWeight: 600 }}>
              🗨️ Resposta:
            </div>
            <div style={{
              fontSize: '32px',
              color: '#1f2937',
              wordBreak: 'break-word',
              textAlign: 'center',
              lineHeight: 1.2,
              whiteSpace: 'pre-line',
              width: '100%',
            }}>
              💭 {response}
            </div>
          </div>
        )}
      </div>
      {/* Rodapé */}
      <div style={{ textAlign: 'center', marginTop: '8px', minHeight: '80px' }}>
        <div style={{ width: '100%', height: '3px', backgroundColor: 'white', opacity: 0.3, marginBottom: '4px' }}></div>
        <div style={{ fontSize: '36px', fontWeight: 'bold', color: 'white', marginBottom: '4px' }}>
          🔥 100% ANÔNIMO
        </div>
        <div style={{ fontSize: '28px', color: 'white', opacity: 0.95, marginBottom: '2px', fontWeight: 500 }}>
          📱 {randomPhrase}
        </div>
        <div style={{ fontSize: '28px', color: 'white', opacity: 0.9, fontWeight: 500 }}>
          inboxsecreta.com/{username}
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Gerar Card para Instagram</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          {!generatedImage ? (
            <div className="space-y-6">
              {/* Preview do card */}
              <div className="flex justify-center">
                <CardVisual message={message} response={response} username={username} randomPhrase={randomPhrase} />
                {/* Card invisível para captura */}
                <CardHidden message={message} response={response} username={username} randomPhrase={randomPhrase} />
              </div>

              {/* Botão de gerar */}
              <div className="flex justify-center">
                <button
                  onClick={generateCard}
                  disabled={isGenerating}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50"
                >
                  {isGenerating ? 'Gerando...' : 'Gerar Card'}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Imagem gerada */}
              <div className="flex justify-center">
                <img
                  src={generatedImage}
                  alt="Card gerado"
                  className="max-w-full h-auto rounded-lg shadow-lg"
                />
              </div>

              {/* Botões de ação */}
              <div className="flex justify-center space-x-4">
                <button
                  onClick={downloadImage}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all"
                >
                  📥 Baixar
                </button>
                <button
                  onClick={copyToClipboard}
                  className="bg-gray-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-700 transition-all"
                >
                  📋 Copiar
                </button>
                <button
                  onClick={() => setGeneratedImage(null)}
                  className="bg-gray-400 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-500 transition-all"
                >
                  🔄 Nova versão
                </button>
              </div>

              {/* Instruções */}
              <div className="text-center text-sm text-gray-600">
                <p>💡 Dica: Compartilhe no Instagram para viralizar!</p>
                <p>Adicione as hashtags #InboxSecreta #PerguntaAnônima #RespondeAí na legenda</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardMemeGenerator; 