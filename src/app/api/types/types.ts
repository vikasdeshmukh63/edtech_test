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
  dueDate: string;
  categoryId: string;
}

export interface ResponseType {
  success: boolean;
  message: string;
  data?: unknown;
}
