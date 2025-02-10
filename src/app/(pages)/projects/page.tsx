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
  // check if user is authenticated
  const { isAuthenticated } = useAuthRedirect();

  // states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [editProject, setEditProject] = useState<Project | null>(null);

  // projects hook
  const { getAllProjects, deleteManyProjects, isLoading } = useProjects();
  const { data: projectsData } = getAllProjects;

  // if loading
  if (isLoading) return <Loader className="w-full h-screen" />;

  // if not authenticated
  if (!isAuthenticated) return null;

  // has no projects
  const hasNoProjects = !projectsData?.data.length;

  // handle delete many projects
  const handleDeleteManyProjects = () => {
    deleteManyProjects(selectedProjects, {
      onSuccess: () => {
        setSelectedProjects([]);
      },
    });
  };

  // if laoding
  if (isLoading) {
    return <Loader className="w-full h-screen" />;
  }

  // if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <Container className="py-6">
      <div className="flex justify-between items-center mb-6">
        {/* heading  */}
        <h1 className="text-2xl font-bold">Projects</h1>
        <div className="flex items-center gap-2">
          {/* delete button  */}
          {selectedProjects.length > 0 && (
            <Button
              variant="danger"
              className="flex items-center gap-2 text-white"
              onClick={handleDeleteManyProjects}
            >
              <Trash2 />
            </Button>
          )}
          {/* create button  */}
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
      {/* no projects  */}
      {hasNoProjects ? (
        <NoData title="No projects available" />
      ) : (
        // projects present
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
      {/* create modal  */}
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
