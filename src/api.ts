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

export interface CategoryDetail {
    category_id: number;
    name: string;
    slug: string;
    description: string;
}

export interface SubcategoryDetail {
    category_id: number;
    name: string;
    slug: string;
    description: string;
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
};

//Categories
const getCategories = (): Promise<CategoryDetail[]> => {
    return api.get('/categories').then(({ data }) => {
        return data.categories
    });
};

const getSubcategories = (category_slug: number): Promise<SubcategoryDetail[]> => {
    return api.get(`/categories/${category_slug}`).then(({ data }) => {
        return data.subcategories
    });
};

export { getEvents, getEventById, getCategories, getSubcategories };
