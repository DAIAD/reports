import { actions } from 'daiad-home-web';
import HttpApiActions from './HttpApiActions';

const { QueryActions } = actions;
const connectActionsToQueryBackend = QueryActions;

module.exports = connectActionsToQueryBackend(HttpApiActions);
