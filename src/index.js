// import 'babel-core/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import Root from './containers/Root';
import configureStore from './store/configureStore';
import {loginUserSuccess} from './actions';

import './styles/styles.css';

const target = document.getElementById('root');
export const store = configureStore(window.__INITIAL_STATE__);

const node = (
    <Root store={store} />
);

let token = localStorage.getItem('token');
token = JSON.parse(token);
if (token !== null) {
    store.dispatch(loginUserSuccess(token));
}

ReactDOM.render(node, target);
