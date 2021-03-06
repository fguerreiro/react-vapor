import * as React from 'react';
import { tablePropsMock, tablePropsMockWithData, tablePossibleProps } from './TableTestCommon';
import { TableConnected } from '../TableConnected';
import { ITableProps, Table } from '../Table';
import { mount } from 'enzyme';
import { clearState } from '../../../utils/ReduxUtils';
import { IReactVaporState } from '../../../ReactVapor';
import { TestUtils } from '../../../utils/TestUtils';
import { Store, Provider } from 'react-redux';
import { PrimaryAction } from '../../actions/PrimaryAction';
import * as _ from 'underscore';
import { openDropdownSearch } from '../../dropdownSearch/DropdownSearchActions';
import { getTableChildComponentId } from '../TableUtils';
import { TableChildComponent } from '../TableConstants';
import * as TableDataModifier from '../TableDataModifier';

describe('<TableConnected />', () => {
  let store: Store<IReactVaporState>;

  beforeEach(() => {
    store = TestUtils.buildStore();
  });

  afterEach(() => {
    store.dispatch(clearState());
  });

  const mountComponentWithProps = (props: ITableProps) => {
    return mount(
      <Provider store={store}>
        <TableConnected {...props} />
      </Provider>,
      { attachTo: document.getElementById('App') },
    );
  };

  describe('render', () => {
    it('should render without error in different scenarios', () => {
      tablePossibleProps.forEach((props: ITableProps) => {
        expect(() => mountComponentWithProps(props)).not.toThrow();
      });
    });

    it('should put the table state in the store on mount', () => {
      expect(store.getState().tables[tablePropsMock.id]).toBeUndefined();
      mountComponentWithProps(tablePropsMock);
      expect(store.getState().tables[tablePropsMock.id]).toBeDefined();
    });

    it('should remove the table state in the store on unmount', () => {
      const tableConnected = mountComponentWithProps({ ...tablePropsMock, actionBar: true });
      expect(store.getState().tables[tablePropsMock.id]).toBeDefined();
      tableConnected.unmount();
      expect(store.getState().tables[tablePropsMock.id]).toBeUndefined();
    });
  });

  describe('after render', () => {
    it('should add as many actions as there are dispatched table actions on onRowClick', () => {
      const wrapper = mountComponentWithProps({ ...tablePropsMock, actionBar: true });
      const tableConnected = wrapper.find(Table);

      const actions = [
        {
          enabled: true,
          name: 'action1',
          primary: true,
          icon: 'edit',
        },
        {
          enabled: true,
          name: 'action2',
          primary: true,
          icon: 'clear',
        },
      ];

      expect(wrapper.find(PrimaryAction).length).toBe(0);
      tableConnected.props().onRowClick(actions);
      expect(wrapper.find(PrimaryAction).length).toBe(actions.length);
    });

    it('should modify the selected option in the predicate and close the dropdown on onPredicateOptionClick', () => {
      const testOption = { value: 'test emails', selected: false };
      const predicate = {
        attributeName: 'email',
        attributeNameFormatter: _.identity,
        props: { defaultOptions: [testOption] },
      };
      const wrapper = mountComponentWithProps({ ...tablePropsMock, actionBar: true, predicates: [predicate] });
      const tableConnected = wrapper.find(Table);
      const predicateId = `${getTableChildComponentId(tableConnected.props().id, TableChildComponent.PREDICATE)}${predicate.attributeName}`;
      store.dispatch(openDropdownSearch(predicateId));

      tableConnected.props().onPredicateOptionClick(predicateId, testOption);

      const dropdownSearch = _.findWhere(store.getState().dropdownSearch, { id: predicateId });

      expect(dropdownSearch.isOpened).toBe(false);
      expect(_.findWhere(dropdownSearch.options, { selected: true }).value).toBe(testOption.value);
    });

    it('should call the manual thunk if it is passed as own props on onModifyData', () => {
      const manualSpy = jasmine.createSpy('manualSpy').and.returnValue(_.noop);
      const wrapper = mountComponentWithProps({ ...tablePropsMock, manual: manualSpy });
      const tableConnected = wrapper.find(Table);

      let shouldResetPage = true;
      let tableComposite1 = tablePropsMock.tableCompositeState;
      let tableComposite2 = tablePropsMock.tableCompositeState;
      tableConnected.props().onModifyData(shouldResetPage, tableComposite1, tableComposite2);
      expect(manualSpy).toHaveBeenCalledTimes(1);
      expect(_.rest(manualSpy.calls.mostRecent().args)).toEqual([shouldResetPage, tableComposite1, tableComposite2]);
    });

    it('should call the default data modifier thunk if manual is not in ownProps on onModifyData', () => {
      const wrapper = mountComponentWithProps({ ...tablePropsMockWithData });
      const tableConnected = wrapper.find(Table);
      const defaultTableStateModifierThunkSpy = spyOn(TableDataModifier, 'defaultTableStateModifierThunk').and.returnValue(_.noop);

      let shouldResetPage = true;
      let tableComposite1 = tablePropsMock.tableCompositeState;
      tableConnected.props().onModifyData(shouldResetPage, tableComposite1);
      expect(defaultTableStateModifierThunkSpy).toHaveBeenCalledTimes(1);
      expect(_.rest(defaultTableStateModifierThunkSpy.calls.mostRecent().args)).toEqual([shouldResetPage, tableComposite1]);
    });
  });
});
