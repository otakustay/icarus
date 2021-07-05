type LinearTo = 'left' | 'right' | 'top' | 'bottom';

export interface LinearColors {
    start: string;
    end?: string;
    background?: string;
}

export const twoStopLinear = (to: LinearTo, width: number | string, color: LinearColors | string) => {
    const colors: LinearColors = typeof color === 'string' ? {start: color} : color;
    const {start, end = start, background = 'transparent'} = colors;
    const stop = typeof width === 'number' ? `${width}px` : width;

    return `linear-gradient(to ${to}, ${start}, ${end} ${stop}, ${background} ${stop})`;
};
