import axios from 'axios';

const api = axios.create({
    baseURL: 'https://scene-locally.onrender.com/api',
});

// Types
export interface EventSummary {
    event_id: number;
    title: string;
    start_datetime: string;
    is_recurring: boolean;
    category_id: number;
    subcategory_id: number;
    tags?: string[];
    created_at: string;
    image_url: string;
    is_online: boolean;
    organiser: string;
    venue: string;
}

export interface EventDetail extends EventSummary {
    organisation_id: number;
    description: string;
    venue_id: number;
    recurring_schedule: RecurringSchedule;
    updated_at: string;
    status: string;
    signup_required: boolean;
    organisation_name: string;
    venue_name: string;
}

export interface RecurringSchedule {
    frequency?: string;
    day?: string;
}

// Events
const getEvents = (): Promise<EventSummary[]> => {
    return api.get('/events').then(({ data }) => {
        return data.events
    });
};

const getEventById = (event_id: number): Promise<EventDetail> => {
    return api.get(`/events/${event_id}`).then(({ data }) => {
        return data.event
    });
}

export { getEvents, getEventById };
