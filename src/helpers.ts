export function parseDate(s: string) {
    // 05.12.2022, 23:39:18
    const [datePart, timePart] = s.split(', ');

    const [day, month, year] = datePart.split('.');
    const [hours, minutes, seconds] = timePart.split(':');

    return new Date(+year, (+month - 1), +day, +hours, +minutes, +seconds);
}