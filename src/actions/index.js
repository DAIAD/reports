import moment from 'moment';

import userAPI from '../api/user';
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

import enMessages from '../i18n/en';
import esMessages from '../i18n/es';
import elMessages from '../i18n/el';

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


const receivedProfile = function(success, errors, profile) {
  return {
    type: 'USER_RECEIVED_PROFILE',
    profile
  };
};

// thunks

const fetchUserProfile = function(userKey) {
  return function(dispatch, getState) {
    const credentials = getState().credentials;
    const api = getState().api;

    return userAPI.getUserProfile({ userKey, api, credentials })
    .then((response) => {
      const { success, errors, profile } = response;
      dispatch(receivedProfile(success, errors.length ? errors[0].code : null, profile));
      return profile;
    })
    .catch((errors) => {
      console.error('Error caught on profile fetch:', errors);
      return errors;
      });
  };
};

const changeLocale = function(locale) {
  return function(dispatch, getState) {
    switch (locale) {
      case 'en': 
        dispatch(setLocale(locale, genUtils.flattenMessages(
          enMessages,
        )));
        break;
      
        case 'el': 
          dispatch(setLocale(locale, genUtils.flattenMessages(
            elMessages,
          )));
          break;
        
        case 'es': 
          dispatch(setLocale(locale, genUtils.flattenMessages(
            esMessages,
          )));
          break;

        case 'de': 
          dispatch(setLocale(locale, genUtils.flattenMessages(
            deMessages,
          )));
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
    return dispatch(QueryActions.fetchPriceBrackets(userKey));
  };
};

const prepareWidgets = function(options, profile, breakdown, brackets) {
  return function(dispatch, getState) {
    
    const { userKey, credentials, from, to, api } = options;
    if (!credentials || !from || !to || !userKey) 
      throw new Error('prepareInfoboxes: Insufficient data provided ' +
                      '(requires credentials, from, to, userKey)');
 
    const deviceKey = Array.isArray(profile.devices) && 
      profile.devices
      .filter(dev => dev.type === 'AMPHIRO')
      .map(dev => dev.deviceKey);

    const members = profile.household && profile.household.members;

    return getState().widgets.map(widget => {
      const { type, deviceType, period, id } = widget;
      
      if (!id || !type || !deviceType) throw new Error('prepareInfoboxes: Insufficient data provided in widget (requires id, type, deviceType)');

      const startDate = getState().date.from;
      const endDate = getState().date.to;
      
      const data = {
        time: {
          startDate,
          endDate,
          granularity: 2
        },
        deviceKey,
        members,
        brackets,
        breakdown,
        userKey,
      };

      dispatch(setWidgetData(id, Object.assign({}, data)));
    });

  };
};

const fetchAllWidgetData = function(options) {
  return function(dispatch, getState) {
    const { userKey, credentials, api, from, to } = options;

    return getState().widgets
    .map(widget => QueryActions.fetchWidgetData(widget))
    .reduce((prev, curr, i, arr) => {
      return prev.then(() => {
        return dispatch(curr)
        .then(res => {
          if (getState().widgets[i]) {
            const id = getState().widgets[i].id;
            dispatch(setWidgetData(id, res));
          }
        })
        .catch(err => {
          if (getState().widgets[i]) {
            const id = getState().widgets[i].id;
            console.error('couldnt set widget data cause of', err);
            dispatch(setWidgetData(id, {data: [], error: 'Oops, sth went wrong'}));
          }
        });
      });
    }, Promise.resolve());

  };
};

export const init = function(options) {
  return function(dispatch, getState) {
    const { api, from, to, locale, userKey, credentials } = options;

    const fromTimestamp = moment(from, 'YYYYMMDD').valueOf();
    const toTimestamp = moment(to, 'YYYYMMDD').valueOf();

    dispatch(changeLocale(locale));
    dispatch(setCredentials(credentials));
    dispatch(setApiURL(api));
    dispatch(setDateRange(fromTimestamp, toTimestamp));

    return Promise.all([
      dispatch(fetchUserProfile(userKey)),
      dispatch(fetchWaterBreakdown(userKey)),
      dispatch(fetchPriceBrackets(userKey))
    ])
    .then(([profile, breakdown, brackets]) => {
      dispatch(prepareWidgets(options, profile, breakdown, brackets));
      return dispatch(fetchAllWidgetData(options));
    });
  };
};
