export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CreateTask {
  title: string;
  description: string;
  priority: string;
  dueDate?: string | Date;
  categoryId: string;
  projectId: string;
  assignedTo?: string;
}

export interface UpdateTask extends CreateTask {
  status: string;
  _id: string;
}

export interface CreateProject {
  title: string;
  description: string;
}

export interface UpdateProject extends CreateProject {
  id: string;
}

export interface AssignTask {
  taskId: string;
  userId: string;
}

export interface ResponseType {
  success: boolean;
  message: string;
  data?: unknown;
  hasMore?: boolean;
  total?: number;
}
