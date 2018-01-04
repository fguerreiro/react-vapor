import * as React from 'react';
import { shallow } from 'enzyme';
import { NavigationLoaderExample } from '../NavigationLoaderExample';

describe('NavLoader', () => {
  it('renders without errors', () => {
    let element = shallow(
      <Navi />
    );
    expect(() => {
      shallow(
        <NavigationLoaderExample />
      );
    }).not.toThrow();
  });
});
