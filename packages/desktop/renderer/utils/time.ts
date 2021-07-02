const SECOND_MS = 1000;
const MINUTE_MS = SECOND_MS * 60;
const HOUR_MS = MINUTE_MS * 60;

export const formatDuration = (ms: number) => {
    const hours = Math.floor(ms / HOUR_MS);
    const minutes = Math.floor(ms % HOUR_MS / MINUTE_MS);
    const seconds = Math.floor(ms % MINUTE_MS / SECOND_MS);
    const parts = [`${hours}小时`, `${minutes}分`, `${seconds}秒`];
    return parts.filter(v => !v.startsWith('0')).join('');
};
