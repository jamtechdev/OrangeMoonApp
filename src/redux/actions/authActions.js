/* eslint-disable prettier/prettier */

// Action Types
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const ROUTE_VALUE = 'ROUTE_VALUE';
export const UPDATE_PROFILE = 'UPDATE_PROFILE';

// Action Creators

export const loginSuccess = (response, token) => ({
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
export const updateProfile = (updatedProfileData) => {
    return {
        type: UPDATE_PROFILE,
        payload: updatedProfileData,
    };
};