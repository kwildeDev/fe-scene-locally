import { useState, useEffect } from 'react';
import { getEvents } from '../api.ts';
import { Container, SimpleGrid } from '@chakra-ui/react';
import EventCard from './EventCard.tsx';

interface EventSummary {
    event_id: number;
    title: string;
    start_datetime: string;
    is_recurring: boolean;
    category_id: number;
    subcategory_id: number;
    tags: string[];
    created_at: string;
    image_url: string;
    is_online: boolean;
    organiser: string;
    venue: string;
}

const EventList: React.FC = () => {
    const [events, setEvents] = useState<EventSummary[]>([]);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        getEvents()
            .then((events) => setEvents(events))
            .catch(() => setIsError(true));
    }, []);

    if (isError) {
        return <p>Failed to load events.</p>;
    }

    return (
        <Container>
            <SimpleGrid
                columns={[1, 2, 3]}
                columnGap="2"
                rowGap="4"
            >
                {events.map((event) => (
                    <EventCard
                        key={event.event_id}
                        event={event}
                    />
                ))}
            </SimpleGrid>
        </Container>
    );
};

export default EventList;
