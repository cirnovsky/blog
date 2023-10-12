import {format, isValid, parseISO} from 'date-fns';

export default function Date({dateString}) {
    const date = parseISO(dateString);
    const formatString = 'LLL dd, yyyy';
    if (!isValid(date)) {
        console.log(date)
        return <div>CAONIMABI</div>
    }
    return <time dateTime={dateString}>{format(date, formatString)}</time>
}