import { IActionOptions } from './Action';
import { ActionBarActions } from './ActionBarActions';
import { IReduxAction } from '../../utils/ReduxUtils';
import { IReduxActionsPayload } from '../../ReactVapor';
import * as _ from 'underscore';
import { LoadingActions } from '../loading/LoadingActions';

export interface IActionBarState {
  id: string;
  actions: IActionOptions[];
  isLoading?: boolean;
}

export const actionBarInitialState: IActionBarState = { id: undefined, actions: [] };
export const actionBarsInitialState: IActionBarState[] = [];

export const actionBarReducer = (state: IActionBarState = actionBarInitialState, action: IReduxAction<IReduxActionsPayload>): IActionBarState => {
  switch (action.type) {
    case ActionBarActions.addActions:
      return state.id !== action.payload.id
        ? state
        : { ...state, actions: action.payload.actions };
    case ActionBarActions.add:
      return {
        id: action.payload.id,
        actions: [],
        isLoading: false,
      };
    case LoadingActions.turnOn:
      return _.contains(action.payload.ids, state.id)
        ? { ...state, isLoading: true }
        : state;
    case LoadingActions.turnOff:
      return _.contains(action.payload.ids, state.id)
        ? { ...state, isLoading: false }
        : state;
    default:
      return state;
  }
};

export const actionBarsReducer = (state: IActionBarState[] = actionBarsInitialState, action: IReduxAction<IReduxActionsPayload>): IActionBarState[] => {
  switch (action.type) {
    case ActionBarActions.addActions:
    case LoadingActions.turnOn:
    case LoadingActions.turnOff:
      return state.map(bar =>
        actionBarReducer(bar, action)
      );
    case ActionBarActions.add:
      return [
        ...state,
        actionBarReducer(undefined, action)
      ];
    case ActionBarActions.remove:
      return _.reject(state, (bar) => {
        return action.payload.id === bar.id;
      });
    default:
      return state;
  }
};
