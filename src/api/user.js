var callAPI = require('./base');

var userAPI = {
  getUserProfile: function ({ userKey, api, credentials }) {
    return callAPI(`/v1/profile/load/HOME/${userKey}`, { api, ...credentials });
  },
};

module.exports = userAPI;

