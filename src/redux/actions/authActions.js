/* eslint-disable prettier/prettier */

// Action Types
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const ROUTE_VALUE = 'ROUTE_VALUE';

// Action Creators

export const loginSuccess = (response,token) => ({
    type: LOGIN_SUCCESS,
    payload: response,
    token: token,
});

export const logoutSuccess = () => ({
    type: LOGOUT_SUCCESS,
});

export const routeValue = (id) => ({
    type: ROUTE_VALUE,
    payload: id
});
