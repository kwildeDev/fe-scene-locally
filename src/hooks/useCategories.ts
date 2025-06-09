import { useState, useEffect } from "react";
import { getCategories, CategoryDetail } from "../api";

export const useCategories = () => {
    const [categories, setCategories] = useState<CategoryDetail[]>([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(false);
    const [categoriesError, setCategoriesError] = useState<boolean>(false);

    useEffect(() => {
        setIsLoadingCategories(true);
        getCategories()
            .then(setCategories)
            .catch(() => setCategoriesError(true))
            .finally(() => setIsLoadingCategories(false));
    }, []);

    return {categories, isLoadingCategories, categoriesError};
};