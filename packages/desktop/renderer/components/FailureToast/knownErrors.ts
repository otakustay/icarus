import {ComponentType} from 'react';
import {IoLockClosedOutline} from 'react-icons/io5';
import ActionConflictError from '@/errors/ActionConflict';

export default (error: Error): string | [ComponentType, string] | null => {
    if (error instanceof ActionConflictError) {
        return [IoLockClosedOutline, '请停止你疯狂按键的行为'];
    }

    return null;
};
