import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { IntlProvider, injectIntl } from 'react-intl';
import IntlPolyfill from 'intl';
import moment from 'moment';

import PureRenderMixin from 'react-addons-pure-render-mixin';

import * as myActions from '../actions';
import ReportTemplate from '../components';
import { transformInfoboxData } from '../common/utils/transformations';
import { getMeterSerial } from '../common/utils/device';


var Report = React.createClass({
  mixins: [PureRenderMixin],

  render: function() {
    return (
      <ReportTemplate {...this.props} />
    )
  }
});

const mapStateToProps = (state, ownProps)  => ({
  username: state.profile.username,
  email: state.profile.email,
  firstname: state.profile.firstname,
  lastname: state.profile.lastname,
  address: state.profile.address,
  devices: state.profile.devices,
  utility: state.profile.utility.name,
  logo: state.profile.utility.logo || 'logo.png',
  url: state.profile.utility.url || 'www.daiad.eu',
  from: moment(state.fromDate, 'YYYYMMDD').valueOf(),
  to: moment(state.toDate, 'YYYYMMDD').valueOf(),
  layout: state.layout,
  meter: getMeterSerial(state.profile.devices),
  infoboxes: state.infobox.map(infobox => 
    transformInfoboxData(infobox, state.profile.devices, ownProps.intl))
})

const mapDispatchToProps = (dispatch) => bindActionCreators(myActions, dispatch);

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(Report));
