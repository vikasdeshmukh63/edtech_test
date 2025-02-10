import { useState } from 'react';
import { Button } from './Button';
import { X } from 'lucide-react';
import { Input } from './Input';
import { Select } from './Select';
import { Project, Category, User } from '@/types/types';
import { PRIORITY_OPTIONS, STATUS_OPTIONS } from '@/constants/constants';
interface TaskFiltersProps {
  users: User[];
  categories: Category[];
  projects: Project[];
  onFilterChange: (filters: {
    priority: string;
    assignedTo: string;
    startDate: string;
    endDate: string;
    search: string;
    status: string;
    categoryId: string;
    projectId: string;
  }) => void;
  onResetFilters: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export function TaskFilters({
  users,
  categories,
  projects,
  onFilterChange,
  onResetFilters,
  isOpen,
  onClose,
}: TaskFiltersProps) {
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApply = () => {
    onFilterChange(filters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters = {
      priority: '',
      assignedTo: '',
      startDate: '',
      endDate: '',
      search: '',
      status: '',
      categoryId: '',
      projectId: '',
    };
    setFilters(resetFilters);
    onResetFilters();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Filter Tasks</h2>
          <Button
            variant="outline"
            onClick={onClose}
            className="text-black dark:text-white"
          >
            <X size={24} />
          </Button>
        </div>

        <div className="space-y-4">
          <Input
            label="Search"
            name="search"
            className="p-2 border bg-white dark:bg-gray-800"
            value={filters.search}
            onChange={handleChange}
          />

          <Select
            label="Category"
            name="categoryId"
            value={filters.categoryId}
            onChange={handleChange}
            options={[
              { value: '', label: 'All Categories' },
              ...categories.map((category) => ({
                value: category._id,
                label: category.name,
              })),
            ]}
          />

          <Select
            label="Priority"
            name="priority"
            value={filters.priority}
            onChange={handleChange}
            options={[
              { value: '', label: 'All Priorities' },
              ...PRIORITY_OPTIONS,
            ]}
          />

          <Select
            label="Status"
            name="status"
            value={filters.status}
            onChange={handleChange}
            options={[
              { value: '', label: 'All Statuses' },
              ...STATUS_OPTIONS,
            ]}
          />

          <Select
            label="Assigned To"
            name="assignedTo"
            value={filters.assignedTo}
            onChange={handleChange}
            options={[
              { value: '', label: 'All Users' },
              ...users.map((user) => ({
                value: user._id,
                label: user.name,
              })),
            ]}
          />

          <Select
            label="Project"
            name="projectId"
            value={filters.projectId}
            onChange={handleChange}
            options={[
              { value: '', label: 'All Projects' },
              ...projects.map((project) => ({
                value: project._id,
                label: project.title,
              })),
            ]}
          />

          <div className="flex gap-2 justify-end mt-6">
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
            <Button onClick={handleApply}>Apply Filters</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
