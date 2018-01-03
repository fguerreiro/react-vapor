import * as React from 'react';
import { shallow } from 'enzyme';
import { NavigationLoader } from '../NavigationLoader';

describe('NavLoader', () => {
    it('renders without errors', () => {
        let element = shallow(
            <NavigationLoader />
        );
        expect(() => {
            shallow(
                <NavigationLoader />
            );
        }).not.toThrow();
    });
});