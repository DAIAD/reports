
module.exports = {
  IMAGES : "/assets/images/home/svg",
  PNG_IMAGES : "/assets/images/home/png",
  LOCALES: ["en", "el", "de", "es"],
  COUNTRIES: ["United Kingdom", "Spain", "Greece" ],
  TIMEZONES: [
    "Europe/London",
    "Europe/Madrid",
    "Europe/Athens"
  ],
  METER_PERIODS: [
    {id: 'day', title: 'periods.day'},
    {id: 'week', title: 'periods.week'},
    {id: 'month', title: 'periods.month'},
    {id: 'year', title: 'periods.year'},
    {id: 'custom', title: 'periods.custom'},
  ],
  DEV_PERIODS: [
    {id: 'ten', title: 'periods.ten'},
    {id: 'twenty', title: 'periods.twenty'},
    {id: 'fifty', title: 'periods.fifty'},
  ],
  METER_METRICS: [
    {id:'difference', title:'Volume'},
  ],
  DEV_METRICS: [
    {id:'volume', title:'Volume'},
    {id:'energy', title:'Energy'},
    {id:'duration', title:'Duration'},
    {id:'temperature', title:'Temperature'}
  ],
  STATBOX_DISPLAYS: [
    {id: 'stat', title: 'Stat'}, 
    {id: 'chart', title: 'Chart'}
  ],
};

