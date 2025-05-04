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
import {
    FaBuilding,
    FaCalendarDays,
    FaLocationDot,
    FaRotate,
} from 'react-icons/fa6';
import { formatDateTime } from '../utils.ts';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowCircleLeft, FaInfoCircle } from 'react-icons/fa';
import LoadingSpinner from './LoadingSpinner.tsx';
import SignupCard from './SignupCard.tsx';

interface RouteParams {
    event_id: string;
}

const IndividualEvent: React.FC = () => {
    const { event_id } = useParams<RouteParams>();
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
            .catch((err) => {
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

    return (
        <>
            <Button
                size="lg"
                ml={4}
                variant="plain"
                onClick={() => {
                    navigate(-1);
                }}
            >
                <FaArrowCircleLeft />
                <Text textDecoration="underline">Back to list</Text>
            </Button>
            <SimpleGrid
                columns={[1, null, 2]}
                gap={8}
            >
                <Box>
                    <Box>
                        <Box>
                            <Image
                                src={event.image_url || placeholderImageUrl}
                                alt="Event Image"
                                borderRadius="md"
                                mb={4}
                            />
                        </Box>
                        <Text>Category name / Subcategory name</Text>
                        <HStack
                            pb={8}
                            pt={1}
                        >
                            {event.tags?.map((tag, index) => (
                                <Tag.Root
                                    key={index}
                                    variant="solid"
                                    size="lg"
                                    colorPalette="green"
                                >
                                    <Tag.Label>{tag}</Tag.Label>
                                </Tag.Root>
                            ))}
                        </HStack>
                        <Box
                            bg="gray.100"
                            borderRadius="md"
                            p={4}
                        >
                            <Text
                                fontSize="xl"
                                fontWeight="bold"
                                mb={2}
                            >
                                {event.title}
                            </Text>
                            <Text>{event.description}</Text>
                        </Box>
                    </Box>
                </Box>

                <Box>
                    <Box
                        bg="gray.100"
                        borderRadius="md"
                        p={4}
                    >
                        <Box mb={2}>
                            <Icon
                                as={FaCalendarDays}
                                marginRight="2"
                            />
                            <Text as="span">
                                {formatDateTime(event.start_datetime)} to {formatDateTime(event.end_datetime)}
                            </Text>
                        </Box>
                        {recurringScheduleExists && (
                            <Box
                                color="blue"
                                mb={8}
                            >
                                <Icon
                                    as={FaRotate}
                                    marginRight="2"
                                />
                                <Text as="span">
                                    {event.recurring_schedule.frequency} on{' '}
                                    {event.recurring_schedule.day}s
                                </Text>
                            </Box>
                        )}
                        <Box mb={2}>
                            <Icon
                                as={FaBuilding}
                                marginRight="2"
                            />
                            <Text as="span">{event.organisation_name}</Text>
                        </Box>
                        <Box mb={2}>
                            <Icon
                                as={FaLocationDot}
                                marginRight="2"
                            />
                            <Text as="span">{event.venue_name}</Text>
                        </Box>
                    </Box>

                    <Box
                        p={8}
                        pl={0}
                    >
                        {event.signup_required ? (
                            <SignupCard
                                event_id={event.event_id}
                                title={event.title}
                            />
                        ) : (
                            <Box color="blue">
                                <Icon
                                    as={FaInfoCircle}
                                    marginRight="2"
                                />
                                <Text as="span">
                                    No signup required - just turn up
                                </Text>
                            </Box>
                        )}
                    </Box>
                </Box>
            </SimpleGrid>
        </>
    );
};

export default IndividualEvent;

/* Button onClick={handleSignupClick} colorPalette="blue">Sign Up</Button */
