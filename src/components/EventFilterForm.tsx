import { Box, Center, Stack, Button } from '@chakra-ui/react';
import { useState, useCallback } from 'react';
import Select from 'react-select';
import makeAnimated, { SingleValue } from 'react-select/animated'

interface EventFilterProps {
    filters: Record<string, string>;
    onFilterChange: (key: string, value: string) => void;
    availableTags: string[];
    availableVenues: string[];
    availableOrganisers: string[];
}

const EventFilterForm: React.FC<EventFilterProps> = ({ filters, onFilterChange, availableTags, availableVenues, availableOrganisers}) => {
    const [selectedTags, setSelectedTags] = useState<string[]>(filters.tags ? filters.tags.split(',') : []);
    const [selectedVenue, setSelectedVenue] = useState<string | null>(filters.venue || null);
    const [selectedOrganiser, setSelectedOrganiser] = useState<string | null>(filters.organiser || null);
    const [selectedSortBy, setSelectedSortBy] = useState<string | null>(filters.sort_by || null);
    const [selectedOrder, setSelectedOrder] = useState<string | null>(filters.order || null);
    const [online, setOnline] = useState<boolean>(filters.online === 'true' || false);
    const [recurring, setRecurring] = useState<boolean>(filters.recurring === 'true' || false);

    const animatedComponents = makeAnimated();

    const handleOnlineChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const checked = e.target.checked;
            setOnline(checked);
            onFilterChange('online', checked ? 'true' : '');
        },
        [onFilterChange]
    );
    
    const handleRecurringChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const checked = e.target.checked;
            setRecurring(checked);
            onFilterChange('recurring', checked ? 'true' : '');
        },
        [onFilterChange]
    );

    const handleVenueChange = useCallback(
        (option: { value: string; label: string } | null) => {
            setSelectedVenue(option?.value || null);
            onFilterChange('venue', option?.value || '');
        },
        [onFilterChange]
    );

    const handleOrganiserChange = useCallback(
        (option: { value: string; label: string } | null) => {
            setSelectedOrganiser(option?.value || null);
            onFilterChange('organiser', option?.value || '');
        },
        [onFilterChange]
    );

    const handleTagChange = useCallback(
        (newSelectedOptions: { value: string; label: string }[]) => {
        const newTags = newSelectedOptions.map((option) => option.value);
        setSelectedTags(newTags);
        onFilterChange('tags', newTags.join(','));
        }, 
        [onFilterChange]
    );

    const handleSortByChange = useCallback(
        (option: { value: string, label: string } | null) => {
            setSelectedSortBy(option?.value || null);
            onFilterChange('sort_by', option?.value || '');
        },
        [onFilterChange]
    );

    const handleOrderChange = useCallback(
        (option: { value: string, label: string } | null) => {
            setSelectedOrder(option?.value || null);
            onFilterChange('order', option?.value || '');
        },
        [onFilterChange]
    );

    const clearVenue = useCallback(() => {
        setSelectedVenue(null);
        onFilterChange('venue', '');
        },
        [onFilterChange]
    );

    const clearOrganiser = useCallback(() => {
        setSelectedOrganiser(null);
        onFilterChange('organiser', '');
        },
        [onFilterChange]
    );

    const clearTags = useCallback(() => {
        setSelectedTags([]);
        onFilterChange('tags', '');
        },
        [onFilterChange]
    );

    const resetAllFilters = useCallback(() => {
        setSelectedVenue(null);
        setSelectedOrganiser(null);
        setSelectedTags([]);
        setOnline(false);
        setRecurring(false);
        setSelectedSortBy(null);
        setSelectedOrder(null);
        const resetValues = {
                venue: '',
                organiser: '',
                tags: '',
                online: '',
                recurring: '',
                sort_by: '',
                order: '',
            }    
        onFilterChange('resetAll', JSON.stringify(resetValues));
        },
        [onFilterChange]
    );

    const tagOptions = availableTags.map((tag) => ({ value: tag, label: tag }));
    const venueOptions = availableVenues.map((venue) => ({ value: venue, label: venue }));
    const organiserOptions = availableOrganisers.map((organiser) => ({ value: organiser, label: organiser }));
    const sortByOptions = [
        { value: "start_datetime", label: "Start Date" },
        { value: "created_at", label: "Date Created" },
        { value: "organiser", label: "Organiser" },
        { value: "venue", label: "Venue" }
    ]
    const orderOptions = [
        { value: "asc", label: "Ascending" },
        { value: "desc", label: "Descending" }
    ]

    const customStyles = {
        control: (provided) => ({
            ...provided,
            width: 200,
        }),
        singleValue: (provided) => ({
            ...provided,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
        }),
    };

    return (
        <Box mb={8}>
        <Stack direction={{ base: "column", md: "row" }} gap="4">
            <Center>
                <input
                    type="checkbox"
                    id="online"
                    checked={online}
                    onChange={handleOnlineChange}
                />
                <label htmlFor="online" style={{ marginLeft: '5px' }}>
                    Online
                </label>
            </Center>
            <Center>
                <input
                    type="checkbox"
                    id="recurring"
                    checked={recurring}
                    onChange={handleRecurringChange}
                />
                <label htmlFor="recurring" style={{ marginLeft: '5px' }}>
                    Recurring
                </label>
            </Center>
            <Box>
                <label htmlFor="tags">Tags</label>
                <Select
                    isMulti
                    id="tags"
                    components={animatedComponents}
                    options={tagOptions}
                    value={tagOptions.filter((option) => selectedTags.includes(option.value))}
                    onChange={handleTagChange}
                    placeholder="Select tags..."
                    styles={{
                        ...customStyles,
                        control: (provided) => ({
                          ...customStyles.control(provided),
                          width: 300,
                        }),
                      }}
                    isClearable
                />
            </Box>
            <Box>
                <label htmlFor="venue">Venue</label>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Select
                        id="venue"
                        options={venueOptions}
                        value={venueOptions.find((option) => option.value === selectedVenue)}
                        onChange={handleVenueChange}
                        placeholder="Select venue..."
                        styles={customStyles}
                        isDisabled={online}
                        isClearable
                    />
                </div>
            </Box>
            <Box>
                <label htmlFor="organiser">Organiser</label>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Select
                        id="organiser"
                        options={organiserOptions}
                        value={organiserOptions.find((option) => option.organiser === selectedOrganiser)}
                        onChange={handleOrganiserChange}
                        placeholder="Select organiser..."
                        styles={customStyles}
                        isClearable
                    />
                </div>
            </Box>
            <Box>
                <label htmlFor="sort_by">Sort By</label>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Select
                        id="sort_by"
                        options={sortByOptions}
                        defaultValue={sortByOptions[0]}
                        value={sortByOptions.find((option) => option.value === selectedSortBy)}
                        onChange={handleSortByChange}
                        placeholder="Sort by..."
                        styles={{
                            ...customStyles,
                            control: (provided) => ({
                              ...customStyles.control(provided),
                              width: 195,
                            }),
                          }}
                        isClearable
                    />
                </div>
            </Box>
            <Box>
                <label htmlFor="order">Order</label>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Select
                        id="order"
                        options={orderOptions}
                        defaultValue={orderOptions[0]}
                        value={orderOptions.find((option) => option.value === selectedOrder)}
                        onChange={handleOrderChange}
                        placeholder="Order..."
                        styles={{
                            ...customStyles,
                            control: (provided) => ({
                              ...customStyles.control(provided),
                              width: 140,
                            }),
                          }}
                        isClearable
                    />
                </div>
            </Box>
            <Center>
                <Button
                    colorPalette="blue"
                    variant="solid"
                    rounded="full"
                    onClick={resetAllFilters}   
                >
                    RESET
                </Button>
            </Center>
        </Stack>
        </Box>
    );
};

export default EventFilterForm;