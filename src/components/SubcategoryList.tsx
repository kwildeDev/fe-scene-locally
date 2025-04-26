import { useState, useEffect } from 'react';
import { getSubcategories } from '../api.ts';
import { getIconColour } from '../utils.ts';
import { AspectRatio, Box, HStack, IconButton, Spinner, Text, VStack } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

interface SubcategoryDetail {
    subcategory_id: number;
    category_id: number;
    name: string;
    slug: string;
    description: string;
}

interface RouteParams {
    category_slug: string;
}

const SubcategoryList: React.FC = () => {
    const {category_slug } = useParams<RouteParams>();
    const [subcategories, setSubcategories] = useState<SubcategoryDetail[]>([]);
    const [isError, setIsError] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        getSubcategories(category_slug)
            .then((subcategories) => {
                setSubcategories(subcategories);
                setIsLoading(false);
            })
            .catch((err) => {
                setIsError(true);
                setIsLoading(false);
            });
    }, []);

    if (isError) {
        return <p>Failed to load subcategories.</p>;
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
                {subcategories.map((subcategory) => (
                    <AspectRatio ratio={1} minW={["80px", "120px"]} maxW={180} key={subcategory.subcategory_id}>
                    <IconButton 
                        bg={`${getIconColour(subcategory.subcategory_id)}.subtle`}
                        borderColor={`${getIconColour(subcategory.subcategory_id)}.emphasized`}
                        p={4}
                    >
                        <Text
                            color={`${getIconColour(subcategory.subcategory_id)}.fg`}
                            fontWeight="bold" 
                            fontSize={["xs", "sm", "md"]} 
                            whiteSpace="normal">{subcategory.name}
                        </Text>
                    </IconButton>
                    </AspectRatio>
                ))}
            </HStack>
            </Box>
    );
};

export default SubcategoryList;