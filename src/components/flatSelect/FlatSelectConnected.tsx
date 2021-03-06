import { ReduxUtils, IReduxAction } from '../../utils/ReduxUtils';
import { IReactVaporState, IReduxActionsPayload } from '../../ReactVapor';
import { connect } from 'react-redux';
import * as React from 'react';
import * as _ from 'underscore';
import { removeFlatSelect, addFlatSelect, selectFlatSelect } from './FlatSelectActions';
import { IFlatSelectOptionProps } from './FlatSelectOption';
import { FlatSelect, IFlatSelectDispatchProps, IFlatSelectOwnProps, IFlatSelectProps, IFlatSelectStateProps } from './FlatSelect';
import { IFlatSelectState } from './FlatSelectReducers';

const mapStateToProps = (state: IReactVaporState, ownProps: IFlatSelectOwnProps): IFlatSelectStateProps => {
  const flatSelectState: IFlatSelectState = _.findWhere(state.flatSelect, { id: ownProps.id });

  if (flatSelectState && flatSelectState.selectedOptionId) {
    return { selectedOptionId: flatSelectState.selectedOptionId };
  }

  return { selectedOptionId: ownProps.options.length && ownProps.options[0].id };
};

const mapDispatchToProps = (dispatch: (action: IReduxAction<IReduxActionsPayload>) => void,
  ownProps: IFlatSelectOwnProps): IFlatSelectDispatchProps => ({
    onRender: () => dispatch(addFlatSelect(ownProps.id, ownProps.options.length && ownProps.options[0].id)),
    onDestroy: () => dispatch(removeFlatSelect(ownProps.id)),
    onOptionClick: (selected: IFlatSelectOptionProps) => dispatch(selectFlatSelect(ownProps.id, selected.id)),
  });

export const FlatSelectConnected: React.ComponentClass<IFlatSelectProps> =
  connect(mapStateToProps, mapDispatchToProps, ReduxUtils.mergeProps)(FlatSelect);
