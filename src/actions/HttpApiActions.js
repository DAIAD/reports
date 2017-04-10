import deviceAPI from '../api/device';
import dataAPI from '../api/data';

import { utils } from 'daiad-home-web';
const { 
  general: genUtils,
} = utils;

const queryData = function (options) {
  return function (dispatch, getState) {
    const credentials = getState().credentials;
    const api = getState().api;

    const data = {
      query: options,
      credentials,
      api,
    };

    return dataAPI.query(data)
    .then((response) => {
      if (!response || !response.success) {
        genUtils.throwServerError(response);  
      }
      return response;
    })
    .catch((error) => {
      console.error('caught error in data query: ', error);
      throw error;
    });
  };
};

/**
 * Query Device sessions
 * @param {Object} options - Query options
 * @param {Array} options.deviceKey - Array of device keys to query
 * @param {String} options.type - The query type. One of SLIDING, ABSOLUTE
 * @param {Number} options.startIndex - Start index for ABSOLUTE query
 * @param {Number} options.endIndex - End index for ABSOLUTE query
 * @param {Number} options.length - Length for SLIDING query
 * @return {Promise} Resolve returns Object containing device sessions data 
 * in form {data: sessionsData}, reject returns possible errors
 * 
 */
const queryDeviceSessions = function (options) {
  return function (dispatch, getState) {
    const credentials = getState().credentials;
    const api = getState().api;
    
    const data = {
      ...options,
      credentials,
      api,
    };
    
    return deviceAPI.querySessions(data)
    .then((response) => {
      if (!response || !response.success) {
        genUtils.throwServerError(response);  
      }
      
      return response.devices;
    })
    .catch((error) => {
      throw error;
    });
  };
};

/**
 * Fetch specific device session
 * @param {String} deviceKey - Device keys to query
 * @param {Number} options - Session id to query
 * @return {Promise} Resolve returns Object containing device session data, 
 *  reject returns possible errors
 * 
 */
const fetchDeviceSession = function (options) {
  return function (dispatch, getState) {
    const credentials = getState().credentials;
    const api = getState().api;
    
    const data = {
      ...options,
      credentials,
      api,
    };

    return deviceAPI.getSession(data)
      .then((response) => {
        if (!response || !response.success) {
          genUtils.throwServerError(response);  
        }
        return response.session;
      })
      .catch((errors) => {
        throw errors;
      });
  };
};

const queryMeterForecast = function (options) {
  return function (dispatch, getState) {
    const credentials = getState().credentials;
    const api = getState().api;
    
    const data = {
      query: options, 
      credentials,
      api,
    };

    return dataAPI.getForecast(data)
    .then((response) => {
      if (!response || !response.success || !Array.isArray(response.meters) || 
          !response.meters[0] || !response.meters[0].points) {
        genUtils.throwServerError(response);  
      }
      return response.meters;
    })
    .catch((error) => {
      console.error('caught error in query meter forecast: ', error);
      throw error;
    });
  };
};

const queryUserComparisons = function (options) {
  return function (dispatch, getState) {
    const credentials = getState().credentials;
    const api = getState().api;

    const data = {
      ...options,
      credentials,
      api,
    };

    return dataAPI.getComparisons(data)
    .then((response) => {
      if (!response || !response.success) {
        genUtils.throwServerError(response);  
      } 
      
      return response.comparison;
    })
    .catch((error) => {
      console.error('caught error in fetch user comparisons: ', error);
      throw error;
    });
  };
};

const fetchWaterBreakdown = function (userKey) {
  return function (dispatch, getState) {
    const credentials = getState().credentials;
    const api = getState().api;
    
    const data = {
      credentials,
      api,
      userKey,
    };

    return dataAPI.getWaterBreakdown(data)
    .then((response) => {
      if (!response || !response.success) {
        genUtils.throwServerError(response);  
      }
      return response.labels;
    }) 
    .catch((errors) => {
      console.error('Error caught on fetch water breakdown:', errors);
      return errors;
    });
  };
};

const fetchPriceBrackets = function (userKey) {
  return function (dispatch, getState) {
    const credentials = getState().credentials;
    const api = getState().api;
    
    const data = {
      credentials,
      api,
      userKey,
    };

    return dataAPI.getPriceBrackets(data)
    .then((response) => {
      if (!response || !response.success) {
        genUtils.throwServerError(response);  
      }
      return response.brackets;
    }) 
    .catch((errors) => {
      console.error('Error caught on get price brackets:', errors);
      return errors;
    });
  };
};

module.exports = {
  queryData,
  queryDeviceSessions,
  fetchDeviceSession,
  queryMeterForecast,
  queryUserComparisons,
  fetchWaterBreakdown,
  fetchPriceBrackets,
};
