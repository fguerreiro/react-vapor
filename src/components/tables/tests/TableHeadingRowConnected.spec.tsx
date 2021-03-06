import { mount, ReactWrapper } from 'enzyme';
import { Store } from 'redux';
import { Provider } from 'react-redux';
import { ITableHeadingRowProps, TableHeadingRow, ITableHeadingRowOwnProps } from '../TableHeadingRow';
import { IReactVaporState } from '../../../ReactVapor';
import { TestUtils } from '../../../utils/TestUtils';
import { TableHeadingRowConnected } from '../TableHeadingRowConnected';
import { clearState } from '../../../utils/ReduxUtils';
import * as _ from 'underscore';
// tslint:disable-next-line:no-unused-variable
import * as React from 'react';

describe('Tables', () => {
  let basicTableHeadingRowProps: ITableHeadingRowOwnProps;

  describe('<TableHeadingRowConnected />', () => {
    let wrapper: ReactWrapper<any, any>;
    let tableHeadingRow: ReactWrapper<ITableHeadingRowProps, any>;
    let store: Store<IReactVaporState>;

    beforeEach(() => {
      basicTableHeadingRowProps = {
        id: 'heading-row',
        isCollapsible: true
      };

      store = TestUtils.buildStore();

      wrapper = mount(
        <Provider store={store}>
          <table>
            <tbody>
              <TableHeadingRowConnected {...basicTableHeadingRowProps} />
            </tbody>
          </table>
        </Provider>,
        { attachTo: document.getElementById('App') }
      );
      tableHeadingRow = wrapper.find(TableHeadingRow).first();
    });

    afterEach(() => {
      store.dispatch(clearState());
      wrapper.unmount();
      wrapper.detach();
    });

    it('should get its id as a prop', () => {
      let idProp = tableHeadingRow.props().id;

      expect(idProp).toBeDefined();
      expect(idProp).toBe(basicTableHeadingRowProps.id);
    });

    it('should get if its collapsible row is opened as a prop', () => {
      let openedProp = tableHeadingRow.props().opened;

      expect(openedProp).toBeDefined();
      expect(openedProp).toBe(false);
    });

    it('should get what to do on render as a prop', () => {
      let onRowRenderProp = tableHeadingRow.props().onRender;

      expect(onRowRenderProp).toBeDefined();
    });

    it('should get what to do on destroy as a prop', () => {
      let onRowDestroyProp = tableHeadingRow.props().onDestroy;

      expect(onRowDestroyProp).toBeDefined();
    });

    it('should get what to do on click as a prop', () => {
      let onRowClickProp = tableHeadingRow.props().onClick;

      expect(onRowClickProp).toBeDefined();
    });

    it('should add the row in the store on render', () => {
      expect(store.getState().rows.filter(row => row.id === basicTableHeadingRowProps.id).length).toBe(1);
    });

    it('should remove the row in the store on destroy', () => {
      wrapper.unmount();
      expect(store.getState().rows.filter(row => row.id === basicTableHeadingRowProps.id).length).toBe(0);
    });

    it('should set the open property to true on click', () => {
      expect(_.findWhere(store.getState().rows, { id: basicTableHeadingRowProps.id }).opened).toBe(false);

      tableHeadingRow.find('tr').simulate('click');
      expect(_.findWhere(store.getState().rows, { id: basicTableHeadingRowProps.id }).opened).toBe(true);
    });

    it('should not dispatch any action on render, on destroy and on click if not collapsible', () => {
      store.dispatch(clearState());

      let newHeadingRowProps = _.extend({}, basicTableHeadingRowProps, { isCollapsible: false });
      let rowState = _.clone(store.getState().rows);

      wrapper = mount(
        <Provider store={store}>
          <table>
            <tbody>
              <TableHeadingRowConnected {...newHeadingRowProps} />
            </tbody>
          </table>
        </Provider>,
        { attachTo: document.getElementById('App') }
      );
      tableHeadingRow = wrapper.find(TableHeadingRow).first();
      expect(store.getState().rows).toEqual(jasmine.objectContaining(rowState));

      tableHeadingRow.find('tr').simulate('click');
      expect(store.getState().rows).toEqual(jasmine.objectContaining(rowState));

      wrapper.unmount();
      expect(store.getState().rows).toEqual(jasmine.objectContaining(rowState));
    });
  });
});
