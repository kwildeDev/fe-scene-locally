import { useState, useEffect } from "react";
import { getOrganisationTags } from "../api";

export const useOrganisationTags = (organisationId?: number | null) => {
    const [tags, setTags] = useState<string[]>([]);
    const [isLoadingTags, setIsLoadingTags] = useState<boolean>(false);
    const [tagsError, setTagsError] = useState<boolean>(false);

    useEffect(() => {
        if (!organisationId) return;
        
        setIsLoadingTags(true);
        getOrganisationTags(organisationId)
            .then(setTags)
            .catch(() => setTagsError(true))
            .finally(() => setIsLoadingTags(false));
        }, [organisationId]);
    
    return {tags, isLoadingTags, tagsError};
};