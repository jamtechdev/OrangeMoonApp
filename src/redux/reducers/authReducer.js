/* eslint-disable prettier/prettier */
import {
    LOGIN_SUCCESS,
    LOGOUT_SUCCESS,
    ROUTE_VALUE
} from '../actions/authActions';

const initialState = {
    loading: false,
    user: null,
    token:null,
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
                token:null,
                error: null,
            };
            case ROUTE_VALUE:
                console.log(action.payload, 'payload ')
                return {
                    ...state,
                    value:action.payload,
                };
        default:
            return state;
    }
};

export default authReducer;
