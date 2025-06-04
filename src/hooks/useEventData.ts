import { useEffect, useState } from 'react';
import {
    getEventById,
    getCategories,
    getVenues,
    getOrganisationTags,
    EventDetail,
    CategoryDetail,
    VenueDetail,
    SubcategoryDetail,
    getSubcategoriesById,
} from '../api';

interface EventDataHook {
    event: EventDetail | null;
    venues: VenueDetail[];
    categories: CategoryDetail[];
    subcategories: SubcategoryDetail[];
    tags: string[];
    isLoadingEvent: boolean;
    isLoadingVenues: boolean;
    isLoadingCategories: boolean;
    isLoadingSubcategories: boolean;
    isLoadingTags: boolean;
    eventError: boolean;
    venuesError: boolean;
    categoriesError: boolean;
    tagsError: boolean;
    subcategoriesError: boolean;
    setEvent: React.Dispatch<React.SetStateAction<EventDetail | null>>;
    setSubcategories: React.Dispatch<React.SetStateAction<SubcategoryDetail[]>>;
}

export const useEventData = (
    eventId: number,
    organisationId: number | null | undefined,
): EventDataHook => {
    const [event, setEvent] = useState<EventDetail | null>(null);
    const [venues, setVenues] = useState<VenueDetail[]>([]);
    const [categories, setCategories] = useState<CategoryDetail[]>([]);
    const [subcategories, setSubcategories] = useState<SubcategoryDetail[]>([]);
    const [tags, setTags] = useState<string[]>([]);
    
    const [isLoadingEvent, setIsLoadingEvent] = useState<boolean>(false);
    const [isLoadingVenues, setIsLoadingVenues] = useState<boolean>(false);
    const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(false);
    const [isLoadingSubcategories, setIsLoadingSubcategories] = useState<boolean>(false);
    const [isLoadingTags, setIsLoadingTags] = useState<boolean>(false);

    const [eventError, setEventError] = useState<boolean>(false);
    const [venuesError, setVenuesError] = useState<boolean>(false);
    const [categoriesError, setCategoriesError] = useState<boolean>(false);
    const [tagsError, setTagsError] = useState<boolean>(false);
    const [subcategoriesError, setSubcategoriesError] = useState<boolean>(false);

    useEffect(() => {
        if (!eventId || isNaN(eventId) || organisationId == null) {
            setEventError(true);
            return;
        }
        setIsLoadingEvent(true);
        setIsLoadingVenues(true);
        setIsLoadingCategories(true);
        setIsLoadingTags(true);
        
        Promise.all([
            getVenues().then(setVenues).catch(() => setVenuesError(true)),
            getCategories().then(setCategories).catch(() => setCategoriesError(true)),
            getOrganisationTags(organisationId).then(setTags).catch(() => setTagsError(true)),
            getEventById(eventId).then(setEvent).catch(() => setEventError(true)),
        ])
        .finally(() => {
            setIsLoadingEvent(false);
            setIsLoadingVenues(false);
            setIsLoadingCategories(false);
            setIsLoadingTags(false);
        })
    }, [eventId, organisationId]);

    useEffect(() => {
        if (event?.category_id) {
            setIsLoadingSubcategories(true);
            getSubcategoriesById(event.category_id)
                .then(setSubcategories)
                .catch(() => setSubcategoriesError(true))
                .finally(() => setIsLoadingSubcategories(false));
        } else {
            setSubcategories([]);
        }
    }, [event?.category_id]);

    return {
        event,
        venues,
        categories,
        subcategories,
        tags,
        isLoadingEvent,
        isLoadingVenues,
        isLoadingCategories,
        isLoadingSubcategories,
        isLoadingTags,
        eventError,
        venuesError,
        categoriesError,
        tagsError,
        subcategoriesError,
        setEvent,
        setSubcategories,
    };
};