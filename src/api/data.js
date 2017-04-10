const callAPI = require('./base');

const DataAPI = {
  query: function (data) {
    return callAPI('/v1/data/query', data);
  },
  getForecast: function (data) {
    return callAPI('/v1/data/meter/forecast', data);
  },
  getComparisons: function ({ month, year, userKey, api, credentials }) {
    return callAPI(`/v1/comparison/${year}/${month}/${userKey}`, { api, ...credentials });
  }, 
  getWaterBreakdown: function ({ api, credentials }) {
    return callAPI('/v1/water-calculator/water-breakdown', { api, credentials });
  },
  getPriceBrackets: function ({ api, credentials, userKey }) {
    return callAPI('/v1/billing/price-bracket', { userKey, api, credentials });
  },
};

module.exports = DataAPI;

