import {
    Box,
    Button,
    Container,
    DataList,
    Field,
    For,
    Heading,
    Separator,
    Stack,
    Text,
    Wrap,
    WrapItem,
} from '@chakra-ui/react';

import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { CategoryDetail, SubcategoryDetail, VenueDetail } from '../api.ts';
import {
    getCategories,
    getSubcategories,
    getVenues,
    postEvent,
} from '../api.ts';

import { formatToTimestamp } from '../utils.ts';

import '../App.css';
import NewEventConfirmation from './NewEventConfirmation.tsx';

interface OutletContextType {
    organisation_id: number | null | undefined;
}

interface RecurringSchedule {
    frequency: string;
    day: string;
}

interface NewEventData {
    event_id: number;
    organisation_id: number;
    title: string;
    description: string;
    start_datetime: string;
    end_datetime: string;
    venue_id: number;
    category_id: number;
    subcategory_id: number;
    tags: string[] | null;
    is_recurring: boolean;
    recurring_schedule: RecurringSchedule | null;
    created_at: string;
    updated_at: string;
    status: string;
    image_url?: string;
    access_link?: string;
    is_online: boolean;
    signup_required: boolean;
}

interface NewEventConfirmationProps {
    eventDetails: NewEventData;
    venueName?: string;
    categoryName?: string;
    subcategoryName?: string;
}

const capitaliseFirstCharacter = (
    name: string | undefined
): string | undefined => {
    if (!name) {
        return name;
    }
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
};

const eventSchema = z
    .object({
        title: z
            .string()
            .min(3, { message: 'Title is required' })
            .transform(capitaliseFirstCharacter),
        description: z
            .string()
            .min(20, { message: 'Description is required' })
            .transform(capitaliseFirstCharacter),
        startDate: z
            .string()
            .min(1, { message: 'Start date is required' })
            .refine((date) => {
                const inputDate = new Date(date);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return inputDate >= today;
            }, {
                message: 'Start date must be today or in the future',
            }),
        startTime: z.string().min(1, { message: 'Start time is required' }),
        endDate: z
            .string()
            .min(1, { message: 'End date is required' })
            .refine((date) => {
                const inputDate = new Date(date);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return inputDate >= today;
            }, {
                message: 'End date must be today or in the future',
            }),
        endTime: z.string().min(1, { message: 'End time is required' }),
        venue: z.preprocess((value) => {
            if (value === '') return undefined;
            return Number(value);
        }, z.number({ required_error: 'Venue is required' }).int()),
        isOnline: z.boolean(),
        accessLink: z
            .string()
            .trim()
            .optional()
            .refine(
                (value) => !value || z.string().url().safeParse(value).success,
                {
                    message: 'Invalid URL',
                }
            ),
        category: z.preprocess((value) => {
            if (value === '') return undefined;
            return Number(value);
        }, z.number({ required_error: 'Category is required' }).int()),
        subcategory: z.preprocess((value) => {
            if (value === '') return undefined;
            return Number(value);
        }, z.number({ required_error: 'Subcategory is required' }).int()),
        selectedTags: z.array(z.string()).optional(),
        isRecurring: z.boolean(),
        recurringFrequency: z.string().optional(),
        recurringDay: z.string().optional(),
        imageUrl: z
            .string()
            .trim()
            .optional()
            .refine(
                (value) => !value || z.string().url().safeParse(value).success,
                {
                    message: 'Invalid URL',
                }
            ),
        signupRequired: z.boolean(),
    })
    .refine(
        (values) => {
            const startDateTime = new Date(
                `${values.startDate}T${values.startTime}`
            );
            const endDateTime = new Date(`${values.endDate}T${values.endTime}`);
            return endDateTime > startDateTime;
        },
        {
            message: `End time must be after start time`,
        }
    );

type Formfields = z.infer<typeof eventSchema>;

