type LinearTo = 'left' | 'right' | 'top' | 'bottom';

interface LinearColors {
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

type ElementColorCategory = 'default' | 'active' | 'primary';

type ElementColorState = 'default' | 'contrast';

type ElementColorType = 'default' | 'contrast' | 'active' | 'active-contrast' | 'primary' | 'primary-contrast';

const computeColorType = (category: ElementColorCategory, state: ElementColorState) => {
    switch (category) {
        case 'default':
            return state === 'contrast' ? 'contrast' : 'default';
        case 'active':
            return state === 'contrast' ? 'active-contrast' : 'active';
        case 'primary':
            return state === 'contrast' ? 'primary-contrast' : 'primary';
        default:
            throw new Error(`Unknown color category ${category}`);
    }
};

const BACKGROUND_COLORS: Record<ElementColorType, string> = {
    'default': 'var(--color-element-background)',
    'contrast': 'var(--color-element-contrast-background)',
    'active': 'var(--color-active-element-background)',
    'active-contrast': 'var(--color-active-element-contrast-background)',
    'primary': 'var(--color-primary-element-background)',
    'primary-contrast': 'var(--color-primary-element-contrast-background)',
};

export const backgroundColor = (category: ElementColorCategory, state: ElementColorState) => {
    const type = computeColorType(category, state);
    return BACKGROUND_COLORS[type];
};

const TEXT_COLORS: Record<ElementColorType, string> = {
    'default': 'var(--color-element-text)',
    'contrast': 'var(--color-element-contrast-text)',
    'active': 'var(--color-active-element-text)',
    'active-contrast': 'var(--color-active-element-contrast-text)',
    'primary': 'var(--color-primary-element-text)',
    'primary-contrast': 'var(--color-primary-element-contrast-text)',
};

export const textColor = (category: ElementColorCategory, state: ElementColorState) => {
    const type = computeColorType(category, state);
    return TEXT_COLORS[type];
};
