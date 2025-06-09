import { Box, DataList, Image, Link } from '@chakra-ui/react';
import { NewEventData } from '../api';
import { formatDateTime } from '../utils/utils';

interface NewEventConfirmationProps {
    eventDetails: NewEventData;
}

const NewEventConfirmation: React.FC<NewEventConfirmationProps> = ({
    eventDetails,
}) => {
    const formattedSchedule: string = eventDetails.is_recurring
        ? `${eventDetails.recurring_schedule?.frequency} on ${eventDetails.recurring_schedule?.day}s`
        : '';
    const booleanLookup: (arg0: boolean) => string = (boolean) =>
        boolean ? 'Yes' : 'No';

    return (
        <>
            <DataList.Root
                orientation="horizontal"
                size="md"
                variant="subtle"
                key="subtle"
                divideY="1px"
            >
                <DataList.Item>
                    <DataList.ItemLabel>Title</DataList.ItemLabel>
                    <DataList.ItemValue>
                        {eventDetails.title}
                    </DataList.ItemValue>
                </DataList.Item>
                <DataList.Item>
                    <DataList.ItemLabel>Description</DataList.ItemLabel>
                    <DataList.ItemValue>
                        {eventDetails.description}
                    </DataList.ItemValue>
                </DataList.Item>
                <DataList.Item>
                    <DataList.ItemLabel>Start Date and Time</DataList.ItemLabel>
                    <DataList.ItemValue>
                        {formatDateTime(eventDetails.start_datetime)}
                    </DataList.ItemValue>
                </DataList.Item>
                <DataList.Item>
                    <DataList.ItemLabel>End Date and Time</DataList.ItemLabel>
                    <DataList.ItemValue>
                        {formatDateTime(eventDetails.end_datetime)}
                    </DataList.ItemValue>
                </DataList.Item>
                <DataList.Item>
                    <DataList.ItemLabel>Venue</DataList.ItemLabel>
                    <DataList.ItemValue>
                        Venue #{eventDetails.venue_id} :{' '}
                        {eventDetails.venueName}
                    </DataList.ItemValue>
                </DataList.Item>
                <DataList.Item>
                    <DataList.ItemLabel>Category ID</DataList.ItemLabel>
                    <DataList.ItemValue>
                        Category #{eventDetails.category_id} :{' '}
                        {eventDetails.categoryName}
                    </DataList.ItemValue>

                    <DataList.ItemLabel>Subcategory ID</DataList.ItemLabel>
                    <DataList.ItemValue>
                        Subcategory #{eventDetails.subcategory_id} :{' '}
                        {eventDetails.subcategoryName}
                    </DataList.ItemValue>
                </DataList.Item>
                <DataList.Item>
                    <DataList.ItemLabel>Tags</DataList.ItemLabel>
                    <DataList.ItemValue>
                        {eventDetails.tags?.join(', ')}
                    </DataList.ItemValue>
                </DataList.Item>
                <DataList.Item>
                    <DataList.ItemLabel>Recurring Event</DataList.ItemLabel>
                    <DataList.ItemValue>
                        {booleanLookup(eventDetails.is_recurring)}
                    </DataList.ItemValue>

                    <DataList.ItemLabel>Frequency and Day</DataList.ItemLabel>
                    <DataList.ItemValue>{formattedSchedule}</DataList.ItemValue>
                </DataList.Item>
                <DataList.Item>
                    <DataList.ItemLabel>Image URL</DataList.ItemLabel>
                    <DataList.ItemValue>
                        <Link
                            variant="underline"
                            color="blue"
                            target="_blank"
                            href={eventDetails.image_url}
                        >
                            {eventDetails.image_url}
                        </Link>
                    </DataList.ItemValue>
                </DataList.Item>
                {eventDetails.image_url && (
                    <DataList.Item>
                        <DataList.ItemLabel mt={3} alignSelf="start">
                            Thumbnail
                        </DataList.ItemLabel>
                        <DataList.ItemValue>
                            <Box>
                                <Image
                                    mt={4}
                                    src={eventDetails.image_url}
                                    h={120}
                                    alt="Event Image"
                                />
                            </Box>
                        </DataList.ItemValue>
                    </DataList.Item>
                )}
                <DataList.Item>
                    <DataList.ItemLabel>Online Event</DataList.ItemLabel>
                    <DataList.ItemValue>
                        {booleanLookup(eventDetails.is_online)}
                    </DataList.ItemValue>
                    <DataList.ItemLabel>Online Access Link</DataList.ItemLabel>
                    <DataList.ItemValue>
                        {eventDetails.access_link}
                    </DataList.ItemValue>
                </DataList.Item>
                <DataList.Item>
                    <DataList.ItemLabel>Sign-up Required</DataList.ItemLabel>
                    <DataList.ItemValue>
                        {booleanLookup(eventDetails.signup_required)}
                    </DataList.ItemValue>
                </DataList.Item>
            </DataList.Root>
        </>
    );
};

export default NewEventConfirmation;
