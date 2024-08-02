export function secondsToString(time: number): string {
    const minutes = Math.floor(time / 60);
    const seconds = time - minutes * 60;

    return `${minutes}분 ${seconds}초`;
}

export function numberComma(num: number): string {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}