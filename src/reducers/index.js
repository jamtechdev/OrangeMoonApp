/* eslint-disable prettier/prettier */
import {combineReducers} from 'redux';


const LOGIN = 'LOGIN';
const LOGOUT = 'LOGOUT';

const initialAuthState = {isLoggedIn: false};

export const login = (user) => ({
  type: LOGIN,
  user,
});

export const logout = (user) => ({
  type: LOGIN,
});

function auth(state = initialAuthState, action) {
  switch (action.type) {
    case LOGIN:
      console.log(action,"reducer")
      return {...state, 
        isLoggedIn: true,
        user: action.user};
    case LOGOUT:
      return {...state, isLoggedIn: false, user: {}};
    default:
      return state;
  }
}



const AppReducer = combineReducers({
  auth,
});

export default AppReducer;
