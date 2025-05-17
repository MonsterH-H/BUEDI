import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ProjectStage } from '@/components/project/ProjectTimeline';

// Types
export interface Project {
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: Date;
  endDate?: Date;
  budget: number;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  progress: number;
  contractor?: {
    id: string;
    name: string;
    rating: number;
    photo: string;
  };
  stages: ProjectStage[];
  updates: {
    id: string;
    date: Date;
    content: string;
    photos: string[];
    author: string;
  }[];
  documents: {
    id: string;
    name: string;
    type: string;
    date: Date;
    url?: string;
  }[];
}

interface ProjectState {
  projects: Project[];
  activeProjectId: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProjectState = {
  projects: [],
  activeProjectId: null,
  isLoading: false,
  error: null,
};

// Actions
type ProjectAction =
  | { type: 'FETCH_PROJECTS_REQUEST' }
  | { type: 'FETCH_PROJECTS_SUCCESS'; payload: Project[] }
  | { type: 'FETCH_PROJECTS_FAILURE'; payload: string }
  | { type: 'SET_ACTIVE_PROJECT'; payload: string }
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'UPDATE_PROJECT'; payload: { id: string; data: Partial<Project> } }
  | { type: 'DELETE_PROJECT'; payload: string }
  | { type: 'ADD_PROJECT_UPDATE'; payload: { projectId: string; update: Project['updates'][0] } }
  | { type: 'ADD_PROJECT_DOCUMENT'; payload: { projectId: string; document: Project['documents'][0] } }
  | { type: 'COMPLETE_TASK'; payload: { projectId: string; stageId: string; taskId: string } }
  | { type: 'ADD_COMMENT'; payload: { projectId: string; stageId: string; comment: ProjectStage['comments'][0] } }
  | { type: 'ADD_PHOTO'; payload: { projectId: string; stageId: string; photo: ProjectStage['photos'][0] } };

// Reducer
const projectReducer = (state: ProjectState, action: ProjectAction): ProjectState => {
  switch (action.type) {
    case 'FETCH_PROJECTS_REQUEST':
      return { ...state, isLoading: true, error: null };
    
    case 'FETCH_PROJECTS_SUCCESS':
      return {
        ...state,
        projects: action.payload,
        isLoading: false,
      };
    
    case 'FETCH_PROJECTS_FAILURE':
      return { ...state, error: action.payload, isLoading: false };
    
    case 'SET_ACTIVE_PROJECT':
      return {
        ...state,
        activeProjectId: action.payload,
      };
    
    case 'ADD_PROJECT':
      return {
        ...state,
        projects: [...state.projects, action.payload],
      };
    
    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map(project => 
          project.id === action.payload.id 
            ? { ...project, ...action.payload.data } 
            : project
        ),
      };
    
    case 'DELETE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter(project => project.id !== action.payload),
        activeProjectId: state.activeProjectId === action.payload ? null : state.activeProjectId,
      };
    
    case 'ADD_PROJECT_UPDATE':
      return {
        ...state,
        projects: state.projects.map(project => 
          project.id === action.payload.projectId
            ? { 
                ...project, 
                updates: [action.payload.update, ...project.updates] 
              }
            : project
        ),
      };
    
    case 'ADD_PROJECT_DOCUMENT':
      return {
        ...state,
        projects: state.projects.map(project => 
          project.id === action.payload.projectId
            ? { 
                ...project, 
                documents: [...project.documents, action.payload.document] 
              }
            : project
        ),
      };
    
    case 'COMPLETE_TASK':
      return {
        ...state,
        projects: state.projects.map(project => {
          if (project.id !== action.payload.projectId) return project;
          
          // Trouver l'étape et la tâche concernées
          const updatedStages = project.stages.map(stage => {
            if (stage.id !== action.payload.stageId) return stage;
            
            // Mettre à jour la tâche
            const updatedTasks = stage.tasks.map(task => 
              task.id === action.payload.taskId
                ? { ...task, completed: true }
                : task
            );
            
            // Calculer la nouvelle progression de l'étape
            const completedTasksCount = updatedTasks.filter(task => task.completed).length;
            const newProgress = Math.round((completedTasksCount / updatedTasks.length) * 100);
            
            return { 
              ...stage, 
              tasks: updatedTasks,
              progress: newProgress,
              status: newProgress === 100 ? 'completed' : stage.status
            };
          });
          
          // Calculer la progression globale du projet
          const completedStagesCount = updatedStages.filter(stage => stage.status === 'completed').length;
          const newProjectProgress = Math.round((completedStagesCount / updatedStages.length) * 100);
          
          return { 
            ...project, 
            stages: updatedStages,
            progress: newProjectProgress,
            status: newProjectProgress === 100 ? 'completed' : project.status
          };
        }),
      };
    
    case 'ADD_COMMENT':
      return {
        ...state,
        projects: state.projects.map(project => {
          if (project.id !== action.payload.projectId) return project;
          
          // Ajouter le commentaire à l'étape concernée
          const updatedStages = project.stages.map(stage => 
            stage.id === action.payload.stageId
              ? { 
                  ...stage, 
                  comments: [...(stage.comments || []), action.payload.comment] 
                }
              : stage
          );
          
          return { ...project, stages: updatedStages };
        }),
      };
    
    case 'ADD_PHOTO':
      return {
        ...state,
        projects: state.projects.map(project => {
          if (project.id !== action.payload.projectId) return project;
          
          // Ajouter la photo à l'étape concernée
          const updatedStages = project.stages.map(stage => 
            stage.id === action.payload.stageId
              ? { 
                  ...stage, 
                  photos: [...(stage.photos || []), action.payload.photo] 
                }
              : stage
          );
          
          return { ...project, stages: updatedStages };
        }),
      };
    
    default:
      return state;
  }
};

