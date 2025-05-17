import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { toast } from '@/components/ui/sonner';
import { v4 as uuidv4 } from 'uuid';

// Types
export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  timestamp: Date;
  link?: string;
  userId?: string; // Pour filtrer les notifications par utilisateur
}

// État initial
interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
};

// Actions
type NotificationAction =
  | { type: 'FETCH_NOTIFICATIONS_REQUEST' }
  | { type: 'FETCH_NOTIFICATIONS_SUCCESS'; payload: Notification[] }
  | { type: 'FETCH_NOTIFICATIONS_FAILURE'; payload: string }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_AS_READ'; payload: string }
  | { type: 'MARK_ALL_AS_READ' }
  | { type: 'DELETE_NOTIFICATION'; payload: string }
  | { type: 'DELETE_ALL_NOTIFICATIONS' };

// Reducer
const notificationReducer = (state: NotificationState, action: NotificationAction): NotificationState => {
  switch (action.type) {
    case 'FETCH_NOTIFICATIONS_REQUEST':
      return { ...state, isLoading: true, error: null };
    
    case 'FETCH_NOTIFICATIONS_SUCCESS':
      return {
        ...state,
        notifications: action.payload,
        unreadCount: action.payload.filter(n => !n.read).length,
        isLoading: false,
      };
    
    case 'FETCH_NOTIFICATIONS_FAILURE':
      return { ...state, error: action.payload, isLoading: false };
    
    case 'ADD_NOTIFICATION':
      const updatedNotifications = [action.payload, ...state.notifications];
      return {
        ...state,
        notifications: updatedNotifications,
        unreadCount: updatedNotifications.filter(n => !n.read).length,
      };
    
    case 'MARK_AS_READ':
      const markedAsReadNotifications = state.notifications.map(notification =>
        notification.id === action.payload
          ? { ...notification, read: true }
          : notification
      );
      return {
        ...state,
        notifications: markedAsReadNotifications,
        unreadCount: markedAsReadNotifications.filter(n => !n.read).length,
      };
    
    case 'MARK_ALL_AS_READ':
      const allReadNotifications = state.notifications.map(notification => ({
        ...notification,
        read: true,
      }));
      return {
        ...state,
        notifications: allReadNotifications,
        unreadCount: 0,
      };
    
    case 'DELETE_NOTIFICATION':
      const filteredNotifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
      return {
        ...state,
        notifications: filteredNotifications,
        unreadCount: filteredNotifications.filter(n => !n.read).length,
      };
    
    case 'DELETE_ALL_NOTIFICATIONS':
      return {
        ...state,
        notifications: [],
        unreadCount: 0,
      };
    
    default:
      return state;
  }
};

// Contexte
interface NotificationContextType extends NotificationState {
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  deleteAllNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Provider
export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  // Simulation: Charger les notifications au démarrage (à remplacer par un appel API réel)
  useEffect(() => {
    dispatch({ type: 'FETCH_NOTIFICATIONS_REQUEST' });
    
    // Simulation de l'appel API
    setTimeout(() => {
      const mockNotifications: Notification[] = [
        {
          id: uuidv4(),
          type: 'info',
          title: 'Bienvenue sur BUEDI',
          message: 'Explorez notre plateforme pour trouver des professionnels qualifiés.',
          read: false,
          timestamp: new Date(Date.now() - 3600000), // 1 heure plus tôt
        },
        {
          id: uuidv4(),
          type: 'success',
          title: 'Nouveau devis disponible',
          message: 'Un professionnel a répondu à votre demande de devis.',
          read: false,
          timestamp: new Date(Date.now() - 86400000), // 1 jour plus tôt
          link: '/quotes',
        },
      ];
      
      dispatch({ type: 'FETCH_NOTIFICATIONS_SUCCESS', payload: mockNotifications });
    }, 1000);
    
    // Simulation de notifications en temps réel (WebSocket)
    const interval = setInterval(() => {
      // Une chance sur 5 de recevoir une notification toutes les 30 secondes
      if (Math.random() < 0.2) {
        const types: NotificationType[] = ['info', 'success', 'warning', 'error'];
        const randomType = types[Math.floor(Math.random() * types.length)];
        
        const newNotification: Notification = {
          id: uuidv4(),
          type: randomType,
          title: `Nouvelle ${randomType === 'info' ? 'information' : randomType === 'success' ? 'réussite' : randomType === 'warning' ? 'alerte' : 'erreur'}`,
          message: `Ceci est une notification de test de type ${randomType}`,
          read: false,
          timestamp: new Date(),
        };
        
        addNotification({
          type: newNotification.type,
          title: newNotification.title,
          message: newNotification.message,
          link: newNotification.link,
        });
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Ajouter une notification
  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: uuidv4(),
      timestamp: new Date(),
      read: false,
    };
    
    dispatch({ type: 'ADD_NOTIFICATION', payload: newNotification });
    
    // Afficher un toast
    toast[notification.type || 'info'](notification.title, {
      description: notification.message,
      action: notification.link ? {
        label: 'Voir',
        onClick: () => {
          window.location.href = notification.link || '#';
        },
      } : undefined,
    });
  };

  // Marquer comme lu
  const markAsRead = (id: string) => {
    dispatch({ type: 'MARK_AS_READ', payload: id });
  };

  // Marquer tout comme lu
  const markAllAsRead = () => {
    dispatch({ type: 'MARK_ALL_AS_READ' });
  };

  // Supprimer une notification
  const deleteNotification = (id: string) => {
    dispatch({ type: 'DELETE_NOTIFICATION', payload: id });
  };

  // Supprimer toutes les notifications
  const deleteAllNotifications = () => {
    dispatch({ type: 'DELETE_ALL_NOTIFICATIONS' });
  };

  return (
    <NotificationContext.Provider
      value={{
        ...state,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        deleteAllNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// Hook personnalisé
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}; 