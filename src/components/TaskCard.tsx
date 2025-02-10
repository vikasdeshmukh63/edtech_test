import React from 'react';

import { Category, Project, Task, User } from '@/types/types';
import { Pencil } from 'lucide-react';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { Button } from './Button';
import { Select } from './Select';

interface TaskCardProps {
  task: Task;
  users: User[];
  onChangeUpdate: (newStatus: Partial<Task>, task: Task) => void;
  isLastItem?: boolean;
  onLastItemInView?: () => void;
  projects: Project[];
  categories: Category[];
  selectedTasks: string[];
  setSelectedTasks: React.Dispatch<React.SetStateAction<string[]>>;
  setIsEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setTask: React.Dispatch<React.SetStateAction<Task | null>>;
}

type Priority = 'low' | 'medium' | 'high';

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  users,
  projects,
  categories,
  onChangeUpdate,
  isLastItem,
  onLastItemInView,
  selectedTasks,
  setSelectedTasks,
  setIsEditModalOpen,
  setTask,
}) => {
  // intersection observer
  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: true,
  });

  // handle last item in view
  useEffect(() => {
    if (isLastItem && inView && onLastItemInView) {
      onLastItemInView();
    }
  }, [inView, isLastItem, onLastItemInView]);

  // background colors
  const priorityColors: Record<Priority, string> = {
    low: 'bg-blue-500',
    medium: 'bg-yellow-500',
    high: 'bg-red-500',
  };

  return (
    <div
      ref={isLastItem ? ref : undefined}
      className={`
      rounded-lg p-4 shadow-md hover:shadow-lg hover:dark:shadow-gray-500/50 transition-shadow
      cursor-pointer mb-4 w-full max-w-md bg-white dark:bg-gray-800 border
    `}
    >
      <div className="flex justify-between items-start">
        <span className="flex items-center gap-2">
          {/* checkbox  */}
          <input
            type="checkbox"
            className="w-5 h-5"
            checked={selectedTasks.includes(task._id)}
            onChange={() =>
              setSelectedTasks((prev) =>
                prev.includes(task._id)
                  ? prev.filter((id) => id !== task._id)
                  : [...prev, task._id]
              )
            }
          />
          {/* title  */}
          <h3 className="font-semibold text-lg text-black dark:text-white">
            {task.title}
          </h3>
        </span>
        <span className="flex items-center gap-2">
          {/* edit button  */}
          <Button
            variant="outline"
            className="p-1"
            onClick={() => {
              setIsEditModalOpen(true);
              setTask(task);
            }}
          >
            <Pencil className="w-4 h-4" />
          </Button>
          {/* priority  */}
          <span
            className={`text-sm font-medium text-white ${priorityColors[task.priority as Priority]} px-2 py-1 rounded`}
          >
            {task.priority.toUpperCase()}
          </span>
        </span>
      </div>
      {/* description  */}
      <p className="text-gray-600 dark:text-white mt-2 text-sm">
        {task.description.substring(0, 100)}...
      </p>

      <div className="mt-4 flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-2">
          {/* status  */}
          <Select
            options={[
              { value: 'pending', label: 'Pending' },
              { value: 'in_progress', label: 'In Progress' },
              { value: 'completed', label: 'Completed' },
            ]}
            label="Status"
            value={task.status}
            onChange={(e) => onChangeUpdate({ status: e.target.value }, task)}
          />

          {/* user assignment */}
          <Select
            options={users.map((user) => ({
              value: user._id,
              label: user.name,
            }))}
            label="Assign to"
            value={users.find((user) => user._id === task.assignedTo)?._id}
            onChange={(e) =>
              onChangeUpdate({ assignedTo: e.target.value }, task)
            }
          />

          {/* project assignment */}
          <Select
            options={projects.map((project) => ({
              value: project._id,
              label: project.title,
            }))}
            label="Project"
            onChange={(e) =>
              onChangeUpdate({ projectId: e.target.value }, task)
            }
            value={
              projects.find((project) => project._id === task.projectId)?._id
            }
          />

          {/* category assignment */}
          <Select
            options={categories.map((category) => ({
              value: category._id,
              label: category.name,
            }))}
            label="Category"
            onChange={(e) =>
              onChangeUpdate({ categoryId: e.target.value }, task)
            }
            value={
              categories.find((category) => category._id === task.categoryId)
                ?._id
            }
          />
        </div>

        {/* due date */}
        <div className="text-sm text-gray-500 dark:text-white mt-2">
          Due: {new Date(task.dueDate).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
