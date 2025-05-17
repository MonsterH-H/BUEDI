import api from './api';
import { Project, ProjectCreate, ProjectUpdate } from '@/types/project';

export const projectService = {
  async getAllProjects(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    category?: string;
    sort?: string;
  }): Promise<{ projects: Project[]; total: number }> {
    const response = await api.get('/projects', { params });
    return response.data;
  },

  async getProjectById(id: string): Promise<Project> {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  async createProject(data: ProjectCreate): Promise<Project> {
    const response = await api.post('/projects', data);
    return response.data;
  },

  async updateProject(id: string, data: ProjectUpdate): Promise<Project> {
    const response = await api.patch(`/projects/${id}`, data);
    return response.data;
  },

  async deleteProject(id: string): Promise<void> {
    await api.delete(`/projects/${id}`);
  },

  async updateProjectStatus(id: string, status: string): Promise<Project> {
    const response = await api.patch(`/projects/${id}/status`, { status });
    return response.data;
  },

  async assignProfessional(projectId: string, professionalId: string): Promise<Project> {
    const response = await api.post(`/projects/${projectId}/assign`, { professionalId });
    return response.data;
  },

  async getProjectCategories(): Promise<string[]> {
    const response = await api.get('/projects/categories');
    return response.data;
  },

  async getProjectTimeline(id: string): Promise<{ date: string; event: string }[]> {
    const response = await api.get(`/projects/${id}/timeline`);
    return response.data;
  },

  async addProjectComment(id: string, comment: string): Promise<{ id: string; comment: string; author: string; date: string }> {
    const response = await api.post(`/projects/${id}/comments`, { comment });
    return response.data;
  },

  async getProjectComments(id: string): Promise<{ id: string; comment: string; author: string; date: string }[]> {
    const response = await api.get(`/projects/${id}/comments`);
    return response.data;
  }
};