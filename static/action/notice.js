import {SHOW_LOADING, HIDE_LOADING, SHOW_MESSAGE, HIDE_MESSAGE} from './type';

export let showLoading = () => ({type: SHOW_LOADING});

export let hideLoading = () => ({type: HIDE_LOADING});

export let showAlert = message => dispatch => {
    dispatch({type: SHOW_MESSAGE, message: message});

    setTimeout(() => dispatch({type: HIDE_MESSAGE}), 5000);
};

export let showServerAlert = message => dispatch => {
    dispatch(hideLoading());

    dispatch(showAlert('无法找到保存的阅读信息'));
};
