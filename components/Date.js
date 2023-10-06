import {format, parseISO} from 'date-fns';

export default function Date({dateString}) {
    const date = parseISO(dateString);
    const formatString = 'LLL dd, yyyy';
    return <time dateTime={dateString}>{format(date, formatString)}</time>
}