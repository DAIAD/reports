# Introduction

A universal JS application that produces user water consumption reports for [DAIAD](http://www.daiad.eu/) with the ability to render to PDF files on the backend with the help of [phantomJS](http://phantomjs.org/).

# Installation (Development)

npm install
npm run dev

# Installation (Production)

npm install
npm run prod

# Execution

phantomjs saveToPDF.js URL API locale username password from to filename

URL: The NODE server url
API: The API endpoint 
locale: The locale for page rendering (one of en, el)
username: the username
password: the user's password
from: Date for the beginning of the period in ISO-8061 form
to: Date for the end of the period in ISO-8061 form
output: The output filename (the extension can be one of pdf, png)

example: ./phantomjs saveToPdf.js http://localhost:3000/ http://localhost:8888/api en user1@daiad.eu 12345678 20160101 20161231 out.pdf

** Important
For correct phantomjs PDF font rendering, required fonts should be copied or symlinked to ~/.fonts for the src:local CSS rule to work. Otherwise font will not be embeded and rendered as image instead.

See: https://github.com/rposborne/wkhtmltopdf-heroku/issues/20#issuecomment-115338687
