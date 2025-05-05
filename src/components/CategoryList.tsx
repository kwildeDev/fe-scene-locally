import { useState, useEffect } from 'react';
import { getCategories } from '../api.ts';
import { getIconColour } from '../utils/utils.ts';
import {
    AspectRatio,
    Box,
    Button,
    Container,
    HStack,
    Text,
} from '@chakra-ui/react';
import { useSearchParams } from 'react-router-dom';

interface CategoryDetail {
    category_id: number;
    name: string;
    slug: string;
    description: string;
}

interface CategoryListProps {
    onCategoryClick: (categorySlug: string) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({ onCategoryClick }) => {
    const [searchParams] = useSearchParams();
    const [categories, setCategories] = useState<CategoryDetail[]>([]);
    const [isError, setIsError] = useState<boolean>(false);

    useEffect(() => {
        getCategories()
            .then((categories) => {
                setCategories(categories);
            })
            .catch((err) => {
                setIsError(true);
                setIsLoading(false);
            });
    }, []);

    if (isError) {
        return <p>Failed to load categories.</p>;
    }

    return (
        <Container p={0}>
            <Box overflowX="auto" whiteSpace="nowrap" pb={4} mb={4}>
                <Button
                    variant="plain"
                    p={0}
                    pb={2}
                    onClick={() => {
                        onCategoryClick('');
                    }}
                >
                    <Text textStyle="lg" textDecoration="underline">
                        All Categories
                    </Text>
                </Button>
                <HStack gap={10}>
                    {categories.map((category) => {
                        const isActive =
                            searchParams.get('category') === category.slug;
                        return (
                            <AspectRatio
                                ratio={1}
                                minW={['80px', '120px']}
                                maxW={180}
                                key={category.category_id}
                            >
                                <Button
                                    w="100%"
                                    h="100%"
                                    bg={`${getIconColour(
                                        category.category_id
                                    )}.${isActive ? 'emphasized' : 'subtle'}`}
                                    borderColor={`${getIconColour(
                                        category.category_id
                                    )}.emphasized`}
                                    p={4}
                                    _hover={{
                                        bg: `${getIconColour(
                                            category.category_id
                                        )}.emphasized`,
                                        color: 'white',
                                    }}
                                    _active={{
                                        transform: 'scale(0.98)',
                                        bg: `${getIconColour(
                                            category.category_id
                                        )}.emphasized`,
                                    }}
                                    _focus={{
                                        boxShadow: 'outline',
                                    }}
                                    onClick={() => {
                                        onCategoryClick(category.slug);
                                    }}
                                >
                                    <Text
                                        color={`${getIconColour(
                                            category.category_id
                                        )}.fg`}
                                        fontWeight="bold"
                                        fontSize={['xs', 'sm', 'md']}
                                        whiteSpace="normal"
                                    >
                                        {category.name}
                                    </Text>
                                </Button>
                            </AspectRatio>
                        );
                    })}
                </HStack>
            </Box>
        </Container>
    );
};

export default CategoryList;
