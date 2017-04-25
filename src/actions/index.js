import moment from 'moment';

import userAPI from '../api/user';
import messageAPI from '../api/messages';

import QueryActions from './QueryActions';
import { utils } from 'daiad-home-web';
const { general: genUtils } = utils;

import { addLocaleData } from 'react-intl';
import enLocaleData from 'react-intl/locale-data/en';
import elLocaleData from 'react-intl/locale-data/el';
import esLocaleData from 'react-intl/locale-data/es';
import deLocaleData from 'react-intl/locale-data/de';

addLocaleData(enLocaleData);
addLocaleData(elLocaleData);
addLocaleData(esLocaleData);
addLocaleData(deLocaleData);

import enHome from 'daiad-home-web/i18n/en.json';
import elHome from 'daiad-home-web/i18n/el.json';
import esHome from 'daiad-home-web/i18n/es.json';
import deHome from 'daiad-home-web/i18n/de.json';

import enReports from '../i18n/en';
import esReports from '../i18n/es';
import elReports from '../i18n/el';
import deReports from '../i18n/de';

// action creators 

const setLocale = function(locale, messages) {
  return {
    type: 'SET_LOCALE',
    locale,
    messages
  }
};

const setDateRange = function(from, to) {
  return {
    type: 'SET_DATE_RANGE',
    from,
    to
  }
};

const setCredentials = function (credentials) {
  return {
    type: 'SET_CREDENTIALS',
    credentials,
  };
};

const setApiURL = function (url) {
  return {
    type: 'SET_API_URL',
    url,
  };
};

const setWidgetData = function(id, data) {
  return {
    type: 'SET_WIDGET_DATA',
    id,
    data
  };
};


const receivedProfile = function(profile) {
  return {
    type: 'USER_RECEIVED_PROFILE',
    profile
  };
};

export const setError = function (error) {
  return {
    type: 'SET_ERROR',
    error,
  };
};

// thunks

const fetchAllTips = function(locale) {
  return function(dispatch, getState) {
    const credentials = getState().credentials;
    const api = getState().api;
    
    return messageAPI.fetchTips({ api, credentials, locale })
    .then((response) => {
      if (!response || !response.success) {
        genUtils.throwServerError(response);  
      }
      return response.messages;
    })
    .catch((error) => {
      console.error('caught error in fetch all tips', error);
    });
  };
};

const fetchUserProfile = function(userKey) {
  return function(dispatch, getState) {
    const credentials = getState().credentials;
    const api = getState().api;

    return userAPI.getUserProfile({ userKey, api, credentials })
    .then((response) => {
      const { success, errors, profile } = response;
      if (!success || (Array.isArray(errors) && errors.length > 0) || !profile) {
        throw 'couldn\'t fetch profile for user ' + userKey;
      }
      dispatch(receivedProfile(profile));
      return profile;
    });
  };
};

const changeLocale = function(locale) {
  return function(dispatch, getState) {
    switch (locale) {
      case 'en': 
        dispatch(setLocale(locale, genUtils.flattenMessages({
          ...enHome,
          ...enReports,
        })));
        break;
      
        case 'el': 
          dispatch(setLocale(locale, genUtils.flattenMessages({
            ...elHome,
            ...elReports,
          })));
          break;
        
        case 'es': 
          dispatch(setLocale(locale, genUtils.flattenMessages({
            ...esHome,
            ...esReports,
          })));
          break;

        case 'de': 
          dispatch(setLocale(locale, genUtils.flattenMessages({
            ...deHome,
            ...deReports,
          })));
          break;

      default:
        break;
    }

  };
};

const fetchWaterBreakdown = function (userKey) {
  return function (dispatch, getState) {
    return dispatch(QueryActions.fetchWaterBreakdown(userKey))
    .then(labels => Array.isArray(labels) ? labels.reverse() : labels);
  };
};

const fetchPriceBrackets = function (userKey) {
  return function (dispatch, getState) {
    return dispatch(QueryActions.fetchPriceBrackets(userKey))
    .then(brackets => Array.isArray(brackets) ? 
          brackets
          .filter(b => b.maxVolume)
          .map(b => ({
            ...b,
            maxVolume: b.maxVolume * 1000,
            minVolume: b.minVolume * 1000,
          }))
          : []);
  };
};

const prepareWidgets = function(options, profile) {
  return function(dispatch, getState) {
    
    const { userKey, credentials, from, to, api, breakdown, brackets, tips } = options;
    if (!credentials || !from || !to || !userKey) 
      throw new Error('prepareWidgets: Insufficient data provided ' +
                      '(requires credentials, from, to, userKey)');
 
    const deviceKey = Array.isArray(profile.devices) && 
      profile.devices
      .filter(dev => dev.type === 'AMPHIRO')
      .map(dev => dev.deviceKey);

    const members = profile.household && profile.household.members;

    return getState().widgets.map(widget => {
      const { type, deviceType, period, id } = widget;
      
      if (!id || !type || !deviceType) 
        throw new Error('prepareWidgets: Insufficient data provided ' +
                        'in widget (requires at least id, type, deviceType)');

      const startDate = getState().date.from;
      const endDate = getState().date.to;
      
      const randomTipIndex = tips && tips.length && Math.floor(Math.random() * (tips.length + 1));

      const data = {
        time: {
          startDate,
          endDate,
          granularity: 2
        },
        deviceKey,
        members,
        brackets: type === 'pricing' ? brackets : null,
        breakdown: type === 'breakdown' ? breakdown : null,
        tips: type === 'tip' ? tips : null,
        tipIndex: randomTipIndex,
        userKey,
        renderAsImage: true,
      };

      dispatch(setWidgetData(id, data));
    });

  };
};

const fetchWidgetData = function(widget) {
  return function (dispatch, getState) {
    return dispatch(QueryActions.fetchWidgetData(widget))
    .then((res) => {
      dispatch(setWidgetData(widget.id, res));
    })
    .catch((error) => { 
      console.error('Caught error in widget data fetch:', error); 
      dispatch(setWidgetData(widget.id, { data: [], error: 'Oops sth went wrong, please contact us' })); 
  }); 
  };
};

const fetchAllWidgetData = function(options) {
  return function(dispatch, getState) {
    const { userKey, credentials, api, from, to } = options;

    return getState().widgets
    .map(widget => fetchWidgetData(widget))
    .reduce((prev, curr) => prev.then(() => dispatch(curr)), Promise.resolve());
  };
};

export const init = function(options) {
  return function(dispatch, getState) {
    const { api, from, to, locale, userKey, credentials } = options;

    const fromTimestamp = moment(from, 'YYYYMMDD').startOf('day').valueOf();
    const toTimestamp = moment(to, 'YYYYMMDD').endOf('day').valueOf();

    dispatch(changeLocale(locale));
    dispatch(setCredentials(credentials));
    dispatch(setApiURL(api));
    dispatch(setDateRange(fromTimestamp, toTimestamp));

    return Promise.all([
      dispatch(fetchUserProfile(userKey)),
      dispatch(fetchWaterBreakdown(userKey)),
      dispatch(fetchPriceBrackets(userKey)),
      dispatch(fetchAllTips(locale))
    ])
    .then(([profile, breakdown, brackets, tips]) => {
      dispatch(prepareWidgets({ ...options, breakdown, brackets, tips }, profile));
      return dispatch(fetchAllWidgetData(options));
    })
    .catch((err) => {
      console.error('error while initing: ', err);
      // need to set error as string 
      // cause initial state object will be stringified to pass to client
      dispatch(setError(err.toString()));
    });
  };
};
