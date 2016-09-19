import moment from 'moment';

import { fetchInfoboxData } from '../common/actions/QueryActions';
import { fetchProfile } from './UserActions';

import { lastNFilterToLength, flattenMessages } from '../common/utils/general';
import { getDeviceKeysByType } from '../common/utils/device';

import { addLocaleData } from 'react-intl';

import enLocaleData from 'react-intl/locale-data/en';
import elLocaleData from 'react-intl/locale-data/el';
//import esLocaleData from 'react-intl/locale-data/es';
//import deLocaleData from 'react-intl/locale-data/de';

addLocaleData(enLocaleData);
addLocaleData(elLocaleData);
//addLocaleData(esLocaleData);
//addLocaleData(deLocaleData);

import enMessages from '../i18n/en';
import elMessages from '../i18n/el';

export const doNothing = function() {
  return {
    type: 'DO_NOTHING'
  }
};

export const setLocale = function(locale) {
  return {
    type: 'SET_LOCALE',
    locale
  }
};

const setI18nMessages = function(messages) {
  return {
    type: 'SET_I18N_MESSAGES',
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

export const init = function(options) {
  return function(dispatch, getState) {
    const { api, from, to, locale, credentials } = options;
    const { username, password } = credentials;

    dispatch(changeLocale(locale));
    dispatch(setDateRange(from, to));
    
    return dispatch(fetchProfile({username, password, base: api}))
    .then((profile) => {
      dispatch(prepareInfoboxes(options));
      return dispatch(fetchAllInfoboxesData())
        .then(() => {
          return Promise.resolve();
        });

    })
  };
};

const changeLocale = function(locale) {
  return function(dispatch, getState) {
    dispatch(setLocale(locale));

    switch (locale) {
      
      case 'en': 
        dispatch(setI18nMessages(flattenMessages(enMessages)));
        break;
        /*
        require.ensure([
          'react-intl/locale-data/en',
          //'../i18n/en'
        ], require => {
          addLocaleData(require('react-intl/locale-data/en'));
          dispatch(setI18nMessages(require('../i18n/en')));
          });
          */

      
        case 'el': 
          dispatch(setI18nMessages(flattenMessages(elMessages)));
          break;
          /*
        require.ensure([
          'react-intl/locale-data/el',
          //'../i18n/el'
        ], require => {
          addLocaleData(require('react-intl/locale-data/el'));
          dispatch(setI18nMessages(require('../i18n/el')));
          });
          */

      default:
        break;
    }

  };
};

const setInfoboxData = function(id, data) {
  return {
    type: 'SET_INFOBOX_DATA',
    id,
    data
  };
};

const prepareInfoboxes = function(options) {
  return function(dispatch, getState) {
    
    const { credentials, from, to, api } = options;
    if (!credentials || !from || !to) throw new Error('prepareInfoboxes: Insufficient data provided (requires credentials, from, to)');

    return getState().infobox.map(infobox => {

    const { type, deviceType, period, id } = infobox;
    
    if (!id || !type || !deviceType) throw new Error('prepareInfoboxes: Insufficient data provided in infobox (requires id, type, deviceType)');

    const startDate = moment(from, 'YYYYMMDD').valueOf();
    const endDate = moment(to, 'YYYYMMDD').valueOf();
    //const startDate = moment(`01-${month}-${year}`, 'DD-MM-YYYY').valueOf();
    //const endDate = moment(startDate).endOf('month').valueOf();

    const prevStartDate = moment(startDate).subtract(1, 'month').valueOf();
    const prevEndDate = moment(startDate).endOf('month').valueOf();
    
    const data = {};
    data.time = {
          startDate,
          endDate,
          granularity: 3
    };

    const deviceKey = getDeviceKeysByType(getState().profile.devices, deviceType);

    if (deviceType === 'METER') {

      data.query = {
        deviceKey,   
        credentials,
        base: api
      }; 

      if (type === 'total') {
        //prev month
        //data.query.prevTime = getPreviousPeriodSoFar(period);
        data.prevTime = {
          startDate: prevStartDate,
          endDate: prevEndDate,
          granularity: 3
        };
      }
    }
    else if (deviceType === 'AMPHIRO') {
      data.query = {
        deviceKey,
        type: 'SLIDING',
        length: lastNFilterToLength(period),
        credentials,
        base: api
      }
        //return dispatch(queryDevice({deviceKey:device, type: 'SLIDING', length:lastNFilterToLength(period), csrf: getState().user.csrf}))
    }

    dispatch(setInfoboxData(id, Object.assign({}, data)));
  });

  };
};

const fetchAllInfoboxesData = function() {
  return function(dispatch, getState) {

    return getState().infobox.map(infobox => {
      return fetchInfoboxData(infobox);
    })
    .reduce((prev, curr, i, arr) => {
      return prev.then(() => {
        return dispatch(curr)
        .then(res => {
          const id = getState().infobox[i].id;
          dispatch(setInfoboxData(id, res));
        })
        .catch(err => {
          console.error('couldnt set infobox data cause of', err);
          dispatch(setInfoboxData(id, {data: [], error: 'Oops, sth went wrong'}));
        });
      });
    }, Promise.resolve());

  };
};




