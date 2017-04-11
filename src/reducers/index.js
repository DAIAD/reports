const initialState = {
  i18n: {
    locale: null,
    messages: {},
  },
  date: {
    from: null,
    to: null,
  },
  credentials: {},
  api: null,
  errors: [],
  user: {
    profile: {
      devices: [],
      utility: {},
    },
  },
  widgets: [
    {
      id: "1", 
      title: "Water consumption", 
      type: "total",
      display: "chart",
      deviceType: "METER",
      period: "month",
      metric: "volume",
      data: [],
    },
    {
      id: "2",
      title: 'Last 10 showers',
      type: "total",
      display: "chart",
      deviceType: 'AMPHIRO',
      period: 'ten',
      metric: 'volume',
      data: [],
    },
    {
      id: '3',
      type: 'comparison',
      title: 'Comparisons',
      display: 'chart',
      deviceType: 'METER',
      metric: 'volume',
      data: [],
    },
    {
      id: '4',
      type: 'wateriq',
      title: 'Water IQ comparison',
      display: 'chart',
      deviceType: 'METER',
      metric: 'volume',
      data: [],
    },
    {
      id: '5',
      title: 'Your water IQ',
      type: 'wateriq',
      display: 'stat',
      deviceType: 'METER',
      metric: 'volume',
      data: [],
    },
    {
      id: '6',
      title: 'Member showers ranking',
      type: 'ranking',
      display: 'chart',
      period: 'all',
      deviceType: 'AMPHIRO',
      metric: 'volume',
      data: [],
    },
    {
      id: '7',
      title: 'Energy efficiency (last 10 showers)',
      type: 'efficiency',
      display: 'stat',
      period: 'ten',
      deviceType: 'AMPHIRO',
      metric: 'energy',
      data: [],
    },
    {
      id: '8',
      title: 'Last 10 showers average temperature',
      type: 'total',
      display: 'stat',
      deviceType: 'AMPHIRO',
      period: 'ten',
      metric: 'temperature',
      data: [],
    },
    {
      id: '9',
      title: 'Next month forecast',
      type: 'forecast',
      deviceType: 'METER',
      display: 'chart',
      period: 'month',
      metric: 'volume',
      periodIndex: 1,
      data: [],
    },
    {
      id: '10',
      title: 'Pricing',
      type: 'pricing',
      period: 'month',
      deviceType: 'METER',
      display: 'chart',
      metric: 'volume',
      data: [],
    },
    {
      id: '11',
      title: 'Water breakdown',
      type: 'breakdown',
      period: 'month',
      deviceType: 'METER',
      display: 'chart',
      metric: 'volume',
      data: [],
    },
  ]
}

export default (state = initialState, action) => {
  
  switch (action.type) {
    case 'SET_DATE_RANGE':
      return {
         ...state,
         date: {
           from: action.from,
           to: action.to,
         },
      };    
    
    case 'SET_LOCALE':
      return {
        ...state,
        i18n: {
          locale: action.locale,
          messages: action.messages,
        },
      };
     
    case 'SET_CREDENTIALS':
      return {
        ...state,
        credentials: action.credentials,
      };

    case 'SET_API_URL':
      return {
        ...state,
        api: action.url,
      };

    case 'USER_RECEIVED_PROFILE': 
      return {
        ...state,
        user: {
          ...state.user,
          profile: action.profile,
        },
      };

    case 'SET_ERROR':
      return {
        ...state,
        errors: [...state.errors, action.error],
      };

    case 'SET_WIDGET_DATA': {
      const newWidgets = [...state.widgets];
      const index = newWidgets.findIndex((el, idx, arr) => el.id === action.id);
      newWidgets[index] = {
        ...newWidgets[index],
        ...action.data,
      };
      return {...state,
        widgets: newWidgets,
      };
    }

    default:
      return state; 

  }
}
