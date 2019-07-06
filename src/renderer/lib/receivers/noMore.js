import {showServerAlert} from '../../actions';

export default ({direction}) => showServerAlert('不能继续往' + (direction === 'forward' ? '后' : '前') + '翻了');
