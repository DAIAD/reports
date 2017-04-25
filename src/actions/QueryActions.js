import { actions } from 'daiad-home-web';
import HttpApiActions from './HttpApiActions';

const { CacheActions, QueryActions } = actions;
const connectActionsToQueryBackend = QueryActions;
const connectCacheActionsToQueryBackend = CacheActions;

const cachePath = state => state.cache;

module.exports = connectActionsToQueryBackend(connectCacheActionsToQueryBackend(HttpApiActions, cachePath));
