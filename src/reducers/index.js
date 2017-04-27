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
  cache: {},
  user: {
    profile: {
      devices: [],
      utility: {},
    },
  },
  widgets: [ 
    {
      id: 'totalVolumeStatSWM',
      widgetId: 'totalVolumeStatSWM',
      type: 'total',
      display: 'stat',
      period: 'month',
      deviceType: 'METER',
    },
    {
      id: 'totalVolumeStatAmphiro',
      widgetId: 'totalVolumeStatAmphiro',
      type: 'total',
      display: 'stat',
      deviceType: 'AMPHIRO',
      period: '100',
      metric: 'volume',
    },
    {
      id: 'wateriqStat',
      widgetId: 'wateriqStat',
      type: 'wateriq',
      display: 'stat',
      period: 'month',
      deviceType: 'METER',
    },
    {
      id: 'tip',
      widgetId: 'tip',
      type: 'tip',
      display: 'stat',
      deviceType: 'METER',
    },
    {
      id: 'totalVolumeChartSWM',
      widgetId: 'totalVolumeChartSWM',
      type: 'total',
      display: 'chart',
      period: 'month',
      deviceType: 'METER',
    },
    {
      id: 'forecast',
      widgetId: 'forecast',
      type: 'forecast',
      deviceType: 'METER',
      period: 'year',
      display: 'chart',
    },
    {
      id: 'totalVolumeChartAmphiro',
      widgetId: 'totalVolumeChartAmphiro',
      type: 'total',
      display: 'chart',
      deviceType: 'AMPHIRO',
      period: '100',
      metric: 'volume',
    },
    {
      id: 'comparison',
      widgetId: 'comparison', 
      type: 'comparison',
      display: 'chart',
      deviceType: 'METER',
    },
    {
      id: 'wateriq',
      type: 'wateriq',
      widgetId: 'wateriqChart',
      display: 'chart',
      deviceType: 'METER',
    },
    {
      id: 'ranking',
      widgetId: 'ranking',
      type: 'ranking',
      display: 'chart',
      period: '100',
      deviceType: 'AMPHIRO',
    }, 
    {
      id: 'pricing',
      widgetId: 'pricing',
      type: 'pricing',
      period: 'month',
      deviceType: 'METER',
      period: 'month',
      display: 'chart',
    },
    {
      id: 'breakdown',
      widgetId: 'breakdown',
      type: 'breakdown',
      deviceType: 'METER',
      display: 'chart',
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

    case 'SET_WIDGETS':
      return {
        ...state,
        widgets: action.widgets,
      };

    case 'QUERY_SET_CACHE': {
      return {
        ...state,
        cache: action.cache,
      };
    }

    case 'QUERY_SAVE_TO_CACHE': {
      const newCache = { ...state.cache };
      newCache[action.key] = {
        data: action.data,
        counter: 1,
      };
      return {
        ...state,
        cache: newCache,
      };
    }

    case 'QUERY_CACHE_ITEM_REQUESTED': {
      const newCache = { ...state.cache };
      newCache[action.key] = { 
        ...newCache[action.key], 
        counter: newCache[action.key].counter + 1,
      };
      return {
        ...state,
        cache: newCache,
      };
    }

    default:
      return state; 

  }
}
