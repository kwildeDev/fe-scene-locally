import {
    Box,
    Button,
    Text,
    Field,
    Checkbox,
    Flex,
} from '@chakra-ui/react';
import React, { useState, useCallback } from 'react';
import { MdFilterAltOff } from 'react-icons/md';
import Select, { MultiValue, CSSObjectWithLabel } from 'react-select';
import makeAnimated from 'react-select/animated';

interface EventFilterProps {
    filters: Record<string, string>;
    onFilterChange: (key: string, value: string) => void;
    availableTags: string[];
    availableVenues: string[];
    availableOrganisers: string[];
}

const EventFilterForm: React.FC<EventFilterProps> = ({
    filters,
    onFilterChange,
    availableTags,
    availableVenues,
    availableOrganisers,
}) => {
    const [selectedTags, setSelectedTags] = useState<string[]>(
        filters.tags ? filters.tags.split(',') : []
    );
    const [selectedVenue, setSelectedVenue] = useState<string | null>(
        filters.venue || null
    );
    const [selectedOrganiser, setSelectedOrganiser] = useState<string | null>(
        filters.organiser || null
    );
    const [selectedSortBy, setSelectedSortBy] = useState<string | null>(
        filters.sort_by || null
    );
    const [selectedOrder, setSelectedOrder] = useState<string | null>(
        filters.order || null
    );
    const [online, setOnline] = useState<boolean>(
        filters.online === 'true' || false
    );
    const [recurring, setRecurring] = useState<boolean>(
        filters.recurring === 'true' || false
    );

    const animatedComponents = makeAnimated();

    const handleOnlineChange = useCallback(
        (details: { checked: boolean | string }) => {
            const checked =
                typeof details.checked === 'boolean'
                    ? details.checked
                    : details.checked === 'true';
            setOnline(checked);
            onFilterChange('online', checked ? 'true' : '');
        },
        [onFilterChange]
    );

    const handleRecurringChange = useCallback(
        (details: { checked: boolean | string }) => {
            const checked =
                typeof details.checked === 'boolean'
                    ? details.checked
                    : details.checked === 'true';
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
        (newSelectedOptions: MultiValue<{ value: string; label: string }>) => {
            const newTags: string[] = newSelectedOptions.map(
                (option: { value: string; label: string }) => option.value
            );
            setSelectedTags(newTags);
            onFilterChange('tags', newTags.join(','));
        },
        [onFilterChange]
    );

    const handleSortByChange = useCallback(
        (option: { value: string; label: string } | null) => {
            setSelectedSortBy(option?.value || null);
            onFilterChange('sort_by', option?.value || '');
        },
        [onFilterChange]
    );

    const handleOrderChange = useCallback(
        (option: { value: string; label: string } | null) => {
            setSelectedOrder(option?.value || null);
            onFilterChange('order', option?.value || '');
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
        };
        onFilterChange('resetAll', JSON.stringify(resetValues));
    }, [onFilterChange]);

    const tagOptions = availableTags.map((tag) => ({ value: tag, label: tag }));
    const venueOptions = availableVenues.map((venue) => ({
        value: venue,
        label: venue,
    }));
    const organiserOptions = availableOrganisers.map((organiser) => ({
        value: organiser,
        label: organiser,
    }));
    const sortByOptions = [
        { value: 'start_datetime', label: 'Start Date' },
        { value: 'created_at', label: 'Date Created' },
        { value: 'organiser', label: 'Organiser' },
        { value: 'venue', label: 'Venue' },
    ];
    const orderOptions = [
        { value: 'asc', label: 'Ascending' },
        { value: 'desc', label: 'Descending' },
    ];

    const customStyles = {
        control: (provided: CSSObjectWithLabel) => ({
            ...provided,
            width: 200,
            borderColor: "#27272a",
        }),
        singleValue: (provided: CSSObjectWithLabel) => ({
            ...provided,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
        }),
        placeholder: (provided: CSSObjectWithLabel) => ({
            ...provided,
            color: '#27272a'
        }),
        option: (provided: CSSObjectWithLabel) => ({
            ...provided,
            color: 'black'
        })
        
    };

    return (
        <form>
            <Text hideBelow="md" as="legend" mb={4} fontWeight="semibold">Filters</Text>
            <Flex wrap="wrap" gap={4} mb={8}>
                <Button
                    size="sm"
                    variant="surface"
                    borderColor="gray.600"
                    rounded="md"
                    onClick={resetAllFilters}
                    width={{ base: "100%", md: "auto" }}
                >
                    <MdFilterAltOff />
                    <Text>RESET</Text>
                </Button>
                <Box flex={1} display="flex" flexDirection="column" gap={2} justifyContent="space-evenly">
                <Checkbox.Root
                    id="online"
                    checked={online}
                    onCheckedChange={handleOnlineChange}
                >
                    <Checkbox.HiddenInput />
                    <Checkbox.Control 
                        borderColor="border.inverted"
                    />
                    <Checkbox.Label ml={2}
                        color="gray.fg">
                        Online
                    </Checkbox.Label>
                </Checkbox.Root>

                <Checkbox.Root
                    id="recurring"
                    checked={recurring}
                    onCheckedChange={handleRecurringChange}
                >
                    <Checkbox.HiddenInput />
                    <Checkbox.Control 
                        borderColor="border.inverted"
                    />
                    <Checkbox.Label ml={2}
                        color="gray.fg">
                        Recurring
                    </Checkbox.Label>
                </Checkbox.Root>
                </Box>

                <Field.Root flex={1} minW="fit-content">
                    <Field.Label color="gray.fg" mt={0.5} htmlFor="tags">Tags</Field.Label>
                    <Select
                        inputId="tags"
                        isMulti
                        components={animatedComponents}
                        options={tagOptions}
                        value={tagOptions.filter((option) =>
                            selectedTags.includes(option.value)
                        )}
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
                </Field.Root>

                <Field.Root flex={1} minW="fit-content">
                    <Field.Label color="gray.fg" mt={0.5} htmlFor="venue">Venue</Field.Label>
                    <Select
                        inputId="venue"
                        options={venueOptions}
                        value={venueOptions.find(
                            (option) => option.value === selectedVenue
                        )}
                        onChange={handleVenueChange}
                        placeholder="Select venue..."
                        styles={customStyles}
                        isDisabled={online}
                        isClearable
                    />
                </Field.Root>

                <Field.Root flex={1} minW="fit-content">
                    <Field.Label color="gray.fg" mt={0.5} htmlFor="organiser">Organiser</Field.Label>
                    <Select
                        inputId="organiser"
                        options={organiserOptions}
                        value={organiserOptions.find(
                            (option) => option.value === selectedOrganiser
                        )}
                        onChange={handleOrganiserChange}
                        placeholder="Select organiser..."
                        styles={customStyles}
                        isClearable
                    />
                </Field.Root>

                <Field.Root flex={1} minW="fit-content">
                    <Field.Label color="gray.fg" mt={0.5} htmlFor="sort_by">Sort By</Field.Label>
                    <Select
                        inputId="sort_by"
                        options={sortByOptions}
                        defaultValue={sortByOptions[0]}
                        value={sortByOptions.find(
                            (option) => option.value === selectedSortBy
                        )}
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
                </Field.Root>

                <Field.Root flex={1} minW="fit-content">
                    <Field.Label color="gray.fg" mt={0.5} htmlFor="order">Order</Field.Label>
                    <Select
                        inputId="order"
                        options={orderOptions}
                        defaultValue={orderOptions[0]}
                        value={orderOptions.find(
                            (option) => option.value === selectedOrder
                        )}
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
                </Field.Root>
            </Flex>
        </form>
    );
};

export default React.memo(EventFilterForm);
