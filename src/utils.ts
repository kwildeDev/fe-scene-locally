import { format } from 'date-fns';

export function formatDateTime(dateTime: string) {
    const date: Date = new Date(dateTime);
    const formattedDate = format(date, "eee do MMMM 'at' hh:mm a");
    return formattedDate;
}
