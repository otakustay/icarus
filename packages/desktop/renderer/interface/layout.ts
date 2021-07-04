export type LayoutType = 'topBottom' | 'oneStep';

export type CenterContent = 'filter' | 'bookList' | 'settings' | 'help' | null;

export interface ReadingLayout {
    hasTagList: boolean;
    centerContent: CenterContent;
    centerPanelVisible: boolean;
    timingStart: number;
}
