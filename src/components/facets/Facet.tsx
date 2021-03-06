import { Svg } from '../svg/Svg';
import { IReduxStatePossibleProps } from '../../utils/ReduxUtils';
import { FacetMoreToggleConnected } from './FacetMoreToggleConnected';
import { FacetMoreToggle } from './FacetMoreToggle';
import { FacetMoreRowsConnected } from './FacetMoreRowsConnected';
import { FacetMoreRows } from './FacetMoreRows';
import { FacetRow } from './FacetRow';
import { Tooltip } from '../tooltip/Tooltip';
import * as React from 'react';
import * as _ from 'underscore';

export interface IFacet {
  name: string;
  formattedName: string;
}

export interface IFacetOwnProps extends React.ClassAttributes<Facet> {
  facet: IFacet;
  facetRows: IFacet[];
  toggleFacet: (facet: string, facetRow: IFacet) => void;
  clearFacet: (facet: string) => void;
  clearFacetLabel?: string;
}

export interface IFacetStateProps extends IReduxStatePossibleProps {
  isOpened?: boolean;
  selectedFacetRows?: IFacet[];
}

export interface IFacetDispatchProps {
  onRender?: (facet: string) => void;
  onDestroy?: (facet: string) => void;
  onToggleFacet?: (facet: string, facetRow: IFacet) => void;
  onClearFacet?: (facet: string) => void;
}

export interface IFacetChildrenProps {
  moreLabel?: string;
  filterPlaceholder?: string;
}

export interface IFacetProps extends IFacetOwnProps, IFacetStateProps, IFacetDispatchProps, IFacetChildrenProps { }

export const CLEAR_FACET_LABEL: string = 'Clear';

export class Facet extends React.Component<IFacetProps, any> {
  static defaultProps: Partial<IFacetProps> = {
    clearFacetLabel: CLEAR_FACET_LABEL,
    selectedFacetRows: []
  };

  private buildFacet = (facetRow: IFacet) => {
    this.props.toggleFacet(this.props.facet.name, facetRow);
    if (this.props.onToggleFacet) {
      this.props.onToggleFacet(this.props.facet.name, facetRow);
    }
  }

  private clearFacet = () => {
    this.props.clearFacet(this.props.facet.name);
    if (this.props.onClearFacet) {
      this.props.onClearFacet(this.props.facet.name);
    }
  }

  private sortFacetRows(facetRows: IFacet[]) {
    return _.sortBy(facetRows, (facetRow: IFacet) => facetRow.formattedName.toLowerCase());
  }

  componentWillMount() {
    if (this.props.onRender) {
      this.props.onRender(this.props.facet.name);
    }
  }

  componentWillUnmount() {
    if (this.props.onDestroy) {
      this.props.onDestroy(this.props.facet.name);
    }
  }

  render() {
    const removeSelectedClass: string = 'facet-header-eraser' + (this.props.selectedFacetRows.length ? '' : ' hidden');
    const selected: IFacet[] = this.sortFacetRows(this.props.selectedFacetRows);
    const unselected: IFacet[] = this.sortFacetRows(this.props.facetRows);
    const allRows: IFacet[] = _.union(selected, unselected);
    const facetRows: IFacet[] = _.uniq(allRows, false, item => item.name);
    const rows: JSX.Element[] = _.map(facetRows, (facetRow: IFacet) => {
      return (<FacetRow
        key={facetRow.name}
        facet={this.props.facet.name}
        facetRow={facetRow}
        onToggleFacet={this.buildFacet}
        isChecked={_.contains(_.pluck(this.props.selectedFacetRows, 'name'), facetRow.name)}
      />);
    });
    const rowsToShow: number = Math.max(this.props.selectedFacetRows.length, 5);
    const moreRowsToggle: JSX.Element = rows.length > rowsToShow
      ? (this.props.withReduxState
        ? <FacetMoreToggleConnected facet={this.props.facet.name} moreLabel={this.props.moreLabel} />
        : <FacetMoreToggle facet={this.props.facet.name} moreLabel={this.props.moreLabel} />
      )
      : null;
    const moreRows: JSX.Element = moreRowsToggle
      ? (this.props.withReduxState
        ? <FacetMoreRowsConnected
          facet={this.props.facet.name}
          facetRows={rows.splice(rowsToShow)}
          filterPlaceholder={this.props.filterPlaceholder} />
        : <FacetMoreRows
          facet={this.props.facet.name}
          facetRows={rows.splice(rowsToShow)}
          filterPlaceholder={this.props.filterPlaceholder} />
      )
      : null;
    const facetClasses: string = this.props.facet.name + ' facet' + (this.props.isOpened ? ' facet-opened' : '');

    return (
      <div className={facetClasses}>
        <div className='facet-header'>
          <div
            className={removeSelectedClass}
            onClick={() => this.clearFacet()}>
            <Tooltip className='remove-selected-tooltip' title={`${this.props.clearFacetLabel} ${this.props.facet.formattedName}`}>
              <Svg svgName='clear' className='icon fill-medium-grey' />
            </Tooltip>
          </div>
          <div className='facet-header-title bold text-medium-blue'>{this.props.facet.formattedName}</div>
        </div>
        <ul className='facet-values'>
          {rows}
          {moreRowsToggle}
        </ul>
        {moreRows}
      </div>
    );
  }
}
