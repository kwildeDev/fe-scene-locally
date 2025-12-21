import {
    Card,
    Group,
    Icon,
    LinkBox,
    LinkOverlay,
    Text,
    VisuallyHidden,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { Image } from '@chakra-ui/react';
import { EventSummary } from '../api.ts';
import { formatDateTime } from '../utils/utils.ts';
import { CalendarDays, MapPin } from 'lucide-react';

interface EventCardProps {
    event: EventSummary;
}

const placeholderImageUrl: string = 'https://placehold.co/600x400';

const EventCard: React.FC<EventCardProps> = ({ event }) => {
    return (
        <LinkBox maxW="md" as="article">
            <Card.Root>
                <Image
                    alt={`Promotional image for ${event.title}`}
                    src={event.image_url || placeholderImageUrl}
                ></Image>
                <Card.Header>
                    <LinkOverlay asChild>
                        <RouterLink to={`/events/${event.event_id}`}>
                            <VisuallyHidden>{event.title}</VisuallyHidden>
                        </RouterLink>
                    </LinkOverlay>
                    <Card.Title>{event.title}</Card.Title>
                </Card.Header>
                <Card.Body>
                    <Group>
                        <Icon as={CalendarDays} />
                        <Text>{formatDateTime(event.start_datetime)}</Text>
                    </Group>
                    <Group>
                        <Icon as={MapPin} />
                        <Text>{event.venue}</Text>
                    </Group>
                </Card.Body>
            </Card.Root>
        </LinkBox>
    );
};

export default EventCard;
