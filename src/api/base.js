var fetch = require('isomorphic-fetch');
require('es6-promise').polyfill();

var callAPI = function(url, data, method="POST") {
  const { csrf, base } = data;
  delete data.csrf;
  delete data.base;

  let fetchObj = {
    method: method,
    headers: {
      'Accept': "application/json",
      'Content-Type': "application/json",
    }
  };
  fetchObj = Object.assign({}, fetchObj, {body:JSON.stringify(data)});

  //const finalUrl = BASE_URL + url;
  const finalUrl = base + url;

  return fetch(finalUrl, fetchObj) 
  .then(response => { 
    if (response.status >= 200 && response.status < 300) 
      return response; 
    else 
      throw new Error(response.statusText); 
  })
  .then(response => response.json()
        .then(json => Object.assign({}, json, {csrf:response.headers.get('X-CSRF-TOKEN')}))
        .catch(error => { console.error('Error parsing response:', error, url, fetchObj);})
       )
   .then(res => { 
     return res;
   });
};

module.exports = callAPI;
