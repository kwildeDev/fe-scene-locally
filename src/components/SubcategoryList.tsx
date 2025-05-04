import { useState, useEffect } from 'react';
import { getSubcategories } from '../api.ts';
import { getIconColour } from '../utils.ts';
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
    onSubcategoryClick: (subcategorySlug: string) => void;
}

const SubcategoryList: React.FC<SubcategoryListProps> = ({onSubcategoryClick}) => {
    const [searchParams] = useSearchParams();
    const category = searchParams.get('category');
    const [subcategories, setSubcategories] = useState<SubcategoryDetail[]>([]);
    const [isError, setIsError] = useState<boolean>(false);

    useEffect(() => {
        getSubcategories(category as string)
            .then((subcategories) => {
                setSubcategories(subcategories);
            })
            .catch((err) => {
                setIsError(true);
            });
    }, [category]);

    if (isError) {
        return <p>Failed to load subcategories.</p>;
    }
    if (subcategories.length === 0) {
        return <Text>No subcategories available for this category.</Text>
    }

    return (
            <Box overflowX="auto" whiteSpace="nowrap" mb={2}>
            <HStack>
                {subcategories.map((subcategory) => {
                    const isActive = searchParams.get("subcategory") === subcategory.slug;
                    
                    return(
                        <Button
                            p={0}
                            variant="plain"
                            key={subcategory.subcategory_id}
                            color={isActive ? `${getIconColour(subcategory.subcategory_id)}.solid` : "gray.800"}
                            fontWeight="bold" 
                            fontSize={["xs", "sm", "md"]}
                            textDecoration="underline"
                            _hover={{
                                textDecoration: "underline",
                                color: `${getIconColour(subcategory.subcategory_id)}.solid`,
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