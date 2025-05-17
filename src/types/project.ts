export type ProjectStatus = 'draft' | 'published' | 'in_progress' | 'completed' | 'cancelled';

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  budget: number;
  deadline: string;
  status: ProjectStatus;
  client: {
    id: string;
    name: string;
    avatar?: string;
  };
  professional?: {
    id: string;
    name: string;
    avatar?: string;
  };
  location: {
    city: string;
    country: string;
  };
  skills: string[];
  attachments: string[];
  createdAt: string;
  updatedAt: string;
  timeline: ProjectTimeline[];
  comments: ProjectComment[];
}

export interface ProjectCreate {
  title: string;
  description: string;
  category: string;
  budget: number;
  deadline: string;
  location: {
    city: string;
    country: string;
  };
  skills: string[];
  attachments?: string[];
}

export interface ProjectUpdate extends Partial<ProjectCreate> {
  status?: ProjectStatus;
  professionalId?: string;
}

export interface ProjectTimeline {
  id: string;
  title: string;
  description: string;
  date: string;
  status: 'pending' | 'completed';
  attachments?: string[];
}

export interface ProjectComment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
  attachments?: string[];
}

export interface ProjectFilter {
  search?: string;
  category?: string;
  status?: ProjectStatus;
  minBudget?: number;
  maxBudget?: number;
  location?: string;
  skills?: string[];
  sortBy?: 'budget' | 'deadline' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
} 