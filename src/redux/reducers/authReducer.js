/* eslint-disable prettier/prettier */
import {
    LOGIN_SUCCESS,
    LOGOUT_SUCCESS,
    ROUTE_VALUE,
    UPDATE_PROFILE
} from '../actions/authActions';

const initialState = {
    loading: false,
    user: {},
    token: null,
    value: null,
    error: null,
};

const authReducer = (state = initialState, action,) => {
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
                token: null,
                error: null,
            };
        case ROUTE_VALUE:
            return {
                ...state,
                value: action.payload,
            };
        case UPDATE_PROFILE:
            return {
                ...state,
                user: {
                    ...state.user,
                    ...action.payload, // Merge updated profile data
                },
            };
        default:
            return state;
    }
};

export default authReducer;
