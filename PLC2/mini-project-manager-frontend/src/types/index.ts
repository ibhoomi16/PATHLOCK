export interface User {
  id: number;
  username: string;
}

export interface Project {
  id: number;
  title: string;
  description?: string;
  createdAt: string;
  tasks?: Task[];
}

export interface Task {
  id: number;
  title: string;
  dueDate?: string;
  isCompleted: boolean;
  projectId: number;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export interface ProjectCreateRequest {
  title: string;
  description?: string;
}

export interface TaskCreateRequest {
  title: string;
  dueDate?: string;
}

export interface TaskUpdateRequest {
  title: string;
  dueDate?: string;
  isCompleted: boolean;
}
