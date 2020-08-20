import {ThunkDispatch} from 'redux-thunk';
import {State} from '../store';

export type Dispatch = ThunkDispatch<State, any, any>;

export type GetState = () => any;
