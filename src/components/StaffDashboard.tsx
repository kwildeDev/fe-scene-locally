import {
    Box,
    Separator,
    Stack,
} from '@chakra-ui/react';
import StaffSidebarMenu from './StaffSidebarMenu';
import OrganisationEventList from './OrganisationEventList';

const StaffDashboard: React.FC = () => {
    return (
        <Stack
            direction={{ base: 'column', sm: 'row' }}
            align="stretch"
        >
            <Box>
                <StaffSidebarMenu />
            </Box>

            <Separator orientation={{ base: 'horizontal', sm: 'vertical' }} />

            <Box height="dvh">
                <OrganisationEventList 
                    organisation_id={3}
                />
            </Box>
        </Stack>
    );
};

export default StaffDashboard;
