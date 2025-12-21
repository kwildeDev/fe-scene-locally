import {
    Box,
    Button,
    HStack,
    Icon,
    SimpleGrid,
    Tag,
    Text,
} from '@chakra-ui/react';
import { Image } from '@chakra-ui/react';
import { EventDetail, getEventById } from '../api.ts';
import { formatDateTime } from '../utils/utils.ts';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaInfoCircle } from 'react-icons/fa';
import LoadingSpinner from './LoadingSpinner.tsx';
import SignupCard from './SignupCard.tsx';
import { Building2, CalendarDays, CalendarSync, CircleArrowLeft, MapPin } from 'lucide-react';

export interface GoogleCalendarEvent {
    eventTitle: string;
    eventDescription: string;
    startTimeUTC: string;
    endTimeUTC: string;
    locationName?: string;
    relevantTimezone: string;
}

const IndividualEvent: React.FC = () => {
    const { event_id } = useParams<{ event_id: string }>();
    const eventIdNumber = Number(event_id);
    const [event, setEvent] = useState<EventDetail>({} as EventDetail);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isError, setIsError] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        getEventById(eventIdNumber)
            .then((fetchedEvent) => {
                setEvent(fetchedEvent);
                setIsLoading(false);
            })
            .catch((_err) => {
                setIsError(true);
                setIsLoading(false);
            });
    }, [eventIdNumber]);

    if (isLoading) {
        return <LoadingSpinner />;
    }
    if (isError) {
        return <Text>Failed to load event.</Text>;
    }

    const placeholderImageUrl: string = 'https://placehold.co/600x400';

    const recurringScheduleExists: boolean =
        event.recurring_schedule === null ? false : true;

    const googleEventProps: GoogleCalendarEvent = {
        eventTitle: event.title,
        eventDescription: event.description,
        startTimeUTC: event.start_datetime,
        endTimeUTC: event.end_datetime,
        locationName: event.venue_name,
        relevantTimezone: 'Europe/London',
    };

    return (
        <article>
            <Button
                size="lg"
                ml={4}
                variant="plain"
                textDecoration="underline"
                onClick={() => {
                    navigate(-1);
                }}
            >
                <CircleArrowLeft />
                <Text>Back to list</Text>
            </Button>
            <SimpleGrid columns={[1, null, 2]} gap={8}>
                <Box>
                    <Box>
                        <Box>
                            <Image
                                src={event.image_url || placeholderImageUrl}
                                alt="Promotional image for event"
                                borderRadius="md"
                                mb={4}
                            />
                        </Box>
                        
                        <HStack pb={8} pt={1}>
                            {event.tags?.map((tag, index) => (
                                <Tag.Root
                                    key={index}
                                    variant="subtle"
                                    size="lg"
                                    colorPalette="green"
                                >
                                    <Tag.Label>{tag}</Tag.Label>
                                </Tag.Root>
                            ))}
                        </HStack>
                        <Box bg="gray.subtle" borderRadius="md" p={4}>
                            <Text as="h2" fontSize="xl" fontWeight="bold" mb={2}>
                                {event.title}
                            </Text>
                            <Text>{event.description}</Text>
                        </Box>
                    </Box>
                </Box>

                <Box>
                    <Box bg="gray.subtle" borderRadius="md" p={4}>
                        <Box mb={2}>
                            <Icon as={CalendarDays} marginRight="2" />
                            <Text as="span">
                                {formatDateTime(event.start_datetime)} to{' '}
                                {formatDateTime(event.end_datetime)}
                            </Text>
                        </Box>
                        {recurringScheduleExists && (
                            <Box color="blue.fg" mb={8}>
                                <Icon as={CalendarSync} marginRight="2" />
                                <Text as="span">
                                    {event.recurring_schedule?.frequency} on{' '}
                                    {event.recurring_schedule?.day}s
                                </Text>
                            </Box>
                        )}
                        <Box mb={2}>
                            <Icon as={Building2} marginRight="2" />
                            <Text as="span">{event.organisation_name}</Text>
                        </Box>
                        <Box mb={2}>
                            <Icon as={MapPin} marginRight="2" />
                            <Text as="span">{event.venue_name}</Text>
                        </Box>
                    </Box>

                    <Box p={8} pl={0}>
                        {event.signup_required ? (
                            <SignupCard
                                event_id={event.event_id}
                                title={event.title}
                                googleEventProps={googleEventProps}
                            />
                        ) : (
                            <Box color="blue.fg">
                                <Icon as={FaInfoCircle} marginRight="2" />
                                <Text as="span">
                                    No signup required - just turn up
                                </Text>
                            </Box>
                        )}
                    </Box>
                </Box>
            </SimpleGrid>
        </article>
    );
};

export default IndividualEvent;
