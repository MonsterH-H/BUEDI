import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Send, 
  X, 
  ChevronRight, 
  ChevronDown, 
  Paperclip, 
  Image,
  Smile,
  Circle,
  Download,
  Clock,
  CheckCheck
} from 'lucide-react';
import { useChat } from '@/contexts/ChatContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export const ChatDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [conversationList, setConversationList] = useState(true);
  const [activeConversationTitle, setActiveConversationTitle] = useState('');
  const messageEndRef = useRef<HTMLDivElement>(null);
  
  const { 
    conversations,
    activeConversationId,
    messages,
    setActiveConversation,
    sendMessage,
    markConversationAsRead
  } = useChat();

  // Récupérer les messages de la conversation active
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const activeMessages = activeConversationId ? messages[activeConversationId] || [] : [];
  
  // Marquer la conversation comme lue
  useEffect(() => {
    if (isOpen && activeConversationId) {
      markConversationAsRead(activeConversationId);
    }
  }, [isOpen, activeConversationId, markConversationAsRead]);
  
  // Défiler vers le bas quand de nouveaux messages arrivent
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages]);
  
  // Récupérer le titre de la conversation active
  useEffect(() => {
    if (activeConversationId) {
      const conversation = conversations.find(c => c.id === activeConversationId);
      if (conversation) {
        setActiveConversationTitle(conversation.title || 'Chat');
      }
    }
  }, [activeConversationId, conversations]);
  
  // Calculer le nombre total de messages non lus
  const totalUnreadCount = conversations.reduce((total, conv) => total + conv.unreadCount, 0);
  
  // Gérer l'envoi d'un message
  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeConversationId) return;
    
    sendMessage(activeConversationId, newMessage);
    setNewMessage('');
  };
  
  // Formater les messages par date
  const groupMessagesByDate = () => {
    const groups: { [date: string]: typeof activeMessages } = {};
    
    activeMessages.forEach(message => {
      const date = format(new Date(message.timestamp), 'P', { locale: fr });
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    
    return Object.entries(groups).map(([date, msgs]) => ({
      date,
      messages: msgs
    }));
  };
  
  // Afficher le statut du message
  const getMessageStatus = (read: boolean) => {
    if (read) {
      return <CheckCheck className="h-3.5 w-3.5 text-blue-500" />;
    }
    return <CheckCheck className="h-3.5 w-3.5 text-gray-400" />;
  };
  
  // Obtenir le statut en ligne de l'utilisateur
  const getUserStatus = (conversationId: string) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (!conversation) return 'offline';
    
    // Simuler des statuts aléatoires, à remplacer par de vrais statuts
    const statuses = ['online', 'offline', 'away'];
    const index = conversationId.charCodeAt(5) % 3;
    return statuses[index];
  };
  
  // Style du statut
  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    away: 'bg-amber-500'
  };
  
  // Récupérer le format de l'heure
  const getMessageTime = (date: Date) => {
    return format(new Date(date), 'HH:mm');
  };
  
  // Récupérer les initiales de l'utilisateur pour le fallback de l'avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };
  
  return (
    <div className="fixed bottom-4 right-4 z-40">
      {/* Bouton du chat */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative"
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="lg"
          className="h-14 w-14 rounded-full bg-buedi-blue hover:bg-buedi-blue/90 shadow-lg"
          aria-label="Chat"
        >
          <MessageSquare className="h-6 w-6" />
          {totalUnreadCount > 0 && (
            <Badge
              className="absolute -top-1 -right-1 h-5 min-w-[1.25rem] flex items-center justify-center p-0 bg-red-500 text-white"
              aria-label={`${totalUnreadCount} messages non lus`}
            >
              {totalUnreadCount}
            </Badge>
          )}
        </Button>
      </motion.div>
      
      {/* Fenêtre de chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25 }}
            className="absolute bottom-20 right-0 w-[320px] md:w-[380px] bg-white rounded-lg shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700 dark:bg-gray-800"
            style={{ height: '500px' }}
          >
            {/* En-tête */}
            <div className="flex items-center justify-between p-3 border-b dark:border-gray-700">
              {/* Titre/Retour */}
              {!conversationList && activeConversationId ? (
                <button
                  onClick={() => setConversationList(true)}
                  className="flex items-center text-sm font-medium hover:text-buedi-blue transition-colors"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Conversations
                </button>
              ) : (
                <h3 className="text-base font-medium">Conversations</h3>
              )}
              
              {/* Bouton de fermeture */}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setIsOpen(false)}
                aria-label="Fermer"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Liste des conversations */}
            {conversationList ? (
              <div className="h-[calc(500px-3rem)] overflow-y-auto divide-y dark:divide-gray-700">
                {conversations.length > 0 ? (
                  conversations.map(conversation => (
                    <button
                      key={conversation.id}
                      className={`w-full flex items-start p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left ${
                        conversation.unreadCount > 0 ? 'bg-blue-50/50 dark:bg-blue-900/20' : ''
                      }`}
                      onClick={() => {
                        setActiveConversation(conversation.id);
                        setConversationList(false);
                      }}
                    >
                      <div className="relative flex-shrink-0">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={conversation.avatarUrl} alt={conversation.title} />
                          <AvatarFallback>
                            {getInitials(conversation.title || 'User')}
                          </AvatarFallback>
                        </Avatar>
                        <span 
                          className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-gray-800 ${
                            statusColors[getUserStatus(conversation.id) as keyof typeof statusColors]
                          }`}
                          aria-hidden="true"
                        />
                      </div>
                      <div className="ml-3 flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                          <span className="font-medium truncate">{conversation.title}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 whitespace-nowrap">
                            {conversation.lastMessage && format(new Date(conversation.lastMessage.timestamp), 'HH:mm')}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                            {conversation.lastMessage?.content || 'Aucun message'}
                          </p>
                          {conversation.unreadCount > 0 && (
                            <Badge
                              className="ml-2 h-5 min-w-[1.25rem] flex items-center justify-center p-0 bg-blue-500 text-white"
                            >
                              {conversation.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 ml-2 self-center text-gray-400" />
                    </button>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-6">
                    <MessageSquare className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
                    <p className="text-gray-500 dark:text-gray-400 text-center">
                      Aucune conversation pour le moment
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      onClick={() => setIsOpen(false)}
                    >
                      Fermer
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* En-tête de la conversation */}
                <div className="border-b dark:border-gray-700 p-3">
                  <div className="flex items-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 mr-2"
                      onClick={() => setConversationList(true)}
                      aria-label="Retour"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="relative">
                      <Avatar className="h-8 w-8">
                        <AvatarImage 
                          src={conversations.find(c => c.id === activeConversationId)?.avatarUrl} 
                          alt={activeConversationTitle} 
                        />
                        <AvatarFallback>
                          {getInitials(activeConversationTitle)}
                        </AvatarFallback>
                      </Avatar>
                      <span 
                        className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white dark:border-gray-800 ${
                          statusColors[getUserStatus(activeConversationId || '') as keyof typeof statusColors]
                        }`}
                        aria-hidden="true"
                      />
                    </div>
                    <div className="ml-2 flex-1 min-w-0">
                      <div className="font-medium">{activeConversationTitle}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {getUserStatus(activeConversationId || '') === 'online' 
                          ? 'En ligne' 
                          : getUserStatus(activeConversationId || '') === 'away'
                            ? 'Absent'
                            : 'Hors ligne'}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Messages */}
                <ScrollArea className="h-[calc(500px-3rem-3.5rem-3.5rem)]">
                  <div className="p-3 space-y-4">
                    {groupMessagesByDate().map((group, groupIndex) => (
                      <div key={groupIndex} className="space-y-3">
                        <div className="relative flex items-center justify-center">
                          <div className="absolute left-0 right-0 border-t dark:border-gray-700" />
                          <span className="relative bg-white dark:bg-gray-800 px-2 text-xs text-gray-500 dark:text-gray-400">
                            {group.date}
                          </span>
                        </div>
                        
                        {group.messages.map((message, messageIndex) => (
                          <div 
                            key={messageIndex} 
                            className={`flex ${message.senderId === 'currentUser' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`max-w-[75%] ${message.senderId === 'currentUser' ? 'order-2' : 'order-1'}`}>
                              {message.senderId !== 'currentUser' && (
                                <Avatar className="h-6 w-6 mb-1">
                                  <AvatarImage 
                                    src={conversations.find(c => c.id === activeConversationId)?.avatarUrl} 
                                    alt={activeConversationTitle} 
                                  />
                                  <AvatarFallback>
                                    {getInitials(activeConversationTitle)}
                                  </AvatarFallback>
                                </Avatar>
                              )}
                              
                              <div
                                className={`rounded-lg px-3 py-2 text-sm ${
                                  message.senderId === 'currentUser' 
                                    ? 'bg-buedi-blue text-white ml-auto' 
                                    : 'bg-gray-100 dark:bg-gray-700 dark:text-gray-200'
                                }`}
                              >
                                {message.content}
                                {message.attachmentUrl && (
                                  <div className="mt-2">
                                    <a 
                                      href={message.attachmentUrl} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="block overflow-hidden rounded border dark:border-gray-600"
                                    >
                                      <img 
                                        src={message.attachmentUrl} 
                                        alt="Attachment" 
                                        className="w-full h-auto max-h-32 object-cover" 
                                      />
                                    </a>
                                  </div>
                                )}
                                <div 
                                  className={`text-xs mt-1 flex items-center justify-end ${
                                    message.senderId === 'currentUser' 
                                      ? 'text-blue-100' 
                                      : 'text-gray-500'
                                  }`}
                                >
                                  {getMessageTime(message.timestamp)}
                                  {message.senderId === 'currentUser' && (
                                    <span className="ml-1">
                                      {getMessageStatus(message.read)}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                    <div ref={messageEndRef} />
                  </div>
                </ScrollArea>
                
                {/* Formulaire d'envoi de message */}
                <div className="p-3 border-t dark:border-gray-700">
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-9 w-9 rounded-full flex-shrink-0"
                      aria-label="Joindre un fichier"
                    >
                      <Paperclip className="h-5 w-5" />
                    </Button>
                    <Input
                      placeholder="Écrivez votre message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="h-9 rounded-full"
                    />
                    <Button 
                      className="h-9 w-9 rounded-full flex-shrink-0 bg-buedi-blue hover:bg-buedi-blue/90"
                      onClick={handleSendMessage}
                      aria-label="Envoyer"
                      disabled={!newMessage.trim()}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Composant ChevronLeft (Lucide n'est pas importé par défaut)
const ChevronLeft = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="m15 18-6-6 6-6" />
  </svg>
);

export default ChatDrawer; 