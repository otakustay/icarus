import {CSSProperties} from 'react';
import {css} from 'styled-components';

type StyleProperty = keyof CSSProperties;

export interface TransitionDefinition<T extends StyleProperty> {
    property: T;
    from: Exclude<CSSProperties[T], undefined>;
    to: Exclude<CSSProperties[T], undefined>;
    duration: number;
    timingFunction: CSSProperties['transitionTimingFunction'];
    defaultToInvisible: boolean;
}

export const createTransition = <T extends StyleProperty>(name: string, definition: TransitionDefinition<T>) => {
    const {property, from, to, duration, timingFunction, defaultToInvisible} = definition;
    const fromDeclaration = `${property}: ${from}`;
    const toDeclaration = `${property}: ${to}`;
    const transition = `transition: ${property} ${duration}ms ${timingFunction}`;

    return css`
        ${defaultToInvisible ? fromDeclaration : ''};

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

export interface DefinedTransitionOverride {
    name?: string;
    duration?: number;
    timingFunction?: CSSProperties['transitionTimingFunction'];
    defaultToInvisible?: boolean;
}

export const rightToLeftTransition = (override: DefinedTransitionOverride = {}) => createTransition(
    override.name ?? 'right-to-left',
    {
        property: 'transform',
        from: 'translateX(100%)',
        to: 'translateX(0)',
        duration: override.duration ?? 300,
        timingFunction: override.timingFunction ?? 'ease-in-out',
        defaultToInvisible: override.defaultToInvisible ?? true,
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
        defaultToInvisible: override.defaultToInvisible ?? true,
    }
);

export const topToBottomTransition = (override: DefinedTransitionOverride = {}) => createTransition(
    override.name ?? 'top-to-bottom',
    {
        property: 'transform',
        from: 'translateY(-100%)',
        to: 'translateY(0)',
        duration: override.duration ?? 300,
        timingFunction: override.timingFunction ?? 'ease-in-out',
        defaultToInvisible: override.defaultToInvisible ?? true,
    }
);

export const fadeTransition = (override: DefinedTransitionOverride = {}) => createTransition(
    override.name ?? 'fade',
    {
        property: 'opacity',
        from: 0,
        to: 1,
        duration: override.duration ?? 300,
        timingFunction: override.timingFunction ?? 'ease-in-out',
        defaultToInvisible: override.defaultToInvisible ?? true,
    }
);
