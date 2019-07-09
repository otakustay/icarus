import {useReducer} from 'react';

export default (initialValue = false) => useReducer(v => !v, initialValue);
