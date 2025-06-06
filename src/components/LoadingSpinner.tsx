import { Spinner, Text, VStack } from "@chakra-ui/react";


const LoadingSpinner: React.FC = () => {
    return (
            <VStack p={4} colorPalette="teal">
                <Spinner color="colorPalette.600" />
                <Text color="colorPalette.600">Loading...</Text>
            </VStack>
        );
};

export default LoadingSpinner;