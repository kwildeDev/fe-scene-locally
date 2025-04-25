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
    tags: string[];
    created_at: string;
    image_url: string;
    is_online: boolean;
    organiser: string;
    venue: string;
}

// Events
const getEvents = (): Promise<EventSummary[]> => {
    return api.get('/events').then(({ data }) => data.events);
};

export { getEvents };
