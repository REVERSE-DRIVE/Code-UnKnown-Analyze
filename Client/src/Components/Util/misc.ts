export function secondsToString(time: number): string {
    const minutes = Math.floor(time / 60);
    const seconds = time - minutes * 60;

    return `${minutes}분 ${seconds}초`;
}

export function numberComma(num: number): string {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function stringToHash(str: string): number {
    var hash = 0, i, chr;
    if (str.length === 0) return hash;

    for (i = 0; i < str.length; i++) {
        chr = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}

export function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}