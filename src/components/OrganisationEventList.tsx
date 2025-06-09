import {
    Box,
    Container,
    Mark,
    Stack,
    Table,
    Text,
    Button,
    Dialog,
    Portal,
    Heading,
    Badge,
    VisuallyHidden,
} from '@chakra-ui/react';
import { FaXmark } from 'react-icons/fa6';
import { FcCheckmark } from 'react-icons/fc';
import {
    getOrganisationEvents,
    OrganisationEventSummary,
    updateEvent,
    deleteEvent,
} from '../api';
import { useEffect, useState, useRef, useMemo } from 'react';
import LoadingSpinner from './LoadingSpinner';
import { formatShortDate, formatShortTime } from '../utils/utils';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { Toaster, toaster } from './ui/toaster';

interface OutletContextType {
    organisation_id: number | null | undefined;
}

const OrganisationEventList: React.FC = () => {
    const [events, setEvents] = useState<OrganisationEventSummary[]>([]);
    const [eventIdToDelete, setEventIdToDelete] = useState<number | null>(null);
    const [isError, setIsError] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [selectedStatuses, setSelectedStatuses] = useState<{
        [eventId: number]: string;
    }>({});
    const navigate = useNavigate();
    const { organisation_id } = useOutletContext() as OutletContextType;

    const ref = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (!organisation_id) {
            navigate('/');
            return;
        }
        getOrganisationEvents(organisation_id)
            .then((events) => {
                setEvents(events);
                setIsLoading(false);
            })
            .catch((_err) => {
                setIsError(true);
                setIsLoading(false);
            });
    }, []);

    const upcomingEvents = useMemo(() => {
        return events.filter(event => new Date(event.start_datetime).getTime() >= Date.now() &&
        event.status !== "cancelled");
    }, [events]);

    if (isError) {
        return <p>Failed to load events.</p>;
    }
    if (isLoading) {
        return <LoadingSpinner />;
    }

    const iconType = (property: boolean): React.ReactNode => {
        return property ? <FcCheckmark /> : <FaXmark color="red" />;
    };

    const handleStatusChange = (eventId: number, status: string) => {
        const updatePromise = updateEvent(eventId, { status });

        toaster.promise(updatePromise, {
            loading: {
                title: 'Updating status...',
                description: 'Please wait',
            },
            success: {
                title: 'Status updated!',
                description: `Status changed to ${status}`,
            },
            error: {
                title: 'Failed to update status.',
                description: 'Please try again.',
            },
        });

        updatePromise
            .then(() => {
                setEvents((prevEvents) =>
                    prevEvents.map((event) =>
                        event.event_id === eventId
                            ? { ...event, status }
                            : event
                    )
                );
                setSelectedStatuses((prevStatuses) => ({
                    ...prevStatuses,
                    [eventId]: '',
                }));
            })
            .catch((error) => {
                console.error('Error updating status:', error);
            });
    };

    const handleDeleteClick = (eventId: number) => {
        setEventIdToDelete(eventId);
        setIsOpen(true);
    };

    const confirmDelete = () => {
        if (eventIdToDelete) {
            const deletePromise = deleteEvent(eventIdToDelete);

            toaster.promise(deletePromise, {
                loading: {
                    title: 'Deleting event...',
                    description: 'Please wait',
                },
                success: {
                    title: 'Event deleted!',
                    description: 'The event has been removed.',
                },
                error: {
                    title: 'Failed to delete event.',
                    description: 'Please try again.',
                },
            });

            deletePromise
                .then(() => {
                    setEvents((prevEvents) =>
                        prevEvents.filter(
                            (event) => event.event_id !== eventIdToDelete
                        )
                    );
                    setIsOpen(false);
                })
                .catch((error) => {
                    console.error('Error deleting event:', error);
                })
                .finally(() => {
                    setEventIdToDelete(null);
                });
        }
    };

    return (
        <>
            {organisation_id ? (
                <Container p={1}>
                    <Box pt={4} pb={4}>
                        <Heading>Organisation Events</Heading>
                        <Text textStyle="lg">
                            You have{' '}
                            <Mark variant="subtle">{upcomingEvents.length}</Mark>{' '}
                            upcoming events
                        </Text>
                    </Box>
                    <Text
                        fontSize="sm"
                        color="gray.500"
                        mb={2}
                        display={{ base: 'block', xl: 'none' }}
                    >
                        ← Scroll left to see more →
                    </Text>
                    <Box 
                        overflowX={{ base: "auto", md: "scroll" }} 
                        bg="bg" 
                        borderRadius="md" 
                        shadow="md"
                    >
                        <Stack gap="10">
                            <Table.Root size="md">
                                <Table.Header>
                                    <Table.Row bg="gray.subtle">
                                        <Table.ColumnHeader fontWeight="semibold">
                                            Title
                                        </Table.ColumnHeader>
                                        <Table.ColumnHeader fontWeight="semibold">
                                            Venue
                                        </Table.ColumnHeader>
                                        <Table.ColumnHeader fontWeight="semibold">
                                            Date
                                        </Table.ColumnHeader>
                                        <Table.ColumnHeader fontWeight="semibold">
                                            Time
                                        </Table.ColumnHeader>
                                        <Table.ColumnHeader fontWeight="semibold">
                                            Recurrent
                                        </Table.ColumnHeader>
                                        <Table.ColumnHeader fontWeight="semibold">
                                            Online
                                        </Table.ColumnHeader>
                                        <Table.ColumnHeader fontWeight="semibold">
                                            Status
                                        </Table.ColumnHeader>
                                        <Table.ColumnHeader fontWeight="semibold">
                                            <VisuallyHidden>
                                                Update Status Dropdown Menu
                                            </VisuallyHidden>
                                        </Table.ColumnHeader>
                                        <Table.ColumnHeader fontWeight="semibold">
                                            Actions
                                        </Table.ColumnHeader>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {upcomingEvents.map((event) => {
                                        const badgeColour =
                                            event.status === 'draft'
                                                ? 'gray'
                                                : event.status === 'published'
                                                ? 'orange'
                                                : event.status === 'cancelled'
                                                ? 'purple'
                                                : event.status === 'completed'
                                                ? 'blue'
                                                : 'gray';
                                        return (
                                            <Table.Row key={event.event_id}>
                                                <Table.Cell
                                                    color="blue.fg"
                                                >
                                                    <Link
                                                        to={`${event.event_id}`}
                                                        style={{ textDecoration: 'underline' }}
                                                    >
                                                        {event.title}
                                                    </Link>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    {event.venue}
                                                </Table.Cell>
                                                <Table.Cell textAlign="end">
                                                    {formatShortDate(
                                                        event.start_datetime
                                                    )}
                                                </Table.Cell>
                                                <Table.Cell textAlign="end">
                                                    {formatShortTime(
                                                        event.start_datetime
                                                    )}
                                                </Table.Cell>
                                                <Table.Cell>
                                                    {iconType(
                                                        event.is_recurring
                                                    )}
                                                </Table.Cell>
                                                <Table.Cell>
                                                    {iconType(event.is_online)}
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <Badge
                                                        colorPalette={badgeColour}
                                                        textTransform="capitalize"
                                                    >
                                                        {event.status}
                                                    </Badge>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <select
                                                        aria-label='Update status dropdown menu'
                                                        value={
                                                            selectedStatuses[
                                                                event.event_id
                                                            ] || ''
                                                        }
                                                        onChange={(e) => {
                                                            const newStatus =
                                                                e.currentTarget
                                                                    .value;
                                                            setSelectedStatuses(
                                                                (
                                                                    prevStatuses
                                                                ) => ({
                                                                    ...prevStatuses,
                                                                    [event.event_id]:
                                                                        newStatus,
                                                                })
                                                            );
                                                            handleStatusChange(
                                                                event.event_id,
                                                                newStatus
                                                            );
                                                        }}
                                                        size={0}
                                                        style={{
                                                            color: 'teal',
                                                            borderColor: 'teal',
                                                            font: 'inherit',
                                                            width: 148,
                                                            marginBottom: 7,
                                                        }}
                                                    >
                                                        <option value="">
                                                            Update Status
                                                        </option>
                                                        <option value="published" disabled={event.status === "published" || event.status === "completed"}>
                                                            Published
                                                        </option>
                                                        <option value="cancelled" disabled={event.status !== "published"}>
                                                            Cancelled
                                                        </option>
                                                        <option value="completed" disabled={event.status !== "published"}>
                                                            Completed
                                                        </option>
                                                    </select>
                                                </Table.Cell>
                                                <Table.Cell>
                                                    <Button
                                                        m={0}
                                                        size="sm"
                                                        bg="red.solid"
                                                        disabled={
                                                            event.status !==
                                                            'draft'
                                                        }
                                                        onClick={() =>
                                                            handleDeleteClick(
                                                                event.event_id
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </Button>
                                                </Table.Cell>
                                            </Table.Row>
                                        );
                                    })}
                                </Table.Body>
                            </Table.Root>
                        </Stack>
                    </Box>
                    <Dialog.Root
                        role="alertdialog"
                        open={isOpen}
                        initialFocusEl={() => ref.current}
                    >
                        <Portal>
                            <Dialog.Backdrop>
                                <Dialog.Content>
                                    <Dialog.Header
                                        fontSize="lg"
                                        fontWeight="bold"
                                    >
                                        Delete Event
                                    </Dialog.Header>

                                    <Dialog.Body>
                                        Are you sure you want to delete this
                                        event? This action cannot be undone.
                                    </Dialog.Body>

                                    <Dialog.Footer>
                                        <Button
                                            variant="outline"
                                            ref={ref}
                                            onClick={() => setIsOpen(false)}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            bg="red.solid"
                                            onClick={confirmDelete}
                                            ml={3}
                                        >
                                            Delete
                                        </Button>
                                    </Dialog.Footer>
                                </Dialog.Content>
                            </Dialog.Backdrop>
                        </Portal>
                    </Dialog.Root>
                    <Toaster />
                </Container>
            ) : (
                <Text>
                    You are not authorised to view this page. If you are an
                    organiser please log in.
                </Text>
            )}
        </>
    );
};

export default OrganisationEventList;
