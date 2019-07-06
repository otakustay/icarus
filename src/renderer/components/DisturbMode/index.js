import c from './index.less';

export default ({visible}) => {
    const iframeSrc = visible ? 'https://www.taobao.com' : 'about:blank';
    return <webview className={c.root} src={iframeSrc} style={{display: visible ? '' : 'none'}} />;
};
