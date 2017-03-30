import {pick, groupBy} from 'lodash';

let shortcutItem = ([description, items]) => {
    return (
        <li key={description} className="shortcut-item">
            <span className="short-key-list">
                {items.map(({char}) => <kbd key={char} className="shortcut-key">{char === ' ' ? 'SPACE' : char}</kbd>)}
            </span>
            <span className="shortcut-description">{description}</span>
        </li>
    );
};

export default ({children, visible}) => {
    let keys = children.map(key => pick(key.props, ['char', 'description']));
    let groups = Object.entries(groupBy(keys, 'description'));

    return (
        <div className="help" style={{display: visible ? '' : 'none'}}>
            {children}
            <h2 className="shortcut-title">键盘操作</h2>
            <ul>
                {groups.map(shortcutItem)}
            </ul>
            <h2 className="contact-title">联系作者</h2>
            <a id="github-issues" href="http://github.com/otakustay/icarus/issues" target="_blank">前往 GitHub Issues</a>
        </div>
    );
};
