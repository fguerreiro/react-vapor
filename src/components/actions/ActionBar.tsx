import { IActionOptions } from './Action';
import { ITooltipProps } from '../tooltip/Tooltip';
import { IReduxStatePossibleProps } from '../../utils/ReduxUtils';
import { PrimaryActionConnected } from './PrimaryActionConnected';
import { PrimaryAction } from './PrimaryAction';
import { SecondaryActionsConnected } from './SecondaryActionsConnected';
import { SecondaryActions } from './SecondaryActions';
import * as React from 'react';
import * as _ from 'underscore';
import { ItemFilter } from './filters/ItemFilter';
import * as classNames from 'classnames';

export const DEFAULT_ACTIONS_CONTAINER_CLASSES = [
  'coveo-table-actions-container',
  'mod-cancel-header-padding',
  'mod-border-bottom',
  'mod-align-header',
];

export interface IActionBarOwnProps extends React.ClassAttributes<ActionBar> {
  id?: string;
  itemFilterLabel?: string;
  itemTooltipProps?: ITooltipProps;
  onClearItemFilter?: () => void;
  extraContainerClasses?: string[];
  removeDefaultContainerClasses?: boolean;
}

export interface IActionBarStateProps extends IReduxStatePossibleProps {
  actions?: IActionOptions[];
  prompt?: JSX.Element;
  itemFilter?: string;
  isLoading?: boolean;
}

export interface IActionBarDispatchProps {
  onRender?: () => void;
  onDestroy?: () => void;
  clearItemFilter?: () => void;
}

export interface IActionBarChildrenProps {
  moreLabel?: string;
  itemFilterCropLength?: number;
}

export interface IActionBarProps extends
  IActionBarOwnProps,
  IActionBarStateProps,
  IActionBarDispatchProps,
  IActionBarChildrenProps { }

export class ActionBar extends React.Component<IActionBarProps, any> {
  static defaultProps: Partial<IActionBarOwnProps> = {
    extraContainerClasses: [],
  };

  private handleClear() {
    if (this.props.clearItemFilter) {
      this.props.clearItemFilter();
    }
  }

  componentWillMount() {
    if (this.props.onRender) {
      this.props.onRender();
    }
  }

  componentWillUnmount() {
    if (this.props.onDestroy) {
      this.props.onDestroy();
    }
  }

  render() {
    const itemFilter: JSX.Element = this.props.itemFilter
      ? <ItemFilter
        label={this.props.itemFilterLabel}
        item={this.props.itemFilter}
        itemTooltipProps={this.props.itemTooltipProps}
        onClear={() => this.handleClear()} crop={this.props.itemFilterCropLength}
      />
      : null;

    const primaryActions: JSX.Element[] = !this.props.prompt && _.map(this.props.actions, (action: IActionOptions, index: number): JSX.Element => {
      if (action.primary) {
        let primaryAction = this.props.withReduxState
          ? <PrimaryActionConnected action={action} parentId={this.props.id} />
          : <PrimaryAction action={action} />;
        return <div className='dropdown action primary-action' key={'primary-' + index}>{primaryAction}</div>;
      }
    });

    const secondaryActions: IActionOptions[] = !this.props.prompt && _.map(this.props.actions, (action: IActionOptions) => {
      if (!action.primary) {
        return action;
      }
    }).filter(Boolean);

    let secondaryActionsView: JSX.Element = null;
    if (secondaryActions.length) {
      secondaryActionsView = this.props.withReduxState
        ? <SecondaryActionsConnected moreLabel={this.props.moreLabel} actions={secondaryActions} id={this.props.id} />
        : <SecondaryActions moreLabel={this.props.moreLabel} actions={secondaryActions} />;
    }

    const actions = primaryActions.length || secondaryActionsView || this.props.prompt
      ? (<div className='coveo-table-actions'>
        {primaryActions}
        {secondaryActionsView}
        {this.props.prompt}
      </div>)
      : null;

    const defaultContainerClasses = !this.props.removeDefaultContainerClasses
      ? DEFAULT_ACTIONS_CONTAINER_CLASSES
      : [];
    const containerClasses = classNames(
      defaultContainerClasses,
      this.props.extraContainerClasses,
      {
        'mod-deactivate-pointer': !!this.props.isLoading,
      },
    );

    return (
      <div className={containerClasses}>
        {itemFilter}
        {actions}
        {this.props.children}
      </div>
    );
  }
}
