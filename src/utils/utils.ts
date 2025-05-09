import { parseISO, format } from 'date-fns';
import { fromZonedTime, toZonedTime } from 'date-fns-tz';

export function formatDateTime(dateTime: string) {
    try {
        const utcDate = parseISO(dateTime);
        const zonedDate = toZonedTime(utcDate, 'Europe/London');
        const formattedDate = format(zonedDate, "eee do MMMM 'at' hh:mm a");
        return formattedDate;
    } catch (error) {
        console.error('Error formatting date:', error);
        return 'Invalid Date';
    }
}

export function formatShortDate(dateTime: string) {
    try {
        const utcDate = parseISO(dateTime);
        const zonedDate = toZonedTime(utcDate, 'Europe/London');
        const shortDate = format(zonedDate, 'dd/MM/yyyy');
        return shortDate;
    } catch (error) {
        console.error('Error formatting date:', error);
        return 'Invalid Date';
    }
}

export function formatShortTime(dateTime: string) {
    try {
        const utcDate = parseISO(dateTime);
        const zonedDate = toZonedTime(utcDate, 'Europe/London');
        const shortTime = format(zonedDate, 'k:mm');
        return shortTime;
    } catch (error) {
        console.error('Error formatting date:', error);
        return 'Invalid Date';
    }
}

export function getIconColour(idNumber: number) {
    const colourId: number = idNumber % 10;
    const colourLookup: string[] = [
        'teal',
        'blue',
        'green',
        'orange',
        'red',
        'purple',
        'pink',
        'yellow',
        'cyan',
        'gray',
    ];
    return colourLookup[colourId];
}

export function formatToTimestamp(date: string, time: string): string | null {
    try {
        const combinedDateTimeString = `${date}T${time}:00`;
        const localDate = parseISO(combinedDateTimeString);
        const utcDate = fromZonedTime(localDate, 'Europe/London');
        return utcDate.toISOString();
    } catch (error) {
        console.error('Error formatting to timestamp:', error);
        return null;
    }
}

export function formatDateForGoogleCalendarLocal(dateTimeStringUTC: string, eventTimezone: string) {
    try {
        const utcDate = parseISO(dateTimeStringUTC);
        const zonedDate = toZonedTime(utcDate, eventTimezone);
        const year = zonedDate.getFullYear();
        const month = String(zonedDate.getMonth() + 1).padStart(2, '0');
        const day = String(zonedDate.getDate()).padStart(2, '0');
        const hours = String(zonedDate.getHours()).padStart(2, '0');
        const minutes = String(zonedDate.getMinutes()).padStart(2, '0');
        const seconds = String(zonedDate.getSeconds()).padStart(2, '0');
        return `${year}${month}${day}T${hours}${minutes}${seconds}`;
    } catch (error) {
        console.error('Error formatting date for Google Calendar:', error);
        return '';
    }
}