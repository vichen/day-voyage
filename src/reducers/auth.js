import {createReducer} from '../utils';
import {
    LOGIN_USER_REQUEST,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_FAILURE,
    LOGOUT_USER,
    SIGNUP_USER_FAILURE,
    SIGNUP_USER_REQUEST,
    SIGNUP_USER
} from '../constants';
import {push} from 'redux-router';


const initialState = {
    token: null,
    user_id: null,
    isAuthenticated: false,
    isAuthenticating: false,
    statusText: null,
    username: null,
    isSigningUp: null,
};

export default createReducer(initialState, {
    [LOGIN_USER_REQUEST]: (state, payload) => {
        return Object.assign({}, state, {
            'isAuthenticating': true,
            'statusText': null
        });
    },
    [LOGIN_USER_SUCCESS]: (state, payload) => {
        return Object.assign({}, state, {
            'isAuthenticating': false,
            'isAuthenticated': true,
            'token': payload.token,
            'user_id': payload.token.user_id,
            'username': payload.token.username,
            'statusText': 'You have been successfully logged in.'
        });

    },
    [LOGIN_USER_FAILURE]: (state, payload) => {
        return Object.assign({}, state, {
            'isAuthenticating': false,
            'isAuthenticated': false,
            'token': null,
            'user_id': null,
            'username': null,
            'statusText': `Authentication Error: ${payload.status} ${payload.statusText}`
        });
    },
    [LOGOUT_USER]: (state, payload) => {
        return Object.assign({}, state, {
            'isAuthenticated': false,
            'token': null,
            'username': null,
            'user_id': null,
            'statusText': 'You have been successfully logged out.',
        });
    },
    [SIGNUP_USER]: (state, payload) => {
        return Object.assign({}, state, {
            'isSigningUp': true
        });
    },
    [SIGNUP_USER_FAILURE]: (state, payload) => {
        return Object.assign({}, state, {
            'isSigningUp': false,
            'statusText': `Problem signing you up. ${payload.status} ${payload.statusText}`,
        });
    },
    [SIGNUP_USER_REQUEST]: (state, payload) => {
        return Object.assign({}, state, {
            'isSigningUp': true,
            'statusText': null
        });
    }
});
