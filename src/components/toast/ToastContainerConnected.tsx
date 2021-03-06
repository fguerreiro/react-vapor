import * as _ from 'underscore';
import { IReactVaporState, IReduxActionsPayload } from '../../ReactVapor';
import { IReduxAction, ReduxUtils } from '../../utils/ReduxUtils';
import { addToastContainer, removeToast, removeToastContainer } from './ToastActions';
import { connect } from 'react-redux';
import {
  IToastContainerDispatchProps,
  IToastContainerOwnProps,
  IToastContainerProps,
  IToastContainerStateProps,
  ToastContainer
} from './ToastContainer';

const mapStateToProps = (state: IReactVaporState,
  ownProps: IToastContainerOwnProps): IToastContainerStateProps => {
  const container = _.findWhere(state.toastContainers, { id: ownProps.id }) || { id: null, toasts: [] };
  return {
    toasts: container.toasts,
  };
};

const mapDispatchToProps = (dispatch: (action: IReduxAction<IReduxActionsPayload>) => void,
  ownProps: IToastContainerOwnProps): IToastContainerDispatchProps => ({
    onRender: () => dispatch(addToastContainer(ownProps.id)),
    onDestroy: () => dispatch(removeToastContainer(ownProps.id)),
    onCloseToast: (id: string) => dispatch(removeToast(ownProps.id, id)),
  });

export const ToastContainerConnected: React.ComponentClass<IToastContainerProps> = connect(mapStateToProps, mapDispatchToProps,
  ReduxUtils.mergeProps)(ToastContainer);
