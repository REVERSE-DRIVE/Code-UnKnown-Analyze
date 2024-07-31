export function secondsToString(time: number): string {
    const minutes = Math.floor(time / 60);
    const seconds = time - minutes * 60;

    return `${minutes}분 ${seconds}초`;
}