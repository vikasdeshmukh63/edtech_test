'use client';

import { Button } from '@/components/Button';
import CategoryCard from '@/components/CategoryCard';
import CategoryModal from '@/components/CategoryModal';
import { Container } from '@/components/Container';
import Loader from '@/components/Loader';
import NoData from '@/components/NoData';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import { useCategories } from '@/hooks/useCategories';
import { Category } from '@/types/types';
import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

const CategoriesPage = () => {
  const { isAuthenticated } = useAuthRedirect();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const { getAllCategories, deleteManyCategories, isLoading } = useCategories();
  const { data: categoriesData } = getAllCategories;

  const handleDeleteManyCategories = () => {
    deleteManyCategories(selectedCategories, {
      onSuccess: () => {
        setSelectedCategories([]);
      },
    });
  };

  const hasNoCategories = !categoriesData?.data.length;

  if (isLoading) {
    return <Loader className="w-full h-screen" />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Container className="py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>
        <div className="flex items-center gap-2">
          {selectedCategories.length > 0 && (
            <Button
              variant="danger"
              className="flex items-center gap-2 text-white"
              onClick={handleDeleteManyCategories}
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
            Create Category
          </Button>
        </div>
      </div>
      {hasNoCategories ? (
        <NoData title="No categories available" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {categoriesData?.data.map((category: Category) => (
            <CategoryCard
              key={category._id}
              category={category}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              setEditCategory={setEditCategory}
              setIsCreateModalOpen={setIsCreateModalOpen}
            />
          ))}
        </div>
      )}
      {isCreateModalOpen && (
        <CategoryModal
          isOpen={isCreateModalOpen}
          onClose={() => {
            setIsCreateModalOpen(false);
            setEditCategory(null);
          }}
          category={editCategory}
        />
      )}
    </Container>
  );
};

export default CategoriesPage;
