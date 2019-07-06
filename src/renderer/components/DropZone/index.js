import {useState, useCallback} from 'react';
import {noop} from 'lodash';
import {useDocumentEvent} from '../../hooks';
import c from './index.less';

const useBoolean = (initialValue = false) => {
    const [value, setValue] = useState(initialValue);
    const on = useCallback(() => setValue(true), []);
    const off = useCallback(() => setValue(false), []);
    return [value, on, off];
};

const preventDefault = e => e.preventDefault();

const DropZone = ({visible, onOpen, onOpenMultiple}) => {
    const [accepting, addAccepting, removeAccepting] = useBoolean(false);
    useDocumentEvent('dragover', preventDefault, []);
    useDocumentEvent('dragenter', addAccepting, []);
    useDocumentEvent('dragleave', removeAccepting, []);
    useDocumentEvent(
        'drop',
        e => {
            e.stopPropagation();
            e.preventDefault();

            if (!e.dataTransfer.files.length) {
                return;
            }

            // 只拖动一个目录或压缩文件，则浏览该目录下的所有压缩文件
            if (e.dataTransfer.files.length === 1) {
                const file = e.dataTransfer.files[0];
                if (!file.type || file.type.includes('zip')) {
                    onOpen(file.path);
                }
            }
            // 如果是多个压缩文件，则只浏览选中的这些。不支持多个目录
            else {
                const files = Array.from(e.dataTransfer.files)
                    .filter(file => file.type.includes('zip'))
                    .map(file => file.path);
                if (files.length) {
                    onOpenMultiple(files);
                }
            }

            removeAccepting();
        },
        [onOpen, onOpenMultiple, removeAccepting]
    );

    return (
        <div className={c('root', {accepting})} style={{display: visible ? '' : 'none'}}>
            将目录或.zip文件拖到此处
        </div>
    );
};

DropZone.defaultProps = {
    visible: true,
    onOpen: noop,
    onOpenMultiple: noop,
};

export default DropZone;

