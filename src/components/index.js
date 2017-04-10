import React from 'react';

import PUBLIC_PATH from '../../path';
import { injectIntl, FormattedMessage, FormattedDate } from 'react-intl';

import { components } from 'daiad-home-web';

const { Widgets } = components;
const { Widget } = Widgets;


function WidgetPanel (props) {
  const { widgets, intl } = props;
  return (
    <div className='report-widgets'>
       {
         widgets.map(widget => (
           <div key={widget.id} className='widget'>
             <h3>{widget.title}</h3>
             <Widget 
               {...widget} 
               intl={intl}
             />
         </div>
         ))
       }
     </div>
  );
}

export default function ReportTemplate (props) {
  const { widgets, date, firstname, lastname, username, email, address, serial, devices, utility, logo, url, intl } = props;
  const { from, to } = date;
 
  const fromDisplay = <b><FormattedMessage id={`weekdays.${from.day()}`}/>, <span>{from.date()}/{from.month()+1}/{from.year()}</span></b>;
  const toDisplay = <b><FormattedMessage id={`weekdays.${to.day()}`}/>, <span>{to.date()}/{to.month()+1}/{to.year()}</span></b>;

  return (
    <div className='report'>
      <div className='report-header'>
        <div className='report-header-right'>
          <span className='report-title'>
            <h3><FormattedMessage id='report.title' /></h3>
          </span>
          <span className='report-subtitle'> 
            <FormattedMessage id='report.subtitle' /> <b>{url}</b>
          </span>
        </div>
        <br/>
        <div className='report-header-left'>
          <img className='report-logo' src={`${PUBLIC_PATH}/${logo}`}/>
          <div className='report-info'>
            <ul className='list-unstyled report-info-list'>
              <li><h6><FormattedMessage id='profile.fullname' />: <span className='report-info-item-value'>{`${firstname} ${lastname}`}</span></h6></li>
            <li><h6><FormattedMessage id='profile.username' />: <span className='report-info-item-value'>{username}</span></h6></li>
            <li><h6><FormattedMessage id='profile.address' />: <span className='report-info-item-value'>{address}</span></h6></li>
            <li><h6><FormattedMessage id='devices.serial.label' />: <span className='report-info-item-value'>{serial}</span></h6></li>
            </ul>
          </div>
        </div>
        <div className='report-text'>
          <span><FormattedMessage id='report.dear' values={{firstname}} /></span>
          <p><FormattedMessage id='report.textP1' values={{from: fromDisplay, to:toDisplay}} /></p>
          <p><FormattedMessage id='report.textP2' values={{utility}} /></p>
        </div>
      </div>
      <div className='report-body'>
        <WidgetPanel
          widgets={widgets}
          intl={intl}
        />
      </div>
    </div>
  );
}
