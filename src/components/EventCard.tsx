import { Box, Card, Group, Icon, Text } from '@chakra-ui/react';
import { Image } from '@chakra-ui/react';
import { EventSummary } from '../api.ts';
import { FaCalendarDays, FaLocationDot } from 'react-icons/fa6';
import { formatDateTime } from '../utils.ts';

interface EventCardProps {
    event: EventSummary;
}

const placeholderImageUrl: string = 'https://placehold.co/600x400';

const EventCard: React.FC<EventCardProps> = ({ event }) => {
    return (
        <Card.Root maxW="sm">
            <Image src={event.image_url || placeholderImageUrl}></Image>
            <Card.Header>
                <Card.Title>{event.title}</Card.Title>
            </Card.Header>
            <Card.Body>
                <Group>
                    <Icon as={FaCalendarDays} />
                    <Text>{formatDateTime(event.start_datetime)}</Text>
                </Group>
                <Group>
                    <Icon as={FaLocationDot} />
                    <Text>{event.venue}</Text>
                </Group>
            </Card.Body>
        </Card.Root>
    );
};

export default EventCard;
