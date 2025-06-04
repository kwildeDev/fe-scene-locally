import React from 'react';
import { UseFormRegister, FieldErrors, UseFormWatch } from 'react-hook-form';
import { Text, Flex } from '@chakra-ui/react';
import { EventFormField } from './EventFormField';
import {
    CategoryDetail,
    SubcategoryDetail,
    getSubcategoriesById,
} from '../api';
import { Formfields } from '../types/forms';

interface CategorySubcategoryFieldsProps {
    register: UseFormRegister<Formfields>;
    errors: FieldErrors<Formfields>;
    isDisabled: boolean;
    isPublished: boolean;
    categoriesList: CategoryDetail[];
    subcategoriesList: SubcategoryDetail[];
    isLoadingCategories: boolean;
    isLoadingSubcategories: boolean;
    categoriesError: boolean;
    subcategoriesError: boolean;
    watch: UseFormWatch<Formfields>;
    setSubcategories: React.Dispatch<React.SetStateAction<SubcategoryDetail[]>>;
}

export const CategorySubcategoryFields: React.FC<
    CategorySubcategoryFieldsProps
> = ({
    register,
    errors,
    isDisabled,
    isPublished,
    categoriesList,
    subcategoriesList,
    isLoadingCategories,
    isLoadingSubcategories,
    categoriesError,
    subcategoriesError,
    watch,
    setSubcategories,
}) => {
    const categoryId = watch('category');

    React.useEffect(() => {
        if (!categoryId) {
            setSubcategories([]);
            return;
        }
        getSubcategoriesById(categoryId)
            .then(setSubcategories)
            .catch((err: unknown) => {
                console.error('Error fetching subcategories:', err);
            });
    }, [categoryId, setSubcategories]);

    return (
        <>
            <Flex direction={{ base: 'column', md: 'row' }} mt={4}>
                <EventFormField
                    label="Category"
                    error={errors.category}
                    htmlFor="category"
                    focusWarningMessage="This event is already published. Changing its category or subcategory may affect how attendees find and perceive it."
                    shouldWarn={isPublished}
                >
                    <div>
                        {categoriesError && (
                            <Text color="red.500">
                                Failed to load categories. Please refresh.
                            </Text>
                        )}
                        <select
                            {...register('category')}
                            id="category"
                            disabled={isDisabled}
                        >
                            <option value="">
                                {isLoadingCategories
                                    ? 'Loading categories...'
                                    : 'Select category'}
                            </option>
                            {categoriesList.map((category) => (
                                <option
                                    key={category.category_id}
                                    value={category.category_id}
                                >
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </EventFormField>

                <EventFormField
                    label="Subcategory"
                    error={errors.subcategory}
                    htmlFor="subcategory"
                    focusWarningMessage="This event is already published. Changing its category or subcategory may affect how attendees find and perceive it."
                    shouldWarn={isPublished}
                >
                    <div>
                        {subcategoriesError && (
                            <Text color="red.500">
                                Subcategories could not be retrieved.
                            </Text>
                        )}
                        <select
                            {...register('subcategory')}
                            id="subcategory"
                            disabled={isDisabled}
                        >
                            <option value="">
                                {isLoadingSubcategories
                                    ? 'Loading subcategories...'
                                    : 'Select subcategory'}
                            </option>
                            {subcategoriesList.length === 0 && (
                                <option disabled>No subcategories available</option>
                            )}
                            {subcategoriesList.map((subcategory) => (
                                <option
                                    key={subcategory.subcategory_id}
                                    value={subcategory.subcategory_id}
                                >
                                    {subcategory.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </EventFormField>
            </Flex>
        </>
    );
};
