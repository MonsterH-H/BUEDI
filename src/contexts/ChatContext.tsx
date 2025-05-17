import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Types
export interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  timestamp: Date;
  read: boolean;
  attachmentUrl?: string;
}

export interface Conversation {
  id: string;
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
  title?: string;
  avatarUrl?: string;
}

export interface User {
  id: string;
  name: string;
  avatarUrl?: string;
  status: 'online' | 'offline' | 'away';
  lastSeen?: Date;
}

interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  messages: Record<string, Message[]>;
  users: User[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  conversations: [],
  activeConversationId: null,
  messages: {},
  users: [],
  isLoading: false,
  error: null,
};

// Actions
type ChatAction =
  | { type: 'FETCH_CONVERSATIONS_REQUEST' }
  | { type: 'FETCH_CONVERSATIONS_SUCCESS'; payload: Conversation[] }
  | { type: 'FETCH_CONVERSATIONS_FAILURE'; payload: string }
  | { type: 'FETCH_MESSAGES_REQUEST'; payload: string }
  | { type: 'FETCH_MESSAGES_SUCCESS'; payload: { conversationId: string; messages: Message[] } }
  | { type: 'FETCH_MESSAGES_FAILURE'; payload: string }
  | { type: 'FETCH_USERS_SUCCESS'; payload: User[] }
  | { type: 'SEND_MESSAGE'; payload: Message }
  | { type: 'MARK_CONVERSATION_AS_READ'; payload: string }
  | { type: 'SET_ACTIVE_CONVERSATION'; payload: string }
  | { type: 'NEW_MESSAGE_RECEIVED'; payload: Message }
  | { type: 'CREATE_CONVERSATION'; payload: Conversation };

// Reducer
const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case 'FETCH_CONVERSATIONS_REQUEST':
      return { ...state, isLoading: true, error: null };
    
    case 'FETCH_CONVERSATIONS_SUCCESS':
      return {
        ...state,
        conversations: action.payload,
        isLoading: false,
      };
    
    case 'FETCH_CONVERSATIONS_FAILURE':
      return { ...state, error: action.payload, isLoading: false };
    
    case 'FETCH_MESSAGES_REQUEST':
      return { ...state, isLoading: true };
    
    case 'FETCH_MESSAGES_SUCCESS':
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.payload.conversationId]: action.payload.messages,
        },
        isLoading: false,
      };
    
    case 'FETCH_MESSAGES_FAILURE':
      return { ...state, error: action.payload, isLoading: false };
    
    case 'FETCH_USERS_SUCCESS':
      return { ...state, users: action.payload };
    
    case 'SEND_MESSAGE': {
      const { conversationId } = action.payload as any;
      const conversation = state.conversations.find(c => c.id === conversationId);
      
      if (!conversation) return state;
      
      // Update messages
      const updatedMessages = {
        ...state.messages,
        [conversationId]: [...(state.messages[conversationId] || []), action.payload],
      };
      
      // Update conversation with last message
      const updatedConversations = state.conversations.map(c => {
        if (c.id === conversationId) {
          return {
            ...c,
            lastMessage: action.payload,
          };
        }
        return c;
      });
      
      return {
        ...state,
        messages: updatedMessages,
        conversations: updatedConversations,
      };
    }
    
    case 'NEW_MESSAGE_RECEIVED': {
      const { conversationId } = action.payload as any;
      const isActiveConversation = state.activeConversationId === conversationId;
      
      // Update messages
      const updatedMessages = {
        ...state.messages,
        [conversationId]: [...(state.messages[conversationId] || []), action.payload],
      };
      
      // Update conversation with last message and unread count
      const updatedConversations = state.conversations.map(c => {
        if (c.id === conversationId) {
          return {
            ...c,
            lastMessage: action.payload,
            unreadCount: isActiveConversation ? 0 : c.unreadCount + 1,
          };
        }
        return c;
      });
      
      return {
        ...state,
        messages: updatedMessages,
        conversations: updatedConversations,
      };
    }
    
    case 'MARK_CONVERSATION_AS_READ': {
      const updatedConversations = state.conversations.map(c => {
        if (c.id === action.payload) {
          return { ...c, unreadCount: 0 };
        }
        return c;
      });
      
      // Update messages to mark them as read
      const conversationMessages = state.messages[action.payload] || [];
      const updatedConversationMessages = conversationMessages.map(m => ({ ...m, read: true }));
      
      return {
        ...state,
        conversations: updatedConversations,
        messages: {
          ...state.messages,
          [action.payload]: updatedConversationMessages,
        },
      };
    }
    
    case 'SET_ACTIVE_CONVERSATION':
      return {
        ...state,
        activeConversationId: action.payload,
      };
    
    case 'CREATE_CONVERSATION':
      return {
        ...state,
        conversations: [action.payload, ...state.conversations],
      };
    
    default:
      return state;
  }
};

