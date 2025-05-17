import { toast } from 'sonner';
import api from './api';

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

export const notificationService = {
  // Récupérer toutes les notifications
  async getNotifications(): Promise<Notification[]> {
    const response = await api.get('/notifications');
    return response.data;
  },

  // Marquer une notification comme lue
  async markAsRead(id: string): Promise<void> {
    await api.patch(`/notifications/${id}/read`);
  },

  // Marquer toutes les notifications comme lues
  async markAllAsRead(): Promise<void> {
    await api.patch('/notifications/read-all');
  },

  // Supprimer une notification
  async deleteNotification(id: string): Promise<void> {
    await api.delete(`/notifications/${id}`);
  },

  // Supprimer toutes les notifications
  async deleteAllNotifications(): Promise<void> {
    await api.delete('/notifications');
  },

  // Afficher une notification toast
  showToast(type: NotificationType, title: string, message: string) {
    switch (type) {
      case 'success':
        toast.success(message, { description: title });
        break;
      case 'error':
        toast.error(message, { description: title });
        break;
      case 'warning':
        toast.warning(message, { description: title });
        break;
      default:
        toast.info(message, { description: title });
    }
  },

  // S'abonner aux notifications en temps réel
  subscribeToNotifications(callback: (notification: Notification) => void) {
    // Ici, vous pouvez implémenter WebSocket ou Server-Sent Events
    // Pour l'exemple, nous simulons une notification toutes les 30 secondes
    const interval = setInterval(() => {
      const mockNotification: Notification = {
        id: Math.random().toString(36).substr(2, 9),
        type: ['info', 'success', 'warning', 'error'][Math.floor(Math.random() * 4)] as NotificationType,
        title: 'Nouvelle notification',
        message: 'Ceci est une notification de test',
        read: false,
        createdAt: new Date().toISOString(),
      };
      callback(mockNotification);
    }, 30000);

    return () => clearInterval(interval);
  }
}; 