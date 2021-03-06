import React from 'react';

import PUBLIC_PATH from '../../path';
import { injectIntl, FormattedMessage, FormattedDate } from 'react-intl';

import { components } from 'daiad-home-web';

const { Widgets } = components;
const { Widget } = Widgets;

function WidgetItem (props) {
  const { widget, intl } = props;
  return (
    <div key={widget.id} className={`widget ${widget.display}-widget`}>
      <div className="widget-header">
      <h5 className="widget-title">
        <FormattedMessage id={`widgets.titles.${widget.widgetId}`} />
      </h5>
      <span className="widget-subtitle">
        <FormattedMessage id={`widgets.descriptions.${widget.widgetId}`} values={{ device: widget.deviceName }} />
      </span>
      </div>
      { 
        widget.error ? 
        <h5>{ widget.error }</h5>
        :
        <Widget 
         {...widget} 
         intl={intl}
       />
     }
   </div>
  );
}

function WidgetPanel (props) {
  const { widgets, intl } = props;
  return (
    <div className="report-widgets">
       {
         widgets.map((widget, i) => (
           <WidgetItem
             idx={i}
             widget={widget} 
             intl={intl} 
           /> 
         ))
       }
     </div>
  );
}

export default function ReportTemplate (props) {
  const { widgets, date, firstname, lastname, username, email, address, serial, devices, utility, logo, url, intl } = props;
  
  const period = <b><FormattedDate value={date.from} month="long" year="numeric" /></b>;
  return (
    <div className="report">
      <div className="report-header">
        <div className="report-logo">
          <img className="report-logo" src={`${PUBLIC_PATH}/${logo}`}/>
        </div>
        <div className="report-header-right">
          <span className="report-title">
            <h3><FormattedMessage id="report.title" /></h3>
          </span>
          <span className="report-subtitle"> 
            <FormattedMessage id="report.subtitleL1" />
            <br />
            <FormattedMessage id="report.subtitleL2" /> <b>{url}</b>
          </span>
        </div>
        <br/>
        <div className="report-header-left">
          <div className="report-info">
            <ul className="list-unstyled report-info-list">
              <li><h6><FormattedMessage id="profile.fullname" />: <span className="report-info-item-value">{`${firstname} ${lastname}`}</span></h6></li>
            <li><h6><FormattedMessage id="profile.username" />: <span className="report-info-item-value">{username}</span></h6></li>
            <li><h6><FormattedMessage id="profile.address" />: <span className="report-info-item-value">{address}</span></h6></li>
            <li><h6><FormattedMessage id="devices.meter" />: <span className="report-info-item-value">{serial}</span></h6></li>
            </ul>
          </div>
        </div>
        <div className="report-text">
          <span><FormattedMessage id="report.dear" values={{ firstname }} /></span>
          <p><FormattedMessage id="report.textP1" values={{ period }} /></p>
          <p><FormattedMessage id="report.textP2" values={{ utility }} /></p>
        </div>
      </div>
      <div className="report-body">
        <WidgetPanel
          widgets={widgets}
          intl={intl}
        />
      </div>
    </div>
  );
}
