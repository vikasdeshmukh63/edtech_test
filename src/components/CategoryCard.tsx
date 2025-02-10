import { Category } from '@/types/types';
import { Pencil } from 'lucide-react';
import React from 'react';
import { Button } from './Button';

const CategoryCard = ({
  category,
  selectedCategories,
  setSelectedCategories,
  setEditCategory,
  setIsCreateModalOpen,
}: {
  category: Category;
  selectedCategories: string[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
  setEditCategory: (category: Category) => void;
  setIsCreateModalOpen: (open: boolean) => void;
}) => {
  return (
    <div className="flex justify-between items-center p-2 rounded-lg border w-full sm:w-auto">
      <span className="flex items-center gap-2">
        {/* checkbox  */}
        <input
          type="checkbox"
          checked={selectedCategories.includes(category._id)}
          onChange={() => {
            setSelectedCategories((prev: string[]) =>
              prev.includes(category._id)
                ? prev.filter((id: string) => id !== category._id)
                : [...prev, category._id]
            );
          }}
        />

        {/* name  */}
        <span className="truncate">{category.name}</span>
      </span>

      {/* edit button  */}
      <Button
        variant="outline"
        onClick={() => {
          setEditCategory(category);
          setIsCreateModalOpen(true);
        }}
      >
        <Pencil className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default CategoryCard;
