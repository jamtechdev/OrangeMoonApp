/* eslint-disable prettier/prettier */
import {
    LOGIN_SUCCESS,
    LOGOUT_SUCCESS,
} from '../actions/authActions';

const initialState = {
    loading: false,
    user: null,
    token:null,
    error: null,
};

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN_SUCCESS:
            return {
                ...state,
                loading: false,
                user: action.payload,
                token: action.token,
                error: null,
            };
        case LOGOUT_SUCCESS:
            return {
                ...state,
                loading: false,
                user: null,
                token:null,
                error: null,
            };
        default:
            return state;
    }
};

export default authReducer;
