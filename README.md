# Introduction

A universal JS application that produces user water consumption reports for [DAIAD](http://www.daiad.eu/) with the ability to render to PDF files on the backend with the help of [phantomJS](http://phantomjs.org/). The application uses [Express](http://expressjs.com/), [React](https://facebook.github.io/react/), [Redux](http://redux.js.org/), [Webpack](https://webpack.github.io/)

# Installation (Development)

For faster development, Webpack's Hot Module Replacement feature has been enabled (compatibility with React+Redux with [React-hot-loader](https://github.com/gaearon/react-hot-loader)). For easier debugging, the HTTP method accepted by the backend is GET. Also, logging is enabled on the client.

* `npm install`
* `npm run dev`

> Note: The host and the port for the Node server, as well as the host and port for the hotload server can be changed in the config section of package.json 

# Installation (Production)

In production mode, deployment has been optimized for speed. The HTTP method accepted by the backend is POST. 

* `npm install`
* `npm run prod`

> Note: The host and the port for the Node server can be changed in the config section of package.json 

# Execution

* `phantomjs saveToPDF.js URL API locale username password from to output`

| Parameter | Description |
| --------- | ----------- |
| URL       | The NODE server url |
| API       | The API endpoint |
| locale    | The locale for page rendering (one of en, el, es) |
| username  | The username of the relevant user |
| password  | The user's password |
| from      | The beginning of the period date in ISO-8061 form (YYYYMMDD) |
| to        | The end of the period date in ISO-8061 form (YYYYMMDD) |
| output    | The output filename (the extension can be one of pdf, png) |

#### Example usage  
`phantomjs saveToPdf.js http://localhost:3000/ http://localhost:8888/api en user1@daiad.eu 12345678 20160101 20161231 out.pdf`

# Known issues

* For correct phantomjs PDF font rendering, required fonts should be copied or symlinked to ~/.fonts for the src:local CSS rule to work. Otherwise font will not be embeded and will be rendered as image instead.
See: https://github.com/rposborne/wkhtmltopdf-heroku/issues/20#issuecomment-115338687
