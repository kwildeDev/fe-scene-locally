import {
    EventDetail,
    CategoryDetail,
    VenueDetail,
    SubcategoryDetail,
} from '../api';
import { useCategories } from './useCategories';
import { useEvent } from './useEvent';
import { useVenues } from './useVenues';
import { useOrganisationTags } from './useOrganisatonTags';
import { useSubcategories } from './useSubcategories';

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
    isNewEvent: boolean,
    organisationId: number | null | undefined,
    eventId?: number,
): EventDataHook => {
    const { event, setEvent, isLoadingEvent, eventError, } = useEvent(eventId, isNewEvent, organisationId);
    const { venues, isLoadingVenues, venuesError, } = useVenues();
    const { categories, isLoadingCategories, categoriesError, } = useCategories();
    const { tags, isLoadingTags, tagsError, } = useOrganisationTags(organisationId);
    const { subcategories, setSubcategories, isLoadingSubcategories, subcategoriesError, } = useSubcategories(event?.category_id);

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