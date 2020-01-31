import {useEffect} from 'react';

export default function useFullscreen(isFullscreen: boolean) {
    useEffect(
        () => {
            if (isFullscreen) {
                document.documentElement.requestFullscreen();
            }
            else if (document.fullscreen) {
                document.exitFullscreen();
            }
        },
        [isFullscreen]
    );
}
