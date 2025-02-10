'use client';

import { Button } from '@/components/Button';
import { Container } from '@/components/Container';
import Loader from '@/components/Loader';
import TaskCard from '@/components/TaskCard';
import { TaskFilters } from '@/components/TaskFilters';
import { TaskModal } from '@/components/TaskModal';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import { useCategories } from '@/hooks/useCategories';
import { useFilteredTasks } from '@/hooks/useFilteredTasks';
import { useProjects } from '@/hooks/useProjects';
import { useTask } from '@/hooks/useTask';
import { useUsers } from '@/hooks/useUsers';
import { Task } from '@/types/types';
import { Filter, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function Dashboard() {
  const { isAuthenticated } = useAuthRedirect();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [task, setTask] = useState<Task | null>(null);
  const [filters, setFilters] = useState({
    priority: '',
    assignedTo: '',
    startDate: '',
    endDate: '',
    search: '',
    status: '',
    categoryId: '',
    projectId: '',
  });
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data: usersData } = useUsers();
  const { getAllCategories } = useCategories();
  const { data: categoriesData } = getAllCategories;
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useFilteredTasks(filters);
  const { getAllProjects } = useProjects();
  const { data: projectsData } = getAllProjects;
  const { updateTask, deleteManyTasks } = useTask();

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const handleUpdateTask = (updates: Partial<Task>, task: Task) => {
    console.log(task);
    updateTask({
      ...task,
      ...updates,
      dueDate:
        task.dueDate instanceof Date
          ? task.dueDate.toISOString()
          : task.dueDate,
    });
  };

  const handleDeleteManyTasks = () => {
    deleteManyTasks(selectedTasks, {
      onSuccess: () => {
        setSelectedTasks([]);
      },
    });
  };

  if (isLoading) {
    return <Loader className="w-full h-screen" />;
  }

  if (!isAuthenticated) {
    return null;
  }

  const hasNoTasks = !data?.pages[0]?.tasks.length;

  return (
    <Container className="py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tasks</h1>
        <div className="flex items-center gap-2">
          {selectedTasks.length > 0 && (
            <Button
              variant="danger"
              className="flex items-center gap-2 text-white"
              onClick={handleDeleteManyTasks}
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
            Create Task
          </Button>
          <Button
            onClick={() => setIsFilterOpen(true)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {isFilterOpen && (
        <TaskFilters
          users={usersData?.data || []}
          categories={categoriesData?.data || []}
          projects={projectsData?.data || []}
          onFilterChange={setFilters}
          onResetFilters={() =>
            setFilters({
              priority: '',
              assignedTo: '',
              startDate: '',
              endDate: '',
              search: '',
              status: '',
              categoryId: '',
              projectId: '',
            })
          }
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
        />
      )}

      {isCreateModalOpen && (
        <TaskModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          categories={categoriesData?.data || []}
          projects={projectsData?.data || []}
          users={usersData?.data || []}
        />
      )}

      {isEditModalOpen && (
        <TaskModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          task={task}
          categories={categoriesData?.data || []}
          projects={projectsData?.data || []}
          users={usersData?.data || []}
        />
      )}

      {hasNoTasks ? (
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow">
          <p className="text-gray-500 dark:text-gray-400">No tasks available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.pages.map((page, pageIndex) =>
            page.tasks.map((task, taskIndex) => (
              <TaskCard
                key={task._id}
                setTask={setTask}
                setIsEditModalOpen={setIsEditModalOpen}
                selectedTasks={selectedTasks}
                setSelectedTasks={setSelectedTasks}
                task={task}
                users={usersData?.data || []}
                projects={projectsData?.data || []}
                categories={categoriesData?.data || []}
                onChangeUpdate={handleUpdateTask}
                isLastItem={
                  pageIndex === data.pages.length - 1 &&
                  taskIndex === page.tasks.length - 1
                }
                onLastItemInView={handleLoadMore}
              />
            ))
          )}
        </div>
      )}

      {isFetchingNextPage && (
        <div className="w-full h-fit flex justify-center items-center">
          <Loader className="w-full h-fit" />
        </div>
      )}
    </Container>
  );
}
