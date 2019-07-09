export const SHOW_LOADING = 'SHOW_LOADING';
export const HIDE_LOADING = 'HIDE_LOADING';
export const SHOW_MESSAGE = 'SHOW_MESSAGE';
export const HIDE_MESSAGE = 'HIDE_MESSAGE';

export const showLoading = () => ({type: SHOW_LOADING});

export const hideLoading = () => ({type: HIDE_LOADING});

export const showAlert = (title, content = null) => dispatch => {
    dispatch({type: SHOW_MESSAGE, payload: {title, content}});

    setTimeout(() => dispatch({type: HIDE_MESSAGE}), 5000);
};

export const showServerAlert = (title, content) => dispatch => {
    dispatch(hideLoading());

    dispatch(showAlert(title, content));
};
