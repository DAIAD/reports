import moment from 'moment';

import userAPI from '../api/user';
import messageAPI from '../api/messages';

import QueryActions from './QueryActions';
import { utils } from 'daiad-home-web';
const { general: genUtils, device: devUtils } = utils;

import { addLocaleData } from 'react-intl';

import enLocaleData from 'react-intl/locale-data/en';
import elLocaleData from 'react-intl/locale-data/el';
import esLocaleData from 'react-intl/locale-data/es';
import deLocaleData from 'react-intl/locale-data/de';

addLocaleData(enLocaleData);
addLocaleData(elLocaleData);
addLocaleData(esLocaleData);
addLocaleData(deLocaleData);

import 'intl';
import 'intl/locale-data/jsonp/en.js';
import 'intl/locale-data/jsonp/el.js';
import 'intl/locale-data/jsonp/es.js';
import 'intl/locale-data/jsonp/de.js';

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

const setWidgets = function(widgets) {
  return {
    type: 'SET_WIDGETS',
    widgets,
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
      return response.messages
      // filter out tips without images
      .filter(m => m.imageEncoded)
      // and tips with long descriptions
      .filter(m => m.description && m.description.length < 135);

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
 
    const deviceKeys = Array.isArray(profile.devices) && 
      profile.devices
      .filter(dev => dev.type === 'AMPHIRO')
      .map(dev => dev.deviceKey);

    const hasMeters = devUtils.getMeterCount(profile.devices) > 0;
    const hasAmphiros = devUtils.getDeviceCount(profile.devices) > 0;

    const members = profile.household && profile.household.members;

    // expand amphiro chart widgets to as many amphiro devices there are
    const widgets = getState().widgets
    .filter(w => hasMeters ? true : w.deviceType !== 'METER')
    .filter(w => hasAmphiros ? true : w.deviceType !== 'AMPHIRO')
    .reduce((p, c) => c.type === 'total' && c.deviceType === 'AMPHIRO' && c.display === 'chart' ? [...p, ...deviceKeys.map((deviceKey, i) => ({ ...c, deviceKey, id: `${c.id}${i}` }))] : [...p, c], []);
    
    dispatch(setWidgets(widgets));

    return widgets.map(widget => {
      const { type, deviceType, period, id } = widget;
      
      if (!id || !type || !deviceType) 
        throw new Error('prepareWidgets: Insufficient data provided ' +
                        'in widget (requires at least id, type, deviceType)');
      const fromDate = getState().date.from;
      const toDate = getState().date.to;
      const month = {
        startDate: fromDate,
        endDate: toDate,
        granularity: 2
      };

      // calculate time of year with/without next month for forecasting
      const timeBeforeNextMonth = {
        startDate: moment(fromDate).month() === 11 ? 
          moment(fromDate).add(1, 'year').startOf('year').valueOf() 
          : moment(fromDate).startOf('year').valueOf(),
        endDate: moment(fromDate).month() === 11 ? 
          moment(toDate).endOf('month').valueOf() 
          : moment(toDate).endOf('month').valueOf(),
        granularity: 4,
      };
      const timeWithNextMonth = {
        ...timeBeforeNextMonth,
        endDate: moment(timeBeforeNextMonth.endDate)
        .startOf('week').add(1, 'month').endOf('month').valueOf(),
      };

      const randomTipIndex = tips && tips.length && Math.floor(Math.random() * tips.length) || 0;
      const data = {
        time: type === 'forecast' ? timeBeforeNextMonth : month,
        forecastTime: type === 'forecast' ? timeWithNextMonth : null, 
        deviceKey: widget.deviceKey ? [widget.deviceKey] : deviceKeys,
        deviceName: widget.deviceKey ? devUtils.getDeviceNameByKey(profile.devices, widget.deviceKey) : null, 
        members,
        brackets: type === 'pricing' ? brackets : null,
        breakdown: type === 'breakdown' ? breakdown : null,
        tip: type === 'tip' ? tips && tips[randomTipIndex] : null,
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
