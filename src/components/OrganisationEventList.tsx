import {
    Box,
    Container,
    Link,
    Mark,
    Stack,
    Table,
    Text,
} from '@chakra-ui/react';
import { FaXmark } from 'react-icons/fa6';
import { FcCheckmark } from 'react-icons/fc'
import { getOrganisationEvents, OrganisationEventSummary } from '../api';
import { useEffect, useState } from 'react';
import LoadingSpinner from './LoadingSpinner';
import { formatShortDate, formatShortTime } from '../utils';
import { useNavigate } from 'react-router-dom';
import { useOutletContext } from 'react-router-dom';


interface OutletContextType {
    organisation_id: number | null | undefined;
}

const OrganisationEventList: React.FC = () => {
    const [events, setEvents] = useState<OrganisationEventSummary[]>([]);
    const [isError, setIsError] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const navigate = useNavigate();
    const { organisation_id } = useOutletContext() as OutletContextType;


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
            .catch((err) => {
                setIsError(true);
                setIsLoading(false);
            });
    }, []);

    if (isError) {
        return <p>Failed to load events.</p>;
    }
    if (isLoading) {
        return <LoadingSpinner />;
    }

    const iconType = (property: boolean): React.ReactNode => {
        return property ? <FcCheckmark/> : <FaXmark color='red'/> 
    }
    return (
        <>
        {organisation_id ? (
        <Container p={1}>
            <Box
                pt={14}
                pb={8}
            >
                <Text textStyle="lg">You have <Mark variant='subtle'>{events.length}</Mark> upcoming events</Text>
                
            </Box>
            <Box
                bg="bg"
                borderRadius="md"
                shadow="md"
            >
                <Stack gap="10">
                    <Table.Root size="lg">
                        <Table.Header>
                            <Table.Row
                                bg='gray.subtle'
                            >
                                <Table.ColumnHeader fontWeight="semibold">Title</Table.ColumnHeader>
                                <Table.ColumnHeader fontWeight="semibold">Venue</Table.ColumnHeader>
                                <Table.ColumnHeader fontWeight="semibold">Date</Table.ColumnHeader>
                                <Table.ColumnHeader fontWeight="semibold">Time</Table.ColumnHeader>
                                <Table.ColumnHeader fontWeight="semibold">Recurring</Table.ColumnHeader>
                                <Table.ColumnHeader fontWeight="semibold">Online</Table.ColumnHeader>
                                <Table.ColumnHeader fontWeight="semibold">Status</Table.ColumnHeader>
                                <Table.ColumnHeader fontWeight="semibold" textAlign="end">Actions</Table.ColumnHeader>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {events.map((event) => (
                                <Table.Row key={event.event_id}>
                                    <Table.Cell>{event.title}</Table.Cell>
                                    <Table.Cell>{event.venue}</Table.Cell>
                                    <Table.Cell textAlign="end">
                                    {formatShortDate(event.start_datetime)}
                                    </Table.Cell>
                                    <Table.Cell textAlign="end">
                                    {formatShortTime(event.start_datetime)}
                                    </Table.Cell>
                                    <Table.Cell>{iconType(event.is_recurring)}</Table.Cell>
                                    <Table.Cell>{iconType(event.is_online)}</Table.Cell>
                                    <Table.Cell>{event.status}</Table.Cell>
                                    <Table.Cell>
                                        <Link pr={1}>Update</Link>
                                        <Link pl={1}>Delete</Link>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table.Root>
                </Stack>
            </Box>
        </Container>
        ) : (
            <Text>You are not authorised to view this page. If you are an organiser please log in.</Text>
        )}
        </>
    );
};

export default OrganisationEventList;
