import { useState, useEffect } from 'react';
import { getSubcategories } from '../api.ts';
import { getIconColour } from '../utils/utils.ts';
import { Box, Button, HStack, Text } from '@chakra-ui/react';
import { useSearchParams } from 'react-router-dom';

interface SubcategoryDetail {
    subcategory_id: number;
    category_id: number;
    name: string;
    slug: string;
    description: string;
}

interface SubcategoryListProps {
    category: string;
    onSubcategoryClick: (subcategorySlug: string) => void;
}

const SubcategoryList: React.FC<SubcategoryListProps> = ({
    onSubcategoryClick,
}) => {
    const [searchParams] = useSearchParams();
    const category = searchParams.get('category');
    const [subcategories, setSubcategories] = useState<SubcategoryDetail[]>([]);
    const [isError, setIsError] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        setIsLoading(true);
        setIsError(false);
        getSubcategories(category as string)
            .then((subcategories) => {
                setSubcategories(subcategories);
                setIsLoading(false);
            })
            .catch((_err) => {
                setIsError(true);
                setIsLoading(false);
            });
    }, [category]);

    if (isError) {
        return <Text mb={2} pt={2}>Failed to load subcategories.</Text>;
    }

    if (isLoading) {
        return <Text mb={2} pt={2}>Loading subcategories...</Text>;
}

    if (subcategories.length === 0) {
        return <Text mb={2} pt={2}>No subcategories available for this category.</Text>;
    }

    return (
        <Box as="section" aria-label='Filter events by subcategory' overflowX="auto" whiteSpace="nowrap">
            <HStack>
                {subcategories.map((subcategory) => {
                    const isActive =
                        searchParams.get('subcategory') === subcategory.slug;

                    return (
                        <Button
                            p={0}
                            variant="plain"
                            key={subcategory.subcategory_id}
                            color={
                                isActive
                                    ? `${getIconColour(
                                          subcategory.subcategory_id
                                      )}.solid`
                                    : 'gray.fg'
                            }
                            fontWeight="bold"
                            fontSize={['xs', 'sm', 'md']}
                            textDecoration="underline"
                            _hover={{
                                textDecoration: 'underline',
                                color: `${getIconColour(
                                    subcategory.subcategory_id
                                )}.solid`,
                            }}
                            onClick={() => {
                                onSubcategoryClick(subcategory.slug);
                            }}
                        >
                            {subcategory.name}
                        </Button>
                    );
                })}
            </HStack>
        </Box>
    );
};

export default SubcategoryList;
