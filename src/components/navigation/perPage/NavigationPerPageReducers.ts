import { IReduxAction } from '../../../utils/ReduxUtils';
import { IReduxActionsPayload } from '../../../ReactVapor';
import { PerPageActions } from './NavigationPerPageActions';
import * as _ from 'underscore';

export interface IPerPageState {
  id: string;
  perPage: number;
}

export const perPageInitialState: IPerPageState = {
  id: undefined,
  perPage: 10
};

export const perPageCompositeInitialState: IPerPageState[] = [];

export const perPageReducer = (state: IPerPageState = perPageInitialState, action: IReduxAction<IReduxActionsPayload>): IPerPageState => {
  switch (action.type) {
    case PerPageActions.add:
      return { id: action.payload.id, perPage: action.payload.perPage };
    case PerPageActions.change:
      return state.id === action.payload.id
        ? { id: state.id, perPage: action.payload.perPage }
        : state;
    default:
      return state;
  }
};

export const perPageCompositeReducer = (state: IPerPageState[] = perPageCompositeInitialState, action: IReduxAction<IReduxActionsPayload>): IPerPageState[] => {
  switch (action.type) {
    case PerPageActions.add:
      return [
        ...state,
        perPageReducer(undefined, action)
      ];
    case PerPageActions.remove:
      return _.reject(state, (perPage: IPerPageState) => {
        return perPage.id === action.payload.id;
      });
    case PerPageActions.change:
      return state.map((perPage: IPerPageState) => perPageReducer(perPage, action));
    default:
      return state;
  }
};
