import {useEffect} from 'react';

export default isFullscreen => useEffect(
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
