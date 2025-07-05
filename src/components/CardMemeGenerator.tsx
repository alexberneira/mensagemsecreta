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
        height: 800,
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

  // Card visual (preview) - igual ao CardMensagem
  const CardVisual = ({ message, response, username, randomPhrase }: { message: string, response?: string, username: string, randomPhrase: string }) => (
    <div
      style={{
        width: '400px',
        height: 'auto',
        minHeight: '300px',
        borderRadius: '12px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #f3e8ff 0%, #fce7f3 50%, #ffffff 100%)',
        boxSizing: 'border-box',
        border: '1px solid #e5e7eb',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Header com numeração */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ color: '#6b7280', fontSize: '16px', fontWeight: 'bold' }}>#1</span>
          <div style={{ 
            padding: '6px 12px', 
            borderRadius: '9999px', 
            border: '1px solid #bbf7d0', 
            fontSize: '14px', 
            fontWeight: '600',
            backgroundColor: '#f0fdf4',
            color: '#166534'
          }}>
            <span style={{ textTransform: 'capitalize' }}>respondida</span>
          </div>
        </div>
      </div>

      {/* Conteúdo da mensagem */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{
          color: '#111827',
          lineHeight: '1.6',
          whiteSpace: 'pre-wrap',
          fontSize: '16px',
          fontWeight: 'bold',
          wordBreak: 'break-word',
          width: '100%'
        }}>
          {message}
        </div>
      </div>

      {/* Resposta */}
      {response && (
        <div style={{ 
          marginBottom: '16px', 
          padding: '16px', 
          background: 'linear-gradient(90deg, #f0fdf4 0%, #ecfdf5 100%)', 
          borderRadius: '8px', 
          border: '1px solid #bbf7d0' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span style={{ fontWeight: 'bold', color: '#166534', fontSize: '14px' }}>🗨️ Resposta</span>
          </div>
          <div style={{
            color: '#1f2937',
            lineHeight: '1.6',
            whiteSpace: 'pre-wrap',
            fontSize: '16px',
            fontWeight: '500',
            wordBreak: 'break-word'
          }}>
            {response}
          </div>
        </div>
      )}

      {/* Rodapé com domínio */}
      <div style={{ 
        textAlign: 'center', 
        marginTop: '16px', 
        paddingTop: '12px', 
        borderTop: '1px solid #e5e7eb',
        color: '#6b7280',
        fontSize: '12px',
        fontWeight: '500'
      }}>
        inboxsecreta.com
      </div>
    </div>
  );

  // Card invisível (para captura) - igual ao CardMensagem
  const CardHidden = ({ message, response, username, randomPhrase }: { message: string, response?: string, username: string, randomPhrase: string }) => (
    <div
      ref={cardRef}
      style={{
        width: '1080px',
        height: 'auto',
        minHeight: '800px',
        borderRadius: '32px',
        padding: '64px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'absolute',
        left: '-9999px',
        top: 0,
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #f3e8ff 0%, #fce7f3 50%, #ffffff 100%)',
        boxSizing: 'border-box',
        zIndex: -1,
        border: '2px solid #e5e7eb',
        boxShadow: '0 8px 32px -1px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Header com numeração */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <span style={{ color: '#6b7280', fontSize: '32px', fontWeight: 'bold' }}>#1</span>
          <div style={{ 
            padding: '12px 24px', 
            borderRadius: '9999px', 
            border: '2px solid #bbf7d0', 
            fontSize: '28px', 
            fontWeight: '600',
            backgroundColor: '#f0fdf4',
            color: '#166534'
          }}>
            <span style={{ textTransform: 'capitalize' }}>respondida</span>
          </div>
        </div>
      </div>

      {/* Conteúdo da mensagem */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{
          color: '#111827',
          lineHeight: '1.6',
          whiteSpace: 'pre-wrap',
          fontSize: '32px',
          fontWeight: 'bold',
          wordBreak: 'break-word',
          width: '100%'
        }}>
          {message}
        </div>
      </div>

      {/* Resposta */}
      {response && (
        <div style={{ 
          marginBottom: '32px', 
          padding: '32px', 
          background: 'linear-gradient(90deg, #f0fdf4 0%, #ecfdf5 100%)', 
          borderRadius: '16px', 
          border: '2px solid #bbf7d0' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
            <span style={{ fontWeight: 'bold', color: '#166534', fontSize: '28px' }}>🗨️ Resposta</span>
          </div>
          <div style={{
            color: '#1f2937',
            lineHeight: '1.6',
            whiteSpace: 'pre-wrap',
            fontSize: '28px',
            fontWeight: '500',
            wordBreak: 'break-word'
          }}>
            {response}
          </div>
        </div>
      )}

      {/* Rodapé com domínio */}
      <div style={{ 
        textAlign: 'center', 
        marginTop: '32px', 
        paddingTop: '24px', 
        borderTop: '2px solid #e5e7eb',
        color: '#6b7280',
        fontSize: '24px',
        fontWeight: '500'
      }}>
        inboxsecreta.com
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
              <div className="flex flex-wrap justify-center gap-1.5">
                <button
                  onClick={downloadImage}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-2.5 py-1 rounded-md font-medium hover:from-blue-600 hover:to-cyan-600 transition-all text-xs"
                >
                  📥 Baixar
                </button>
                
                <button
                  onClick={copyToClipboard}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2.5 py-1 rounded-md font-medium hover:from-green-600 hover:to-emerald-600 transition-all text-xs"
                >
                  📋 Copiar
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
                  className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-2.5 py-1 rounded-md font-medium hover:from-pink-600 hover:to-purple-600 transition-all text-xs"
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