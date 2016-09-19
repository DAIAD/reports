import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { IntlProvider } from 'react-intl';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import * as actions from '../actions';
import Report from './report';

const myApp = React.createClass({
  mixins: [PureRenderMixin],

  render: function() {
    return (
      <IntlProvider 
        locale={this.props.locale}
        messages={this.props.messages} >
        <Report /> 
      </IntlProvider>
    );
  }
});

const mapStateToProps = (state, ownProps)  => ({
  locale: state.locale,
  messages: state.i18nMessages
})

const mapDispatchToProps = (dispatch, ownProps) => bindActionCreators(actions, dispatch);
  
export default connect(mapStateToProps, mapDispatchToProps)(myApp);
