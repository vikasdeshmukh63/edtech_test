import React, { useState } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { Select } from './Select';
import { useTask } from '@/hooks/useTask';
import { toast } from 'react-toastify';
import { Category, Project, User } from '@/types/types';
import { PRIORITY_OPTIONS } from '@/constants/constants';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  projects: Project[];
  users: User[];
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  users,
  categories,
  projects,
}) => {
  const { createTask } = useTask();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    categoryId: '',
    projectId: '',
    assignedTo: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await createTask(formData);
    onClose();

  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Create New Task</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Title"
            value={formData.title}
            placeholder="Enter task title"
            className="p-3"
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
          />
          <Input
            label="Description"
            value={formData.description}
            placeholder="Enter task description"
            className="p-3"
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
          />
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
          />

          <Select
            label="Assigned To"
            name="assignedTo"
            value={formData.assignedTo}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, assignedTo: e.target.value }))
            }
            options={[
              { value: '', label: 'All Users' },
              ...users.map((user) => ({
                value: user._id,
                label: user.name,
              })),
            ]}
          />
          <Input
            label="Due Date"
            type="date"
            value={formData.dueDate}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, dueDate: e.target.value }))
            }
          />
          {/* Add more fields for categoryId, projectId, and assignedTo as needed */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Create Task</Button>
          </div>
        </form>
      </div>
    </div>
  );
};
