import { UserContext } from '../contexts/userContext';
import { Box, Center, Heading, Image, Text, VStack } from '@chakra-ui/react';
import { useContext } from 'react';

const StaffSidebarMenu: React.FC = () => {

    const context = useContext(UserContext);
    const user = context?.user;
    
    return (
        <VStack width="fit-content" alignItems="left">
            <Center>
            <Image width={50} src="https://avatars.githubusercontent.com/u/43854511?s=200&v=4"></Image>
            </Center>
            <Heading>{`Organisation ${user?.organisation_id}`}</Heading>
            <Text>Dashboard</Text>
            <Box height="2px" width={40} bg="gray.100"></Box>
            <Text>Events</Text>
            <Text>View Events</Text>
            <Text>Add New Event</Text>
            <Text>Organisation Settings</Text>
            <Text>Support</Text>
            <Text>Your Profile</Text>
            <Text>{`Signed in as ${user?.first_name} ${user?.last_name}`}</Text>
        </VStack>
    );
};

export default StaffSidebarMenu;
