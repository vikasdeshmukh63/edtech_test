import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { Select } from './Select';
import { useTask } from '@/hooks/useTask';
import { toast } from 'react-toastify';
import { Category, Project, User, Task } from '@/types/types';
import { PRIORITY_OPTIONS } from '@/constants/constants';
import * as yup from 'yup';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  projects: Project[];
  users: User[];
  task?: Task | null; // Optional task prop for editing
}

const taskSchema = yup.object().shape({
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required'),
  priority: yup.string().required('Priority is required'),
  dueDate: yup.date().required('Due date is required'),
  categoryId: yup.string().required('Category is required'),
  projectId: yup.string().required('Project is required'),
  assignedTo: yup.string().required('Assigned user is required'),
});

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  users,
  categories,
  projects,
  task,
}) => {
  const { createTask, updateTask } = useTask();
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    priority: task?.priority || 'medium',
    dueDate: task?.dueDate
      ? new Date(task.dueDate).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    categoryId: task?.categoryId || '',
    projectId: task?.projectId || '',
    assignedTo: task?.assignedTo || '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'medium',
        dueDate: task.dueDate
          ? new Date(task.dueDate).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        categoryId: task.categoryId || '',
        projectId: task.projectId || '',
        assignedTo: task.assignedTo || '',
      });
    }
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      await taskSchema.validate(formData, { abortEarly: false });

      if (task) {
        updateTask({
          ...formData,
          _id: task._id,
          status: 'pending',
          dueDate: formData.dueDate,
        });
      } else {
        createTask({
          ...formData,
          dueDate: formData.dueDate,
        });
      }
      onClose();
    } catch (err) {
      if (err instanceof yup.ValidationError) {
        const fieldErrors: { [key: string]: string } = {};
        err.inner.forEach((error) => {
          if (error.path) {
            fieldErrors[error.path] = error.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        toast.error('An unexpected error occurred');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {task ? 'Edit Task' : 'Create New Task'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Title"
            value={formData.title}
            placeholder="Enter task title"
            className="p-3"
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
            error={errors.title}
          />
          <Input
            label="Description"
            value={formData.description}
            placeholder="Enter task description"
            className="p-3"
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            error={errors.description}
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Priority"
              value={formData.priority}
              className="p-4"
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, priority: e.target.value }))
              }
              options={[
                { value: '', label: 'Select Priority' },
                ...PRIORITY_OPTIONS,
              ]}
              error={errors.priority}
            />
            <Select
              label="Category"
              name="categoryId"
              value={formData.categoryId}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, categoryId: e.target.value }))
              }
              options={[
                { value: '', label: 'Select Category' },
                ...categories.map((category) => ({
                  value: category._id,
                  label: category.name,
                })),
              ]}
              error={errors.categoryId}
            />
            <Select
              label="Assigned To"
              name="assignedTo"
              value={formData.assignedTo}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, assignedTo: e.target.value }))
              }
              options={[
                { value: '', label: 'Select Users' },
                ...users.map((user) => ({
                  value: user._id,
                  label: user.name,
                })),
              ]}
              error={errors.assignedTo}
            />
            <Select
              label="Project"
              name="projectId"
              value={formData.projectId}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, projectId: e.target.value }))
              }
              options={[
                { value: '', label: 'Select Projects' },
                ...projects.map((project) => ({
                  value: project._id,
                  label: project.title,
                })),
              ]}
              error={errors.projectId}
            />
          </div>
          <Input
            label="Due Date"
            type="date"
            className="p-3"
            value={formData.dueDate}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, dueDate: e.target.value }))
            }
            error={errors.dueDate}
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {task ? 'Update Task' : 'Create Task'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
