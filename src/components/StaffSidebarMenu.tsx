import { Avatar, Box, Heading, HStack, Separator, Text, VStack } from '@chakra-ui/react';
import { FaCog, FaQuestionCircle, FaUserCircle } from 'react-icons/fa';
import { FaBell, FaGrip, FaUsers } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import { useUser } from '../contexts/UserProvider';

const StaffSidebarMenu: React.FC = () => {
    const { user } = useUser();
    const organisationId = user?.organisation_id;
    const organisationName = user?.organisation_name;
    const organisationLogo =
        'https://avatars.githubusercontent.com/u/43854511?s=200&v=4';

    return (
        <aside>
            {organisationId ? (
                <VStack as="nav" width="fit-content" alignItems="left">
                    <HStack mt={4}>
                        <Avatar.Root>
                            <Avatar.Fallback name={organisationName ?? undefined} />
                            <Avatar.Image src={organisationLogo} alt="Organisation Logo"/>
                        </Avatar.Root>
                    <Heading size="lg" color="fg.muted" maxW={{ lg: 250 }}>{organisationName}</Heading>
                    </HStack>
                    <HStack gap={2} as="span" whiteSpace="nowrap">
                        <Box as={FaGrip} aria-hidden="true" />
                        <Text fontSize="lg" fontWeight="semibold">Staff Dashboard</Text>
                    </HStack>
                    
                    <Separator></Separator>
                    <Heading display="flex" as="h3" size="md">
                        <HStack gap={2} as="span" whiteSpace="nowrap">
                            <Box as={FaBell} aria-hidden="true" />
                            <Text as="span">Events</Text>
                        </HStack>
                    </Heading>
                    <VStack ml={6} alignItems="flex-start">
                        <Link to={`events`}>View Events</Link>
                        <Link to={`events/create`}>Add New Event</Link>
                    </VStack>
                    <Heading display="flex" as="h3" size="md">
                        <HStack gap={2} as="span" whiteSpace="nowrap">
                            <Box as={FaUsers} aria-hidden="true" />
                            <Text as="span">Attendees</Text>
                        </HStack>
                    </Heading>
                    <VStack ml={6} alignItems="flex-start">
                        <Text>Attendee Lists</Text>
                    </VStack>
                    <Link to={`settings`}>
                        <HStack gap={2} as="span" whiteSpace="nowrap">
                            <Box as={FaCog} aria-hidden="true" /> 
                            <Text as="span" fontWeight="semibold">Organisation Settings</Text>
                        </HStack>
                    </Link>                    
                    <Link to={`support`}>
                        <HStack gap={2} as="span" whiteSpace="nowrap">
                            <Box as={FaQuestionCircle} aria-hidden="true" /> 
                            <Text as="span" fontWeight="semibold">Support</Text>
                        </HStack>
                    </Link>
                    <Separator></Separator>
                    <HStack gap={2} as="span" whiteSpace="nowrap">
                        <Box color="teal.fg" as={FaUserCircle} aria-hidden="true" />
                        <Text color="teal.fg">{`Welcome ${user?.first_name} ${user?.last_name} \u{1F44B}`}</Text>
                    </HStack>
                </VStack>
            ) : (
                <Text>You are not authorised to view this page</Text>
            )}
        </aside>
    );
};

export default StaffSidebarMenu;
