import { ReactWrapper, mount } from 'enzyme';
import { IReactVaporState } from '../../../ReactVapor';
import { Store } from 'redux';
import { TestUtils } from '../../../utils/TestUtils';
import { LoadingConnected } from '../LoadingConnected';
import { Provider } from 'react-redux';
// tslint:disable-next-line:no-unused-variable
import * as React from 'react';

describe('<LoadingConnected />', () => {
  it('should render without errors', () => {
    let store: Store<IReactVaporState> = TestUtils.buildStore();
    expect(() => {
      let wrapper: ReactWrapper<any, any> = mount(
        <Provider store={store}>
          <div>
            <LoadingConnected id='loading' />
          </div>
        </Provider>,
        { attachTo: document.getElementById('App') }
      );
      wrapper.unmount();
      wrapper.detach();
    }).not.toThrow();
  });
});
