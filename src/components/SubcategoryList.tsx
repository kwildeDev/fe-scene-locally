import { useState, useEffect } from 'react';
import { getSubcategories } from '../api.ts';
import { getIconColour } from '../utils.ts';
import { AspectRatio, Box, Button, HStack, Link, Spinner, Text, VStack } from '@chakra-ui/react';
import { useSearchParams } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner.tsx';

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
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        getSubcategories(category as string)
            .then((subcategories) => {
                setSubcategories(subcategories);
                setIsLoading(false);
            })
            .catch((err) => {
                setIsError(true);
                setIsLoading(false);
            });
    }, [category]);

    if (isError) {
        return <p>Failed to load subcategories.</p>;
    }
    if (isLoading) {
        return <LoadingSpinner />
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

/*
<AspectRatio ratio={1} minW={["80px", "120px"]} maxW={180} key={subcategory.subcategory_id}>
                    <Button
                        w="100%"
                        h="100%" 
                        bg={`${getIconColour(subcategory.subcategory_id)}.subtle`}
                        borderColor={`${getIconColour(subcategory.subcategory_id)}.emphasized`}
                        p={4}
                        _hover={{
                            bg: `${getIconColour(subcategory.subcategory_id)}.emphasized`,
                            color: "white" 
                        }}
                        _active={{
                            transform: "scale(0.98)",
                            bg: `${getIconColour(subcategory.subcategory_id)}.emphasized`,
                        }}
                        _focus={{
                            boxShadow: "outline",
                        }}
                        onClick={() => {
                            console.log("clicked subcategory:", subcategory.slug);
                            onSubcategoryClick(subcategory.slug);
                        }}
                    >
                        <Text
                            color={`${getIconColour(subcategory.subcategory_id)}.fg`}
                            fontWeight="bold" 
                            fontSize={["xs", "sm", "md"]} 
                            whiteSpace="normal">{subcategory.name}
                        </Text>
                    </Button>
                    </AspectRatio>

*/