const CreateEventForm: React.FC = () => {
    const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);
    const [NewEventConfirmationProps, setNewEventConfirmationProps] = useState<NewEventData>();

    const { organisation_id } = useOutletContext() as OutletContextType;
    if (!organisation_id) {
        return <Text color="red">Error: Organisation ID not found</Text>;
    }

    const {
        register,
        handleSubmit,
        setError,
        reset,
        resetField,
        watch,
        setValue,
        getValues,
        formState: { errors, isSubmitting },
    } = useForm<Formfields>({
        resolver: zodResolver(eventSchema),
    });

    const [venuesList, setVenuesList] = useState<VenueDetail[]>([]);
    const [categoriesList, setCategoriesList] = useState<CategoryDetail[]>([]);
    const [subcategoriesList, setSubcategoriesList] = useState<
        SubcategoryDetail[]
    >([]);
    const [isLoadingVenues, setIsLoadingVenues] = useState(false);
    const [isLoadingCategories, setIsLoadingCategories] = useState(false);
    const [isLoadingSubcategories, setIsLoadingSubcategories] = useState(false);

    // prettier-ignore
    const tagOptions: string[] = [
        'yoga','fitness','outdoors','parenting','workshop','virtual','volunteer','environment','cleanup','poetry','culture','creative','health','wellness','fair',
        'books','reading','seniors','coding','youth','technology','hiking','nature','football','sports','tournament','gardening','community','baby','sleep',
        'biodiversity','talent','performance','pilates','art','online','movie','social','robots','teens','history','architecture','walk','trivia','games',
    ];

    const selectedTags: string[] = watch('selectedTags', []);

    const handleTagSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedValue = event.target.value;
        if (!selectedValue) return;

        const currentTags = getValues('selectedTags') || [];
        if (!currentTags.includes(selectedValue)) {
            setValue('selectedTags', [...currentTags, selectedValue]);
        }
        event.target.value = '';
    };

    const handleRemoveTag = (tagToRemove: string) => {
        const updatedTags = selectedTags.filter((tag) => tag !== tagToRemove);
        setValue('selectedTags', updatedTags);
    };

    const isOnline = watch('isOnline', false);

    useEffect(() => {
        if (isOnline) {
            setValue('venue', 11); //Online Event is currently venue_id 11
        }
    }, [isOnline, setValue]);

    const isRecurring = watch('isRecurring', false);

    useEffect(() => {
        if (!isRecurring) {
            setValue('recurringFrequency', undefined);
            setValue('recurringDay', undefined);
        }
    });
    const startDate = watch('startDate');
    const endDate = watch('endDate');

    useEffect(() => {
        resetField('startTime');
    }, [startDate]);
    useEffect(() => {
        resetField('endTime');
    }, [endDate]);

    useEffect(() => {
        if (startDate && !endDate) {
            setValue('endDate', startDate);
        }
    }, [startDate, endDate, setValue]);

    useEffect(() => {
        setIsLoadingVenues(true);
        setIsLoadingCategories(true);
        Promise.all([getVenues(), getCategories()])
            .then(([venuesData, categoriesData]) => {
                setVenuesList(venuesData);
                setCategoriesList(categoriesData);
            })
            .catch((err) => {
                console.error('Error fetching initial data:', err);
            })
            .finally(() => {
                setIsLoadingVenues(false);
                setIsLoadingCategories(false);
            });
    }, []);

    const categoryId = watch('category', undefined);
    const venueId = watch('venue', undefined);
    const subcategoryId = watch('subcategory', undefined);

    const selectedCategory = categoriesList.find((c) => c.category_id === Number(categoryId));
    
    const categorySlug = selectedCategory?.slug;

    const selectedVenue = venuesList.find((v) => v.venue_id === Number(venueId));

    const selectedSubcategory = subcategoriesList.find((s) => s.subcategory_id === Number(subcategoryId));

    useEffect(() => {
        if (categoryId) {
            setIsLoadingSubcategories(true);
            getSubcategories(categorySlug)
                .then((subcategoriesData) => {
                    setSubcategoriesList(subcategoriesData);
                    console.log('Fetched Subcategories:', subcategoriesData);
                })
                .catch((err) => {
                    console.error('Error fetching subcategories:', err);
                })
                .finally(() => {
                    setIsLoadingSubcategories(false);
                });
        } else {
            setSubcategoriesList([]);
        }
    }, [categoryId]);

    const onSubmit: SubmitHandler<Formfields> = (data) => {

        const recurringSchedule: RecurringSchedule = {
            frequency: data.recurringFrequency,
            day: data.recurringDay,
        };

        const newEventData: NewEventData = {
            organisation_id: organisation_id,
            title: data.title,
            description: data.description,
            start_datetime: formatToTimestamp(data.startDate, data.startTime),
            end_datetime: formatToTimestamp(data.endDate, data.endTime),
            venue_id: data.venue,
            category_id: data.category,
            subcategory_id: data.subcategory,
            tags: data.selectedTags,
            is_recurring: data.isRecurring,
            recurring_schedule: isRecurring ? recurringSchedule : null,
            status: 'draft',
            image_url: data.imageUrl,
            access_link: data.accessLink,
            is_online: data.isOnline,
            signup_required: data.signupRequired,
        };

        postEvent(newEventData)
            .then((event) => {
                setIsFormSubmitted(true);
                setNewEventConfirmationProps({
                    eventDetails: event,
                    venueName: selectedVenue?.name,
                    categoryName: selectedCategory?.name,
                    subcategoryName: selectedSubcategory?.name,
                });
            })
            .catch((error) => {
                setError('root', {
                    message: 'Event could not be created',
                });
            });
    };

    const handleClose = () => {
        setIsFormSubmitted(false);
        reset();
    };

    return (
        <Container id="event-form-container">
            <Box pt={8} pb={4} id="heading-box">
                <Heading>Add new event</Heading>
            </Box>

            {/* React Hook Form */}
            {!isFormSubmitted && (
                <Box id="event-form">
                    <form onSubmit={handleSubmit(onSubmit)}>
                    <Separator size="md"></Separator>
                        <Stack id="form-stack" mt={4}>
                            <label>Title</label>
                            <input
                                {...register('title')}
                                type="text"
                                placeholder="Title"
                                disabled={isFormSubmitted}
                            />
                            {errors.title && (
                                <div className="error-message">
                                    {errors.title.message}
                                </div>
                            )}

                            <label>Description</label>
                            <textarea
                                {...register('description')}
                                placeholder="Description"
                                disabled={isFormSubmitted}
                            />
                            {errors.description && (
                                <div className="error-message">
                                    {errors.description.message}
                                </div>
                            )}
                            <Separator size="md"></Separator>
                            <Wrap mt={4}>
                                <WrapItem display="block" flex="2">
                                    <label>Start Date</label>
                                    <input
                                        {...register('startDate')}
                                        type="date"
                                        disabled={isFormSubmitted}
                                    />
                                    {errors.startDate && (
                                        <div className="error-message">
                                            {errors.startDate.message}
                                        </div>
                                    )}
                                </WrapItem>
                                <WrapItem display="block" flex="2">
                                    <label>Start Time</label>
                                    <input
                                        {...register('startTime')}
                                        type="time"
                                        disabled={isFormSubmitted}
                                    />
                                    {errors.startTime && (
                                        <div className="error-message">
                                            {errors.startTime.message}
                                        </div>
                                    )}
                                </WrapItem>
                                <WrapItem display="block" flex="2">
                                    <label>End Date</label>
                                    <input
                                        {...register('endDate')}
                                        type="date"
                                        disabled={isFormSubmitted}
                                    />
                                    {errors.endDate && (
                                        <div className="error-message">
                                            {errors.endDate.message}
                                        </div>
                                    )}
                                </WrapItem>
                                <WrapItem display="block" flex="2">
                                    <label>End Time</label>
                                    <input
                                        {...register('endTime')}
                                        type="time"
                                        disabled={isFormSubmitted}
                                    />
                                    {errors.endTime && (
                                        <div className="error-message">
                                            {errors.endTime.message}
                                        </div>
                                    )}
                                </WrapItem>
                            </Wrap>

                            <Separator size="md"></Separator>
                            {/* Online Checkbox and Access Link */}
                            <Wrap align="stretch" mt={4}>
                                <WrapItem
                                    display="block"
                                    flex={{ base: '1 0 auto', sm: '0 0 auto' }}
                                    w={{ base: '100%', sm: 'auto' }}
                                >
                                    <label>Online Event</label>
                                    <input
                                        {...register('isOnline')}
                                        type="checkbox"
                                        disabled={isFormSubmitted}
                                    />
                                    {errors.isOnline && (
                                        <div className="error-message">
                                            {errors.isOnline.message}
                                        </div>
                                    )}
                                </WrapItem>
                                <WrapItem display="block" flex="1">
                                    <label>Access Link</label>
                                    <input
                                        {...register('accessLink')}
                                        type="text"
                                        placeholder="Access link"
                                        disabled={isFormSubmitted}
                                    />
                                    {errors.accessLink && (
                                        <div className="error-message">
                                            {errors.accessLink.message}
                                        </div>
                                    )}
                                </WrapItem>
                            </Wrap>

                            <label>Venue</label>
                            <select
                                {...register('venue')}
                                disabled={isFormSubmitted}
                            >
                                <option value="">
                                    {isLoadingVenues
                                        ? 'Loading venues...'
                                        : 'Select venue'}
                                </option>
                                {venuesList.map((venue) => (
                                    <option
                                        key={venue.venue_id}
                                        value={venue.venue_id}
                                        disabled={venue.venue_id === 11}
                                    >
                                        {venue.name}
                                    </option>
                                ))}
                            </select>
                            {errors.venue && (
                                <div className="error-message">
                                    {errors.venue.message}
                                </div>
                            )}
                            <Separator size="md"></Separator>
                            {/*Category and subcategory selection */}
                            <Wrap mt={4}>
                                <WrapItem display="block" flex="1">
                                    <label>Category</label>
                                    <select
                                        {...register('category')}
                                        disabled={isFormSubmitted}
                                    >
                                        <option value="">
                                            {isLoadingCategories
                                                ? 'Loading categories...'
                                                : 'Select category'}
                                        </option>
                                        {categoriesList.map((category) => (
                                            <option
                                                key={category.category_id}
                                                value={category.category_id}
                                            >
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.category && (
                                        <div className="error-message">
                                            {errors.category.message}
                                        </div>
                                    )}
                                </WrapItem>
                                <WrapItem display="block" flex="1">
                                    <label>Subcategory</label>
                                    <select
                                        {...register('subcategory')}
                                        disabled={isFormSubmitted}
                                    >
                                        <option value="">
                                            {isLoadingSubcategories
                                                ? 'Loading subcategories...'
                                                : 'Select subcategory'}
                                        </option>
                                        {subcategoriesList.length === 0 && (
                                            <option disabled>
                                                No subcategories available
                                            </option>
                                        )}
                                        {subcategoriesList.map(
                                            (subcategory) => (
                                                <option
                                                    key={
                                                        subcategory.subcategory_id
                                                    }
                                                    value={
                                                        subcategory.subcategory_id
                                                    }
                                                >
                                                    {subcategory.name}
                                                </option>
                                            )
                                        )}
                                    </select>
                                    {errors.subcategory && (
                                        <div className="error-message">
                                            {errors.subcategory.message}
                                        </div>
                                    )}
                                </WrapItem>
                            </Wrap>
                            <Separator size="md"></Separator>
                            {/*Tags input */}
                            <Wrap align="stretch" mt={4}>
                                <WrapItem display="block" flex="1">
                                    <label>Select Tag</label>
                                    <select
                                        onChange={handleTagSelect}
                                        disabled={isFormSubmitted}
                                    >
                                        <option value="">Select a tag</option>
                                        {tagOptions.map((tag) => (
                                            <option key={tag} value={tag}>
                                                {tag}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.selectedTags && (
                                        <div className="error-message">
                                            {errors.selectedTags.message}
                                        </div>
                                    )}
                                </WrapItem>
                                <Wrap align="flex-end" flex="2">
                                    {selectedTags.map((tag) => (
                                        <WrapItem key={tag}>
                                            <Box
                                                bg="gray.200"
                                                p={2}
                                                borderRadius="md"
                                                display="flex"
                                                alignItems="center"
                                            >
                                                <Text mr={2}>{tag}</Text>
                                                <Button
                                                    size="xs"
                                                    colorScheme="red"
                                                    variant="ghost"
                                                    onClick={() =>
                                                        handleRemoveTag(tag)
                                                    }
                                                >
                                                    x
                                                </Button>
                                            </Box>
                                        </WrapItem>
                                    ))}
                                </Wrap>
                            </Wrap>
                            <Separator size="md"></Separator>
                            {/*Recurring event checkbox and recurring schedule selction */}
                            <Wrap mt={4}>
                                <WrapItem display="block" flex="1">
                                    <label>Recurring Event</label>
                                    <input
                                        {...register('isRecurring')}
                                        type="checkbox"
                                        disabled={isFormSubmitted}
                                    />
                                    {errors.isRecurring && (
                                        <div className="error-message">
                                            {errors.isRecurring.message}
                                        </div>
                                    )}
                                </WrapItem>
                                <WrapItem display="block" flex="3">
                                    <label>Frequency</label>
                                    <select
                                        {...register('recurringFrequency')}
                                        disabled={
                                            !isRecurring || isFormSubmitted
                                        }
                                    >
                                        <option value="">
                                            Select frequency
                                        </option>
                                        <option value="Weekly">Weekly</option>
                                        <option value="Fortnightly">
                                            Fortnightly
                                        </option>
                                        <option value="Monthly">Monthly</option>
                                    </select>
                                    {errors.recurringFrequency && (
                                        <div className="error-message">
                                            {errors.recurringFrequency.message}
                                        </div>
                                    )}
                                </WrapItem>
                                <WrapItem display="block" flex="3">
                                    <label>Day</label>
                                    <select
                                        {...register('recurringDay')}
                                        disabled={
                                            !isRecurring || isFormSubmitted
                                        }
                                    >
                                        <option value="">Select day</option>
                                        <option value="Monday">Monday</option>
                                        <option value="Tuesday">Tuesday</option>
                                        <option value="Wednesday">
                                            Wednesday
                                        </option>
                                        <option value="Thursday">
                                            Thursday
                                        </option>
                                        <option value="Friday">Friday</option>
                                        <option value="Saturday">
                                            Saturday
                                        </option>
                                        <option value="Sunday">Sunday</option>
                                    </select>
                                    {errors.recurringDay && (
                                        <div className="error-message">
                                            {errors.recurringDay.message}
                                        </div>
                                    )}
                                </WrapItem>
                            </Wrap>
                            <Separator size="md"></Separator>
                            {/*Image URL*/}
                            
                            <label>Image</label>
                            <input
                                {...register('imageUrl')}
                                type="text"
                                placeholder="Image"
                                disabled={isFormSubmitted}
                            />
                            {errors.imageUrl && (
                                <div className="error-message">
                                    {errors.imageUrl.message}
                                </div>
                            )}
                            <label>Is User Sign-up Required?</label>
                            <input
                                {...register('signupRequired')}
                                type="checkbox"
                                disabled={isFormSubmitted}
                            />
                            {errors.signupRequired && (
                                <div className="error-message">
                                    {errors.signupRequired.message}
                                </div>
                            )}

                            <Field.Root alignItems="flex-end" mb={4} mt={4} invalid={!!errors.root}>
                                <Button
                                    disabled={isSubmitting || isFormSubmitted}
                                    type="submit"
                                    maxW="fit-content"
                                    bg="blue.solid"
                                    size="lg"
                                >
                                    {isFormSubmitted
                                        ? 'Submitted'
                                        : isSubmitting
                                        ? 'Saving event...'
                                        : 'Submit'}
                                </Button>
                                <Field.ErrorText>
                                    {errors.root?.message}
                                </Field.ErrorText>
                            </Field.Root>
                        </Stack>
                    </form>
                </Box>
            )}
            {isFormSubmitted && NewEventConfirmationProps && (
                <>
                    <Text color="green" fontWeight="semibold">
                        Event successfully created!
                    </Text>
                    <NewEventConfirmation {...NewEventConfirmationProps} />
                    <Button onClick={handleClose} bg="blue.solid">
                        Close
                    </Button>
               </>
            )}
        </Container>
    );
};

export default CreateEventForm;
