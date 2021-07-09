import {useState} from 'react';
import styled from '@emotion/styled';
import {Direction} from '@icarus/shared';
import {topBottom, oneStep, ComputeLayout, LayoutTransform} from '@icarus/layout';
import {useGlobalShortcut} from '@/hooks/shortcut';
import {LayoutType} from '@/interface/layout';
import {KEY_NEXT_STEP, KEY_PREVIOUS_STEP} from '@/dicts/keyboard';

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

export default function ImageContent({content, layoutType, onNavigateOut, ...layoutContext}: LayoutProps) {
    const [layout, setLayout] = useState(() => initialLayout(layoutType, layoutContext));
    const {scale, translateX, translateY} = layout.steps[layout.currentStep];
    useGlobalShortcut(
        KEY_NEXT_STEP,
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
        KEY_PREVIOUS_STEP,
        () => {
            if (layout.currentStep > 0) {
                setLayout({...layout, currentStep: layout.currentStep - 1});
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
