var fetch = require('isomorphic-fetch');
require('es6-promise').polyfill();

var callAPI = function(url, data, method="POST") {
  const { api } = data;
  delete data.api;

  let fetchObj = {
    method: method,
    headers: {
      'Accept': "application/json",
      'Content-Type': "application/json",
    },
    ...((method === 'POST' || method === 'PUT') ?
                ({ body: JSON.stringify(data) })
                          : {}),
  };

  const finalUrl = `${api}${url}`;

  return fetch(finalUrl, fetchObj) 
  .then(response => { 
    if (response.status >= 200 && response.status < 300) 
      return response.json(); 
    else 
      throw new Error('invalid call'); 
  });
};

module.exports = callAPI;
