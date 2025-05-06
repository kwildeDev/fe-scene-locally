import { UserContext } from '../contexts/userContext';
import { Center, Heading, Image, Separator, Text, VStack } from '@chakra-ui/react';
import { useContext } from 'react';
import { Link } from 'react-router-dom';

const StaffSidebarMenu: React.FC = () => {
    const context = useContext(UserContext);
    const user = context?.user;
    const organisationId = user?.organisation_id;
    const organisationName = user?.organisation_name;
    const organisationLogo =
        'https://avatars.githubusercontent.com/u/43854511?s=200&v=4';

    return (
        <>
            {organisationId ? (
                <VStack as="nav" width="fit-content" alignItems="left">
                    <Center p={1}>
                        <Image width="65px" src={organisationLogo}></Image>
                    </Center>
                    <Heading>{organisationName}</Heading>
                    <Text fontSize="lg" fontWeight="semibold">Staff Dashboard</Text>
                    <Separator></Separator>
                    <Heading as="h3" size="md">Events</Heading>
                    <VStack ml={4} alignItems="flex-start">
                        <Link to={`events`}>View Events</Link>
                        <Link to={`events/create`}>Add New Event</Link>
                    </VStack>
                    <Link to={`settings`}><Text fontWeight="semibold">Organisation Settings</Text></Link>                    
                    <Link to={`support`}><Text fontWeight="semibold">Support</Text></Link>
                    
                    <Text color="teal.solid">{`Welcome back ${user?.first_name} ${user?.last_name} \u{1F44B}`}</Text>
                </VStack>
            ) : (
                <Text>You are not authorised to view this page</Text>
            )}
        </>
    );
};

export default StaffSidebarMenu;
