import { IReactVaporState, ReduxUtils, IReduxAction } from '../../utils/ReduxUtils';
import {
  IFacetMoreRowsOwnProps, FacetMoreRows, IFacetMoreRowsProps, IFacetMoreRowsStateProps,
  IFacetMoreRowsDispatchProps
} from './FacetMoreRows';
import { filterThrough, IFilterActionPayload } from '../filterBox/FilterBoxActions';
import { closeMoreFacetRows, IFacetActionPayload } from './FacetActions';
import { connect } from 'react-redux';
import * as React from 'react';
import * as _ from 'underscore';

const mapStateToProps = (state: IReactVaporState, ownProps: IFacetMoreRowsOwnProps): IFacetMoreRowsStateProps => {
  let item = _.findWhere(state.facets, { facet: ownProps.facet });
  let filterItem = _.findWhere(state.filters, { id: 'filter-' + ownProps.facet });

  return {
    isOpened: item && item.opened,
    filterText: filterItem ? filterItem.filterText : '',
    withReduxState: true
  };
};

const mapDispatchToProps = (dispatch: (action: IReduxAction<IFilterActionPayload | IFacetActionPayload>) => void,
  ownProps: IFacetMoreRowsOwnProps): IFacetMoreRowsDispatchProps => {
  return {
    onOpen: () => {
      dispatch(filterThrough('filter-' + ownProps.facet, ''));
    },
    onDocumentClick: () => {
      dispatch(closeMoreFacetRows());
    }
  };
};

export const FacetMoreRowsConnected: React.ComponentClass<IFacetMoreRowsProps> =
  connect(mapStateToProps, mapDispatchToProps, ReduxUtils.mergeProps)(FacetMoreRows);
