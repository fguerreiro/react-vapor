import { IReactVaporState, ReduxUtils } from '../../utils/ReduxUtils';
import {
  Navigation, INavigationOwnProps, INavigationStateProps, INavigationProps
} from './Navigation';
import { connect } from 'react-redux';
import * as React from 'react';
import * as _ from 'underscore';

const mapStateToProps = (state: IReactVaporState, ownProps: INavigationOwnProps): INavigationStateProps => {
  let item = _.findWhere(state.loadings, { id: 'loading-' + ownProps.id });

  return {
    isLoading: item ? item.isOn : false,
    withReduxState: true
  };
};

const mapDispatchToProps = () => {
  return {};
};

export const TableNavigationConnected: React.ComponentClass<INavigationProps> =
  connect(mapStateToProps, mapDispatchToProps, ReduxUtils.mergeProps)(Navigation);
