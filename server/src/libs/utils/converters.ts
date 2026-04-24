/**
 * Converts seconds to milliseconds
 * @param seconds - The number of seconds to convert
 */
export function secondsToMilliseconds(seconds: number) {
    return seconds * 1000;
}

/**
 * Converts hours to seconds
 * @param hours - The number of hours to convert
 */
export function hoursToSeconds(hours: number) {
    return hours * 60 * 60;
}

/**
 * Converts hours to milliseconds
 * @param hours - The number of hours to convert
 * @returns The number of milliseconds
 */
export function hoursToMilliseconds(hours: number) {
    return secondsToMilliseconds(hoursToSeconds(hours));
}
