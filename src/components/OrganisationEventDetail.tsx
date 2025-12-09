import { EventDetail, UpdatedEventRequest, updateEvent } from '../api.ts';
import {
    Box,
    Button,
    Card,
    Container,
    Heading,
    HStack,
    Image,
    Separator,
    Stack,
    Text,
} from '@chakra-ui/react';
import { Toaster, toaster } from './ui/toaster.tsx';
import { FaArrowCircleLeft } from 'react-icons/fa';
import '../App.css';

import { useEffect, useState } from 'react';
import { useParams, useNavigate, useOutletContext, useBlocker } from 'react-router-dom';

import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { organisationEventSchema } from '../validation/organisationEventSchema.ts';

import { formatToTimestamp } from '../utils/utils.ts';
import LoadingSpinner from './LoadingSpinner';

import { useEventData } from '../hooks/useEventData';
import { EventFormField } from './EventFormField';
import { DateTimeFields } from './DateTimeFields';
import { OnlineEventFields } from './OnlineEventFields';
import { CategorySubcategoryFields } from './CategorySubcategoryFields';
import { TagsInput } from './TagsInput';
import { RecurringEventFields } from './RecurringEventFields';
import { EventFormHeader } from './EventFormHeader.tsx';

interface OutletContextType {
    organisation_id: number | null | undefined;
}

interface RecurringSchedule {
    frequency?: string | undefined;
    day?: string;
}

type Formfields = z.infer<typeof organisationEventSchema>;

