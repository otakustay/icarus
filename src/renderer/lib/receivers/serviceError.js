import {showServerAlert} from '../../actions';

export default info => showServerAlert('应用程序出现异常', info.message);
