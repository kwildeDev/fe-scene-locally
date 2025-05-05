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
    user_id: string | null;
    name: string;
    email: string;
    is_registered_user: boolean;
}

export interface OrganisationEventSummary {
    organisation_id: number;
    event_id: number;
    title: string;
    status: string;
    start_datetime: string;
    venue: string;
    category_id: number;
    subcategory_id: number;
    is_recurring: boolean;
    image_url: string;
    is_online: boolean;
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
    console.log(event_id, signupCardData)
    return api
        .post(`/events/${event_id}/attendees`, signupCardData )
        .then(({ data }) => {
            return data.attendee
        });
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

const postEvent = (newEventData: NewEventData ): Promise<NewEventData> => {
    return api
        .post(`/events`, newEventData )
        .then(({ data }) => {
            return data.event
        });
};

//Users

const loginUser = (loginData: LoginData): Promise<LoginData> => {
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


export { getEvents, getEventById, getCategories, getSubcategories, getVenues, postAttendee, getOrganisationEvents, postEvent, loginUser, getUserDetails };
