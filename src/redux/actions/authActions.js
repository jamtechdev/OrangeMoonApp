/* eslint-disable prettier/prettier */

// Action Types
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';


// Action Creators

export const loginSuccess = (response,token) => ({
    type: LOGIN_SUCCESS,
    payload: response,
    token: token,
});

export const logoutSuccess = () => ({
    type: LOGOUT_SUCCESS,
});