const OrganisationEventDetail: React.FC = () => {
    const { organisation_id } = useOutletContext() as OutletContextType;
    const navigate = useNavigate();
    const { event_id } = useParams<{ event_id: string }>();
    const eventIdNumber = Number(event_id);
    const [savedValues, setSavedValues] = useState<Formfields | null>(null);

    const {
        event,
        venues,
        categories,
        subcategories,
        tags,
        isLoadingEvent,
        isLoadingVenues,
        isLoadingCategories,
        isLoadingTags,
        isLoadingSubcategories,
        eventError,
        venuesError,
        categoriesError,
        tagsError,
        subcategoriesError,
        setEvent,
        setSubcategories,
    } = useEventData(false, organisation_id, eventIdNumber);

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
        formState: { errors, isSubmitting, isDirty, dirtyFields },
    } = useForm<Formfields>({
        resolver: zodResolver(organisationEventSchema),
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
        if (event) {
            const initialValues = {
                title: event.title,
                description: event.description,
                startDate: event.start_datetime
                    ? new Date(event.start_datetime).toISOString().split('T')[0]
                    : '',
                startTime: event.start_datetime
                    ? new Date(event.start_datetime).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false,
                      })
                    : '',
                endDate: event.end_datetime
                    ? new Date(event.end_datetime).toISOString().split('T')[0]
                    : '',
                endTime: event.end_datetime
                    ? new Date(event.end_datetime).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false,
                      })
                    : '',
                venue: event.venue_id,
                isOnline: event.is_online,
                accessLink: event.access_link,
                category: event.category_id,
                subcategory: event.subcategory_id ?? '',
                selectedTags: event.tags ? [...event.tags] : [],
                isRecurring: event.is_recurring,
                recurringFrequency: event.recurring_schedule?.frequency,
                recurringDay: event.recurring_schedule?.day,
                imageUrl: event.image_url,
                signupRequired: event.signup_required,
            };

            setSavedValues(initialValues);
            reset(initialValues);

            setTimeout(() => {
                setValue('subcategory', event.subcategory_id ?? '');
            }, 50);
        }
    }, [event, reset, setValue]);

    useEffect(() => {
        if (isOnline && getValues('venue') !== 11) {
            setValue('venue', 11, { shouldDirty: true }); //Online Event is currently venue_id 11 in dev data
        }
    }, [isOnline, setValue]);

    useEffect(() => {
        if (!isRecurring) {
            setValue('recurringFrequency', undefined, {shouldDirty: true });
            setValue('recurringDay', undefined, {shouldDirty: true });
        }
    }, [isRecurring, setValue]);

    useEffect(() => {
        resetField('startTime');
    }, [startDate, resetField]);

    useEffect(() => {
        resetField('endTime');
    }, [endDate, resetField]);

    useEffect(() => {
        if (!startDate) return;

        const currentStartDate = new Date(startDate);
        const currentEndDate = endDate ? new Date(endDate) : null;

        if (!endDate || (currentEndDate && currentStartDate > currentEndDate)) {
            setValue('endDate', startDate);
        }
    }, [startDate, endDate, setValue]);

    useEffect(() => {
        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            if (isDirty) {
                event.preventDefault();
                event.returnValue = "";
            }
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [isDirty]);

    useEffect(() => {
        if (blocker.state === "blocked") {
            if (window.confirm("You have unsaved changes. Leave anyway?")) {
                blocker.proceed();
            } else {
                blocker.reset();
            }
        }
    }, [blocker]);


    const handleNavigation = (path: string) => {
        if (blocker.state === "blocked") {
            blocker.reset();
            return;
        } 
        navigate(path);
    };

    if (isLoadingEvent) {
        return <LoadingSpinner />;
    }
    if (eventError || !event) {
        return <Text>Failed to load event or event not found.</Text>;
    }

    const isDisabled =
        isSubmitting || ['completed', 'cancelled'].includes(event.status);
    const isPublished = event.status === 'published';

    const onSubmit: SubmitHandler<Formfields> = (data) => {
        const dataToPatch: Partial<UpdatedEventRequest> = {};
        const formFields = getValues();

        const formFieldToApiFieldMap: {
            [key in keyof Formfields]?: keyof UpdatedEventRequest;
        } = {
            title: 'title',
            description: 'description',
            startDate: 'start_datetime',
            startTime: 'start_datetime',
            endDate: 'end_datetime',
            endTime: 'end_datetime',
            venue: 'venue_id',
            isOnline: 'is_online',
            accessLink: 'access_link',
            category: 'category_id',
            subcategory: 'subcategory_id',
            selectedTags: 'tags',
            isRecurring: 'is_recurring',
            recurringFrequency: 'recurring_schedule',
            recurringDay: 'recurring_schedule',
            imageUrl: 'image_url',
            signupRequired: 'signup_required',
        };

        for (const formKey in dirtyFields) {
            if (dirtyFields.hasOwnProperty(formKey)) {
                const apiField =
                    formFieldToApiFieldMap[formKey as keyof Formfields];
                if (
                    !apiField ||
                    [
                        'startDate',
                        'startTime',
                        'endDate',
                        'endTime',
                        'selectedTags',
                        'recurringFrequency',
                        'recurringDay',
                    ].includes(formKey)
                ) {
                    continue;
                }
                const currentFormValue =
                    formFields[formKey as keyof Formfields];
                const originalEventValue = event[apiField as keyof EventDetail];

                if (
                    JSON.stringify(currentFormValue) !==
                    JSON.stringify(originalEventValue)
                ) {
                    dataToPatch[apiField as keyof UpdatedEventRequest] =
                        currentFormValue as any;
                }
            }
        }

        const newStartDatetime = formatToTimestamp(
            data.startDate,
            data.startTime
        );
        if (
            newStartDatetime !== event.start_datetime &&
            newStartDatetime !== null
        ) {
            dataToPatch.start_datetime = newStartDatetime;
        }

        const newEndDatetime = formatToTimestamp(data.endDate, data.endTime);
        if (newEndDatetime !== event.end_datetime && newEndDatetime !== null) {
            dataToPatch.end_datetime = newEndDatetime;
        }

        const currentTags = data.selectedTags || [];
        const originalTags = event.tags || [];
        if (
            JSON.stringify([...currentTags].sort()) !==
            JSON.stringify([...originalTags].sort())
        ) {
            dataToPatch.tags = currentTags.length > 0 ? currentTags : null;
        }

        if (data.isRecurring) {
            const newRecurringSchedule: RecurringSchedule = {
                frequency: data.recurringFrequency || '',
                day: data.recurringDay || '',
            };
            const originalRecurringSchedule = event.recurring_schedule || {};

            if (
                newRecurringSchedule.frequency !==
                    originalRecurringSchedule.frequency ||
                newRecurringSchedule.day !== originalRecurringSchedule.day
            ) {
                dataToPatch.recurring_schedule = newRecurringSchedule;
            }
        } else if (event.is_recurring) {
            dataToPatch.recurring_schedule = null;
        }

        if (Object.keys(dataToPatch).length === 0) {
            console.log('No changes detected. Not sending update request.');
            return;
        }

        const updatePromise = updateEvent(eventIdNumber, dataToPatch);

        toaster.promise(updatePromise, {
            loading: {
                title: 'Updating event...',
                description: 'Please wait while we save your changes.',
            },
            success: {
                title: 'Event updated!',
                description: 'Your changes were saved successfully.',
            },
            error: {
                title: 'Update failed',
                description: 'Something went wrong. Please try again.',
            },
        });

        updatePromise
            .then((updatedEvent) => {
                setEvent({
                    ...updatedEvent,
                    organisation_name: event.organisation_name,
                    venue_name: event.venue_name,
                });
            })
            .catch((error) => {
                console.error('Error updating event:', error);
                setError('root', {
                    message: 'Event could not be updated. Please try again.',
                });
            });
    };

    return (
        <>
            {organisation_id ? (
                <Container p={1}>
                    <Box pt={4} pb={4}>
                        <Heading>Organisation Events</Heading>
                        <Button
                            size="lg"
                            variant="plain"
                            textDecoration="underline"
                            padding={0}
                            onClick={() => {
                                handleNavigation("../events");
                            }}
                        >
                            <FaArrowCircleLeft />
                            <Text>Back to list</Text>
                        </Button>
                    </Box>
                    <Card.Root>
                        <Card.Header bg="gray.subtle">
                            <Card.Title>Event Details</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <Stack id="form-stack" mt={4}>
                                    <EventFormHeader event={event} />
                                    <Separator size="md"></Separator>
                                    <EventFormField
                                        label="Title"
                                        error={errors.title}
                                        htmlFor='title'
                                        focusWarningMessage="This event is already published. Ensure any changes do not confuse attendees."
                                        shouldWarn={isPublished}
                                    >
                                        <input
                                            {...register('title')}
                                            id='title'
                                            type="text"
                                            placeholder="Title"
                                            disabled={isDisabled}
                                        />
                                    </EventFormField>

                                    <EventFormField
                                        label="Description"
                                        error={errors.description}
                                        htmlFor='description'
                                    >
                                        <textarea
                                            {...register('description')}
                                            id='description'
                                            rows={4}
                                            placeholder="Description"
                                            disabled={isDisabled}
                                        />
                                    </EventFormField>

                                    <Separator size="md"></Separator>
                                    <DateTimeFields
                                        register={register}
                                        errors={errors}
                                        isDisabled={isDisabled}
                                        isPublished={isPublished}
                                        resetField={resetField}
                                        startDateValue={startDate}
                                        endDateValue={endDate}
                                        setValue={setValue}
                                    />

                                    <Separator size="md"></Separator>
                                    <OnlineEventFields
                                        register={register}
                                        errors={errors}
                                        isDisabled={isDisabled}
                                        isPublished={isPublished}
                                        isOnlineValue={watch('isOnline')}
                                        setValue={setValue}
                                        getValues={getValues}
                                    />

                                    <EventFormField
                                        label="Venue"
                                        error={errors.venue}
                                        htmlFor='venue'
                                        focusWarningMessage="This event is already published. Changing the venue will require attendee notifications and may affect turnout."
                                        shouldWarn={isPublished}
                                    >
                                        <div>
                                            {venuesError && (
                                                <Text color="fg.error">
                                                    Failed to load venues. Some
                                                    options may be missing.
                                                </Text>
                                            )}
                                            <select
                                                {...register('venue')}
                                                id='venue'
                                                disabled={isOnline || isDisabled}
                                            >
                                                <option value="">
                                                    {isLoadingVenues
                                                        ? 'Loading venues...'
                                                        : 'Select venue'}
                                                </option>
                                                {venues.map((venue) => (
                                                    <option
                                                        key={venue.venue_id}
                                                        value={venue.venue_id}
                                                        disabled={
                                                            venue.venue_id === 11
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
                                        isDisabled={isDisabled}
                                        isPublished={isPublished}
                                        categoriesList={categories}
                                        subcategoriesList={subcategories}
                                        isLoadingCategories={
                                            isLoadingCategories
                                        }
                                        isLoadingSubcategories={
                                            isLoadingSubcategories
                                        }
                                        categoriesError={categoriesError}
                                        subcategoriesError={subcategoriesError}
                                        watch={watch}
                                        setSubcategories={setSubcategories}
                                    />

                                    <Separator size="md"></Separator>
                                    <TagsInput
                                        register={register}
                                        errors={errors}
                                        isDisabled={isDisabled}
                                        isPublished={isPublished}
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
                                        isDisabled={isDisabled}
                                        isPublished={isPublished}
                                        watch={watch}
                                    />

                                    <EventFormField
                                        label="Event Image Link (Optional)"
                                        helperText="Enter a valid link to your event image"
                                        error={errors.imageUrl}
                                        htmlFor='imageUrl'
                                    >
                                        <input
                                            {...register('imageUrl')}
                                            id='imageUrl'
                                            type="text"
                                            placeholder="https://example.com/event-image.jpg"
                                            disabled={isDisabled}
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
                                                alt="Event Image Preview"
                                            />
                                        </Box>
                                    )}

                                    <EventFormField
                                        label="Does this event require sign-up?"
                                        error={errors.signupRequired}
                                        htmlFor='signupRequired'
                                    >
                                        <input
                                            {...register('signupRequired')}
                                            id='signupRequired'
                                            type="checkbox"
                                            disabled={isDisabled || isPublished && !event.signup_required}
                                        />
                                    </EventFormField>

                                    {errors.root && (
                                        <div className="error-message">
                                            {errors.root.message}
                                        </div>
                                    )}
                                    <HStack mt={4}>
                                        <Button
                                            onClick={() =>
                                                savedValues &&
                                                reset(savedValues)
                                            }
                                            disabled={!isDirty}
                                            variant="ghost"
                                        >
                                            Undo Changes
                                        </Button>

                                        <Button
                                            type="submit"
                                            loading={isSubmitting}
                                            disabled={isSubmitting || !isDirty}
                                            bg="blue.fg"
                                        >
                                            Update Event
                                        </Button>
                                    </HStack>
                                    <Toaster />
                                </Stack>
                            </form>
                        </Card.Body>
                    </Card.Root>
                </Container>
            ) : (
                <Text>Organisation ID not available.</Text>
            )}
        </>
    );
};

export default OrganisationEventDetail;
