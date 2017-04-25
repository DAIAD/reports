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
      id: 'totalVolumeChartSWM',
      widgetId: 'totalVolumeChartSWM',
      type: 'total',
      display: 'chart',
      deviceType: 'METER',
      period: 'month',
      metric: 'volume',
      data: [],
    },
    {
      id: 'totalVolumeStatSWM',
      widgetId: 'totalVolumeStatSWM',
      type: 'total',
      display: 'stat',
      deviceType: 'METER',
      period: 'month',
      metric: 'volume',
      data: [],
    },
    {
      id: 'totalVolumeStatAmphiro',
      widgetId: 'totalVolumeStatAmphiro',
      type: 'total',
      display: 'stat',
      deviceType: 'AMPHIRO',
      period: 'ten',
      metric: 'volume',
      data: [],
    },
    {
      id: 'totalVolumeChartAmphiro',
      widgetId: 'totalVolumeChartAmphiro',
      type: 'total',
      display: 'chart',
      deviceType: 'AMPHIRO',
      period: 'ten',
      metric: 'volume',
      data: [],
    },
    {
      id: 'comparison',
      widgetId: 'comparison', 
      type: 'comparison',
      display: 'chart',
      deviceType: 'METER',
      metric: 'volume',
      data: [],
    },
    {
      id: 'wateriq',
      type: 'wateriq',
      widgetId: 'wateriqChart',
      display: 'chart',
      deviceType: 'METER',
      metric: 'volume',
      data: [],
    },
    {
      id: 'forecast',
      widgetId: 'forecast',
      type: 'forecast',
      deviceType: 'METER',
      display: 'chart',
      period: 'month',
      metric: 'volume',
      periodIndex: 1,
      data: [],
    },
    {
      id: 'ranking',
      widgetId: 'ranking',
      type: 'ranking',
      display: 'chart',
      period: 'all',
      deviceType: 'AMPHIRO',
      metric: 'volume',
      data: [],
    }, 
    {
      id: 'pricing',
      widgetId: 'pricing',
      type: 'pricing',
      period: 'month',
      deviceType: 'METER',
      display: 'chart',
      metric: 'volume',
      data: [],
    },
    {
      id: 'breakdown',
      widgetId: 'breakdown',
      type: 'breakdown',
      period: 'month',
      deviceType: 'METER',
      display: 'chart',
      metric: 'volume',
      data: [],
    },
    {
      id: 'wateriqStat',
      widgetId: 'wateriqStat',
      type: 'wateriq',
      display: 'stat',
      deviceType: 'METER',
      metric: 'volume',
      data: [],
    },
    {
      id: 'efficiencyEnergy',
      widgetId: 'efficiencyEnergy',
      type: 'efficiency',
      display: 'stat',
      period: 'ten',
      deviceType: 'AMPHIRO',
      metric: 'energy',
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
