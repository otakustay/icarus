import {useState} from 'react';
import styled from 'styled-components';
import {useElementSize} from '@huse/element-size';
import {topBottom, oneStep, ComputeLayout, LayoutTransform} from '@icarus/layout';
import {useGlobalShortcut} from '@/hooks/shortcut';
import {LayoutType} from '@/interface/layout';
import {useLayoutType, useReadingBook, useReadingImage} from '../ReadingContextProvider';
import {Direction} from '../../../../shared/dist';

const Container = styled.div`
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 20;
`;

const TransformableImage = styled.img`
    transform-origin: 0 0;
    transition: transform .4s linear;
`;

interface ReadingLayout {
    steps: LayoutTransform[];
    currentStep: number;
}

const computeByType: Record<LayoutType, ComputeLayout> = {
    topBottom: topBottom(0.2),
    oneStep: oneStep(),
};

interface LayoutContext {
    width: number;
    height: number;
    containerWidth: number;
    containerHeight: number;
}

const initialLayout = (type: LayoutType, context: LayoutContext): ReadingLayout => {
    const compute = computeByType[type];
    const {width, height, containerWidth, containerHeight} = context;

    return {
        steps: compute({width: containerWidth, height: containerHeight}, {width, height}),
        currentStep: 0,
    };
};

interface LayoutProps extends LayoutContext {
    layoutType: LayoutType;
    content: string;
    onNavigateOut: (direction: Direction) => void;
}

function ImageLayout({content, layoutType, onNavigateOut, ...layoutContext}: LayoutProps) {
    const [layout, setLayout] = useState(() => initialLayout(layoutType, layoutContext));
    const {scale, translateX, translateY} = layout.steps[layout.currentStep];
    useGlobalShortcut(
        ['J', 'D'],
        () => {
            if (layout.currentStep < layout.steps.length - 1) {
                setLayout({...layout, currentStep: layout.currentStep + 1});
            }
            else {
                onNavigateOut('forward');
            }
        }
    );
    useGlobalShortcut(
        ['K', 'A'],
        () => {
            if (layout.currentStep < layout.steps.length - 1) {
                setLayout({...layout, currentStep: layout.currentStep + 1});
            }
            else {
                onNavigateOut('backward');
            }
        }
    );

    return (
        <TransformableImage
            style={{transform: `scale(${scale}) translate(${translateX}px, ${translateY}px)`}}
            width={layoutContext.width}
            height={layoutContext.height}
            src={content}
        />
    );
}

interface Props {
    onNavigate: (direction: Direction) => void;
}

export default function ImageView({onNavigate}: Props) {
    const book = useReadingBook();
    const image = useReadingImage();
    const layoutType = useLayoutType();
    const [containerRef, containerSize] = useElementSize();
    useGlobalShortcut(['L', 'S'], () => onNavigate('forward'));
    useGlobalShortcut(['H', 'W'], () => onNavigate('backward'));

    return (
        <Container ref={containerRef}>
            {
                containerSize && (
                    <ImageLayout
                        key={`${book.name}/${image.name}:${layoutType}`}
                        layoutType={layoutType}
                        content={image.content}
                        width={image.width}
                        height={image.height}
                        containerWidth={containerSize.width}
                        containerHeight={containerSize.height}
                        onNavigateOut={onNavigate}
                    />
                )
            }
        </Container>
    );
}
