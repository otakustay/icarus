import {useState, useCallback} from 'react';
import {useDispatch} from 'react-redux';
import useDocumentEvent from '../../hooks/documentEvent';
import {open, openMultiple} from '../../actions/open';
import {useIsReading} from '../../hooks/state';
import c from './index.less';

type BooleanHook = [boolean, () => void, () => void];

const useBoolean = (initialValue = false): BooleanHook => {
    const [value, setValue] = useState(initialValue);
    const on = useCallback(() => setValue(true), []);
    const off = useCallback(() => setValue(false), []);
    return [value, on, off];
};

const preventDefault = (e: Event) => e.preventDefault();

const DropZone = () => {
    const isReading = useIsReading();
    const [accepting, addAccepting, removeAccepting] = useBoolean(false);
    useDocumentEvent('dragover', preventDefault);
    useDocumentEvent('dragenter', addAccepting);
    useDocumentEvent('dragleave', removeAccepting);
    const dispatch = useDispatch();
    const openSingleEntry = useCallback(
        (file: string) => dispatch(open(file)),
        [dispatch]
    );
    const openMultipleEntries = useCallback(
        (names: string[]) => dispatch(openMultiple(names)),
        [dispatch]
    );
    const drop = useCallback(
        (e: DragEvent) => {
            e.stopPropagation();
            e.preventDefault();

            if (!e.dataTransfer?.files.length) {
                return;
            }

            // 只拖动一个目录或压缩文件，则浏览该目录下的所有压缩文件
            if (e.dataTransfer.files.length === 1) {
                const file = e.dataTransfer.files[0];
                if (!file.type || file.type.includes('zip')) {
                    openSingleEntry(file.path);
                }
            }
            // 如果是多个压缩文件，则只浏览选中的这些。不支持多个目录
            else {
                const files = Array.from(e.dataTransfer.files)
                    .filter(file => file.type.includes('zip'))
                    .map(file => file.path);
                if (files.length) {
                    openMultipleEntries(files);
                }
            }

            removeAccepting();
        },
        [openSingleEntry, openMultipleEntries, removeAccepting]
    );
    useDocumentEvent('drop', drop);

    if (isReading) {
        return null;
    }

    return (
        <div className={c('root', {accepting})}>
            将目录或.zip文件拖到此处
        </div>
    );
};

export default DropZone;

