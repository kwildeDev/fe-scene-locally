import { Spinner, Text, VStack } from "@chakra-ui/react";


const LoadingSpinner: React.FC = () => {
    return (
            <VStack p={4}>
                <Spinner color="teal.fg" />
                <Text color="teal.fg">Loading...</Text>
            </VStack>
        );
};

export default LoadingSpinner;