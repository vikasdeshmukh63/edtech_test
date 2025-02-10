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
  // checking for authentication
  const { isAuthenticated } = useAuthRedirect();

  //states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [editCategory, setEditCategory] = useState<Category | null>(null);

  // category hook
  const { getAllCategories, deleteManyCategories, isLoading } = useCategories();
  const { data: categoriesData } = getAllCategories;

  // funtion to handle delete categories
  const handleDeleteManyCategories = () => {
    deleteManyCategories(selectedCategories, {
      onSuccess: () => {
        setSelectedCategories([]);
      },
    });
  };

  // checking for categories are there or not
  const hasNoCategories = !categoriesData?.data.length;

  // if loading
  if (isLoading) {
    return <Loader className="w-full h-screen" />;
  }

  // if user not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <Container className="py-6">
      <div className="flex justify-between items-center mb-6">
        {/* heading  */}
        <h1 className="text-2xl font-bold">Categories</h1>
        <div className="flex items-center gap-2">
          {/* delete button  */}
          {selectedCategories.length > 0 && (
            <Button
              variant="danger"
              className="flex items-center gap-2 text-white"
              onClick={handleDeleteManyCategories}
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
            Create Category
          </Button>
        </div>
      </div>
      {/* if no categories are there  */}
      {hasNoCategories ? (
        <NoData title="No categories available" />
      ) : (
        // when categories are available
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

      {/* category modal  */}
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
