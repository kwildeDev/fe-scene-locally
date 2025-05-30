import {
    Box,
    Separator,
    Stack,
} from '@chakra-ui/react';
import StaffSidebarMenu from './StaffSidebarMenu';

import { useContext } from 'react';
import { UserContext } from '../contexts/userContext';
import { Navigate, Outlet } from 'react-router-dom';

const StaffDashboard: React.FC = () => {
    const context = useContext(UserContext);
    const user = context?.user;
    const organisationId = user?.organisation_id;

    if (!organisationId) {
        return <Navigate to={`/`} replace />;
    }

    return (
        <Stack
            id='staff-dashboard'
            direction={{ base: 'column', sm: 'row' }}
            align='stretch'
        >
            <Box flex={{ base: '1 0 auto', sm: '0 0 auto' }} w={{ base: '100%', sm: 'auto' }}>
                <StaffSidebarMenu />
            </Box>

            <Separator orientation={{ base: 'horizontal', sm: 'vertical' }} />

            <Box id='staff-dashboard-outlet' flex='1'>
                <Outlet context={{ organisation_id: organisationId}}/>
            </Box>
        </Stack>
    );
};

export default StaffDashboard;
