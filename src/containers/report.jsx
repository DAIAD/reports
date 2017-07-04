import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { IntlProvider, injectIntl } from 'react-intl';
import IntlPolyfill from 'intl';
import moment from 'moment';
import * as myActions from '../actions';
import Report from '../components';

import { utils } from 'daiad-home-web';
const { widgets: prepareWidget } = utils;
const { device: devUtils } = utils;

const mapStateToProps = (state, ownProps)  => ({
  ...state.user.profile,
  utility: state.user.profile.utility.name || 'DAIAD',
  logo: state.user.profile.utility.logo || 'logo.png',
  url: state.user.profile.utility.url || 'https://app.dev.daiad.eu/home/',
  date: state.date,
  widgets: state.widgets, 
})

const mapDispatchToProps = (dispatch) => bindActionCreators(myActions, dispatch);

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const meters = devUtils.getAvailableMeters(stateProps.devices);
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    serial: meters.length > 0 ? meters[0].serial : '-',
    widgets: stateProps.widgets.map(widget => prepareWidget({
      ...widget, 
      devices: stateProps.devices, 
    },
      ownProps.intl)),
  };
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps, mergeProps)(Report));
