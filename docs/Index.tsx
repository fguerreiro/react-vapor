import * as React from 'react';
import { Provider } from 'react-redux';
import { ReactVaporStore } from './ReactVaporStore';
import { render as ReactDOMRender } from 'react-dom';
import './style.scss';
import 'coveo-styleguide/dist/css/CoveoStyleGuide.css';
import { LoadingExamples } from '../src/components/loading/LoadingExamples';
import { FilterBoxExamples } from '../src/components/filterBox/examples/FilterBoxExamples';
import { NavigationLoaderExample } from '../src/components/navigationLoader/NavigationLoaderExample';

class App extends React.Component<any, any> {

  render() {
    (window as any).store = ReactVaporStore;
    return (
      <Provider store={ReactVaporStore}>
        <div className='coveo-form'>
          <div className='form-group'>
            <label className='form-control-label'>
              My list of members
            </label>
            <LoadingExamples />
            <FilterBoxExamples />

            <br />
            <br />
            <NavigationLoaderExample />
          </div>

        </div>
      </Provider>
    );
  }
}

ReactDOMRender(<App />, document.getElementById('App'));