// Context
interface ChatContextType extends ChatState {
  sendMessage: (conversationId: string, content: string, attachmentUrl?: string) => void;
  createConversation: (participantIds: string[], title?: string) => string;
  markConversationAsRead: (conversationId: string) => void;
  setActiveConversation: (conversationId: string) => void;
  getConversationMessages: (conversationId: string) => void;
  getConversationById: (conversationId: string) => Conversation | undefined;
  getUserById: (userId: string) => User | undefined;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Provider
export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  
  // Simulation: Charger les conversations et les utilisateurs au démarrage
  useEffect(() => {
    dispatch({ type: 'FETCH_CONVERSATIONS_REQUEST' });
    
    // Simuler des utilisateurs
    const mockUsers: User[] = [
      {
        id: 'user1',
        name: 'Jean Dupont',
        avatarUrl: 'https://ui-avatars.com/api/?name=Jean+Dupont&background=0D8ABC&color=fff',
        status: 'online',
      },
      {
        id: 'user2',
        name: 'Marie Martin',
        avatarUrl: 'https://ui-avatars.com/api/?name=Marie+Martin&background=C70039&color=fff',
        status: 'offline',
        lastSeen: new Date(Date.now() - 3600000), // 1 heure plus tôt
      },
      {
        id: 'user3',
        name: 'Pierre Dubois',
        avatarUrl: 'https://ui-avatars.com/api/?name=Pierre+Dubois&background=1B9C85&color=fff',
        status: 'away',
      },
    ];
    
    dispatch({ type: 'FETCH_USERS_SUCCESS', payload: mockUsers });
    
    // Simuler des conversations
    setTimeout(() => {
      const mockConversations: Conversation[] = [
        {
          id: 'conv1',
          participants: ['currentUser', 'user1'],
          unreadCount: 2,
          title: 'Jean Dupont',
          avatarUrl: 'https://ui-avatars.com/api/?name=Jean+Dupont&background=0D8ABC&color=fff',
        },
        {
          id: 'conv2',
          participants: ['currentUser', 'user2'],
          unreadCount: 0,
          title: 'Marie Martin',
          avatarUrl: 'https://ui-avatars.com/api/?name=Marie+Martin&background=C70039&color=fff',
        },
        {
          id: 'conv3',
          participants: ['currentUser', 'user3'],
          unreadCount: 5,
          title: 'Pierre Dubois',
          avatarUrl: 'https://ui-avatars.com/api/?name=Pierre+Dubois&background=1B9C85&color=fff',
        },
      ];
      
      // Simuler des messages
      const mockMessages: Record<string, Message[]> = {
        conv1: [
          {
            id: 'm1',
            senderId: 'user1',
            recipientId: 'currentUser',
            content: 'Bonjour, comment puis-je vous aider pour votre projet de rénovation ?',
            timestamp: new Date(Date.now() - 86400000), // 1 jour plus tôt
            read: true,
          },
          {
            id: 'm2',
            senderId: 'currentUser',
            recipientId: 'user1',
            content: 'Bonjour, je souhaite refaire ma salle de bain, pouvez-vous me donner un devis ?',
            timestamp: new Date(Date.now() - 3600000), // 1 heure plus tôt
            read: true,
          },
          {
            id: 'm3',
            senderId: 'user1',
            recipientId: 'currentUser',
            content: 'Bien sûr, pouvez-vous me donner les dimensions de votre salle de bain ?',
            timestamp: new Date(Date.now() - 1800000), // 30 minutes plus tôt
            read: false,
          },
        ],
        conv2: [
          {
            id: 'm4',
            senderId: 'user2',
            recipientId: 'currentUser',
            content: 'Avez-vous reçu mon devis pour les travaux d\'électricité ?',
            timestamp: new Date(Date.now() - 172800000), // 2 jours plus tôt
            read: true,
          },
          {
            id: 'm5',
            senderId: 'currentUser',
            recipientId: 'user2',
            content: 'Oui, je l\'ai bien reçu. J\'ai quelques questions concernant le délai d\'exécution.',
            timestamp: new Date(Date.now() - 86400000), // 1 jour plus tôt
            read: true,
          },
        ],
        conv3: [
          {
            id: 'm6',
            senderId: 'user3',
            recipientId: 'currentUser',
            content: 'Voici les photos de l\'avancement des travaux de maçonnerie.',
            timestamp: new Date(Date.now() - 3600000), // 1 heure plus tôt
            read: false,
            attachmentUrl: 'https://via.placeholder.com/300',
          },
          {
            id: 'm7',
            senderId: 'user3',
            recipientId: 'currentUser',
            content: 'Nous avons terminé la fondation, nous commencerons les murs demain.',
            timestamp: new Date(Date.now() - 1800000), // 30 minutes plus tôt
            read: false,
          },
        ],
      };
      
      // Mettre à jour les derniers messages des conversations
      const conversationsWithLastMessages = mockConversations.map(conv => {
        const messages = mockMessages[conv.id] || [];
        return {
          ...conv,
          lastMessage: messages[messages.length - 1],
        };
      });
      
      dispatch({ type: 'FETCH_CONVERSATIONS_SUCCESS', payload: conversationsWithLastMessages });
      
      // Mettre à jour les messages
      Object.keys(mockMessages).forEach(conversationId => {
        dispatch({
          type: 'FETCH_MESSAGES_SUCCESS',
          payload: {
            conversationId,
            messages: mockMessages[conversationId],
          },
        });
      });
    }, 1000);
    
    // Simuler des messages reçus toutes les 45 secondes
    const interval = setInterval(() => {
      if (state.conversations.length === 0) return;
      
      // Une chance sur 3 de recevoir un message
      if (Math.random() < 0.3) {
        const randomConversationIndex = Math.floor(Math.random() * state.conversations.length);
        const randomConversation = state.conversations[randomConversationIndex];
        const participantId = randomConversation.participants.find(p => p !== 'currentUser') || '';
        
        const newMessage: Message = {
          id: uuidv4(),
          senderId: participantId,
          recipientId: 'currentUser',
          content: `Message simulé reçu à ${new Date().toLocaleTimeString()}`,
          timestamp: new Date(),
          read: false,
        };
        
        dispatch({
          type: 'NEW_MESSAGE_RECEIVED',
          payload: {
            ...newMessage,
            conversationId: randomConversation.id,
          } as any,
        });
      }
    }, 45000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Envoyer un message
  const sendMessage = (conversationId: string, content: string, attachmentUrl?: string) => {
    const message: Message = {
      id: uuidv4(),
      senderId: 'currentUser',
      recipientId: '',
      content,
      timestamp: new Date(),
      read: false,
      attachmentUrl,
      conversationId, // Pour le reducer
    } as any;
    
    dispatch({ type: 'SEND_MESSAGE', payload: message });
  };
  
  // Créer une conversation
  const createConversation = (participantIds: string[], title?: string): string => {
    const newConversation: Conversation = {
      id: uuidv4(),
      participants: ['currentUser', ...participantIds],
      unreadCount: 0,
      title,
    };
    
    dispatch({ type: 'CREATE_CONVERSATION', payload: newConversation });
    
    return newConversation.id;
  };
  
  // Marquer une conversation comme lue
  const markConversationAsRead = (conversationId: string) => {
    dispatch({ type: 'MARK_CONVERSATION_AS_READ', payload: conversationId });
  };
  
  // Définir la conversation active
  const setActiveConversation = (conversationId: string) => {
    dispatch({ type: 'SET_ACTIVE_CONVERSATION', payload: conversationId });
    
    // Également marquer comme lue
    markConversationAsRead(conversationId);
  };
  
  // Récupérer les messages d'une conversation
  const getConversationMessages = (conversationId: string) => {
    if (!state.messages[conversationId]) {
      dispatch({ type: 'FETCH_MESSAGES_REQUEST', payload: conversationId });
      
      // Simuler un appel API
      setTimeout(() => {
        const messages = state.messages[conversationId] || [];
        
        dispatch({
          type: 'FETCH_MESSAGES_SUCCESS',
          payload: {
            conversationId,
            messages,
          },
        });
      }, 500);
    }
  };
  
  // Récupérer une conversation par ID
  const getConversationById = (conversationId: string) => {
    return state.conversations.find(c => c.id === conversationId);
  };
  
  // Récupérer un utilisateur par ID
  const getUserById = (userId: string) => {
    return state.users.find(u => u.id === userId);
  };
  
  return (
    <ChatContext.Provider
      value={{
        ...state,
        sendMessage,
        createConversation,
        markConversationAsRead,
        setActiveConversation,
        getConversationMessages,
        getConversationById,
        getUserById,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

// Hook personnalisé
export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}; 