import {format, parseISO} from 'date-fns';

export default function Date({dateString}: { dateString: string }) {
    const date = parseISO(dateString);
    const formatString = 'LLLL d, yyyy';
    return <time dateTime={dateString}>{format(date, formatString)}</time>
}