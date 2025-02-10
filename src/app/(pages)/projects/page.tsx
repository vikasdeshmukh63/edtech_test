'use client';

import { Button } from '@/components/Button';
import { Container } from '@/components/Container';
import Loader from '@/components/Loader';
import NoData from '@/components/NoData';
import ProjectCard from '@/components/ProjectCard';
import ProjectModal from '@/components/ProjectModal';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import { useProjects } from '@/hooks/useProjects';
import { Project } from '@/types/types';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

const ProjectsPage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const { getAllProjects, deleteManyProjects, isLoading } = useProjects();
  const { data: projectsData } = getAllProjects;
  const { isAuthenticated } = useAuthRedirect();

  const hasNoProjects = !projectsData?.data.length;

  const handleDeleteManyProjects = () => {
    deleteManyProjects(selectedProjects, {
      onSuccess: () => {
        setSelectedProjects([]);
      },
    });
  };

  if (isLoading) {
    return <Loader className="w-full h-screen" />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Container className="py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        <div className="flex items-center gap-2">
          {selectedProjects.length > 0 && (
            <Button
              variant="danger"
              className="flex items-center gap-2 text-white"
              onClick={handleDeleteManyProjects}
            >
              <Trash2 />
            </Button>
          )}
          <Button
            variant="primary"
            className="flex items-center gap-2"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus />
            Create Project
          </Button>
        </div>
      </div>
      {hasNoProjects ? (
        <NoData title="No projects available" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {projectsData?.data.map((project: Project) => (
            <ProjectCard
              key={project._id}
              project={project}
              selectedProjects={selectedProjects}
              setSelectedProjects={setSelectedProjects}
              setEditProject={setEditProject}
              setIsCreateModalOpen={setIsCreateModalOpen}
            />
          ))}
        </div>
      )}
      {isCreateModalOpen && (
        <ProjectModal
          isOpen={isCreateModalOpen}
          onClose={() => {
            setIsCreateModalOpen(false);
            setEditProject(null);
          }}
          project={editProject}
        />
      )}
    </Container>
  );
};

export default ProjectsPage;
