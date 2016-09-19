var callAPI = require('./base');

var DeviceAPI = {
  querySessions: function(data) {
    return callAPI('/v2/device/session/query', data);
  },
  getSession: function(data) {
    return callAPI('/v2/device/session', data);
  }
};

module.exports = DeviceAPI;

