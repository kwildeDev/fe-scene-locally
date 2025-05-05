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
