import {pick, groupBy} from 'lodash';
import c from './index.less';

const displayPattern = pattern => {
    const names = pattern.split('+');
    const char = names.pop();
    return [...names, char === ' ' ? 'SPACE' : char].join(' + ');
};

const shortcutItem = ([description, items]) => {
    return (
        <li key={description} className={c.shortcutItem}>
            <span className={c.shortcutKeyList}>
                {items.map(({pattern}) => <kbd key={pattern} className={c.shortcutKey}>{displayPattern(pattern)}</kbd>)}
            </span>
            <span className={c.shortcutDescription}>{description}</span>
        </li>
    );
};

export default ({children, visible}) => {
    const keys = children.map(key => pick(key.props, ['pattern', 'description']));
    const groups = Object.entries(groupBy(keys, 'description'));

    return (
        <div className={c.root} style={{display: visible ? '' : 'none'}}>
            {children}
            <h2 className={c.shortcutTitle}>键盘操作</h2>
            <ul>
                {groups.map(shortcutItem)}
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
