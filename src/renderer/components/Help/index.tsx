import {FC, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {toggleHelp} from '../../actions/panel';
import useKeyboard from '../../hooks/keyboard';
import {State} from '../../store';
import c from './index.less';

const displayPattern = (pattern: string) => {
    const names = pattern.split('+');
    const char = names.pop();
    return [...names, char === ' ' ? 'SPACE' : char].join(' + ');
};

interface ShortcutProps {
    description: string;
    patterns: string[];
}

const Sortcut: FC<ShortcutProps> = ({description, patterns}) => {
    return (
        <li key={description} className={c.shortcutItem}>
            <span className={c.shortcutKeyList}>
                {patterns.map(pattern => <kbd key={pattern} className={c.shortcutKey}>{displayPattern(pattern)}</kbd>)}
            </span>
            <span className={c.shortcutDescription}>{description}</span>
        </li>
    );
};

const Help: FC = () => {
    const visible = useSelector((s: State) => s.view.isHelpVisible);
    const dispatch = useDispatch();
    const toggle = useCallback(
        () => dispatch(toggleHelp()),
        [dispatch]
    );
    useKeyboard('¿', toggle);

    if (!visible) {
        return null;
    }

    return (
        <div className={c.root} style={{display: visible ? '' : 'none'}}>
            <h2 className={c.shortcutTitle}>键盘操作</h2>
            <ul>
                <Sortcut patterns={['J']} description="向前阅读" />
                <Sortcut patterns={['K']} description="向后阅读" />
                <Sortcut patterns={['H']} description="上一页" />
                <Sortcut patterns={['L']} description="下一页" />
                <Sortcut patterns={['P']} description="上一部漫画" />
                <Sortcut patterns={['N']} description="下一部漫画" />
                <Sortcut patterns={['R']} description="恢复进度" />
                <Sortcut patterns={['C']} description="开始/结束计时" />
                <Sortcut patterns={['I']} description="查看阅读信息" />
                <Sortcut patterns={['T']} description="查看标签" />
                <Sortcut patterns={['ALT+F']} description="筛选漫画" />
                <Sortcut patterns={['/']} description="打扰模式" />
            </ul>
            <h2 className={c.shortcutTitle}>阅读模式</h2>
            <ul>
                <Sortcut patterns={['1']} description="自适应模式" />
                <Sortcut patterns={['2']} description="两步模式" />
                <Sortcut patterns={['3']} description="单步模式" />
            </ul>
            <h2 className={c.contactTitle}>联系作者</h2>
            <a
                href="http://github.com/otakustay/icarus/issues"
                target="_blank"
                rel="noopener noreferrer"
            >
                前往 GitHub Issues
            </a>
        </div>
    );
};

export default Help;
