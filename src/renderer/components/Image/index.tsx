import {useState, useLayoutEffect, useMemo, FC, useCallback, useRef, MutableRefObject} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {ClientImageInfo, LayoutType} from '../../../interface';
import useViewState from '../../hooks/viewState';
import useKeyboard from '../../hooks/keyboard';
import {previousImage, nextImage} from '../../actions/image';
import {previousArchive, nextArchive} from '../../actions/archive';
import {State} from '../../store';
import * as layouts from '../../lib/layouts';
import c from './index.less';

interface Size {
    width: number;
    height: number;
}

const useSize = (ref: MutableRefObject<HTMLElement | null>): Size | null => {
    const [size, setSize] = useState<Size | null>(null);
    useLayoutEffect(
        () => {
            if (!ref.current) {
                return;
            }

            const element = ref.current;
            const updateSize = ([entry]: ResizeEntry[]) => {
                const size = {
                    width: entry.contentRect.width,
                    height: entry.contentRect.height,
                };
                setSize(size);
            };
            const observer = new ResizeObserver(updateSize);
            observer.observe(element);
            return () => observer.disconnect();
        },
        [ref]
    );
    return size;
};

interface ImageProps {
    image: ClientImageInfo;
    layoutType: LayoutType;
    containerSize: Size;
}

const ImageView: FC<ImageProps> = ({image, layoutType, containerSize}) => {
    const computeLayout = layouts[layoutType];
    const [stepIndex, setStepIndex] = useState(0);
    const transformSteps = useMemo(
        () => {
            if (!containerSize) {
                return [];
            }

            return computeLayout(containerSize, image);
        },
        [computeLayout, containerSize, image]
    );
    const dispatch = useDispatch();
    const moveToPreviousArchive = useCallback(
        () => dispatch(previousArchive()),
        [dispatch]
    );
    useKeyboard('P', moveToPreviousArchive);
    const moveToPreviousImage = useCallback(
        () => dispatch(previousImage()),
        [dispatch]
    );
    useKeyboard('H', moveToPreviousImage);
    const moveToPreviousStep = useCallback(
        () => {
            if (stepIndex <= 0) {
                moveToPreviousImage();
            }
            else {
                setStepIndex(stepIndex - 1);
            }
        },
        [moveToPreviousImage, stepIndex]
    );
    useKeyboard('K', moveToPreviousStep);
    const moveToNextArchive = useCallback(
        () => dispatch(nextArchive()),
        [dispatch]
    );
    useKeyboard('N', moveToNextArchive);
    const moveToNextImage = useCallback(
        () => dispatch(nextImage()),
        [dispatch]
    );
    useKeyboard('L', moveToNextImage);
    const moveToNextStep = useCallback(
        () => {
            if (stepIndex >= transformSteps.length - 1) {
                moveToNextImage();
            }
            else {
                setStepIndex(stepIndex + 1);
            }
        },
        [moveToNextImage, stepIndex, transformSteps.length]
    );
    useKeyboard('J', moveToNextStep);

    const transform = transformSteps[stepIndex];
    const transition = (screen.width * devicePixelRatio) > 2560;
    const style = {
        transition: transition ? 'transform 1s linear' : '',
        transform: `scale(${transform.scale}) translate3d(${transform.translateX}px, ${transform.translateY}px, 0)`,
    };

    return <img className={c.image} src={image.uri} style={style} />;
};

const Image: FC = () => {
    const root = useRef<HTMLDivElement>(null);
    const containerSize = useSize(root);
    const viewState = useViewState();
    const image = useSelector((s: State) => s.image);
    const layoutType = useSelector((s: State) => s.layout.type);

    return (
        <div className={c('root', viewState)} ref={root}>
            {
                image.uri && containerSize && (
                    <ImageView
                        key={`${image.uri}/${layoutType}`}
                        image={image}
                        layoutType={layoutType}
                        containerSize={containerSize}
                    />
                )
            }
        </div>
    );
};

export default Image;
