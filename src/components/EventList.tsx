import { useState, useEffect, useMemo } from 'react';
import { getEvents } from '../api.ts';
import { Box, Collapsible, Group, SimpleGrid, Text } from '@chakra-ui/react';
import EventCard from './EventCard.tsx';
import { useSearchParams } from 'react-router-dom';
import EventFilterForm from './EventFilterForm.tsx';
import { useBreakpointValue } from '@chakra-ui/react';
import { FaFilter } from 'react-icons/fa6';
import LoadingSpinner from './LoadingSpinner.tsx';

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
    const [uniqueTags, setUniqueTags] = useState<string[]>([]);
    const [uniqueVenues, setUniqueVenues] = useState<string[]>([]);
    const [uniqueOrganisers, setUniqueOrganisers] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isError, setIsError] = useState<boolean>(false);
    const [searchParams, setSearchParams] = useSearchParams();

    const isCollapsible = useBreakpointValue({ base: true, md: false });

    const filters = useMemo(() => {
        return Object.fromEntries(
            Array.from(searchParams.entries()) 
            .filter(([, value]) => value)
        );
    }, [searchParams]);

    const handleFilterChange = (key: string, value: string) => {
        const updatedParams = new URLSearchParams(searchParams);

        if (key === 'resetAll') {
            const resetValues = JSON.parse(value);
            for (const filterKey in resetValues) {
                updatedParams.delete(filterKey);
            }
            updatedParams.delete('resetAll');
        } else if (value) {
          updatedParams.set(key, value);
        } else {
          updatedParams.delete(key);
        }
        setSearchParams(updatedParams);
      };

    useEffect(() => {
        setIsLoading(true);
        getEvents(filters)
            .then((events) => {
                setEvents(events);
                setIsLoading(false);

                if (events.length > 0) {
                    const allTags: string[] = [];
                    const allVenues: string[] = [];
                    const allOrganisers: string[] = [];
                    events.forEach(event => {
                        if (Array.isArray(event.tags)) {
                            allTags.push(...event.tags);
                        }
                        if (event.venue) {
                            allVenues.push(event.venue);
                        }
                        if (event.organiser) {
                            allOrganisers.push(event.organiser);
                        }
                    })
                    setUniqueTags([...new Set(allTags)]);
                    setUniqueVenues([...new Set(allVenues)]);
                    setUniqueOrganisers([...new Set(allOrganisers)]);
                } else {
                    setUniqueTags([]);
                    setUniqueVenues([]);
                }
            })
            .catch((err) => {
                setIsError(true);
                setIsLoading(false);
            });
    }, [filters]);

    if (isError) {
        return <p>Failed to load events.</p>;
    }
    if (isLoading) {
        return (
            <LoadingSpinner />
        );
    }
    if (events.length === 0) {
        return <Text>No events available.</Text>
    }

    return (
            <>
                {isCollapsible ? (
                    <Collapsible.Root>
                        <Collapsible.Trigger padding={2} borderWidth="1px">
                            <Group>
                            <FaFilter />
                            <Text>Toggle Filters</Text>
                            </Group>
                        </Collapsible.Trigger>
                        <Collapsible.Content>
                            <Box padding="4">
                                <EventFilterForm 
                                    filters={filters} 
                                    onFilterChange={handleFilterChange} 
                                    availableTags={uniqueTags} 
                                    availableVenues={uniqueVenues} 
                                    availableOrganisers={uniqueOrganisers} 
                                />
                            </Box>
                        </Collapsible.Content>
                    </Collapsible.Root>
                ) : (
                    <EventFilterForm
                        filters={filters} 
                        onFilterChange={handleFilterChange} 
                        availableTags={uniqueTags} 
                        availableVenues={uniqueVenues} 
                        availableOrganisers={uniqueOrganisers} 
                    />
                )}
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
