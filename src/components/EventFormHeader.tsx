import {
    Box,
    Stack,
    Text,
    Badge,
    Dialog,
    Button,
    Portal,
    CloseButton,
} from '@chakra-ui/react';
import { formatDateTime, formatRelativeDate } from '../utils/utils';
import EventAttendees from './EventAttendees';

interface EventHeaderProps {
    event: {
        created_at: string;
        updated_at: string;
        status: string;
        event_id: number;
        title: string;
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
            <Box minW="1/4">
                <Text fontWeight="bold" color="fg.muted">
                    Created on
                </Text>
                <Text fontSize="md">{formatDateTime(event.created_at)}</Text>
                <Text fontSize="sm" color="fg.muted">
                    Created {formatRelativeDate(event.created_at)}
                </Text>
            </Box>

            <Box minW="1/4">
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

            <Box minW="1/4">
                <Text fontWeight="bold" color="fg.muted">
                    Status
                </Text>
                <Badge
                    colorPalette={badgeColour}
                    size="lg"
                    fontSize="md"
                    textTransform="capitalize"
                >
                    {event.status}
                </Badge>
            </Box>

            <Box minW="1/4">
                <Dialog.Root
                    size={{ mdDown: "lg", md: "xl" }}
                    placement="bottom"
                    motionPreset="slide-in-bottom"
                >
                    <Dialog.Trigger asChild>
                        <Button size="sm" bg="teal.fg" disabled={event.status === 'draft'}>
                            View Attendees
                        </Button>
                    </Dialog.Trigger>
                    <Portal>
                        <Dialog.Backdrop />
                        <Dialog.Positioner>
                            <Dialog.Content>
                                <Dialog.Header>
                                    <Dialog.Title>{`Attendees: ${event.title}`}</Dialog.Title>
                                    <Dialog.CloseTrigger asChild>
                                        <CloseButton size="sm" />
                                    </Dialog.CloseTrigger>
                                </Dialog.Header>
                                <Dialog.Body>
                                    <EventAttendees />
                                </Dialog.Body>
                                <Dialog.Footer>
                                    <Dialog.ActionTrigger asChild>
                                        <Button bg="teal.fg">
                                            Close
                                        </Button>
                                    </Dialog.ActionTrigger>
                                </Dialog.Footer>
                            </Dialog.Content>
                        </Dialog.Positioner>
                    </Portal>
                </Dialog.Root>
            </Box>
        </Stack>
    );
};
