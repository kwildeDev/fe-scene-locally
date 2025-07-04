import {
    Box,
    Separator,
    Stack,
} from '@chakra-ui/react';
import StaffSidebarMenu from './StaffSidebarMenu';

import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '../contexts/UserProvider';

const StaffDashboard: React.FC = () => {
    const { user } = useUser();
    const organisationId = user?.organisation_id;

    console.log("user: ", user);

    if (!organisationId) {
        return <Navigate to={`/`} replace />;
    }

    return (
        <Stack
            id='staff-dashboard'
            direction={{ base: 'column', lg: 'row' }}
            flex="1"
            minW="0"
        >
            <Box flex={{ base: '1 0 auto', sm: '0 0 auto' }} w={{ base: '100%', sm: 'auto' }}>
                <StaffSidebarMenu />
            </Box>

            <Separator orientation={{ base: 'horizontal', sm: 'vertical' }} />

            <Box
                id='staff-dashboard-outlet'
                flex='1'
                minW="0"
            >
                <Outlet context={{ organisation_id: organisationId}}/>
            </Box>
        </Stack>
    );
};

export default StaffDashboard;
