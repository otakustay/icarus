import {pick, groupBy} from 'lodash';

const displayPattern = pattern => {
    const names = pattern.split('+');
    const char = names.pop();
    return [...names, char === ' ' ? 'SPACE' : char].join(' + ');
};

const shortcutItem = ([description, items]) => {
    return (
        <li key={description} className="shortcut-item">
            <span className="short-key-list">
                {items.map(({pattern}) => <kbd key={pattern} className="shortcut-key">{displayPattern(pattern)}</kbd>)}
            </span>
            <span className="shortcut-description">{description}</span>
        </li>
    );
};

export default ({children, visible}) => {
    const keys = children.map(key => pick(key.props, ['pattern', 'description']));
    const groups = Object.entries(groupBy(keys, 'description'));

    return (
        <div className="help" style={{display: visible ? '' : 'none'}}>
            {children}
            <h2 className="shortcut-title">键盘操作</h2>
            <ul>
                {groups.map(shortcutItem)}
            </ul>
            <h2 className="contact-title">联系作者</h2>
            <a id="github-issues" href="http://github.com/otakustay/icarus/issues" target="_blank" rel="noopener noreferrer">前往 GitHub Issues</a>
        </div>
    );
};
