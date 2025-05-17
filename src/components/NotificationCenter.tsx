import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, Trash2, X, Info, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useNotifications, Notification, NotificationType } from '@/contexts/NotificationContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

export const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification, 
    deleteAllNotifications 
  } = useNotifications();

  // Fermer le menu des notifications quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (isOpen && !target.closest('.notification-center')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Déterminer l'icône et la couleur en fonction du type de notification
  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  // Formater la date relative (il y a X minutes, heures, etc.)
  const formatRelativeTime = (date: Date) => {
    return format(date, "'Il y a' d 'jours'", { locale: fr });
  };

  return (
    <div className="notification-center relative z-50">
      {/* Bouton de notification avec badge */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => setIsOpen(!isOpen)}
              variant="ghost"
              size="icon"
              className="relative"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white"
                  aria-label={`${unreadCount} notifications non lues`}
                >
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Notifications {unreadCount > 0 ? `(${unreadCount})` : ''}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Panneau de notifications */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay pour fermer en cliquant en dehors */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 z-40"
              aria-hidden="true"
            />

            {/* Panneau des notifications */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: 'spring', damping: 20 }}
              className="notification-center absolute right-0 mt-2 w-80 md:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden z-50"
              role="dialog"
              aria-modal="true"
              aria-label="Centre de notifications"
            >
              {/* En-tête */}
              <div className="p-4 border-b flex items-center justify-between">
                <h3 className="font-medium text-lg">Notifications</h3>
                <div className="flex items-center space-x-2">
                  {unreadCount > 0 && (
                    <Button
                      onClick={markAllAsRead}
                      variant="ghost"
                      size="sm"
                      className="text-xs h-8"
                    >
                      <Check className="h-3.5 w-3.5 mr-1" />
                      Tout marquer comme lu
                    </Button>
                  )}
                  <Button
                    onClick={() => setIsOpen(false)}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    aria-label="Fermer"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Liste des notifications */}
              {notifications.length > 0 ? (
                <>
                  <ScrollArea className="max-h-[70vh] md:max-h-[60vh]">
                    <div className="divide-y">
                      {notifications.map((notification: Notification) => (
                        <motion.div
                          key={notification.id}
                          initial={{ x: -10, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          exit={{ x: 10, opacity: 0 }}
                          className={`p-4 transition-colors ${
                            notification.read ? 'bg-transparent' : 'bg-blue-50/50 dark:bg-blue-900/20'
                          }`}
                        >
                          <div className="flex items-start">
                            <div className="flex-shrink-0 mr-3 mt-1">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start">
                                <p className="font-medium text-sm">
                                  {notification.title}
                                </p>
                                <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
                                  {formatRelativeTime(new Date(notification.timestamp))}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 break-words">
                                {notification.message}
                              </p>
                              {notification.link && (
                                <a
                                  href={notification.link}
                                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1 inline-block"
                                  onClick={() => markAsRead(notification.id)}
                                >
                                  Voir les détails
                                </a>
                              )}
                            </div>
                            <div className="flex-shrink-0 ml-2 flex flex-col space-y-1">
                              {!notification.read && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button
                                        onClick={() => markAsRead(notification.id)}
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7"
                                        aria-label="Marquer comme lu"
                                      >
                                        <Check className="h-3.5 w-3.5 text-green-500" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Marquer comme lu</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      onClick={() => deleteNotification(notification.id)}
                                      variant="ghost"
                                      size="icon"
                                      className="h-7 w-7"
                                      aria-label="Supprimer"
                                    >
                                      <Trash2 className="h-3.5 w-3.5 text-red-500" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Supprimer</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>

                  {/* Pied de page */}
                  <div className="p-3 border-t flex justify-between items-center">
                    <Button
                      onClick={deleteAllNotifications}
                      variant="ghost"
                      size="sm"
                      className="text-xs text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1" />
                      Tout effacer
                    </Button>
                    <Button
                      onClick={() => setIsOpen(false)}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      Fermer
                    </Button>
                  </div>
                </>
              ) : (
                <div className="py-12 px-4 text-center">
                  <Bell className="mx-auto h-10 w-10 text-gray-300 dark:text-gray-600 mb-3" />
                  <p className="text-gray-500 dark:text-gray-400">
                    Aucune notification pour le moment
                  </p>
                  <Button
                    onClick={() => setIsOpen(false)}
                    variant="outline"
                    className="mt-4"
                    size="sm"
                  >
                    Fermer
                  </Button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}; 