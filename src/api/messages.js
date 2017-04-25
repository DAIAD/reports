const callAPI = require('./base');

const MessageAPI = {
  fetchTips: function ({ locale, ...rest }) {
    return callAPI(`/v1/tip/localized/${locale}`, rest);
  },
};

module.exports = MessageAPI;

