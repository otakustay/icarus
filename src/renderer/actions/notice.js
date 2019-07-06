export const SHOW_LOADING = 'SHOW_LOADING';
export const HIDE_LOADING = 'HIDE_LOADING';
export const SHOW_MESSAGE = 'SHOW_MESSAGE';
export const HIDE_MESSAGE = 'HIDE_MESSAGE';

export const showLoading = () => ({type: SHOW_LOADING});

export const hideLoading = () => ({type: HIDE_LOADING});

export const showAlert = message => dispatch => {
    dispatch({type: SHOW_MESSAGE, message: message});

    setTimeout(() => dispatch({type: HIDE_MESSAGE}), 5000);
};

export const showServerAlert = message => dispatch => {
    dispatch(hideLoading());

    dispatch(showAlert(message));
};
