import {noCase} from 'change-case';
import {ReadingCursor} from '@icarus/shared';
import {RouteRegistry} from './interface';
import urls, {ServiceURL} from './urls';

type MoveMethodName = 'moveImageForward' | 'moveImageBackward' | 'moveBookForward' | 'moveBookBackward';

export default (registry: RouteRegistry) => {
    const factory = (url: ServiceURL, method: MoveMethodName) => {
        const action = noCase(method);

        registry.get(
            url,
            async context => {
                try {
                    await context.shelf[method]();
                    const content = await context.shelf.readCurrentContent();
                    await context.success(content);
                }
                catch (ex) {
                    await context.error('server', 'MOVE_FAIL', `Unable to ${action}`, ex);
                }
            }
        );
    };

    factory(urls.nextImage, 'moveImageForward');
    factory(urls.previousImage, 'moveImageBackward');
    factory(urls.nextBook, 'moveBookForward');
    factory(urls.previousBook, 'moveBookBackward');

    registry.post(
        urls.cursor,
        async context => {
            const {bookIndex, imageIndex} = context.body as ReadingCursor;

            try {
                await context.shelf.moveCursor(bookIndex, imageIndex);
                const content = await context.shelf.readCurrentContent();
                context.success(content);
            }
            catch {
                context.error('client', 'MOVE_FAIL', `Cannot move to image ${imageIndex} inside book ${bookIndex}`);
            }
        }
    );
};
