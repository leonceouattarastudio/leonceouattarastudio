'use client';

import { useState } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: "Bonjour ! Je suis l'assistant virtuel de Leonce. Comment puis-je vous aider aujourd'hui ?",
      time: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const quickReplies = [
    "💼 Demander un devis",
    "📅 Prendre RDV",
    "🔧 Mes services",
    "📱 Me contacter"
  ];

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      type: 'user',
      text: inputMessage,
      time: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');

    // Simulation de réponse du bot
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        type: 'bot',
        text: getBotResponse(inputMessage),
        time: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const getBotResponse = (message: string) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('prix') || lowerMessage.includes('tarif') || lowerMessage.includes('coût')) {
      return "Les tarifs varient selon la complexité du projet. Un site vitrine démarre à 2500€, une app web à 3500€. Voulez-vous un devis personnalisé ?";
    }
    
    if (lowerMessage.includes('rdv') || lowerMessage.includes('rendez-vous')) {
      return "Parfait ! Je peux vous proposer un créneau cette semaine. Préférez-vous un appel ou une visio ? Quel jour vous conviendrait le mieux ?";
    }
    
    if (lowerMessage.includes('service') || lowerMessage.includes('développement')) {
      return "Je propose du développement web (React/Next.js), des apps mobiles, du e-commerce, et du cloud. Quel type de projet vous intéresse ?";
    }
    
    if (lowerMessage.includes('contact') || lowerMessage.includes('email')) {
      return "Vous pouvez me contacter à leonce.ouattara@outlook.fr ou +225 05 45 13 07 39. Je réponds généralement sous 24h !";
    }
    
    return "Merci pour votre message ! Pour une réponse détaillée, n'hésitez pas à me contacter directement ou à prendre rendez-vous.";
  };

  const handleQuickReply = (reply: string) => {
    setInputMessage(reply);
    handleSendMessage();
  };

  return (
    <>
      {/* Bouton du chatbot */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-4 bg-gradient-to-r from-[#00F5FF] to-[#9D4EDD] rounded-full shadow-lg hover:scale-110 transition-all duration-300 pulse-animation"
        >
          {isOpen ? <X className="w-6 h-6 text-white" /> : <MessageCircle className="w-6 h-6 text-white" />}
        </button>
      </div>

      {/* Fenêtre du chatbot */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 h-96 glass-card rounded-2xl border border-gray-700 flex flex-col z-50">
          {/* En-tête */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-[#00F5FF] to-[#9D4EDD] rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">Assistant Leonce</h3>
                <p className="text-xs text-gray-400">En ligne</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-gray-700 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                  <div className={`chat-bubble ${
                    message.type === 'user' 
                      ? 'bg-gradient-to-r from-[#00F5FF] to-[#9D4EDD] text-white' 
                      : 'bg-gray-800 text-gray-200'
                  }`}>
                    <p className="text-sm">{message.text}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 px-2">
                    {message.time.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.type === 'user' ? 'order-1 mr-2 bg-[#00F5FF]' : 'order-2 ml-2 bg-gray-700'
                }`}>
                  {message.type === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <Bot className="w-4 h-4 text-gray-300" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Réponses rapides */}
          {messages.length === 1 && (
            <div className="px-4 py-2 border-t border-gray-700">
              <p className="text-xs text-gray-400 mb-2">Réponses rapides :</p>
              <div className="flex flex-wrap gap-2">
                {quickReplies.map((reply, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickReply(reply)}
                    className="px-3 py-1 bg-gray-800 text-xs rounded-full hover:bg-gray-700 transition-colors"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Zone de saisie */}
          <div className="p-4 border-t border-gray-700">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Tapez votre message..."
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:border-[#00F5FF] focus:outline-none text-white text-sm"
              />
              <button
                onClick={handleSendMessage}
                className="p-2 bg-[#00F5FF] rounded-lg hover:bg-[#0099CC] transition-colors"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;