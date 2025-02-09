import React, { useState } from 'react';
import { User } from '@/types'; // Assuming you have a User type defined
import { Category, Project, Task } from '@/types/types';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';
import { Select } from './Select';

interface TaskCardProps {
  task: Task;
  users: User[]; // List of users to choose from
  onChangeUpdate: (newStatus: Partial<Task>, task: Task) => void;
  isLastItem?: boolean;
  onLastItemInView?: () => void;
  projects: Project[];
  categories: Category[];
  selectedTasks: string[]; // Changed to an array of strings
  setSelectedTasks: React.Dispatch<React.SetStateAction<string[]>>; // Updated type
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
  selectedTasks, // Changed to selectedTasks
  setSelectedTasks, // Changed to setSelectedTasks
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce: true,
  });

  useEffect(() => {
    if (isLastItem && inView && onLastItemInView) {
      onLastItemInView();
    }
  }, [inView, isLastItem, onLastItemInView]);

  // Priority-based background colors
  const priorityColors: Record<Priority, string> = {
    low: 'bg-blue-500',
    medium: 'bg-yellow-500',
    high: 'bg-red-500',
  };

  // Status-based text colors
  const statusColors = {
    pending: 'text-gray-600',
    in_progress: 'text-blue-600',
    completed: 'text-green-600',
  };

  return (
    <div
      ref={isLastItem ? ref : undefined}
      className={`
      rounded-lg p-4 shadow-md hover:shadow-lg hover:dark:shadow-gray-500/50 transition-shadow
      cursor-pointer mb-4 w-full max-w-md bg-white dark:bg-gray-800
    `}
    >
      <div className="flex justify-between items-start">
        <span className="flex items-center gap-2">
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
          <h3 className="font-semibold text-lg text-black dark:text-white">
            {task.title}
          </h3>
        </span>
        <span
          className={`text-sm font-medium ${priorityColors[task.priority as Priority]} px-2 py-1 rounded`}
        >
          {task.priority.toUpperCase()}
        </span>
      </div>

      <p className="text-gray-600 dark:text-white mt-2 text-sm">
        {task.description.substring(0, 100)}...
      </p>

      <div className="mt-4 flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-2">
          {/* Status Selector */}

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

          {/* User Assignment */}

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

        {/* Due Date */}
        <div className="text-sm text-gray-500 dark:text-white mt-2">
          Due: {new Date(task.dueDate).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
