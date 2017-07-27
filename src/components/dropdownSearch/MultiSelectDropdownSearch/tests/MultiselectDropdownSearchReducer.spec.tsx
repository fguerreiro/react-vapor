import {FixedQueue} from '../../../../utils/FixedQueue';
import {IDropdownOption} from '../../DropdownSearch';
import {IDropdownSearchState} from '../../DropdownSearchReducers';
import {multiSelectDropdownSearchReducer} from '../MultiSelectDropdownSearchReducer';
import {DropdownSearchActions, IOptionsDropdownSearchPayload} from '../../DropdownSearchActions';
import {IReduxAction} from '../../../../utils/ReduxUtils';
import * as _ from 'underscore';
import {keyCode} from '../../../../utils/InputUtils';

describe('DropdownSearch', () => {

  describe('MultiSelectDropdownSearchReducers', () => {

    const defaultPayload = {id: 'new-dropdown-search'};

    const options = [
      {value: 'test 1', displayValue: 'test 1 display'},
      {value: 'test 2', displayValue: 'test 2 display'},
    ];

    const oldState: IDropdownSearchState = {
      id: 'new-dropdown-search',
      isOpened: false,
      options,
      displayedOptions: options,
      selectedOptions: new FixedQueue<IDropdownOption>(),
    };

    it('should add a new multiselect state on "ADD_MULTI_SELECT_DROPDOWN_SEARCH"', () => {
      const oldState: IDropdownSearchState = { id: 'new-dropdown-search', };
      const action: IReduxAction<IOptionsDropdownSearchPayload> = {
        type: DropdownSearchActions.addMultiSelect,
        payload: _.extend(defaultPayload, {
          optionsDropdown: options,
        }),
      };

      const updatedState: IDropdownSearchState = multiSelectDropdownSearchReducer(oldState, action);

      for (let option of options) {
        expect(updatedState.options.indexOf(option)).toBeDefined();
      }
      expect(updatedState.selectedOptions.getQueue()).toEqual([]);
      expect(updatedState.isOpened).toBe(false);
    });

    it('should add a selected option on "MULTI_SELECT_OPTION_DROPDOWN_SEARCH"', () => {
      const addedSelectedOption: IDropdownOption = options[0];

      const action: IReduxAction<IOptionsDropdownSearchPayload> = {
        type: DropdownSearchActions.multiSelect,
        payload: _.extend(defaultPayload, {
          addedSelectedOption: addedSelectedOption,
        }),
      };

      const updatedState: IDropdownSearchState = multiSelectDropdownSearchReducer(oldState, action);

      expect(updatedState.selectedOptions.contains(addedSelectedOption)).toBe(true);
    });

    it('should remove the selected option from the displayed options on "MULTI_SELECT_OPTION_DROPDOWN_SEARCH"', () => {
      const addedSelectedOption: IDropdownOption = options[0];

      const action: IReduxAction<IOptionsDropdownSearchPayload> = {
        type: DropdownSearchActions.multiSelect,
        payload: _.extend(defaultPayload, {
          addedSelectedOption: addedSelectedOption,
        }),
      };

      const updatedState: IDropdownSearchState = multiSelectDropdownSearchReducer(oldState, action);

      expect(updatedState.displayedOptions.indexOf(addedSelectedOption)).toBe(-1);
    });

    it('should remove the selected option from the selectedOptions when "REMOVE_SELECTED_OPTION_DROPDOWN_SEARCH"', () => {
      const selectedOptionValue: string = options[0].displayValue;

      const action: IReduxAction<IOptionsDropdownSearchPayload> = {
        type: DropdownSearchActions.removeSelectedOption,
        payload: _.extend(defaultPayload, {
          selectedOptionValue: selectedOptionValue,
        }),
      };

      const updatedState: IDropdownSearchState = multiSelectDropdownSearchReducer(oldState, action);

      expect(updatedState.selectedOptions.containsElementWithProperties({ displayValue: selectedOptionValue })).toBe(false);
    });

    it('should add the removed option in the displayed options when "REMOVE_SELECTED_OPTION_DROPDOWN_SEARCH"', () => {
      const selectedOptionValue: string = options[0].displayValue;

      const action: IReduxAction<IOptionsDropdownSearchPayload> = {
        type: DropdownSearchActions.removeSelectedOption,
        payload: _.extend(defaultPayload, {
          selectedOptionValue: selectedOptionValue,
        }),
      };

      const updatedState: IDropdownSearchState = multiSelectDropdownSearchReducer(oldState, action);

      expect(_.findWhere(updatedState.displayedOptions, { displayValue: selectedOptionValue })).toBeDefined();
    });

    it('should add a custom selected option on "ADD_CUSTOM_SELECTED_OPTION"', () => {
      const customValue: string = 'custom_value';

      const action: IReduxAction<IOptionsDropdownSearchPayload> = {
        type: DropdownSearchActions.addCustomSelectedOption,
        payload: _.extend(defaultPayload, {
          selectedOptionValue: customValue,
        }),
      };

      const updatedState: IDropdownSearchState = multiSelectDropdownSearchReducer(oldState, action);

      expect(updatedState.selectedOptions.containsElementWithProperties({ displayValue: customValue })).toBe(true);
    });

    describe('on key down', () => {
      it('should add a custom option on enter if the selected option is not present', () => {
        const keycode = keyCode.enter;
        const customValue: string = 'custom_value';
        const stateWithFilterTextPresent: IDropdownSearchState = _.extend(oldState, {
          filterText: customValue,
        });
        const action: IReduxAction<IOptionsDropdownSearchPayload> = {
          type: DropdownSearchActions.onKeyDownMultiselect,
          payload: _.extend(defaultPayload, {
            keyCode: keycode,
          }),
        };

        const updatedState: IDropdownSearchState = multiSelectDropdownSearchReducer(stateWithFilterTextPresent, action);

        expect(updatedState.selectedOptions.containsElementWithProperties({ displayValue: customValue })).toBe(true);
      });

      it('should remove last selected option on backspace when the filter text is empty', () => {
        const keycode = keyCode.backspace;
        const filterText: string = '';
        const selectedOptions: FixedQueue<IDropdownOption> = new FixedQueue<IDropdownOption>(options);
        const stateWithFilterTextPresent: IDropdownSearchState = _.extend(oldState, {
          filterText,
          selectedOptions,
        });
        const action: IReduxAction<IOptionsDropdownSearchPayload> = {
          type: DropdownSearchActions.onKeyDownMultiselect,
          payload: _.extend(defaultPayload, {
            keyCode: keycode,
          }),
        };

        const expectedOptions: IDropdownOption[] = [options[0]];

        const updatedState: IDropdownSearchState = multiSelectDropdownSearchReducer(stateWithFilterTextPresent, action);

        expect(updatedState.selectedOptions.getQueue()).toEqual(expectedOptions);
      });

      it('should not remove last selected option on backspace when the filter text is not empty', () => {
        const keycode = keyCode.backspace;
        const filterText: string = 'not empty filter text';
        const selectedOptions: FixedQueue<IDropdownOption> = new FixedQueue<IDropdownOption>(options);
        const stateWithFilterTextPresent: IDropdownSearchState = _.extend(oldState, {
          filterText,
          selectedOptions,
        });
        const action: IReduxAction<IOptionsDropdownSearchPayload> = {
          type: DropdownSearchActions.onKeyDownMultiselect,
          payload: _.extend(defaultPayload, {
            keyCode: keycode,
          }),
        };

        const expectedOptions: IDropdownOption[] = options;

        const updatedState: IDropdownSearchState = multiSelectDropdownSearchReducer(stateWithFilterTextPresent, action);

        expect(updatedState.selectedOptions.getQueue()).toEqual(expectedOptions);
      });

      it('should close the dropdown on escape', () => {
        const keycode = keyCode.escape;
        const action: IReduxAction<IOptionsDropdownSearchPayload> = {
          type: DropdownSearchActions.onKeyDownMultiselect,
          payload: _.extend(defaultPayload, {
            keyCode: keycode,
          }),
        };

        const updatedState: IDropdownSearchState = multiSelectDropdownSearchReducer(oldState, action);

        expect(updatedState.isOpened).toBe(false);
      });

      it('should remove focus on unknown key', () => {
        const keycode = -1;
        const action: IReduxAction<IOptionsDropdownSearchPayload> = {
          type: DropdownSearchActions.onKeyDownMultiselect,
          payload: _.extend(defaultPayload, {
            keyCode: keycode,
          }),
        };

        const updatedState: IDropdownSearchState = multiSelectDropdownSearchReducer(oldState, action);

        expect(updatedState.setFocusOnDropdownButton).toBe(false);
      });

      it('should set no active option on unknown key', () => {
        const keycode = -1;
        const action: IReduxAction<IOptionsDropdownSearchPayload> = {
          type: DropdownSearchActions.onKeyDownMultiselect,
          payload: _.extend(defaultPayload, {
            keyCode: keycode,
          }),
        };

        const updatedState: IDropdownSearchState = multiSelectDropdownSearchReducer(oldState, action);

        expect(updatedState.activeOption).toBeUndefined();
      });
    });

    describe('default action', () => {
      it('should return the same state by default', () => {
        const action: IReduxAction<IOptionsDropdownSearchPayload> = {
          type: 'default multiselect action',
          payload: defaultPayload,
        };

        const updatedState: IDropdownSearchState = multiSelectDropdownSearchReducer(oldState, action);

        expect(updatedState).toEqual(oldState);
      });
    });
  });
});