# Task Management Application Documentation

## Overview

The Task Management Application is a modern, full-stack application designed to help users organize tasks, manage projects, and track progress efficiently. Built with Next.js, MongoDB, and TypeScript, it offers a robust set of features and a seamless user experience.

## Live Demo

Check out the live application: [Task Management App](https://edtech-test-kappa.vercel.app/)

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Getting Started](#getting-started)
4. [Project Structure](#project-structure)
5. [API Endpoints](#api-endpoints)
6. [Request/Response Format](#requestresponse-format)
7. [Authentication](#authentication)
8. [Common HTTP Status Codes](#common-http-status-codes)
9. [Contributing](#contributing)
10. [License](#license)

## Features

### 📋 Task Management

- **Create, update, and delete tasks**: Easily manage tasks with CRUD operations.
- **Filter tasks by multiple criteria**: Filter tasks by status, priority, due date, and more.
- **Assign tasks to users**: Assign tasks to specific users for better collaboration.
- **Set priority levels and due dates**: Prioritize tasks and set deadlines.
- **Track task status**: Monitor the progress of tasks with status tracking.

### 📁 Project Organization

- **Create and manage projects**: Organize tasks under specific projects.
- **Group tasks by projects**: Keep related tasks together.
- **Bulk delete functionality**: Delete multiple tasks or projects at once.
- **Project descriptions and details**: Add detailed descriptions and information to projects.

### 🏷️ Category Management

- **Organize tasks by categories**: Categorize tasks for better organization.
- **Create and manage categories**: Easily add and manage categories.
- **Associate tasks with specific categories**: Assign tasks to relevant categories.

### 👥 User Management

- **User authentication**: Secure user authentication with JWT.
- **Profile management**: Users can manage their profiles.
- **Task assignment capabilities**: Assign tasks to users.
- **Role-based access control**: Control access based on user roles.

### 🎨 Modern UI/UX

- **Responsive design**: Works seamlessly on all devices.
- **Dark mode support**: Eye-friendly dark mode.
- **Toast notifications**: Notify users of important events.
- **Loading states**: Indicate loading states for better UX.
- **Infinite scrolling for tasks**: Load tasks as you scroll.

## Tech Stack

### Frontend

- **Next.js 15.1**: React framework for server-side rendering and static site generation.
- **React 19**: JavaScript library for building user interfaces.
- **TypeScript**: Typed superset of JavaScript for better developer experience.
- **TailwindCSS**: Utility-first CSS framework for rapid UI development.
- **React Query (TanStack Query)**: Data fetching and caching library.
- **React Toastify**: Toast notifications for React.

### Backend

- **Next.js API Routes**: API routes for backend logic.
- **MongoDB with Mongoose**: NoSQL database with object modeling for Node.js.
- **JWT Authentication**: Secure authentication with JSON Web Tokens.
- **Express.js**: Web application framework for Node.js.

### Development Tools

- **ESLint**: Static code analysis for identifying problematic patterns.
- **Prettier**: Code formatter for consistent code style.
- **PostCSS**: CSS processing tool.
- **Yup**: Form validation library.

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd task-management-app
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### 4. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

## Project Structure

```plaintext
src/
├── app/
│   ├── (pages)/          # Route pages
│   ├── api/              # API routes
│   └── layout.tsx        # Root layout
├── components/           # Reusable components
├── hooks/                # Custom React hooks
├── providers/            # Context providers
├── types/                # TypeScript types
└── utils/                # Utility functions
```

## API Endpoints

### Tasks

- **GET** `/api/tasks/get-all-tasks` - Get all tasks
- **GET** `/api/tasks/get-all-user-tasks` - Get user-specific tasks
- **GET** `/api/tasks/filtered` - Get filtered tasks with pagination
- **POST** `/api/tasks/create` - Create a new task
- **PUT** `/api/tasks/update/[id]` - Update a task
- **DELETE** `/api/tasks/delete/[id]` - Delete a task
- **DELETE** `/api/tasks/delete-many` - Bulk delete tasks

### Projects

- **GET** `/api/project/get-all-projects` - Get all projects
- **GET** `/api/project/get-all-user-projects` - Get user-specific projects
- **POST** `/api/project/create` - Create a new project
- **PUT** `/api/project/update/[id]` - Update a project
- **DELETE** `/api/project/delete/[id]` - Delete a project
- **DELETE** `/api/project/delete-many` - Bulk delete projects

### Categories

- **GET** `/api/category/get-all-categories` - Get all categories
- **POST** `/api/category/create` - Create a new category
- **PUT** `/api/category/update/[id]` - Update a category
- **DELETE** `/api/category/delete/[id]` - Delete a category
- **DELETE** `/api/category/delete-many` - Bulk delete categories

### Users

- **GET** `/api/users/get-all-users` - Get all users
- **GET** `/api/users/get-user` - Get current user details
- **PUT** `/api/users/update` - Update user profile
- **PUT** `/api/users/reset-password` - Reset user password

### Authentication

- **POST** `/api/auth/signin` - User login
- **POST** `/api/auth/signup` - User registration
- **POST** `/api/auth/logout` - User logout
- **GET** `/api/auth/check` - Check authentication status

## Request/Response Format

### Success Response Format

```json
{
  "success": true,
  "message": "Operation successful",
  "data": [
    /* optional data */
  ],
  "hasMore": false, // for paginated responses
  "total": 0 // for paginated responses
}
```

### Error Response Format

```json
{
  "success": false,
  "message": "Error message description"
}
```

## Authentication

- All protected endpoints require a valid JWT token in the Authorization header.
- User ID is passed via `x-user-id` header for authenticated requests.

## Common HTTP Status Codes

- `200` - Success
- `201` - Created successfully
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

## Thanks for checking out the project!

## Author

- [@vikasdeshmukh63](https://github.com/vikasdeshmukh63)
