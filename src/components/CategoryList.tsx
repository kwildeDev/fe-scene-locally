import { useState, useEffect } from 'react';
import { getCategories } from '../api.ts';
import { getIconColour } from '../utils.ts';
import { AspectRatio, Box, Button, HStack, Spinner, Text, VStack } from '@chakra-ui/react';

interface CategoryDetail {
    category_id: number;
    name: string;
    slug: string;
    description: string;
}

const CategoryList: React.FC = () => {
    const [categories, setCategories] = useState<CategoryDetail[]>([]);
    const [isError, setIsError] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        getCategories()
            .then((categories) => {
                setCategories(categories);
                setIsLoading(false);
            })
            .catch((err) => {
                setIsError(true);
                setIsLoading(false);
            });
    }, []);

    if (isError) {
        return <p>Failed to load categories.</p>;
    }
    if (isLoading) {
        return (
            <VStack colorPalette="teal">
                <Spinner color="colorPalette.600" />
                <Text color="colorPalette.600">Loading...</Text>
            </VStack>
        )
    }

    return (
            <Box overflowX="auto" whiteSpace="nowrap" pb={4} mb={8}>
            <HStack gap={10}>
                {categories.map((category) => (
                    <AspectRatio ratio={1} minW={["80px", "120px"]} maxW={180} key={category.category_id}>
                    <Button
                        w="100%"
                        h="100%" 
                        bg={`${getIconColour(category.category_id)}.subtle`}
                        borderColor={`${getIconColour(category.category_id)}.emphasized`}
                        p={4}
                        _hover={{
                            bg: `${getIconColour(category.category_id)}.emphasized`,
                            color: "white"  
                        }}
                        _active={{
                            transform: "scale(0.98)",
                            bg: `${getIconColour(category.category_id)}.emphasized`,
                          }}
                          _focus={{
                            boxShadow: "outline",
                          }}
                    >
                        <Text
                            color={`${getIconColour(category.category_id)}.fg`}
                            fontWeight="bold" 
                            fontSize={["xs", "sm", "md"]} 
                            whiteSpace="normal">{category.name}
                        </Text>
                    </Button>
                    </AspectRatio>
                ))}
            </HStack>
            </Box>
    );
};

export default CategoryList;