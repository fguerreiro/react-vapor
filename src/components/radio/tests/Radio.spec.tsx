import { shallow, mount, ReactWrapper } from 'enzyme';
// tslint:disable-next-line:no-unused-variable
import * as React from 'react';
import { Radio, IRadioProps } from '../Radio';

describe('Radio', () => {
  const anId = 'patate';
  const aLabel = 'Option 1';

  describe('<Radio />', () => {
    it('should render without errors', () => {
      expect(() => {
        shallow(
          <Radio id={anId} label={aLabel} />
        );
      }).not.toThrow();
    });
  });

  describe('<Radio />', () => {
    let radio: ReactWrapper<IRadioProps, any>;
    let radioInstance: Radio;

    beforeEach(() => {
      radio = mount(
        <Radio id={anId} label={aLabel} />,
        { attachTo: document.getElementById('App') }
      );
      radioInstance = radio.instance() as Radio;
    });

    afterEach(() => {
      radio.unmount();
      radio.detach();
    });

    it('should set id prop', () => {
      const innerInput = radio.find('input').first();
      expect(innerInput.prop('id')).toBe(anId);
    });

    it('should set label prop', () => {
      const innerLabel = radio.find('label').first();
      expect(innerLabel.text()).toBe(aLabel);
    });

    it('should set name prop when specified', () => {
      const name = 'salut';
      const innerInput = radio.find('input').first();
      expect(innerInput.prop('name')).toBe(undefined);

      radio.setProps({ name });
      radio.mount();
      expect(innerInput.prop('name')).toBe(name);
    });

    it('should set value prop when specified', () => {
      const value = 'blueberry';
      expect(radio.prop('value')).toBe(undefined);

      radio.setProps({ value });
      radio.mount();
      expect(radio.prop('value')).toBe(value);
    });

    it('should set not disable inner input when disabled prop is not specified', () => {
      const innerInput = radio.find('input').first();
      expect(innerInput.prop('disabled')).toBe(false);
    });

    it('should set not check inner input when checked prop is not specified', () => {
      const innerInput = radio.find('input').first();
      expect(innerInput.prop('checked')).toBe(false);
    });

    it('should set disabled prop when specified', () => {
      const innerInput = radio.find('input').first();
      radio.setProps({ disabled: false });
      radio.mount();
      expect(innerInput.prop('disabled')).toBe(false);

      radio.setProps({ disabled: true });
      radio.mount();
      expect(innerInput.prop('disabled')).toBe(true);
    });

    it('should set checked prop when specified', () => {
      const innerInput = radio.find('input').first();
      radio.setProps({ checked: false });
      radio.mount();
      expect(innerInput.prop('checked')).toBe(false);

      radio.setProps({ checked: true });
      radio.mount();
      expect(innerInput.prop('checked')).toBe(true);
    });

    it('should set classes when specified', () => {
      const innerClass = 'salut';
      const classes = [innerClass];
      const innerDiv = radio.find('div').first();
      expect(innerDiv.hasClass(innerClass)).toBe(false);

      radio.setProps({ classes });
      radio.mount();
      expect(innerDiv.hasClass(innerClass)).toBe(true);
    });

    it('should call prop onChange when specified on click', () => {
      const changeSpy = jasmine.createSpy('onChange');
      const innerInput = radio.find('input');

      radio.setProps({ onChange: changeSpy });
      radio.mount();
      innerInput.simulate('change');

      expect(changeSpy.calls.count()).toBe(1);
    });
  });
});