import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp, 
  Camera,
  Calendar,
  ClipboardCheck,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';

export interface ProjectStage {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate?: Date;
  status: 'pending' | 'in_progress' | 'completed' | 'delayed';
  progress: number;
  tasks: {
    id: string;
    title: string;
    completed: boolean;
    assignedTo?: {
      id: string;
      name: string;
      avatar?: string;
    };
  }[];
  photos?: {
    id: string;
    url: string;
    caption?: string;
    addedAt: Date;
  }[];
  comments?: {
    id: string;
    user: {
      id: string;
      name: string;
      avatar?: string;
    };
    text: string;
    timestamp: Date;
  }[];
}

interface ProjectTimelineProps {
  stages: ProjectStage[];
  onAddPhoto?: (stageId: string) => void;
  onAddComment?: (stageId: string, comment: string) => void;
  onCompleteTask?: (stageId: string, taskId: string) => void;
}

export const ProjectTimeline = ({ 
  stages, 
  onAddPhoto, 
  onAddComment, 
  onCompleteTask 
}: ProjectTimelineProps) => {
  const [expandedStages, setExpandedStages] = useState<Record<string, boolean>>({});
  const [newComment, setNewComment] = useState<Record<string, string>>({});

  // Calculer la progression globale du projet
  const completedStages = stages.filter(stage => stage.status === 'completed').length;
  const totalProgress = stages.length > 0 
    ? Math.round((completedStages / stages.length) * 100) 
    : 0;

  const toggleStage = (stageId: string) => {
    setExpandedStages(prev => ({
      ...prev,
      [stageId]: !prev[stageId]
    }));
  };

  const handleAddComment = (stageId: string) => {
    if (onAddComment && newComment[stageId]?.trim()) {
      onAddComment(stageId, newComment[stageId]);
      setNewComment(prev => ({
        ...prev,
        [stageId]: ''
      }));
    }
  };

  const handleTaskComplete = (stageId: string, taskId: string) => {
    if (onCompleteTask) {
      onCompleteTask(stageId, taskId);
    }
  };

  const getStatusIcon = (status: ProjectStage['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'in_progress':
        return <Clock className="h-5 w-5 text-blue-500" />;
      case 'delayed':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusText = (status: ProjectStage['status']) => {
    switch (status) {
      case 'completed':
        return 'Terminé';
      case 'in_progress':
        return 'En cours';
      case 'delayed':
        return 'En retard';
      default:
        return 'À venir';
    }
  };

  const getStatusColor = (status: ProjectStage['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'delayed':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Progression globale */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-medium">Progression du projet</h2>
          <span className="text-lg font-semibold">{totalProgress}%</span>
        </div>
        <Progress value={totalProgress} className="h-2" />
        <div className="flex items-center justify-between mt-4 text-sm text-gray-500 dark:text-gray-400">
          <div>{completedStages} sur {stages.length} étapes terminées</div>
          {stages.length > 0 && (
            <div>
              {stages.find(stage => stage.status === 'in_progress')?.title || 'Aucune étape en cours'}
            </div>
          )}
        </div>
      </div>

      {/* Timeline des étapes */}
      <div className="space-y-4">
        {stages.map((stage, index) => (
          <div 
            key={stage.id}
            className={cn(
              "bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden transition-all duration-300",
              expandedStages[stage.id] ? "shadow-md ring-1 ring-primary-200 dark:ring-primary-900" : ""
            )}
          >
            {/* En-tête de l'étape */}
            <div 
              className={cn(
                "p-4 cursor-pointer transition-colors", 
                expandedStages[stage.id] ? "bg-gray-50 dark:bg-gray-700/50" : "",
                "hover:bg-gray-50 dark:hover:bg-gray-700/50"
              )}
              onClick={() => toggleStage(stage.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={cn(
                    "flex items-center justify-center h-8 w-8 rounded-full",
                    stage.status === 'completed' ? "bg-green-100 dark:bg-green-900/30" : 
                    stage.status === 'in_progress' ? "bg-blue-100 dark:bg-blue-900/30" : 
                    stage.status === 'delayed' ? "bg-amber-100 dark:bg-amber-900/30" : 
                    "bg-gray-100 dark:bg-gray-700"
                  )}>
                    {getStatusIcon(stage.status)}
                  </div>
                  <div>
                    <h3 className="font-medium">{stage.title}</h3>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      <span>
                        {format(new Date(stage.startDate), 'dd MMM yyyy', { locale: fr })}
                        {stage.endDate && ` - ${format(new Date(stage.endDate), 'dd MMM yyyy', { locale: fr })}`}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className={cn(
                    "text-xs px-2 py-1 rounded-full",
                    getStatusColor(stage.status)
                  )}>
                    {getStatusText(stage.status)}
                  </span>
                  <div className="flex items-center">
                    <span className="text-sm font-medium mr-2">{stage.progress}%</span>
                    {expandedStages[stage.id] ? (
                      <ChevronUp className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>

              <Progress value={stage.progress} className="h-1 mt-3" />
            </div>

            {/* Contenu détaillé (quand l'étape est dépliée) */}
            {expandedStages[stage.id] && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="px-4 pb-4"
              >
                <div className="pt-2 pb-4">
                  <p className="text-gray-600 dark:text-gray-300">{stage.description}</p>
                </div>

                {/* Tâches */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2 flex items-center">
                    <ClipboardCheck className="h-4 w-4 mr-1.5" />
                    Tâches
                  </h4>
                  <div className="space-y-2 pl-6">
                    {stage.tasks.map(task => (
                      <div key={task.id} className="flex items-center justify-between py-1">
                        <div className="flex items-center">
                          <div 
                            className={cn(
                              "h-4 w-4 rounded-full border flex items-center justify-center mr-2 cursor-pointer",
                              task.completed ? "bg-primary-500 border-primary-500" : "border-gray-300 dark:border-gray-600"
                            )}
                            onClick={() => handleTaskComplete(stage.id, task.id)}
                          >
                            {task.completed && <CheckCircle className="h-3 w-3 text-white" />}
                          </div>
                          <span className={cn(
                            "text-sm", 
                            task.completed ? "line-through text-gray-400 dark:text-gray-500" : "text-gray-700 dark:text-gray-300"
                          )}>
                            {task.title}
                          </span>
                        </div>
                        {task.assignedTo && (
                          <div className="flex items-center">
                            <Avatar className="h-5 w-5">
                              <AvatarImage src={task.assignedTo.avatar} alt={task.assignedTo.name} />
                              <AvatarFallback className="text-[10px]">
                                {task.assignedTo.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                              {task.assignedTo.name.split(' ')[0]}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Photos */}
                {stage.photos && stage.photos.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2 flex items-center">
                      <Camera className="h-4 w-4 mr-1.5" />
                      Photos ({stage.photos.length})
                    </h4>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {stage.photos.map(photo => (
                        <div 
                          key={photo.id} 
                          className="rounded-lg overflow-hidden aspect-square relative group"
                        >
                          <img 
                            src={photo.url} 
                            alt={photo.caption || 'Photo du projet'} 
                            className="w-full h-full object-cover"
                          />
                          {photo.caption && (
                            <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                              <span className="text-xs text-white truncate">
                                {photo.caption}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Ajouter une photo */}
                {onAddPhoto && stage.status !== 'completed' && (
                  <div className="mb-4 mt-2">
                    <Button 
                      variant="outline"
                      size="sm"
                      className="flex items-center text-xs"
                      onClick={() => onAddPhoto(stage.id)}
                    >
                      <Camera className="h-3.5 w-3.5 mr-1.5" />
                      Ajouter une photo
                    </Button>
                  </div>
                )}

                {/* Commentaires */}
                {stage.comments && stage.comments.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2 flex items-center">
                      <Users className="h-4 w-4 mr-1.5" />
                      Commentaires ({stage.comments.length})
                    </h4>
                    <div className="space-y-3 mt-2">
                      {stage.comments.map(comment => (
                        <div key={comment.id} className="flex items-start space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
                            <AvatarFallback>
                              {comment.user.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex justify-between items-baseline">
                              <span className="font-medium text-sm">{comment.user.name}</span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {format(new Date(comment.timestamp), 'dd MMM yyyy à HH:mm', { locale: fr })}
                              </span>
                            </div>
                            <p className="text-sm mt-1 text-gray-700 dark:text-gray-300">{comment.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Ajouter un commentaire */}
                {onAddComment && (
                  <div className="mt-4 pt-3 border-t dark:border-gray-700">
                    <div className="flex">
                      <input
                        type="text"
                        className="flex-1 px-3 py-2 border rounded-l-lg text-sm bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400"
                        placeholder="Ajouter un commentaire..."
                        value={newComment[stage.id] || ''}
                        onChange={(e) => setNewComment(prev => ({ ...prev, [stage.id]: e.target.value }))}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddComment(stage.id)}
                      />
                      <Button 
                        className="rounded-l-none" 
                        size="sm"
                        onClick={() => handleAddComment(stage.id)}
                        disabled={!newComment[stage.id]?.trim()}
                      >
                        Envoyer
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}; 