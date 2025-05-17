import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Plus, MoreHorizontal, X, Edit2, Trash2, Calendar, User, Clock, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { useProject, Project, ProjectStage } from '@/contexts/ProjectContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Types pour les colonnes du tableau kanban
interface Column {
  id: string;
  title: string;
  status: 'pending' | 'in_progress' | 'completed';
  color: string;
  tasks: Task[];
}

interface Task {
  id: string;
  title: string;
  stageId: string;
  stageName: string;
  description?: string;
  dueDate?: Date;
  assignedTo?: {
    id: string;
    name: string;
    avatar?: string;
  };
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
}

interface ProjectBoardProps {
  projectId: string;
}

const ProjectBoard = ({ projectId }: ProjectBoardProps) => {
  const { projects, completeTask } = useProject();
  const project = projects.find(p => p.id === projectId);
  
  // État pour la tâche en cours de déplacement
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [isDropping, setIsDropping] = useState(false);
  const [showAddTaskForm, setShowAddTaskForm] = useState(false);
  const [newTaskColumn, setNewTaskColumn] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  
  // Convertir les tâches de projet en format tableau kanban
  const getKanbanTasks = (): Column[] => {
    if (!project) return [];
    
    // Définition des colonnes
    const columns: Column[] = [
      { id: 'pending', title: 'À faire', status: 'pending', color: 'bg-gray-100 dark:bg-gray-800', tasks: [] },
      { id: 'in_progress', title: 'En cours', status: 'in_progress', color: 'bg-blue-50 dark:bg-blue-900/20', tasks: [] },
      { id: 'completed', title: 'Terminé', status: 'completed', color: 'bg-green-50 dark:bg-green-900/20', tasks: [] },
    ];
    
    // Remplir les colonnes avec les tâches de toutes les étapes
    project.stages.forEach(stage => {
      stage.tasks.forEach(task => {
        const columnId = task.completed ? 'completed' : stage.status === 'in_progress' ? 'in_progress' : 'pending';
        
        const kanbanTask: Task = {
          id: task.id,
          title: task.title,
          stageId: stage.id,
          stageName: stage.title,
          assignedTo: task.assignedTo,
          priority: 'medium', // Par défaut
          completed: task.completed,
          dueDate: stage.endDate // On utilise la date de fin de l'étape comme date d'échéance
        };
        
        const columnIndex = columns.findIndex(col => col.id === columnId);
        if (columnIndex >= 0) {
          columns[columnIndex].tasks.push(kanbanTask);
        }
      });
    });
    
    return columns;
  };
  
  const kanbanColumns = getKanbanTasks();
  
  // Gestion du déplacement de tâche
  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };
  
  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    setIsDropping(true);
  };
  
  const handleDragLeave = () => {
    setIsDropping(false);
  };
  
  const handleDrop = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    setIsDropping(false);
    
    if (!draggedTask || !project) return;
    
    // Mettre à jour le statut de la tâche
    if (columnId === 'completed' && !draggedTask.completed) {
      completeTask(project.id, draggedTask.stageId, draggedTask.id);
    }
    
    // Réinitialiser
    setDraggedTask(null);
  };
  
  // Gérer l'ajout d'une nouvelle tâche
  const handleAddTask = () => {
    if (!newTaskTitle.trim() || !newTaskColumn || !project) return;
    
    // TODO: Ajouter la tâche via l'API ou le contexte
    
    // Réinitialiser le formulaire
    setNewTaskTitle('');
    setShowAddTaskForm(false);
    setNewTaskColumn(null);
  };
  
  // Si aucun projet n'est trouvé
  if (!project) {
    return <div>Projet non trouvé</div>;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Tableau des tâches</h2>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => {
            setShowAddTaskForm(true);
            setNewTaskColumn('pending');
          }}
        >
          <Plus className="h-4 w-4 mr-1.5" />
          Ajouter une tâche
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {kanbanColumns.map(column => (
          <div 
            key={column.id}
            className={cn(
              "rounded-lg border dark:border-gray-700 overflow-hidden",
            )}
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <div className={cn(
              "p-3 border-b dark:border-gray-700 flex items-center justify-between",
              column.color
            )}>
              <h3 className="font-medium flex items-center">
                {column.title}
                <Badge variant="outline" className="ml-2 bg-white dark:bg-gray-800">
                  {column.tasks.length}
                </Badge>
              </h3>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0" 
                onClick={() => {
                  setShowAddTaskForm(true);
                  setNewTaskColumn(column.id);
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="p-2 h-[calc(100%-48px)] overflow-y-auto">
              {column.tasks.length > 0 ? (
                <div className="space-y-2">
                  {column.tasks.map(task => (
                    <TaskCard 
                      key={task.id} 
                      task={task} 
                      onDragStart={() => handleDragStart(task)}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-32 text-gray-400 dark:text-gray-500">
                  <p className="text-sm">Aucune tâche</p>
                </div>
              )}
              
              {showAddTaskForm && newTaskColumn === column.id && (
                <div className="mt-2 p-2 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 shadow-sm">
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Titre de la tâche"
                      className="w-full p-2 text-sm border rounded dark:border-gray-700 dark:bg-gray-800"
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      autoFocus
                    />
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setShowAddTaskForm(false);
                          setNewTaskTitle('');
                        }}
                      >
                        Annuler
                      </Button>
                      <Button 
                        size="sm"
                        onClick={handleAddTask}
                        disabled={!newTaskTitle.trim()}
                      >
                        Ajouter
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Composant pour afficher une tâche
const TaskCard = ({ task, onDragStart }: { task: Task; onDragStart: () => void }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900';
      case 'medium':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-900';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-900';
    }
  };
  
  return (
    <motion.div
      draggable
      onDragStart={onDragStart}
      className={cn(
        "p-3 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700 cursor-pointer hover:shadow-md transition-shadow",
        task.completed && "opacity-70"
      )}
      whileHover={{ y: -2 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <div className="flex items-start justify-between mb-2">
        <div className={cn(
          "text-sm font-medium break-words w-5/6",
          task.completed && "line-through text-gray-500"
        )}>
          {task.title}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36">
            <DropdownMenuItem className="cursor-pointer">
              <Edit2 className="h-3.5 w-3.5 mr-2" />
              Modifier
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <CheckCircle2 className="h-3.5 w-3.5 mr-2" />
              {task.completed ? "Annuler" : "Terminer"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-red-600 dark:text-red-400">
              <Trash2 className="h-3.5 w-3.5 mr-2" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
        {task.stageName}
      </div>
      
      <div className="flex justify-between items-center mt-2">
        {task.assignedTo ? (
          <div className="flex items-center">
            <Avatar className="h-5 w-5 mr-1">
              <AvatarImage src={task.assignedTo.avatar} />
              <AvatarFallback className="text-[9px]">
                {task.assignedTo.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-gray-500 dark:text-gray-400">{task.assignedTo.name.split(' ')[0]}</span>
          </div>
        ) : (
          <div className="text-xs text-gray-400 dark:text-gray-500 flex items-center">
            <User className="h-3 w-3 mr-1" />
            Non assignée
          </div>
        )}
        
        {task.dueDate && (
          <Badge variant="outline" className="text-[10px] h-5">
            <Calendar className="h-3 w-3 mr-1" />
            {format(new Date(task.dueDate), 'dd MMM', { locale: fr })}
          </Badge>
        )}
      </div>
    </motion.div>
  );
};

export default ProjectBoard; 