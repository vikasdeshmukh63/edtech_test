import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { Project } from '@/types/types';
import { useProjects } from '@/hooks/useProjects';
import { toast } from 'react-toastify';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: Project | null;
}

const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  project,
}) => {
  const { createProject, updateProject } = useProjects();
  const [title, setTitle] = useState(project?.title || '');
  const [description, setDescription] = useState(project?.description || '');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (project) {
      setTitle(project.title);
      setDescription(project.description);
    }
  }, [project]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!title) {
      setErrors((prev) => ({ ...prev, title: 'Title is required' }));
      return;
    }

    if (!description) {
      setErrors((prev) => ({
        ...prev,
        description: 'Description is required',
      }));
      return;
    }

    try {
      if (project) {
        await updateProject({ _id: project._id, title, description });
      } else {
        await createProject({ title, description });
      }
      onClose();
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">
          {project ? 'Edit Project' : 'Create New Project'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Title"
            value={title}
            placeholder="Enter project title"
            className="p-3"
            onChange={(e) => setTitle(e.target.value)}
            error={errors.title}
          />
          <Input
            label="Description"
            value={description}
            placeholder="Enter project description"
            className="p-3"
            onChange={(e) => setDescription(e.target.value)}
            error={errors.description}
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {project ? 'Update Project' : 'Create Project'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectModal;
