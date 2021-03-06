import { IInlinePromptProps, IInlinePromptViewDispatchProps, InlinePrompt, IInlinePromptOwnProps } from './InlinePrompt';
import { ReduxUtils, IReduxAction } from '../../utils/ReduxUtils';
import { IReduxActionsPayload } from '../../ReactVapor';
import { removePrompt } from './InlinePromptActions';
import { connect } from 'react-redux';
import * as React from 'react';

const mapStateToProps = () => {
  return {};
};

const mapDispatchToProps = (dispatch: (action: IReduxAction<IReduxActionsPayload>) => void,
  ownProps: IInlinePromptOwnProps): IInlinePromptViewDispatchProps => ({
    onCancel: () => dispatch(removePrompt(ownProps.id))
  });

export const InlinePromptConnected: React.ComponentClass<IInlinePromptProps> =
  connect(mapStateToProps, mapDispatchToProps, ReduxUtils.mergeProps)(InlinePrompt);
