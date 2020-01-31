interface RectSize {
    width: number;
    height: number;
}

interface ResizeEntry {
    target: HTMLElement;
    contentRect: RectSize;
}

type ResizeObserverCallback = (entries: ResizeEntry[]) => void;

declare class ResizeObserver {
    constructor(callback: ResizeObserverCallback);
    observe(element: HTMLElement): void;
    unobserve(element: HTMLElement): void;
    disconnect(): void;
}
