import axios from 'axios';

const api = axios.create({
    baseURL: 'https://scene-locally.onrender.com/api',
});

export interface RecurringSchedule {
    frequency?: string;
    day?: string;
}

export interface Event {
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

export interface EventSummary extends Omit<Event,
    'organisation_id' | 'description' | 'venue_id' | 'recurring_schedule' |
    'end_datetime' | 'updated_at' | 'status' | 'signup_required' |
    'access_link' 
> {
    organiser: string;
    venue: string;
}

export interface EventDetail extends Event {
    organisation_name: string;
    venue_name: string;
}

export interface CategoryDetail {
    category_id: number;
    name: string;
    slug: string;
    description: string;
}

export interface SubcategoryDetail {
    subcategory_id: number;
    category_id: number;
    name: string;
    slug: string;
    description: string;
}

interface EventQueryParams {
    sort_by?: string;
    order?: string;
    category?: string;
    subcategory?: string;
    search?: string;
    date?: string;
    venue?: string;
    tags?: string;
}

export interface VenueDetail {
    venue_id: number;
    name: string;
}

interface SignupCardData {
    user_id: number | null;
    name: string;
    email: string;
    is_registered_user: boolean;
}

interface AttendeeDetail {
    registration_id: number;
    event_id: number;
    user_id: number | null;
    name: string;
    email: string;
    is_registered_user: boolean;
}

export interface OrganisationEventSummary extends Omit<EventSummary, 'organiser'> {
    status: string;
}

export interface NewEventRequest {
    organisation_id: number;
    title: string;
    description: string;
    start_datetime: string | null;
    end_datetime: string | null;
    venue_id: number;
    category_id: number;
    subcategory_id: number;
    tags: string[] | null;
    is_recurring: boolean;
    recurring_schedule: RecurringSchedule | null;
    status: string;
    image_url?: string;
    access_link?: string;
    is_online: boolean;
    signup_required: boolean;
}

export interface NewEventData {
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

export type UpdatedEventRequest = Partial<
    Omit<Event, 'event_id' | 'organisation_id' | 'created_at' | 'updated_at'>
>

export interface LoginData {
    email: string;
    password: string;
}

export interface UserDetail {
    user_id: number;
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    organisation_id: number;
    organisation_name: string;
}

export interface DataToUpdate {
    status: string;
}

// Events
const getEvents = (params: EventQueryParams): Promise<EventSummary[]> => {
    return api
        .get('/events', { params })
        .then(({ data }) => {
            return data.events
    });
};

const getEventById = (event_id: number): Promise<EventDetail> => {
    return api.get(`/events/${event_id}`).then(({ data }) => {
        return data.event
    });
};

const postAttendee = (event_id: number, signupCardData: SignupCardData ): Promise<AttendeeDetail> => {
    return api
        .post(`/events/${event_id}/attendees`, signupCardData )
        .then(({ data }) => {
            return data.attendee
        });
};

const updateEventStatus = (event_id: number, dataToUpdate: DataToUpdate ) => {
    return api
        .patch(`/events/${event_id}`, dataToUpdate)
        .then(({ data }) => {
            return data.event
        })
};

const deleteEvent = (event_id: number) => {
    return api
        .delete(`/events/${event_id}`)
};

//Categories
const getCategories = (): Promise<CategoryDetail[]> => {
    return api.get('/categories').then(({ data }) => {
        return data.categories
    });
};

const getSubcategories = (category_slug: string): Promise<SubcategoryDetail[]> => {
    return api
        .get(`/categories/${category_slug}/subcategories`)    
        .then(({ data }) => {
            return data.subcategories
        });
};

const getSubcategoriesById = (category_id: number): Promise<SubcategoryDetail[]> => {
    return api
        .get(`/categories/id/${category_id}/subcategories`)
        .then(({ data }) => {
            return data.subcategories
        });
};

const getCategoryById = (category_id: number): Promise<CategoryDetail> => {
    return api
        .get(`/categories/id/${category_id}`)
        .then(({ data }) => {
            return data.category
        });
};

const getSubcategoryById = (category_id: number, subcategory_id: number): Promise<SubcategoryDetail> => {
    return api
        .get(`/categories/id/${category_id}/subcategories/${subcategory_id}`)
        .then(({ data }) => {
            return data.subcategory
        });
};

//Venues
const getVenues = (): Promise<VenueDetail[]> => {
    return api.get('/venues').then(({ data }) => {
        return data.venues
    })
};

//Organisations
const getOrganisationEvents = (organisation_id: number): Promise<OrganisationEventSummary[]> => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
        throw new Error('Token not found');
    }
    return api
        .get(`/organisations/${organisation_id}/events`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(({ data }) => {
            return data.events
        })
};

const getOrganisationTags = (organisation_id: number): Promise<string[]> => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
        throw new Error('Token not found');
    }
    return api
        .get(`/organisations/${organisation_id}/tags`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(({ data }) => {
            return data.tags
        })
};

const postEvent = (newEventData: NewEventRequest ): Promise<Event> => {
    return api
        .post(`/events`, newEventData )
        .then(({ data }) => {
            return data.event
        });
};

const updateEvent = (event_id: number, updatedEventData: UpdatedEventRequest ): Promise<Event> => {
    return api
        .patch(`/events/${event_id}`, updatedEventData )
        .then(({ data }) => {
            return data.event
        });
};

//Users

const loginUser = (loginData: LoginData): Promise<string> => {
    return api
        .post(`/auth/login`, loginData )
        .then(({ data }) => {
            return data.token
        })
        .catch((error) => {
            if (error.response?.data) {
                return Promise.reject(error.response.data);
            } else {
                console.error("An unexpected error occurred during login:", error);
                return Promise.reject({ msg: "Login failed due to a network error or an issue with the server" });
            }
        });
};


const getUserDetails = (validToken: string): Promise<UserDetail> => {
    return api
        .get(`/users/me`, {
            headers: {
                Authorization: `Bearer ${validToken}`,
            },
        })
        .then((response) => {
            return response.data.user;
        })
        .catch((error) => {
            console.error('Error fetching user profile:', error);
            throw error;
        });
};


export { 
    getEvents, 
    getEventById,
    getCategories,
    getSubcategories,
    getSubcategoriesById,
    getCategoryById,
    getSubcategoryById,
    getVenues,
    postAttendee,
    getOrganisationEvents,
    getOrganisationTags,
    postEvent,
    loginUser,
    getUserDetails,
    updateEventStatus,
    deleteEvent,
    updateEvent
};
