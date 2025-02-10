export const API_ENDPOINTS = {
  CREATE_TASK: '/api/tasks/create',
  GET_ALL_TASKS: '/api/tasks/get-all-tasks',
  GET_ALL_USER_TASKS: '/api/tasks/get-all-user-tasks',
  UPDATE_TASK: (id: string) => `/api/tasks/update/${id}`,
  DELETE_TASK: (id: string) => `/api/tasks/delete/${id}`,
  DELETE_MANY_TASKS: '/api/tasks/delete-many',
  FILTERED_TASKS: '/api/tasks/filtered',
  CREATE_PROJECT: '/api/project/create',
  GET_ALL_PROJECTS: '/api/project/get-all-projects',
  GET_ALL_USER_PROJECTS: '/api/project/get-all-user-projects',
  UPDATE_PROJECT: (id: string) => `/api/project/update/${id}`,
  DELETE_PROJECT: (id: string) => `/api/project/delete/${id}`,
  DELETE_MANY_PROJECTS: '/api/project/delete-many',
  CREATE_CATEGORY: '/api/category/create',
  GET_ALL_CATEGORIES: '/api/category/get-all-categories',
  UPDATE_CATEGORY: (id: string) => `/api/category/update/${id}`,
  DELETE_CATEGORY: (id: string) => `/api/category/delete/${id}`,
  DELETE_MANY_CATEGORIES: '/api/category/delete-many',
  GET_ALL_USERS: '/api/users/get-all-users',
  GET_USER: '/api/users/get-user',
  UPDATE_USER: '/api/users/update',
  RESET_PASSWORD: '/api/users/reset-password',
  AUTH_SIGNIN: '/api/auth/signin',
  AUTH_SIGNUP: '/api/auth/signup',
  AUTH_LOGOUT: '/api/auth/logout',
  AUTH_CHECK: '/api/auth/check',
};

export const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

export const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];
