import { PRIORITY_OPTIONS, STATUS_OPTIONS } from '@/constants/constants';
import { Category, Project, User } from '@/types/types';
import { X } from 'lucide-react';
import { useState } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { Select } from './Select';

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
  // states
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

  // handle change function
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // handle apply function
  const handleApply = () => {
    onFilterChange(filters);
    onClose();
  };

  // handle reset function
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

  // if modal is not open
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        {/* heading  */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Filter Tasks</h2>
          {/* close button  */}
          <Button
            variant="outline"
            onClick={onClose}
            className="text-black dark:text-white"
          >
            <X size={24} />
          </Button>
        </div>

        <div className="space-y-4">
          {/* search  */}
          <Input
            label="Search"
            name="search"
            className="p-2 border bg-white dark:bg-gray-800"
            value={filters.search}
            onChange={handleChange}
          />

          {/* category  */}
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

          {/* priority  */}
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

          {/* status  */}
          <Select
            label="Status"
            name="status"
            value={filters.status}
            onChange={handleChange}
            options={[{ value: '', label: 'All Statuses' }, ...STATUS_OPTIONS]}
          />

          {/* assigned to  */}
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

          {/* project  */}
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

          {/* action buttons  */}
          <div className="flex gap-2 justify-end mt-6">
            {/* reset button  */}
            <Button variant="outline" onClick={handleReset}>
              Reset
            </Button>
            {/* apply button  */}
            <Button onClick={handleApply}>Apply Filters</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
