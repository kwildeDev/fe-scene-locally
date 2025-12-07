import { Box, Link, Table, Text } from '@chakra-ui/react';
import { AttendeeListDetail, getEventAttendees } from '../api';
import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
import { formatShortDate, formatShortTime } from '../utils/utils';

interface OutletContextType {
    organisation_id: number | null | undefined;
}

const EventAttendees: React.FC = () => {
    const [attendees, setAttendees] = useState<AttendeeListDetail[]>([]);
    const [isError, setIsError] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const navigate = useNavigate();
    const { event_id } = useParams<{ event_id: string }>();
    const eventIdNumber = Number(event_id);
    const { organisation_id } = useOutletContext() as OutletContextType;

    useEffect(() => {
        if (!organisation_id) {
            navigate('/');
            return;
        }
        getEventAttendees(eventIdNumber)
            .then((attendees) => {
                setAttendees(attendees);
                setIsLoading(false);
            })
            .catch((_err) => {
                setIsError(true);
                setIsLoading(false);
            });
    }, []);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (isError) {
        return <Text color="fg.error">Failed to load attendees.</Text>;
    }

    if (attendees.length === 0) {
        return <Text>No attendees registered for this event.</Text>;
    }

    return (
        <Box
            overflowX={{ base: "auto", md: "scroll" }} 
        >
            <Table.Root size="lg" variant="outline">
                <Table.Caption captionSide="top" fontSize="lg" fontWeight="bold" textAlign="left" marginBottom={2}>
                    Total attendees: {attendees.length.toString()}
                </Table.Caption>
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeader>Name</Table.ColumnHeader>
                        <Table.ColumnHeader>Email</Table.ColumnHeader>
                        <Table.ColumnHeader>Registered User</Table.ColumnHeader>
                        <Table.ColumnHeader>Registration Date</Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {attendees.map((attendee) => (
                        <Table.Row key={attendee.registration_id}>
                            <Table.Cell>{attendee.name}</Table.Cell>
                            <Table.Cell>
                                <Link color='teal.fg' href={`mailto:${attendee.email}`}>
                                    {attendee.email}
                                </Link>
                            </Table.Cell>
                            <Table.Cell>{attendee.is_registered_user === true ? 'Yes' : 'No'}</Table.Cell>
                            <Table.Cell>{formatShortDate(attendee.created_at)} {formatShortTime(attendee.created_at)}</Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
                <Table.Footer></Table.Footer>
            </Table.Root>
        </Box>
    );
};

export default EventAttendees;
