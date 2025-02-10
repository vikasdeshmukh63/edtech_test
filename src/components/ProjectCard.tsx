import { Project } from '@/types/types';
import { Pencil } from 'lucide-react';
import React from 'react';
import { Button } from './Button';

const ProjectCard = ({
  project,
  selectedProjects,
  setSelectedProjects,
  setEditProject,
  setIsCreateModalOpen,
}: {
  project: Project;
  selectedProjects: string[];
  setSelectedProjects: React.Dispatch<React.SetStateAction<string[]>>;
  setEditProject: (project: Project) => void;
  setIsCreateModalOpen: (open: boolean) => void;
}) => {
  const handleCheckboxChange = () => {
    setSelectedProjects((prev: string[]) =>
      prev.includes(project._id)
        ? prev.filter((id: string) => id !== project._id)
        : [...prev, project._id]
    );
  };

  return (
    <div className="flex justify-between items-center p-2 rounded-lg border w-full sm:w-auto min-h-[80px]">
      <span className="flex items-center gap-2 flex-1">
        <input
          type="checkbox"
          checked={selectedProjects.includes(project._id)}
          onChange={handleCheckboxChange}
        />
        <div className="flex flex-col min-h-[60px]">
          <h3 className="font-bold">{project.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {project.description.substring(0, 100)}...
          </p>
        </div>
      </span>

      <Button
        variant="outline"
        onClick={() => {
          setEditProject(project);
          setIsCreateModalOpen(true);
        }}
      >
        <Pencil className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default ProjectCard;
