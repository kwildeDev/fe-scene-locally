import {
    Box,
    Container,
    Heading,
    List,
    Text,
} from '@chakra-ui/react';
import { FaQuestionCircle } from 'react-icons/fa';

const UserHelpPage: React.FC = () => {
    return (
        <Container maxW="container.lg" py={8}>
            <Heading as="h1" mb={6} textAlign="center">
                Help & Support
            </Heading>

            <Box mb={8}>
                <Heading as="h2" size="lg" mb={4}>
                    Getting Started
                </Heading>
                <Text fontSize="md" lineHeight="1.7">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur.
                </Text>
            </Box>

            <Box mb={8}>
                <Heading as="h2" size="lg" mb={4}>
                    Frequently Asked Questions
                </Heading>
                <List.Root gap="4" variant="plain">
                    <List.Item>
                        <List.Indicator asChild color="green.fg">
                            <FaQuestionCircle />
                        </List.Indicator>
                        <Box display="block">
                            <Heading as="h3" size="md" mb={1}>
                                How do I create an account?
                            </Heading>
                            <Text fontSize="md" lineHeight="1.7">
                                Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit. Sed do eiusmod tempor
                                incididunt ut labore et dolore magna aliqua.
                            </Text>
                        </Box>
                    </List.Item>
                    <List.Item>
                        <List.Indicator asChild color="green.fg">
                            <FaQuestionCircle />
                        </List.Indicator>
                        <Box display="block">
                            <Heading as="h3" size="md" mb={1}>
                                How do I reset my password?
                            </Heading>
                            <Text fontSize="md" lineHeight="1.7">
                                Ut enim ad minim veniam, quis nostrud
                                exercitation ullamco laboris nisi ut aliquip ex
                                ea commodo consequat. Duis aute irure dolor in
                                reprehenderit in voluptate velit esse cillum
                                dolore eu fugiat nulla pariatur.
                            </Text>
                        </Box>
                    </List.Item>
                    <List.Item>
                        <List.Indicator asChild color="green.fg">
                            <FaQuestionCircle />
                        </List.Indicator>
                        <Box display="block">
                            <Heading as="h3" size="md" mb={1}>
                                What are the system requirements?
                            </Heading>
                            <Text fontSize="md" lineHeight="1.7">
                                Sed do eiusmod tempor incididunt ut labore et
                                dolore magna aliqua. Ut enim ad minim veniam,
                                quis nostrud exercitation ullamco laboris nisi
                                ut aliquip ex ea commodo consequat.
                            </Text>
                        </Box>
                    </List.Item>
                </List.Root>
            </Box>

            <Box>
                <Heading as="h2" size="lg" mb={4}>
                    Contact Support
                </Heading>
                <Text fontSize="md" lineHeight="1.7" mb={4}>
                    If you have any other questions or need further assistance,
                    please don't hesitate to contact our support team.
                </Text>
                <Text fontSize="md" lineHeight="1.7">
                    You can reach us via email at support@scenelocally.com or by
                    phone at 01234 567890.
                </Text>
            </Box>
        </Container>
    );
};

export default UserHelpPage;
