import { shallow, ReactWrapper, mount } from 'enzyme';
// tslint:disable-next-line:no-unused-variable
import * as React from 'react';
import { DeleteInputAction, IDeleteInputActionProps } from '../DeleteInputAction';

describe('DeleteInputAction', () => {

  describe('<DeleteInputAction />', () => {
    it('should render without errors', () => {
      expect(() => {
        shallow(
          <DeleteInputAction onClick={() => { }} />
        );
      }).not.toThrow();
    });
  });

  describe('<DeleteInputAction />', () => {
    let deleteInput: ReactWrapper<IDeleteInputActionProps, any>;

    beforeEach(() => {
      deleteInput = mount(
        <DeleteInputAction onClick={() => { }} />,
        { attachTo: document.getElementById('App') }
      );
    });

    afterEach(() => {
      deleteInput.unmount();
      deleteInput.detach();
    });

    it('should render title prop if prop is set', () => {
      let title = 'a title';
      expect(deleteInput.find(`[title="${title}"]`).length).toBe(0);

      deleteInput.setProps({ title });
      deleteInput.mount();
      expect(deleteInput.find(`[title="${title}"]`).length).toBe(1);
    });
  });
});
