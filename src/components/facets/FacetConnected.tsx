import { IFacetOwnProps, Facet, IFacetStateProps, IFacetDispatchProps, IFacetProps, IFacet } from './Facet';
import { ReduxUtils, IReduxAction } from '../../utils/ReduxUtils';
import { IReactVaporState, IReduxActionsPayload } from '../../ReactVapor';
import { IFacetState } from './FacetReducers';
import { addFacet, removeFacet, changeFacet, emptyFacet } from './FacetActions';
import { connect } from 'react-redux';
import * as React from 'react';
import * as _ from 'underscore';

const mapStateToProps = (state: IReactVaporState, ownProps: IFacetOwnProps): IFacetStateProps => {
  let item: IFacetState = _.findWhere(state.facets, { facet: ownProps.facet.name });

  return {
    isOpened: item && item.opened,
    selectedFacetRows: item ? item.selected : [],
    withReduxState: true
  };
};

const mapDispatchToProps = (dispatch: (action: IReduxAction<IReduxActionsPayload>) => void): IFacetDispatchProps => ({
  onRender: (facet: string) => dispatch(addFacet(facet)),
  onDestroy: (facet: string) => dispatch(removeFacet(facet)),
  onToggleFacet: (facet: string, facetRow: IFacet) => dispatch(changeFacet(facet, facetRow)),
  onClearFacet: (facet: string) => dispatch(emptyFacet(facet))
});

export const FacetConnected: React.ComponentClass<IFacetProps> = connect(mapStateToProps, mapDispatchToProps, ReduxUtils.mergeProps)(Facet);
