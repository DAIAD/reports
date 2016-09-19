var callAPI = require('./base');

var userAPI = {
  getProfile: function(data) {
    return callAPI('/v1/profile/load', data);
  },
};

module.exports = userAPI;

