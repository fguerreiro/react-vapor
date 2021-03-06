import { shallow, mount, ReactWrapper } from 'enzyme';
// tslint:disable-next-line:no-unused-variable
import * as React from 'react';
import { Checkbox } from '../Checkbox';
import { IInputProps } from '../../input/Input';

describe('Checkbox', () => {
  describe('<Checkbox />', () => {
    it('should render without errors', () => {
      expect(() => {
        shallow(
          <Checkbox />
        );
      }).not.toThrow();
    });
  });

  describe('<Checkbox />', () => {
    let checkbox: ReactWrapper<IInputProps, any>;
    let checkboxInstance: Checkbox;

    beforeEach(() => {
      checkbox = mount(
        <Checkbox />,
        { attachTo: document.getElementById('App') }
      );
      checkboxInstance = checkbox.instance() as Checkbox;
    });

    afterEach(() => {
      checkbox.unmount();
      checkbox.detach();
    });

    it('should call prop onClick when specified on click', () => {
      const clickSpy = jasmine.createSpy('onClick');
      const innerLabel = checkbox.find('div');

      checkbox.setProps({ onClick: clickSpy }).mount();
      innerLabel.simulate('click');

      expect(clickSpy.calls.count()).toBe(1);
    });

    it('should set inner input type to checkbox', () => {
      const innerInput = checkbox.find('input');

      expect(innerInput.prop('type')).toBe('checkbox');
    });
  });
});
