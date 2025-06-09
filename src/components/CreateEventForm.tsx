import { NewEventData, postEvent } from '../api.ts';
import { NewEventRequest } from '../api.ts';
import {
    Box,
    Button,
    Card,
    Container,
    Heading,
    Image,
    Separator,
    Stack,
    Text,
} from '@chakra-ui/react';
import { Toaster, toaster } from './ui/toaster.tsx';
import '../App.css';

import { useEffect, useState } from 'react';

import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { organisationEventSchema } from '../validation/organisationEventSchema.ts';

import { useBlocker, useNavigate, useOutletContext } from 'react-router-dom';

import { formatToTimestamp } from '../utils/utils.ts';

import NewEventConfirmation from './NewEventConfirmation.tsx';
import { FaArrowCircleLeft } from 'react-icons/fa';
import { EventFormField } from './EventFormField.tsx';
import { DateTimeFields } from './DateTimeFields.tsx';
import { OnlineEventFields } from './OnlineEventFields.tsx';
import { useEventData } from '../hooks/useEventData';
import { CategorySubcategoryFields } from './CategorySubcategoryFields.tsx';
import { TagsInput } from './TagsInput.tsx';
import { RecurringEventFields } from './RecurringEventFields.tsx';

interface OutletContextType {
    organisation_id: number | null | undefined;
}

interface RecurringSchedule {
    frequency?: string | undefined;
    day?: string;
}

type Formfields = z.infer<typeof organisationEventSchema>;

