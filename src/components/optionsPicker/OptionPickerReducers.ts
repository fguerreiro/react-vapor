import { IReduxAction } from '../../utils/ReduxUtils';
import { IReduxActionsPayload } from '../../ReactVapor';
import * as _ from 'underscore';
import { OptionPickerActions } from './OptionPickerActions';

export interface IOptionPickerState {
  id: string;
  selectedValue: string;
}

export const optionPickerInitialState: IOptionPickerState = {
  id: undefined,
  selectedValue: undefined
};
export const optionPickersInitialState: IOptionPickerState[] = [];

export const optionPickerReducer = (state: IOptionPickerState = optionPickerInitialState,
  action: IReduxAction<IReduxActionsPayload>): IOptionPickerState => {
  switch (action.type) {
    case OptionPickerActions.add:
      return {
        id: action.payload.id,
        selectedValue: action.payload.value
      };
    case OptionPickerActions.change:
      if (state.id !== action.payload.id) {
        return state;
      }
      return _.extend({}, state, {
        selectedValue: action.payload.value
      });
    default:
      return state;
  }
};

export const optionPickersReducer = (state: IOptionPickerState[] = optionPickersInitialState,
  action: IReduxAction<IReduxActionsPayload>): IOptionPickerState[] => {
  switch (action.type) {
    case OptionPickerActions.add:
      return [
        ...state,
        optionPickerReducer(undefined, action)
      ];
    case OptionPickerActions.remove:
      return _.reject(state, (optionPicker: IOptionPickerState) => {
        return action.payload.id === optionPicker.id;
      });
    case OptionPickerActions.change:
      return state.map((optionPicker: IOptionPickerState) =>
        optionPickerReducer(optionPicker, action)
      );
    default:
      return state;
  }
};