// Context
interface ProjectContextType extends ProjectState {
  addProject: (project: Omit<Project, 'id'>) => string;
  updateProject: (id: string, data: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  setActiveProject: (id: string) => void;
  getProjectById: (id: string) => Project | undefined;
  addProjectUpdate: (projectId: string, update: Omit<Project['updates'][0], 'id'>) => void;
  addProjectDocument: (projectId: string, document: Omit<Project['documents'][0], 'id'>) => void;
  completeTask: (projectId: string, stageId: string, taskId: string) => void;
  addComment: (projectId: string, stageId: string, text: string, userId: string, userName: string, userAvatar?: string) => void;
  addPhoto: (projectId: string, stageId: string, url: string, caption?: string) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

// Provider
export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(projectReducer, initialState);
  
  // Simulation: Charger les projets au démarrage
  useEffect(() => {
    dispatch({ type: 'FETCH_PROJECTS_REQUEST' });
    
    // Simuler un délai réseau
    setTimeout(() => {
      try {
        // Exemple de données de projets
        const mockProjects: Project[] = [
          {
            id: 'PRJ-2023-001',
            title: 'Rénovation cuisine moderne',
            description: 'Rénovation complète d\'une cuisine de 15m², nouveau mobilier, plomberie et électricité incluses.',
            location: 'Libreville, Owendo',
            startDate: new Date('2023-10-15'),
            endDate: new Date('2023-12-20'),
            budget: 3200000,
            status: 'in_progress',
            progress: 65,
            contractor: {
              id: 'CTR-001',
              name: 'BuildMaster SARL',
              rating: 4.8,
              photo: '/placeholder.svg'
            },
            stages: [
              {
                id: 'stage-1',
                title: 'Démolition et préparation',
                description: 'Démolition des anciens éléments et préparation du sol et des murs',
                startDate: new Date('2023-10-15'),
                endDate: new Date('2023-10-25'),
                status: 'completed',
                progress: 100,
                tasks: [
                  { id: 'task-1-1', title: 'Démontage des meubles', completed: true },
                  { id: 'task-1-2', title: 'Démolition des carrelages', completed: true },
                  { id: 'task-1-3', title: 'Préparation des surfaces', completed: true }
                ]
              },
              {
                id: 'stage-2',
                title: 'Installation plomberie',
                description: 'Installation des nouvelles canalisations et raccordements',
                startDate: new Date('2023-10-26'),
                endDate: new Date('2023-11-05'),
                status: 'completed',
                progress: 100,
                tasks: [
                  { id: 'task-2-1', title: 'Installation des tuyaux d\'alimentation', completed: true },
                  { id: 'task-2-2', title: 'Installation des évacuations', completed: true },
                  { id: 'task-2-3', title: 'Tests d\'étanchéité', completed: true }
                ]
              },
              {
                id: 'stage-3',
                title: 'Installation électrique',
                description: 'Mise en place du nouveau circuit électrique aux normes',
                startDate: new Date('2023-11-06'),
                endDate: new Date('2023-11-15'),
                status: 'completed',
                progress: 100,
                tasks: [
                  { id: 'task-3-1', title: 'Pose des gaines', completed: true },
                  { id: 'task-3-2', title: 'Câblage', completed: true },
                  { id: 'task-3-3', title: 'Installation des prises et interrupteurs', completed: true }
                ]
              },
              {
                id: 'stage-4',
                title: 'Pose du carrelage',
                description: 'Installation du nouveau carrelage au sol et aux murs',
                startDate: new Date('2023-11-16'),
                endDate: new Date('2023-11-30'),
                status: 'in_progress',
                progress: 60,
                tasks: [
                  { id: 'task-4-1', title: 'Préparation des supports', completed: true },
                  { id: 'task-4-2', title: 'Pose du carrelage mural', completed: true },
                  { id: 'task-4-3', title: 'Pose du carrelage au sol', completed: false }
                ]
              },
              {
                id: 'stage-5',
                title: 'Installation des meubles',
                description: 'Montage et fixation des nouveaux meubles de cuisine',
                startDate: new Date('2023-12-01'),
                endDate: new Date('2023-12-10'),
                status: 'pending',
                progress: 0,
                tasks: [
                  { id: 'task-5-1', title: 'Montage des meubles bas', completed: false },
                  { id: 'task-5-2', title: 'Installation du plan de travail', completed: false },
                  { id: 'task-5-3', title: 'Montage des meubles hauts', completed: false }
                ]
              },
              {
                id: 'stage-6',
                title: 'Finitions',
                description: 'Travaux de finition et nettoyage final',
                startDate: new Date('2023-12-11'),
                endDate: new Date('2023-12-20'),
                status: 'pending',
                progress: 0,
                tasks: [
                  { id: 'task-6-1', title: 'Joints de carrelage', completed: false },
                  { id: 'task-6-2', title: 'Installation de la crédence', completed: false },
                  { id: 'task-6-3', title: 'Nettoyage final', completed: false }
                ]
              }
            ],
            updates: [
              {
                id: 'update-1',
                date: new Date('2023-11-28'),
                content: 'Raccordements électriques terminés, début de la pose du carrelage mural.',
                photos: ['/placeholder.svg', '/placeholder.svg'],
                author: 'Entrepreneur'
              },
              {
                id: 'update-2',
                date: new Date('2023-11-25'),
                content: 'Points d\'eau et évacuation installés. Préparation des murs pour carrelage.',
                photos: ['/placeholder.svg'],
                author: 'Entrepreneur'
              }
            ],
            documents: [
              { id: 'doc-1', name: 'Contrat signé', type: 'pdf', date: new Date('2023-10-12'), url: '/placeholder.pdf' },
              { id: 'doc-2', name: 'Plans de la cuisine', type: 'pdf', date: new Date('2023-10-10'), url: '/placeholder.pdf' }
            ]
          }
        ];
        
        dispatch({ type: 'FETCH_PROJECTS_SUCCESS', payload: mockProjects });
        
        // Définir le premier projet comme actif par défaut
        if (mockProjects.length > 0) {
          dispatch({ type: 'SET_ACTIVE_PROJECT', payload: mockProjects[0].id });
        }
      } catch (error) {
        dispatch({ type: 'FETCH_PROJECTS_FAILURE', payload: 'Erreur lors du chargement des projets' });
      }
    }, 1000);
  }, []);
  
  // Ajouter un projet
  const addProject = (project: Omit<Project, 'id'>): string => {
    const newId = `PRJ-${new Date().getFullYear()}-${uuidv4().substring(0, 6)}`;
    
    const newProject: Project = {
      id: newId,
      ...project,
    };
    
    dispatch({ type: 'ADD_PROJECT', payload: newProject });
    return newId;
  };
  
  // Mettre à jour un projet
  const updateProject = (id: string, data: Partial<Project>) => {
    dispatch({ type: 'UPDATE_PROJECT', payload: { id, data } });
  };
  
  // Supprimer un projet
  const deleteProject = (id: string) => {
    dispatch({ type: 'DELETE_PROJECT', payload: id });
  };
  
  // Définir le projet actif
  const setActiveProject = (id: string) => {
    dispatch({ type: 'SET_ACTIVE_PROJECT', payload: id });
  };
  
  // Récupérer un projet par ID
  const getProjectById = (id: string) => {
    return state.projects.find(project => project.id === id);
  };
  
  // Ajouter une mise à jour à un projet
  const addProjectUpdate = (projectId: string, update: Omit<Project['updates'][0], 'id'>) => {
    const newUpdate = {
      id: uuidv4(),
      ...update,
    };
    
    dispatch({ type: 'ADD_PROJECT_UPDATE', payload: { projectId, update: newUpdate } });
  };
  
  // Ajouter un document à un projet
  const addProjectDocument = (projectId: string, document: Omit<Project['documents'][0], 'id'>) => {
    const newDocument = {
      id: uuidv4(),
      ...document,
    };
    
    dispatch({ type: 'ADD_PROJECT_DOCUMENT', payload: { projectId, document: newDocument } });
  };
  
  // Marquer une tâche comme terminée
  const completeTask = (projectId: string, stageId: string, taskId: string) => {
    dispatch({ type: 'COMPLETE_TASK', payload: { projectId, stageId, taskId } });
  };
  
  // Ajouter un commentaire à une étape
  const addComment = (
    projectId: string, 
    stageId: string, 
    text: string, 
    userId: string, 
    userName: string, 
    userAvatar?: string
  ) => {
    const comment = {
      id: uuidv4(),
      user: {
        id: userId,
        name: userName,
        avatar: userAvatar
      },
      text,
      timestamp: new Date()
    };
    
    dispatch({ type: 'ADD_COMMENT', payload: { projectId, stageId, comment } });
  };
  
  // Ajouter une photo à une étape
  const addPhoto = (projectId: string, stageId: string, url: string, caption?: string) => {
    const photo = {
      id: uuidv4(),
      url,
      caption,
      addedAt: new Date()
    };
    
    dispatch({ type: 'ADD_PHOTO', payload: { projectId, stageId, photo } });
  };
  
  return (
    <ProjectContext.Provider
      value={{
        ...state,
        addProject,
        updateProject,
        deleteProject,
        setActiveProject,
        getProjectById,
        addProjectUpdate,
        addProjectDocument,
        completeTask,
        addComment,
        addPhoto,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

// Hook personnalisé
export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
}; 