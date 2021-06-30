const urls = {
    shelf: '/shelf',
    cursor: '/books/:bookIndex/images/:imageIndex',
    nextImage: '/books/:bookIndex/images/:imageIndex/siblings/NEXT',
    previousImage: '/books/:bookIndex/images/:imageIndex/siblings/PREVIOUS',
    nextBook: '/books/:bookIndex/siblings/NEXT',
    previousBook: '/books/:bookIndex/siblings/PREVIOUS',
    filter: '/filter',
    tags: '/tags',
    tagsByBook: '/tags/:bookName',
} as const;

export default urls;

type Collection = typeof urls;
export type ServiceURL = Collection[keyof Collection];
