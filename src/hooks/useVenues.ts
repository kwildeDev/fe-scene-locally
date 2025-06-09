import { useState, useEffect } from "react";
import { getVenues, VenueDetail } from "../api";

export const useVenues = () => {
    const [venues, setVenues] = useState<VenueDetail[]>([]);
    const [isLoadingVenues, setIsLoadingVenues] = useState<boolean>(false);
    const [venuesError, setVenuesError] = useState<boolean>(false);

    useEffect(() => {
        setIsLoadingVenues(true);
        getVenues()
            .then(setVenues)
            .catch(() => setVenuesError(true))
            .finally(() => setIsLoadingVenues(false));
    }, []);

    return {venues, isLoadingVenues, venuesError};
};