import {CSSProperties} from 'react';
import {css} from 'styled-components';

type StyleProperty = keyof CSSProperties;

interface TransitionDefinition<T extends StyleProperty> {
    property: T;
    from: Exclude<CSSProperties[T], undefined>;
    to: Exclude<CSSProperties[T], undefined>;
    duration: number;
    timingFunction: CSSProperties['transitionTimingFunction'];
}

export const createTransition = <T extends StyleProperty>(name: string, definition: TransitionDefinition<T>) => {
    const {property, from, to, duration, timingFunction} = definition;
    const fromDeclaration = `${property}: ${from}`;
    const toDeclaration = `${property}: ${to}`;
    const transition = `transition: ${property} ${duration}ms ${timingFunction}`;

    return css`
        ${fromDeclaration};

        &.${name}-enter {
            ${fromDeclaration};
        }

        &.${name}-enter-active {
            ${toDeclaration};
            ${transition};
        }

        &.${name}-enter-done {
            ${toDeclaration};
        }

        &.${name}-exit {
            ${toDeclaration};
            ${transition};
        }

        &.${name}-exit-active {
            ${fromDeclaration};
        }
    `;
};

interface DefinedTransitionOverride {
    name?: string;
    duration?: number;
    timingFunction?: CSSProperties['transitionTimingFunction'];
}

export const rightToLeftTransition = (override: DefinedTransitionOverride = {}) => createTransition(
    override.name ?? 'right-to-left',
    {
        property: 'transform',
        from: 'translateX(100%)',
        to: 'translateX(0)',
        duration: override.duration ?? 300,
        timingFunction: override.timingFunction ?? 'ease-in-out',
    }
);


export const bottomToTopTransition = (override: DefinedTransitionOverride = {}) => createTransition(
    override.name ?? 'bottom-to-top',
    {
        property: 'transform',
        from: 'translateY(100%)',
        to: 'translateY(0)',
        duration: override.duration ?? 300,
        timingFunction: override.timingFunction ?? 'ease-in-out',
    }
);
