const initialState = {
  locale: 'en',
  i18nMessages: {},
  fromDate: null,
  toDate: null,
  profile: {
    devices: [],
  },
  layout: [
    {i: "1", x:0, y:0, w:2, h:2},
    {i: "2", x:2, y:0, w:2, h:2},
    {i: "3", x:2, y:0, w:2, h:2},
    {i: "4", x:0, y:0, w:2, h:1},
    {i: "5", x:0, y:1, w:2, h:1},
    {i: "6", x:2, y:2, w:2, h:2},
  ],
  infobox: [
      {
        id: "1", 
        title: "Water consumption", 
        type: "total",
        display: "chart",
        deviceType: "METER",
        period: "month",
        metric: "difference",
        data: [],
      },
      {
        id: "2", 
        title: "Total consumption",
        type: "total",
        display: "stat",
        period: "month",
        deviceType: "METER",
        metric: "difference",
        data: [],
        },
      /*
    {
      id: "6", 
      title: "Shower efficiency",
      type: "efficiency",
      display: "stat",
      deviceType: "AMPHIRO",
      period: "twenty",
      metric: "energy",
      data: [],
      },
      */
    {
      id: "3", 
      title: "Breakdown",
      type: "breakdown",
      display: "chart",
      deviceType: "METER",
      period: "year",
      metric: "difference",
      data: [],
    },
    {
      id: "4", 
      title: "Forecast",
      type: "forecast",
      display: "chart",
      deviceType: "METER",
      period: "year",
      metric: "difference",
      data: [],
    },
    {
      id: "5", 
      title: "Comparison",
      type: "comparison",
      display: "chart",
      deviceType: "METER",
      period: "year",
      metric: "difference",
      data: [],
    },
    {
      id: "6", 
      title: "Monthly budget",
      type: "budget",
      display: "chart",
      deviceType: "METER",
      period: "day",
      metric: "difference",
      data: [],
      },
  ]
}

export default (state = initialState, action) => {
  
  switch (action.type) {
    
    case 'SET_LOCALE':
      return {...state,
        locale: action.locale
      };
    
    case 'SET_DATE_RANGE':
      return {...state,
        fromDate: action.from,
        toDate: action.to
      };

    case 'SET_I18N_MESSAGES':
      return {...state,
        i18nMessages: action.messages
      };
    
    case 'USER_RECEIVED_PROFILE': 
      return {...state,
        profile: action.profile
      };

    case 'SET_INFOBOX_DATA': {
      let newInfobox = state.infobox.slice();
      const index = newInfobox.findIndex((el, idx, arr) => el.id === action.id);
      newInfobox[index] = Object.assign({}, newInfobox[index], action.data);
      return {...state,
        infobox: newInfobox
      };
    }

    default:
      return state; 

  }
}
