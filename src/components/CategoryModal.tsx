import { useCategories } from '@/hooks/useCategories';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Button } from './Button';
import { Input } from './Input';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: { _id: string; name: string } | null;
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  category,
}) => {
  const { createCategory, updateCategory } = useCategories();
  const [name, setName] = useState(category?.name || '');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (category) {
      setName(category.name);
    }
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!name) {
      setErrors({ name: 'Name is required' });
      return;
    }

    try {
      if (category) {
        await updateCategory({ _id: category._id, name });
      } else {
        await createCategory({ name });
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
          {category ? 'Edit Category' : 'Create New Category'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            value={name}
            placeholder="Enter category name"
            className="p-3"
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
          />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {category ? 'Update Category' : 'Create Category'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;
