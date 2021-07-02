export interface TagState {
    name: string;
    active: boolean;
    suggested: boolean;
}

export interface TagStateGroup {
    letter: string;
    tags: TagState[];
}
