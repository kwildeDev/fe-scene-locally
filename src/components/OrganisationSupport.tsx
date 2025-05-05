import {
    Box,
    Container,
    Heading,
    List,
    Text,
} from '@chakra-ui/react';
import { FaQuestionCircle } from 'react-icons/fa';

const OrganisationSupport: React.FC = () => {
    return (
        <Container maxW="container.lg" py={8}>
            <Heading as="h1" mb={6} textAlign="center">
                Event Management Help
            </Heading>

            <Box mb={8}>
                <Heading as="h2" size="lg" mb={4}>
                    Creating Your First Event
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
                    Managing Tickets and Registrations
                </Heading>
                <List.Root gap="4" variant="plain">
                    <List.Item>
                        <List.Indicator asChild color="green.500">
                            <FaQuestionCircle />
                        </List.Indicator>
                        <Box display="block">
                            <Heading as="h3" size="md" mb={1}>
                                How do I set up different ticket types?
                            </Heading>
                            <Text fontSize="md" lineHeight="1.7">
                                Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit. Sed do eiusmod tempor
                                incididunt ut labore et dolore magna aliqua.
                            </Text>
                        </Box>
                    </List.Item>
                    <List.Item>
                        <List.Indicator asChild color="green.500">
                            <FaQuestionCircle />
                        </List.Indicator>
                        <Box display="block">
                            <Heading as="h3" size="md" mb={1}>
                                How can I track attendee numbers?
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
                        <List.Indicator asChild color="green.500">
                            <FaQuestionCircle />
                        </List.Indicator>
                        <Box display="block">
                            <Heading as="h3" size="md" mb={1}>
                                Can I export my registration data?
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
                    Promoting Your Event
                </Heading>
                <Text fontSize="md" lineHeight="1.7" mb={4}>
                    If you have any other questions or need further assistance
                    with promoting your event, please don't hesitate to contact
                    our support team.
                </Text>
                <Text fontSize="md" lineHeight="1.7">
                    You can reach us via email at support@scenelocally.com or by
                    phone at 01234 567890.
                </Text>
            </Box>
        </Container>
    );
};

export default OrganisationSupport;