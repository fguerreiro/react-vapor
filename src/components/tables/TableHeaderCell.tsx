import { TableSortingOrder } from './TableConstants';
import { Svg } from '../svg/Svg';
import * as classNames from 'classnames';
import * as React from 'react';
import * as _ from 'underscore';

export interface ITableHeaderCellOwnProps extends React.ClassAttributes<TableHeaderCell> {
  title: string;
  id?: string;
  attributeToSort?: string;
  tableId?: string;
  className?: string;
  onClickCallback?: (e: React.MouseEvent<HTMLTableHeaderCellElement>) => void;
}

export interface ITableHeaderStateProps {
  sorted?: TableSortingOrder;
}

export interface ITableHeaderCellDispatchProps {
  onMount?: () => void;
  onSort?: () => void;
  onUnmount?: () => void;
}

export interface ITableHeaderCellProps extends
  ITableHeaderCellOwnProps,
  ITableHeaderStateProps,
  ITableHeaderCellDispatchProps { }

export class TableHeaderCell extends React.Component<ITableHeaderCellProps, any> {
  static defaultProps: Partial<ITableHeaderCellProps> = {
    sorted: TableSortingOrder.UNSORTED,
  };

  private handleClick(e: React.MouseEvent<HTMLTableHeaderCellElement>) {
    if (this.props.onSort && this.props.attributeToSort) {
      this.props.onSort();
    }

    if (this.props.onClickCallback) {
      this.props.onClickCallback(e);
    }
  }

  componentDidMount() {
    if (this.props.onMount && this.props.attributeToSort) {
      this.props.onMount();
    }
  }

  componentWillUnmount() {
    if (this.props.onUnmount) {
      this.props.onUnmount();
    }
  }

  render() {
    const tableCellHasSort = !_.isUndefined(this.props.sorted) && !!this.props.attributeToSort;
    const sortIcon: JSX.Element = tableCellHasSort
      ? <div className='admin-sort-icon'><Svg svgName='asc-desc' className='tables-sort icon' /></div>
      : null;

    const headerCellClasses = classNames(this.props.className, {
      'admin-sort': tableCellHasSort,
      'admin-sort-ascending': this.props.sorted === TableSortingOrder.ASCENDING,
      'admin-sort-descending': this.props.sorted === TableSortingOrder.DESCENDING,
    });

    return (
      <th
        className={headerCellClasses}
        onClick={(e: React.MouseEvent<HTMLTableHeaderCellElement>) => this.handleClick(e)}>
        {this.props.title}
        {sortIcon}
      </th>
    );
  }
}
