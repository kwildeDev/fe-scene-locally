import { format } from 'date-fns';

export function formatDateTime(dateTime: string) {
    const date: Date = new Date(dateTime);
    const formattedDate = format(date, "eee do MMMM 'at' hh:mm a");
    return formattedDate;
}

export function getIconColour(idNumber: number) {
    const colourId:number = idNumber % 10
    const colourLookup: string[] = [
        "teal",
        "blue",
        "green",
        "orange",
        "red",
        "purple",
        "pink",
        "yellow",
        "cyan",
        "gray",
      ];
    return colourLookup[colourId]  
}
