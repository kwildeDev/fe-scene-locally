import { useState, useEffect } from 'react';
import { getEventById, EventDetail } from '../api';

export const useEvent = (
  eventId?: number,
  isNewEvent?: boolean,
  organisationId?: number | null
) => {
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [isLoadingEvent, setIsLoadingEvent] = useState<boolean>(false);
  const [eventError, setEventError] = useState<boolean>(false);

  useEffect(() => {
    if (isNewEvent) {
      setEvent(null);
      setIsLoadingEvent(false);
      setEventError(false);
      return;
    }
    if (!eventId || isNaN(eventId) || !organisationId) {
      setEventError(true);
      return;
    }

    setIsLoadingEvent(true);
    getEventById(eventId)
      .then(setEvent)
      .catch(() => setEventError(true))
      .finally(() => setIsLoadingEvent(false));
  }, [eventId, isNewEvent, organisationId]);

  return { event, setEvent, isLoadingEvent, eventError };
};
