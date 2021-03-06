import { shallow, mount, ReactWrapper } from 'enzyme';
import { TableHeadingRow, ITableHeadingRowProps } from '../TableHeadingRow';
import { TableCollapsibleRowToggle } from '../TableCollapsibleRowToggle';
import * as _ from 'underscore';
// tslint:disable-next-line:no-unused-variable
import * as React from 'react';

describe('Tables', () => {
  let basicTableHeadingRowProps: ITableHeadingRowProps;

  describe('<TableHeadingRow />', () => {
    it('should render without errors', () => {
      basicTableHeadingRowProps = {
        isCollapsible: false
      };

      expect(() => {
        shallow(
          <TableHeadingRow {...basicTableHeadingRowProps} />
        );
      }).not.toThrow();
    });
  });

  describe('<TableHeadingRow />', () => {
    let tableHeadingRow: ReactWrapper<ITableHeadingRowProps, any>;
    let tableHeadingRowInstance: TableHeadingRow;

    beforeEach(() => {
      document.getElementById('App').innerHTML = '<table><tbody id="AppTableBody"></tbody></table>';

      basicTableHeadingRowProps = {
        isCollapsible: true
      };

      tableHeadingRow = mount(
        <TableHeadingRow {...basicTableHeadingRowProps} />,
        { attachTo: document.getElementById('AppTableBody') }
      );
      tableHeadingRowInstance = tableHeadingRow.instance() as TableHeadingRow;
    });

    afterEach(() => {
      tableHeadingRow.unmount();
      tableHeadingRow.detach();
    });

    it('should get if it is collapsible as a prop', () => {
      let isCollapsibleProp = tableHeadingRow.props().isCollapsible;

      expect(isCollapsibleProp).toBeDefined();
      expect(isCollapsibleProp).toBe(basicTableHeadingRowProps.isCollapsible);
    });

    it('should have heading-row as a class if collapsible', () => {
      let rowClass = 'heading-row';

      expect(tableHeadingRow.find('tr').hasClass(rowClass)).toBe(true);

      tableHeadingRow.setProps({ isCollapsible: false });
      expect(tableHeadingRow.find('tr').hasClass(rowClass)).toBe(false);
    });

    it('should render a <TableCollapsibleRowToggle /> if collapsible', () => {
      expect(tableHeadingRow.find(TableCollapsibleRowToggle).length).toBe(1);

      tableHeadingRow.setProps({ isCollapsible: false });
      expect(tableHeadingRow.find(TableCollapsibleRowToggle).length).toBe(0);
    });

    it('should have class opened if opened prop is set to true', () => {
      const expectedClass = 'opened';
      const newTabledHeadingRowProps = _.extend({}, basicTableHeadingRowProps, { opened: true });

      expect(tableHeadingRow.find('tr').hasClass(expectedClass)).toBe(false);

      tableHeadingRow.setProps(newTabledHeadingRowProps);
      expect(tableHeadingRow.find('tr').hasClass(expectedClass)).toBe(true);
    });

    it('should call onRender prop if set on mount', () => {
      let onRenderSpy = jasmine.createSpy('onRender');
      let newTabledHeadingRowProps = _.extend({}, basicTableHeadingRowProps, { onRender: onRenderSpy });

      expect(() => (tableHeadingRowInstance.componentWillMount())).not.toThrow();

      tableHeadingRow.unmount();
      tableHeadingRow.setProps(newTabledHeadingRowProps);
      tableHeadingRow.mount();
      expect(onRenderSpy).toHaveBeenCalled();
    });

    it('should call onDestroy prop if set when unmounting', () => {
      let onDestroySpy = jasmine.createSpy('onDestroy');
      let newTabledHeadingRowProps = _.extend({}, basicTableHeadingRowProps, { onDestroy: onDestroySpy });

      expect(() => (tableHeadingRowInstance.componentWillUnmount())).not.toThrow();

      tableHeadingRow.unmount();
      tableHeadingRow.setProps(newTabledHeadingRowProps);
      tableHeadingRow.mount();
      tableHeadingRow.unmount();
      expect(onDestroySpy).toHaveBeenCalled();
    });

    it('should call onClick prop if set when clicking on row', () => {
      let onClickSpy = jasmine.createSpy('onClick');
      let newTabledHeadingRowProps = _.extend({}, basicTableHeadingRowProps, { onClick: onClickSpy });

      expect(() => (tableHeadingRowInstance['handleClick'].call(tableHeadingRowInstance))).not.toThrow();

      tableHeadingRow.setProps(newTabledHeadingRowProps);
      tableHeadingRow.find('tr').simulate('click');
      expect(onClickSpy).toHaveBeenCalled();
    });

    it('should call onClickCallBack prop if set when clicking on row', () => {
      const onClickCallback = jasmine.createSpy('onClickCallback');
      const newTabledHeadingRowProps = _.extend({}, basicTableHeadingRowProps, { onClickCallback });
      tableHeadingRow.setProps(newTabledHeadingRowProps);

      tableHeadingRow.find('tr').simulate('click');

      expect(onClickCallback).toHaveBeenCalledTimes(1);
    });
  });
});
