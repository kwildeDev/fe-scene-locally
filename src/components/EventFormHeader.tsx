import { Box, Stack, Text, Badge } from '@chakra-ui/react';
import { formatDateTime, formatRelativeDate } from '../utils/utils';

interface EventHeaderProps {
    event: {
        created_at: string;
        updated_at: string;
        status: string;
        event_id: number;
    };
}

export const EventFormHeader: React.FC<EventHeaderProps> = ({ event }) => {
    const badgeColour: string =
        event.status === 'draft'
            ? 'gray'
            : event.status === 'published'
            ? 'green'
            : event.status === 'cancelled'
            ? 'red'
            : event.status === 'completed'
            ? 'blue'
            : 'gray';

    return (
        <Stack direction={{ base: 'column', md: 'row' }} gap={6}>
            <Box minW="1/3">
                <Text fontWeight="bold" color="fg.muted">
                    Created on
                </Text>
                <Text fontSize="md">{formatDateTime(event.created_at)}</Text>
                <Text fontSize="sm" color="fg.muted">
                    Created {formatRelativeDate(event.created_at)}
                </Text>
            </Box>

            <Box minW="1/3">
                <Text fontWeight="bold" color="fg.muted">
                    Updated on
                </Text>
                <Text fontSize="md" color="fg.info">
                    {formatDateTime(event.updated_at)}
                </Text>
                <Text fontSize="sm" color="fg.muted">
                    Last modified {formatRelativeDate(event.updated_at)}
                </Text>
            </Box>

            <Box minW="1/3">
                <Text fontWeight="bold" color="fg.muted">
                    Status
                </Text>
                <Badge colorPalette={badgeColour} size="lg" fontSize="md" textTransform="capitalize">
                    {event.status}
                </Badge>
            </Box>
        </Stack>
    );
};
