import {ComponentType} from 'react';
import {IoLockClosedOutline, IoSkullOutline} from 'react-icons/io5';
import ActionConflictError from '@/errors/ActionConflict';

export default (error: Error): [ComponentType, string] => {
    if (error instanceof ActionConflictError) {
        return [IoLockClosedOutline, '请停止你疯狂按键的行为'];
    }

    return [IoSkullOutline, '虽然不知道发生了什么，总之有个错误'];
};
