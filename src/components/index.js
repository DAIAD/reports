import React from 'react';

import Chart from './../common/components/Chart';
import { injectIntl, FormattedMessage, FormattedDate } from 'react-intl';


function StatBox (props) {
  const { id, title, type, deviceType, improved, data, highlight, metric, measurements, period, device, deviceDetails, index, time, better, comparePercentage, mu } = props;
  let improvedDiv = <div/>;
  if (improved === true) {
    improvedDiv = (<img src={`${IMAGES}/success.svg`}/>);
  }
  else if (improved === false) {
    improvedDiv = (<img src={`${IMAGES}/warning.svg`}/>);
  }
  const duration = data?(Array.isArray(data)?null:data.duration):null;
  const arrowClass = better?"fa-arrow-down green":"fa-arrow-up red";
  const bow = (better==null || comparePercentage == null) ? false : true;
  return (
    <div>
      <div className='infobox-body-left'>
        <h2>{highlight}<span style={{fontSize:'0.5em', marginLeft:5}}>{mu}</span></h2>
      </div>
      <div className='infobox-body-right'>
        <div>
          {
            (() => bow ? 
             <span><i className={`fa ${arrowClass}`}/>{deviceType === 'AMPHIRO' ? (better ? `${comparePercentage}% better than last ${period}!` : `${comparePercentage}% worse than last ${period}`): (better ? `${comparePercentage}% better than last ${period}!` : `${comparePercentage}% worse than last ${period}`)}</span>
             :
               <span>No comparison data</span>
               )()
          }
        </div>
      </div>
    </div>
  );
}

function ChartBox (props) {
  const { title, type, subtype, improved, data, metric, measurements, period, device, deviceDetails, chartData, chartType, chartCategories, chartFormatter, chartColors, chartXAxis, highlight, time, index, mu, invertAxis } = props;
  return (
    <div>
        {
          (() => chartData && chartData.length>0 ? 
           (type === 'budget' ? 
            <div>
              <div className='infobox-body-left'>
                <Chart
                  height='100%'
                  width='100%'
                  type='pie'
                  title={chartData[0].title}
                  subtitle=""
                  fontSize={16}
                  mu=''
                  colors={chartColors}
                  data={chartData}
                /> 
              </div>
              <div className='infobox-body-right'>
                <b>{chartData[0].data[0].value} lt</b> consumed<br/>
                <b>{chartData[0].data[1].value} lt</b> remaining
              </div>
            </div>:
              ((type === 'breakdown' || type === 'forecast' || type === 'comparison') ?
             <div> 
              <div className='infobox-body-left'>
                <Chart
                      height='100%'
                      width='100%'
                      title=''
                      type='bar'
                      subtitle=""
                      xMargin={0}
                      y2Margin={0}  
                      yMargin={0}
                      x2Margin={0}
                      fontSize={2}
                      mu={mu}
                      invertAxis={invertAxis}
                      xAxis={chartXAxis}
                      xAxisData={chartCategories}
                      colors={chartColors}
                      data={chartData}
                    />
                </div>
              <div className='infobox-body-right'>
                {
                  (() => (type === 'forecast') ?
                    <span>We estimate that you will consume 24% less in 2016! Keep up the good work!</span>
                    : ((type === 'comparison') ?
                       <span>You rank better than your neighbors by 23%, but you are still worse than your city average by 11%!</span>
                       : 
                       <span>Your biggest water consumption was detected in the shower!</span> )
                      )()
                }
                      
              </div>
            </div>
              :
              <div className='infobox-body-full'>
                <Chart
                  height='100%'
                  width='100%'
                  title=''
                  subtitle=""
                  type='line'
                  xMargin={60}
                  x2Margin={10}
                  yMargin={10}
                  y2Margin={20}
                  fontSize={8}
                  mu={mu}
                  formatter={chartFormatter}
                  invertAxis={invertAxis}
                  xAxis={chartXAxis}
                  xAxisData={chartCategories}
                  colors={chartColors}
                  data={chartData}
                />
              </div>))

            :
            <span>Oops, no data available...</span>
            )()
        }
        {
          /*
          (() => type === 'efficiency' ? 
            <span>Your shower efficiency class this {period} was <b>{highlight}</b>!</span>
           :
             <span>You consumed a total of <b>{highlight}</b>!</span>
             )()
             */
        }
    </div>
  );
}

function InfoBox (props) {
  const { infobox, intl } = props;
  const { id, error, period, type, display, displays, time, title } = infobox;
  //const _t = intl.formatMessage;
  return (
    <div className='infobox'>
      <div className='infobox-header'>
        <h4>{title}</h4>
      </div>
      <div className='infobox-body'>
         {
           (()=>{
             if (error) {
               return (<ErrorDisplay errors={error} />);
               } 
             else {
               if (display==='stat') {
                 return (
                    <StatBox {...infobox} /> 
                 );
               } 
               else if (display==='chart') {
                 return (
                   <ChartBox {...infobox} /> 
                   );
               }
               else return null;
             }
           })()
         }
       </div>
    </div>
  );
}

function InfoPanel (props) {
  const { infoboxes, intl } = props;
  return (
    <div className='report-widgets'>
       {
         infoboxes.map(function(infobox) {
           return (
             <div key={infobox.id} className='widget' >
               <InfoBox {...{infobox, intl }} /> 
           </div>
           );
         })
       }
     </div>
  );
}

export default function ReportTemplate (props) {
  const { infoboxes, from, to, firstname, lastname, username, email, address, meter, utility, logo, url, intl } = props;
  const fromDate = new Date(from);
  const toDate = new Date(to);
 
  const fromDisplay = <b><FormattedMessage id={`weekdays.${fromDate.getDay()}`}/>, <span>{fromDate.getDate()}/{fromDate.getMonth()+1}/{fromDate.getFullYear()}</span></b>;
  const toDisplay = <b><FormattedMessage id={`weekdays.${toDate.getDay()}`}/>, <span>{toDate.getDate()}/{toDate.getMonth()+1}/{toDate.getFullYear()}</span></b>;

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
          <img className='report-logo' src={`/dist/${logo}`}/>
          <div className='report-info'>
            <ul className='list-unstyled report-info-list'>
              <li><h6><FormattedMessage id='profile.name' />: <span className='report-info-item-value'>{firstname} {lastname}</span></h6></li>
            <li><h6><FormattedMessage id='profile.username' />: <span className='report-info-item-value'>{username}</span></h6></li>
            <li><h6><FormattedMessage id='profile.address' />: <span className='report-info-item-value'>{address}</span></h6></li>
            <li><h6><FormattedMessage id='devices.serial' />: <span className='report-info-item-value'>{meter}</span></h6></li>
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
        <InfoPanel
          infoboxes={infoboxes}
          intl={intl}
        />
      </div>
    </div>
  );
}
