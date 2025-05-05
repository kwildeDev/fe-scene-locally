import { UserContext } from '../contexts/userContext';
import { Box, Center, Heading, Image, Text, VStack } from '@chakra-ui/react';
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
                <VStack width="fit-content" alignItems="left">
                    <Center>
                        <Image width={50} src={organisationLogo}></Image>
                    </Center>
                    <Heading>{organisationName}</Heading>
                    <Text>Dashboard</Text>
                    <Box height="2px" width={40} bg="gray.100"></Box>
                    <Text>Events</Text>
                    <>
                        <Link to={`events`}>View Events</Link>
                        <Link to={`events/create`}>Add New Event</Link>
                        <Link to={`settings`}>Organisation Settings</Link>
                        <Link to={`support`}>Support</Link>
                    </>
                    <Text>Your Profile</Text>
                    <Text>{`Signed in as ${user?.first_name} ${user?.last_name}`}</Text>
                </VStack>
            ) : (
                <Text>You are not authorised to view this page</Text>
            )}
        </>
    );
};

export default StaffSidebarMenu;
