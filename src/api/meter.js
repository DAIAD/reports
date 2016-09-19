var callAPI = require('./base');

var MeterAPI = {
  getStatus: function(data) {
    return callAPI('/v1/meter/status', data);
  },
  getHistory: function(data) {
    return callAPI('/v1/meter/history', data);
  }
};

module.exports = MeterAPI;

