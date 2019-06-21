/**
 * @file Display alert messages
 * @author zhanglili
 */

export default ({visible, content}) => <div className="warn" style={{display: visible ? '' : 'none'}}>{content}</div>;
