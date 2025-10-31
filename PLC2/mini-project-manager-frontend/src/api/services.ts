import api from './client';
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  Project,
  ProjectCreateRequest,
  Task,
  TaskCreateRequest,
  TaskUpdateRequest,
} from '../types';

// Auth Services
export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },
};

// Project Services
export const projectService = {
  getAll: async (): Promise<Project[]> => {
    const response = await api.get<Project[]>('/projects');
    return response.data;
  },

  getById: async (id: number): Promise<Project> => {
    const response = await api.get<Project>(`/projects/${id}`);
    return response.data;
  },

  create: async (data: ProjectCreateRequest): Promise<Project> => {
    const response = await api.post<Project>('/projects', data);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/projects/${id}`);
  },
};

// Task Services
export const taskService = {
  create: async (projectId: number, data: TaskCreateRequest): Promise<Task> => {
    const response = await api.post<Task>(`/projects/${projectId}/tasks`, data);
    return response.data;
  },

  update: async (taskId: number, data: TaskUpdateRequest): Promise<Task> => {
    const response = await api.put<Task>(`/tasks/${taskId}`, data);
    return response.data;
  },

  delete: async (taskId: number): Promise<void> => {
    await api.delete(`/tasks/${taskId}`);
  },

  toggle: async (taskId: number): Promise<Task> => {
    const response = await api.put<Task>(`/tasks/${taskId}/toggle`);
    return response.data;
  },
};
