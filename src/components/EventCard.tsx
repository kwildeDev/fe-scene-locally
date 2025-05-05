import { Card, Group, Icon, LinkBox, LinkOverlay, Text } from '@chakra-ui/react';
import { Link, NavLink } from 'react-router-dom';
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
        <LinkBox
            as="article"
        >
            <Card.Root maxW="sm">
                <Image src={event.image_url || placeholderImageUrl}></Image>
                <Card.Header>
                    <LinkOverlay asChild>
                        <NavLink
                            to={`/events/${event.event_id}`}
                        >
                        </NavLink>
                    </LinkOverlay>
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
        </LinkBox>
    );
};

export default EventCard;
