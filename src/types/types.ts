export interface Task {
  categoryId: string;
  createdAt?: string;
  createdBy: string;
  description: string;
  dueDate: Date;
  priority: string;
  projectId: string;
  status: string;
  title: string;
  updatedAt?: string;
  assignedTo?: string;
  _id: string;
}

export interface Project {
  _id: string;
  title: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  _id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}
