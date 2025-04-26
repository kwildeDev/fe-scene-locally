import { useState, useEffect } from 'react';
import { getEvents } from '../api.ts';
import { SimpleGrid, Spinner, Text, VStack } from '@chakra-ui/react';
import EventCard from './EventCard.tsx';
import CategoryList from './CategoryList.tsx';
import SubcategoryList from './SubcategoryList.tsx';

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
    const [isError, setIsError] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        getEvents()
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
        return (
            <VStack colorPalette="teal">
                <Spinner color="colorPalette.600" />
                <Text color="colorPalette.600">Loading...</Text>
            </VStack>
        )
    }

    return (
            <>
                <CategoryList />
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
            </>
    );
};

export default EventList;
