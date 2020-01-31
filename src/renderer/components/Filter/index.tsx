import {useCallback, useReducer, FC, useMemo} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {union, difference} from 'lodash';
import {filterArchives} from '../../actions/app';
import {toggleFilter} from '../../actions/panel';
import useKeyboard from '../../hooks/keyboard';
import {useIsReading} from '../../hooks/state';
import {State} from '../../store';
import TagList from '../TagList';
import c from './index.less';

interface ReplaceSetAction<T> {
    type: 'REPLACE';
    payload: T[];
}

interface ModifySetAction<T> {
    type: 'ADD' | 'REMOVE';
    payload: T;
}

interface UseSetHookMethods<T> {
    add(value: T): void;
    remove(value: T): void;
    replace(values: T[]): void;
}

function useSet<T>(): [T[], UseSetHookMethods<T>] {
    const [list, dispatch] = useReducer(
        (state: T[], action: ModifySetAction<T> | ReplaceSetAction<T>) => {
            if (action.type === 'REPLACE') {
                return action.payload;
            }

            const indexOfItem = state.indexOf(action.payload);
            switch (action.type) {
                case 'ADD':
                    return indexOfItem < 0 ? [...state, action.payload] : state;
                case 'REMOVE':
                    return indexOfItem < 0 ? state : [...state.slice(0, indexOfItem), ...state.slice(indexOfItem + 1)];
                default:
                    return state;
            }
        },
        []
    );
    const add = useCallback(
        (value: T) => dispatch({type: 'ADD', payload: value}),
        []
    );
    const remove = useCallback(
        (value: T) => dispatch({type: 'REMOVE', payload: value}),
        []
    );
    const replace = useCallback(
        (values: T[]) => dispatch({type: 'REPLACE', payload: values}),
        []
    );
    return [list, {add, remove, replace}];
}

interface UseSetDifferenceMethods<T> {
    select(value: T): void;
    unselect(value: T): void;
    reset(): void;
}

function useSetWithDifference<T>(base: T[]): [T[], UseSetDifferenceMethods<T>] {
    const [selected, {add: addSelected, remove: removeSelected, replace: replaceSelected}] = useSet<T>();
    const [unselected, {add: addUnselected, remove: removeUnselected, replace: replaceUnselected}] = useSet<T>();
    const select = useCallback(
        (value: T) => {
            addSelected(value);
            removeUnselected(value);
        },
        [addSelected, removeUnselected]
    );
    const unselect = useCallback(
        (value: T) => {
            removeSelected(value);
            addUnselected(value);
        },
        [addUnselected, removeSelected]
    );
    const reset = useCallback(
        () => {
            replaceSelected([]);
            replaceUnselected([]);
        },
        [replaceSelected, replaceUnselected]
    );
    const values = useMemo(
        () => difference(union(base, selected), unselected),
        [base, selected, unselected]
    );
    return [values, {select, unselect, reset}];
}

const Filter: FC = () => {
    const isReading = useIsReading();
    const visible = useSelector((s: State) => s.view.isFilterVisible);
    const baseSelected = useSelector((s: State) => s.filter.tags);
    const [selected, {select, unselect, reset}] = useSetWithDifference(baseSelected);
    const dispatch = useDispatch();
    const confirm = useCallback(
        () => dispatch(filterArchives(selected)),
        [dispatch, selected]
    );
    const toggle = useCallback(
        () => {
            if (isReading) {
                dispatch(toggleFilter());
            }
        },
        [dispatch, isReading]
    );
    const clear = useCallback(
        () => {
            dispatch(filterArchives([]));
            reset();
        },
        [dispatch, reset]
    );
    useKeyboard('ALT+F', toggle);

    if (!visible) {
        return null;
    }

    return (
        <div className={c.root}>
            <div className={c.content}>
                <h2 className={c.header}>筛选标签</h2>
                <div className={c.body}>
                    <TagList
                        visible
                        className={c.tag}
                        selected={selected}
                        showTagWithCount
                        newTag={false}
                        onSelect={select}
                        onUnselect={unselect}
                    />
                </div>
            </div>
            <footer className={c.footer}>
                <span className={c.button} onClick={confirm}>筛选</span>
                <span className={c.button} onClick={toggle}>取消</span>
                <span className={c.button} onClick={clear}>清空</span>
            </footer>
        </div>
    );
};

export default Filter;
