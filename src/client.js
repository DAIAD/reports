import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import 'babel-polyfill';

import App from './containers';
import myApp from './reducers';

import '../assets/style.css';
import '../assets/fonts';
import '../assets/logo.png';

let middleware = [thunkMiddleware];

if (process.env.NODE_ENV === 'development') {
  middleware = [...middleware, createLogger()];
}
const initialState = window.__INITIAL_STATE__;
const store = createStore(myApp, initialState, applyMiddleware(...middleware));

if (initialState.errors.length > 0) {
  initialState.errors.forEach(error => {
    console.error(error);
  });
}
render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);
