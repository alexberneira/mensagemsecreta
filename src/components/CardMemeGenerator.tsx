'use client';

import { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';

interface CardMemeGeneratorProps {
  message: string;
  response?: string;
  username: string;
  onClose: () => void;
}

const CardMemeGenerator = ({ message, response, username, onClose }: CardMemeGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(true);
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

  // Gerar card automaticamente quando o componente for montado
  useEffect(() => {
    const autoGenerate = async () => {
      // Pequeno delay para garantir que o DOM esteja renderizado
      setTimeout(() => {
        generateCard();
      }, 100);
    };
    autoGenerate();
  }, []);

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
        backgroundColor: 'transparent',
        useCORS: true,
        allowTaint: true,
        foreignObjectRendering: false,
      });
      
      const imageUrl = canvas.toDataURL('image/png', 1.0);
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
        background: '#111111',
        boxSizing: 'border-box',
      }}
    >
      {/* Cabeçalho */}
      <div style={{ textAlign: 'center', marginBottom: '8px' }}>
        <div style={{ fontSize: '22px', fontWeight: 'bold', color: 'white', marginBottom: '16px', letterSpacing: '1px', lineHeight: '1.2' }}>
          inboxsecreta.com
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
          inboxsecreta.com
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
        background: '#111111',
        boxSizing: 'border-box',
        zIndex: -1,
      }}
    >
      {/* Cabeçalho */}
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <div style={{ fontSize: '64px', fontWeight: 'bold', color: 'white', marginBottom: '20px', letterSpacing: '1px', lineHeight: '1.2' }}>
          inboxsecreta.com
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
          inboxsecreta.com
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">🚀 Viralize nos Stories!</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          {isGenerating ? (
            <div className="space-y-6">
              {/* Loading */}
              <div className="flex justify-center items-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                  <p className="text-gray-600">Gerando seu card...</p>
                </div>
              </div>
              {/* Card invisível para captura */}
              <CardHidden message={message} response={response} username={username} randomPhrase={randomPhrase} />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Imagem gerada */}
              <div className="flex justify-center">
                {generatedImage && (
                  <img
                    src={generatedImage}
                    alt="Card gerado"
                    className="max-w-full h-auto rounded-lg shadow-lg"
                  />
                )}
              </div>

              {/* Botões de ação */}
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  onClick={downloadImage}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-5 py-2 rounded-lg font-medium hover:from-blue-600 hover:to-cyan-600 transition-all text-base"
                >
                  📥 Baixar Imagem
                </button>
                
                <button
                  onClick={copyToClipboard}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-5 py-2 rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 transition-all text-base"
                >
                  📋 Copiar Imagem
                </button>

                <button
                  onClick={async () => {
                    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                    
                    if (isMobile && navigator.share && generatedImage) {
                      try {
                        // Converter data URL para blob
                        const response = await fetch(generatedImage);
                        const blob = await response.blob();
                        const file = new File([blob], 'inbox-secreta.png', { type: 'image/png' });
                        
                        await navigator.share({
                          title: 'Inbox Secreta',
                          text: 'Confira minha mensagem anônima! 🔒',
                          files: [file]
                        });
                      } catch (error) {
                        console.error('Erro ao compartilhar:', error);
                        // Fallback para download
                        if (generatedImage) downloadImage();
                      }
                    } else {
                      // No desktop ou quando Web Share API não está disponível
                      if (generatedImage) downloadImage();
                      alert('📱 No celular: Baixe a imagem e compartilhe nos Stories do Instagram!\n\n💡 Dica: Use o botão "Compartilhar" do seu celular e selecione Instagram Stories.');
                    }
                  }}
                  className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-5 py-2 rounded-lg font-medium hover:from-pink-600 hover:to-purple-600 transition-all text-base"
                >
                  📱 Compartilhar
                </button>
              </div>

              {/* Instruções */}
              <div className="text-center text-sm text-gray-600 mt-4 space-y-2">
                <p className="font-semibold text-purple-600">💡 Como compartilhar no Instagram:</p>
                <div className="bg-gray-50 p-3 rounded-lg text-left">
                  <p className="mb-2"><strong>📱 No Celular:</strong></p>
                  <ol className="list-decimal list-inside space-y-1 text-xs">
                    <li>Clique em "📱 Compartilhar"</li>
                    <li>Selecione "Instagram" ou "Instagram Stories"</li>
                    <li>A imagem será anexada automaticamente</li>
                  </ol>
                  
                  <p className="mt-3 mb-2"><strong>💻 No Computador:</strong></p>
                  <ol className="list-decimal list-inside space-y-1 text-xs">
                    <li>Clique em "📥 Baixar Imagem"</li>
                    <li>Envie a imagem para seu celular</li>
                    <li>Abra o Instagram e compartilhe nos Stories</li>
                  </ol>
                </div>
                <p className="text-purple-600 font-medium">🚀 Compartilhe nos Stories para viralizar!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardMemeGenerator; 