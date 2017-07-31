import Express from 'express';

import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { renderToString } from 'react-dom/server';
import bodyParser from 'body-parser';
import moment from 'moment';
import validator from 'validator';

import { init, setError } from './actions';
import myApp from './reducers';
import App from './containers';

import PUBLIC_PATH from '../path';

const app = Express();

const PORT = process.env.NODE_PORT || 3000;
const HOST = process.env.NODE_HOST || 'localhost';
const HOTLOADHOST = process.env.HOT_LOAD_HOST;
const HOTLOADPORT = process.env.HOT_LOAD_PORT;
const NODE_ENV = process.env.NODE_ENV || 'development';


if (NODE_ENV === 'development') {
  var SCRIPT = `<script src="http://${HOTLOADHOST}:${HOTLOADPORT}${PUBLIC_PATH}/bundle.js"></script>`;
  // for react-echarts
  console.debug = function(/* ...args */) {
    var vargs = Array.prototype.slice.call(arguments);
    console.log.apply(this, vargs);
  };
}
else {
  var SCRIPT = `<script src="${PUBLIC_PATH}/bundle.js"></script>`;
}

//pass top-level error to client to be caught by phantomjs
function handleError (error, req, res, next) {
  console.error(error);

  const store = createStore(myApp, applyMiddleware(thunkMiddleware));
  store.dispatch(setError(error.toString()));
  const initialState = store.getState();
  res.status(200).send(renderFullPage('', initialState));
}

function handleRequest (req, res, next) {
  //Accept both GET (development only) and POST requests
  if (req.method === 'GET' && NODE_ENV === 'development') {
    var { locale='en', username, password, userKey, from, to, api } = req.query;
  }
  else if (req.method === 'POST') {
    var { locale='en', username, password, from, to, api, userKey } = req.body;
  }

  // validate input
  try {
    validateInput({ locale, username, password, userKey, from, to, api });
  }
  catch(err) {
    next(new Error(`input validation error: ${err}`));
  }

  // initialize data
  const store = createStore(myApp, applyMiddleware(thunkMiddleware));
  
  store.dispatch(init({ locale, from, to, api, userKey, credentials: {username, password} }))
  .then(() => {
    // render
    const html = renderToString(
      <Provider store={store}>
        <App />
      </Provider>
    );
    const initialState = store.getState();
    res.status(200).send(renderFullPage(html, initialState));
  })
  .catch((err) => {
    next(err);
  });  
}

function validateInput(options) {
  const { locale, username, password, userKey, from, to, api } = options;

  if (!locale || !username || !password || !from || !to || !api || !userKey) {
    throw new Error('not all required parameters provided, need locale, username, password, userKey, from, to, api');
  }
  if (!validator.isIn(locale, ['en', 'el', 'es'])) {
    throw new Error('locale must be one of en, el, es');
  }
  if (!validator.isISO8601(from)) {
    throw new Error('from date must be a valid ISO-8601 date (YYYYMMDD)');
  }
  if (!validator.isISO8601(to)) {
    throw new Error('to date must be a valid ISO-8601 date (YYYYMMDD)');
  }
  if (moment(to, 'YYYYMMDD') - moment(from, 'YYYYMMDD') < 0) {
    throw new Error('to date must be after from date');
  } 
  if (!validator.isURL(api, {protocols: ['http', 'https'], require_protocol: true})) {
    throw new Error('api must be a valid http or https url (including protocol)');
  }
  if (!validator.isUUID(userKey)) {
    throw new Error('user key must be valid UUID');
  }
}

function renderFullPage(html, initialState) {
  return `
  <!doctype html>
  <html>
    <head>
      <title>DAIAD PDF Reports</title>
      <link href="${PUBLIC_PATH}/style.css" rel="stylesheet" />
      <link rel="icon" href="data:;base64,iVBORw0KGgo=">
    </head>
    <body>
  <div id="app">${html}</div>
  <script> 
    window.__INITIAL_STATE__ = ${JSON.stringify(initialState)}
  </script>
    ${SCRIPT}
    </body>
  </html>
  ` 
}

app.use('/assets', Express.static('assets'));
app.use(bodyParser.json());

app.use(handleRequest);
app.use(handleError);

app.listen(PORT, HOST, function() {
  console.log(`Node listening on port: ${PORT} in ${NODE_ENV} mode`);
});
