import { ReduxUtils, IReactVaporState, IReduxActionPayload, IReduxAction } from '../../utils/ReduxUtils';
import { IDropdownProps, IDropdownStateProps, Dropdown, IDropdownOwnProps, IDropdownDispatchProps } from './Dropdown';
import { addDropdown, removeDropdown, toggleDropdown, closeDropdown } from './DropdownActions';
import { connect } from 'react-redux';
import * as React from 'react';
import * as _ from 'underscore';

const mapStateToProps = (state: IReactVaporState, ownProps: IDropdownOwnProps): IDropdownStateProps => {
  let item = _.findWhere(state.dropdowns, { id: ownProps.id });

  return {
    isOpened: item && item.opened
  };
};

const mapDispatchToProps = (dispatch: (action: IReduxAction<IReduxActionPayload>) => void, ownProps: IDropdownOwnProps): IDropdownDispatchProps => {
  return {
    onRender: () => dispatch(addDropdown(ownProps.id)),
    onDestroy: () => dispatch(removeDropdown(ownProps.id)),
    onClick: () => dispatch(toggleDropdown(ownProps.id)),
    onDocumentClick: () => dispatch(closeDropdown(ownProps.id))
  };
};

export const DropdownConnected: React.ComponentClass<IDropdownProps> =
  connect(mapStateToProps, mapDispatchToProps, ReduxUtils.mergeProps)(Dropdown);
