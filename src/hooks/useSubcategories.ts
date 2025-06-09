import { useState, useEffect } from 'react';
import { getSubcategoriesById, SubcategoryDetail } from '../api';

export const useSubcategories = (categoryId?: number) => {
  const [subcategories, setSubcategories] = useState<SubcategoryDetail[]>([]);
  const [isLoadingSubcategories, setIsLoadingSubcategories] = useState(false);
  const [subcategoriesError, setSubcategoriesError] = useState(false);

  useEffect(() => {
    if (!categoryId) {
      setSubcategories([]);
      return;
    }

    setIsLoadingSubcategories(true);
    getSubcategoriesById(categoryId)
      .then(setSubcategories)
      .catch(() => setSubcategoriesError(true))
      .finally(() => setIsLoadingSubcategories(false));
  }, [categoryId]);

  return { subcategories, setSubcategories, isLoadingSubcategories, subcategoriesError };
};
