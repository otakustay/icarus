import {createAction} from '@reduxjs/toolkit';
import {LayoutType} from '../../interface';

export const changeLayout = createAction<LayoutType>('CHANGE_LAYOUT');

export const topBottomLayout = () => changeLayout('topBottom');

export const oneStepLayout = () => changeLayout('oneStep');

export const adaptiveLayout = () => changeLayout('adaptive');