const CreateEventForm: React.FC = () => {
    const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);
    const [newEventConfirmationProps, setNewEventConfirmationProps] =
        useState<NewEventData>();

    const [newEventId, setNewEventId] = useState<number | null>(null);
    
    const { organisation_id } = useOutletContext() as OutletContextType;
    if (!organisation_id) {
        return <Text color="red">Error: Organisation ID not found</Text>;
    }

    const {
        venues,
        categories,
        subcategories,
        tags,
        isLoadingVenues,
        isLoadingCategories,
        isLoadingTags,
        isLoadingSubcategories,
        venuesError,
        categoriesError,
        tagsError,
        subcategoriesError,
        setSubcategories,
    } = useEventData(true, organisation_id, undefined);

    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        setError,
        reset,
        resetField,
        watch,
        setValue,
        getValues,
        trigger,
        formState: { errors, isSubmitting, isDirty },
    } = useForm<Formfields>({
        resolver: zodResolver(organisationEventSchema as z.ZodType<Formfields>),
        defaultValues: {
            title: '',
            description: '',
            startDate: '',
            startTime: '',
            endDate: '',
            endTime: '',
            isOnline: false,
            accessLink: '',
            venue: undefined,
            category: undefined,
            subcategory: undefined,
            selectedTags: [],
            isRecurring: false,
            recurringFrequency: undefined,
            recurringDay: undefined,
            imageUrl: '',
            signupRequired: false,
        },
    });

    const isOnline = watch('isOnline', false);
    const isRecurring = watch('isRecurring', false);
    const startDate = watch('startDate');
    const endDate = watch('endDate');
    const selectedTags: string[] = watch('selectedTags') || [];
    const watchedImageUrl = watch('imageUrl');
    const shouldBlock = () => isDirty;
    const blocker = useBlocker(shouldBlock);

    useEffect(() => {
        reset(getValues());
    }, []);

    useEffect(() => {
        if (isOnline) {
            setValue('venue', 11, { shouldDirty: false }); //Online Event is currently venue_id 11 in dev data
        }
    }, [isOnline, setValue]);

    useEffect(() => {
        if (!isRecurring) {
            setValue('recurringFrequency', undefined, { shouldDirty: false });
            setValue('recurringDay', undefined, { shouldDirty: false });
        }
    }, [isRecurring, setValue]);

    useEffect(() => {
        resetField('startTime');
    }, [startDate]);

    useEffect(() => {
        resetField('endTime');
    }, [endDate]);

    useEffect(() => {
        if (startDate && !endDate) {
            setValue('endDate', startDate, { shouldDirty: false });
        }
    }, [startDate, endDate, setValue]);

    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            if (isDirty) {
                event.preventDefault();
                event.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () =>
            window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isDirty]);

    useEffect(() => {
        if (blocker.state === 'blocked') {
            if (window.confirm('You have unsaved changes. Leave anyway?')) {
                blocker.proceed();
            } else {
                blocker.reset();
            }
        }
    }, [blocker]);

    const handleNavigation = (path: string) => {
        if (blocker.state === 'blocked') {
            blocker.reset();
            return;
        }
            navigate(path);
    };

    const onSubmit: SubmitHandler<Formfields> = (data) => {
        const recurringSchedule: RecurringSchedule = {
            frequency: data.recurringFrequency || '',
            day: data.recurringDay || '',
        };

        const newEventData: NewEventRequest = {
            organisation_id: organisation_id,
            title: data.title,
            description: data.description || '',
            start_datetime:
                formatToTimestamp(data.startDate, data.startTime) || '',
            end_datetime: formatToTimestamp(data.endDate, data.endTime) || '',
            venue_id: data.venue!,
            category_id: data.category!,
            subcategory_id: data.subcategory!,
            tags: data.selectedTags ?? null,
            is_recurring: data.isRecurring,
            recurring_schedule: isRecurring ? recurringSchedule : null,
            status: 'draft',
            image_url: data.imageUrl,
            access_link: data.accessLink,
            is_online: data.isOnline,
            signup_required: data.signupRequired,
        };

        const selectedVenue = venues.find(
            (venue) => venue.venue_id === data.venue
        );
        const selectedCategory = categories.find(
            (category) => category.category_id === data.category
        );
        const selectedSubcategory = subcategories.find(
            (subcategory) => subcategory.subcategory_id === data.subcategory
        );

        const postPromise = postEvent(newEventData);

        toaster.promise(postPromise, {
            loading: {
                title: 'Creating event...',
                description: 'Please wait while we save your new event.',
            },
            success: {
                title: 'Event created!',
                description: 'Your new event was saved successfully.',
            },
            error: {
                title: 'Event creation failed',
                description: 'Something went wrong. Please try again.',
            },
        });

        postPromise
            .then((event) => {
                setIsFormSubmitted(true);
                reset();
                console.log(
                    selectedVenue?.name,
                    selectedCategory?.name,
                    selectedSubcategory?.name
                );
                setNewEventConfirmationProps({
                    ...event,
                    venueName: selectedVenue?.name,
                    categoryName: selectedCategory?.name,
                    subcategoryName: selectedSubcategory?.name,
                });
                setNewEventId(event.event_id);
            })
            .catch((_error) => {
                setError('root', {
                    message: 'Event could not be created',
                });
            });
    };

    const handleNewClick = () => {
        setIsFormSubmitted(false);
        reset();
    };

    const handleEditClick = () => {
        setIsFormSubmitted(false);
        reset();
        if (newEventId !== null) {
            navigate(`../events/${newEventId}`);
        }
    };

    return (
        <>
            {organisation_id ? (
                <Container p={1} id="event-form-container">
                    <Box pt={4} pb={4} id="heading-box">
                        <Heading>Organisation Events</Heading>
                        <Button
                            size="lg"
                            variant="plain"
                            padding={0}
                            onClick={() => {
                                handleNavigation('../events');
                            }}
                        >
                            <FaArrowCircleLeft />
                            {isFormSubmitted ? (
                                <Text textDecoration="underline">
                                    Back to list
                                </Text>
                            ) : (
                                <Text textDecoration="underline">
                                    Cancel and go back
                                </Text>
                            )}
                        </Button>
                    </Box>

                    {!isFormSubmitted && (
                        <Card.Root id="event-form">
                            <Card.Header bg="gray.100">
                                <Card.Title>Add New Event</Card.Title>
                            </Card.Header>
                            <Card.Body>
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <Stack id="form-stack" mt={4}>
                                        <EventFormField
                                            label="Title"
                                            error={errors.title}
                                        >
                                            <input
                                                {...register('title')}
                                                type="text"
                                                placeholder="Title"
                                                disabled={isFormSubmitted}
                                            />
                                        </EventFormField>
                                        <EventFormField
                                            label="Description"
                                            error={errors.description}
                                        >
                                            <textarea
                                                {...register('description')}
                                                placeholder="Description"
                                                disabled={isFormSubmitted}
                                            />
                                        </EventFormField>
                                        <Separator size="md"></Separator>

                                        <DateTimeFields
                                            register={register}
                                            errors={errors}
                                            isDisabled={isFormSubmitted}
                                            isPublished={false}
                                            resetField={resetField}
                                            startDateValue={startDate}
                                            endDateValue={endDate}
                                            setValue={setValue}
                                        />

                                        <Separator size="md"></Separator>
                                        <OnlineEventFields
                                            register={register}
                                            errors={errors}
                                            isDisabled={isFormSubmitted}
                                            isPublished={false}
                                            isOnlineValue={watch('isOnline')}
                                            setValue={setValue}
                                            getValues={getValues}
                                        />

                                        <EventFormField
                                            label="Venue"
                                            error={errors.venue}
                                        >
                                            <div>
                                                {venuesError && (
                                                    <Text color="red.500">
                                                        Failed to load venues.
                                                        Some options may be
                                                        missing.
                                                    </Text>
                                                )}
                                                <select
                                                    {...register('venue')}
                                                    disabled={
                                                        isOnline ||
                                                        isFormSubmitted
                                                    }
                                                >
                                                    <option value="">
                                                        {isLoadingVenues
                                                            ? 'Loading venues...'
                                                            : 'Select venue'}
                                                    </option>
                                                    {venues.map((venue) => (
                                                        <option
                                                            key={venue.venue_id}
                                                            value={
                                                                venue.venue_id
                                                            }
                                                            disabled={
                                                                venue.venue_id ===
                                                                11
                                                            }
                                                        >
                                                            {venue.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </EventFormField>

                                        <Separator size="md"></Separator>
                                        <CategorySubcategoryFields
                                            register={register}
                                            errors={errors}
                                            isDisabled={isFormSubmitted}
                                            isPublished={false}
                                            categoriesList={categories}
                                            subcategoriesList={subcategories}
                                            isLoadingCategories={
                                                isLoadingCategories
                                            }
                                            isLoadingSubcategories={
                                                isLoadingSubcategories
                                            }
                                            categoriesError={categoriesError}
                                            subcategoriesError={
                                                subcategoriesError
                                            }
                                            watch={watch}
                                            setSubcategories={setSubcategories}
                                        />

                                        <Separator size="md"></Separator>
                                        <TagsInput
                                            register={register}
                                            errors={errors}
                                            isDisabled={isFormSubmitted}
                                            isPublished={false}
                                            tagsList={tags}
                                            selectedTags={selectedTags}
                                            isLoadingTags={isLoadingTags}
                                            tagsError={tagsError}
                                            setValue={setValue}
                                            getValues={getValues}
                                            trigger={trigger}
                                        />

                                        <Separator size="md"></Separator>
                                        <RecurringEventFields
                                            register={register}
                                            errors={errors}
                                            isDisabled={isFormSubmitted}
                                            isPublished={false}
                                            watch={watch}
                                        />

                                        <EventFormField
                                            label="Event Image Link (Optional)"
                                            helperText="Enter a valid link to your event image"
                                            error={errors.imageUrl}
                                        >
                                            <input
                                                {...register('imageUrl')}
                                                type="text"
                                                placeholder="https://example.com/event-image.jpg"
                                                disabled={isFormSubmitted}
                                            />
                                        </EventFormField>
                                        {watchedImageUrl && (
                                            <Box>
                                                <Image
                                                    align="left"
                                                    rounded="md"
                                                    src={watchedImageUrl}
                                                    h={240}
                                                    fit="contain"
                                                    alt="Event Image"
                                                />
                                            </Box>
                                        )}

                                        <EventFormField
                                            label="Does this event require sign-up?"
                                            error={errors.signupRequired}
                                        >
                                            <input
                                                {...register('signupRequired')}
                                                type="checkbox"
                                                disabled={isFormSubmitted}
                                            />
                                        </EventFormField>

                                        {errors.root && (
                                            <div className="error-message">
                                                {errors.root.message}
                                            </div>
                                        )}
                                        <Button
                                            disabled={
                                                !isDirty ||
                                                isSubmitting ||
                                                isFormSubmitted
                                            }
                                            type="submit"
                                            colorPalette="blue"
                                        >
                                            {isFormSubmitted
                                                ? 'Submitted'
                                                : isSubmitting
                                                ? 'Saving event...'
                                                : 'Submit'}
                                        </Button>
                                    </Stack>
                                </form>
                            </Card.Body>
                        </Card.Root>
                    )}
                    {isFormSubmitted && newEventConfirmationProps && (
                        <>
                            <Card.Root>
                                <Card.Header bg="gray.100">
                                    <Card.Title>Draft Event Preview</Card.Title>
                                </Card.Header>
                                <Card.Body>
                                    <NewEventConfirmation
                                        eventDetails={newEventConfirmationProps}
                                    />
                                </Card.Body>
                                <Card.Footer justifyContent="space-between">
                                    <Button
                                        onClick={handleEditClick}
                                    >
                                        Edit Event
                                    </Button>
                                    <Button
                                        onClick={handleNewClick}
                                        bg="blue.solid"
                                    >
                                        Add New Event
                                    </Button>
                                </Card.Footer>
                            </Card.Root>
                        </>
                    )}
                    <Toaster />
                </Container>
            ) : (
                <Text>Organisation ID is not available.</Text>
            )}
        </>
    );
};

export default CreateEventForm;
