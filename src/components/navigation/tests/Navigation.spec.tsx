import { shallow, mount, ReactWrapper } from 'enzyme';
import { Navigation, INavigationProps } from '../Navigation';
import { Loading } from '../../loading/Loading';
import { NavigationPagination } from '../pagination/NavigationPagination';
import { NavigationPerPage, PER_PAGE_NUMBERS, INavigationPerPageProps } from '../perPage/NavigationPerPage';
import * as _ from 'underscore';
// tslint:disable-next-line:no-unused-variable
import * as React from 'react';

describe(' navigation', () => {
  let basicNavigationProps: INavigationProps = {
    totalPages: 4,
    totalEntries: 12
  };

  describe('<Navigation />', () => {
    it('should render without errors', () => {
      expect(() => {
        shallow(
          <Navigation {...basicNavigationProps} />
        );
      }).not.toThrow();
    });
  });

  describe('<Navigation />', () => {
    let navigation: ReactWrapper<INavigationProps, any>;

    beforeEach(() => {
      navigation = mount(
        <Navigation {...basicNavigationProps} />,
        { attachTo: document.getElementById('App') }
      );
    });

    afterEach(() => {
      navigation.unmount();
      navigation.detach();
    });

    it('should get the number of pages as a prop', () => {
      let totalPagesProp = navigation.props().totalPages;

      expect(totalPagesProp).toBeDefined();
      expect(totalPagesProp).toBe(basicNavigationProps.totalPages);
    });

    it('should get the number of entries as a prop', () => {
      let totalEntriesProp = navigation.props().totalEntries;

      expect(totalEntriesProp).toBeDefined();
      expect(totalEntriesProp).toBe(basicNavigationProps.totalEntries);
    });

    it('should render a <Loading /> component', () => {
      expect(navigation.find(Loading).length).toBe(1);
    });

    it('should render a <NavigationPagination /> component if totalPages is higher than 1', () => {
      let newNavigationProps = _.extend({}, basicNavigationProps, { totalPages: 1 });

      expect(navigation.find(NavigationPagination).closest('div').hasClass('hidden')).toBe(false);

      navigation.setProps(newNavigationProps);
      expect(navigation.find(NavigationPagination).closest('div').hasClass('hidden')).toBe(true);
    });

    it('should render a <NavigationPerPage /> component if totalEntries is higher than the first perPageNumber', () => {
      let newNavigationProps = _.extend({}, basicNavigationProps, { totalEntries: PER_PAGE_NUMBERS[0] });

      expect(navigation.find(NavigationPerPage).closest('div').hasClass('hidden')).toBe(false);

      navigation.setProps(newNavigationProps);
      expect(navigation.find(NavigationPerPage).closest('div').hasClass('hidden')).toBe(true);
    });

    it('should pass on the currentPerPage prop if it is set (used without Redux)', () => {
      let perPageNav: ReactWrapper<INavigationPerPageProps, any> = navigation.find(NavigationPerPage);
      let expectedPerPage: number = 33;
      let newNavigationProps: INavigationProps = _.extend({}, basicNavigationProps, { currentPerPage: expectedPerPage });

      expect(perPageNav.props().currentPerPage).toBeUndefined();

      navigation.setProps(newNavigationProps);
      expect(perPageNav.props().currentPerPage).toBe(expectedPerPage);
    });
  });
});
