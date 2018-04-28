export default ({visible}) => {
    const iframeSrc = visible ? 'https://www.taobao.com' : 'about:blank';
    return <webview className="disturb" src={iframeSrc} style={{display: visible ? '' : 'none'}}></webview>;
};
