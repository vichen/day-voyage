import {createReducer} from '../utils';
import {RECEIVE_PROTECTED_DATA, 
        FETCH_PROTECTED_DATA_REQUEST,
        RECEIVE_BUDGET} from '../constants';

const initialState = {
    data: null,
    isFetching: false,
    budget: 0
};

export default createReducer(initialState, {
    [RECEIVE_PROTECTED_DATA]: (state, payload) => {
        return Object.assign({}, state, {
            'data': payload.data,
            'isFetching': false
        });
    },
    [FETCH_PROTECTED_DATA_REQUEST]: (state, payload) => {
        return Object.assign({}, state, {
            'isFetching': true
        });
    },

    [RECEIVE_BUDGET]: (state, payload) => {
        return Object.assign({}, state, {
            budget: payload.budget
        })
    }
});
