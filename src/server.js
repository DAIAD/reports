import Express from 'express';

import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { renderToString } from 'react-dom/server';
import bodyParser from 'body-parser';
import moment from 'moment';
import validator from 'validator';
import devConfig from '../webpack.config.dev';
import prodConfig from '../webpack.config';

import { init } from './actions';
import myApp from './reducers';
import App from './containers';

const app = Express();

const PORT = process.env.NODE_PORT || 3000;
const HOST = process.env.NODE_HOST || 'localhost';
const NODE_ENV = process.env.NODE_ENV || 'development';

if (NODE_ENV === 'development') {
  var SCRIPT = `<script src="${devConfig.output.publicPath}${devConfig.output.filename}"></script>`;
}
else {
  var SCRIPT = `<script src="dist/${prodConfig.output.filename}"></script>`;
}

app.use('/dist', Express.static('dist'));
app.use(bodyParser.json());

app.use(handleRequest);
//app.post('/', handleRequest);

function validateInput(options) {
  const { locale, username, password, from, to, api } = options;

  if (!locale || !username || !password || !from || !to || !api) {
    throw 'not all required parameters provided, need locale, username, password, from, to, api';
  }
  if (!validator.isIn(locale, ['en', 'el', 'es'])) {
    throw 'locale must be one of en, el, es';
  }
  if (!validator.isEmail(username)) {
    throw 'username not valid';
  }
  if (!validator.isISO8601(from)) {
    throw 'from date must be a valid ISO-8601 date (YYYYMMDD)';
  }
  if (!validator.isISO8601(to)) {
    throw 'to date must be a valid ISO-8601 date (YYYYMMDD)';
  }
  if (moment(to, 'YYYYMMDD') - moment(from, 'YYYYMMDD') < 0) {
    throw 'to date must be after from date';
  } 
  if (!validator.isURL(api, {protocols: ['http', 'https'], require_protocol: true})) {
    throw 'api must be a valid http or https url (including protocol)';
  }
}

function handleRequest (req, res) {

  //GET request in development
  if (NODE_ENV === 'development') {
    var { locale='en', username, password, from, to, api } = req.query;
    //var { locale='en', username, password, from, to, api } = req.body;

  }
  //POST request in production
  else {
    var { locale='en', username, password, from, to, api } = req.body;
    //var { locale='en', username, password, from, to, api } = req.query;
  }

  try {
    validateInput({ locale, username, password, from, to, api });
  }
  catch(err) {
    res.status(400).send(`Input validation error: ${err}`);
  }

  const store = createStore(myApp, applyMiddleware(thunkMiddleware));

  store.dispatch(init({ locale, from, to, api, credentials: {username, password} }))
  .then(() => {

    const html = renderToString(
      <Provider store={store}>
        <App />
      </Provider>
    );
    const initialState = store.getState();

    res.status(200).send(renderFullPage(html, initialState));
    })
    .catch((err) => {
      console.error('Oops, sth went wrong: ', err);
      res.status(400).send(`Sorry, couldn\'t render due to: ${err}`); 
    });
}

function renderFullPage(html, initialState) {
  return `
  <!doctype html>
  <html>
    <head>
      <title>DAIAD PDF Reports</title>
      <link href="dist/style.css" rel="stylesheet" />
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

app.listen(PORT, HOST, function() {
  console.log(`Node listening on port: ${PORT} in ${NODE_ENV} mode`);
});
