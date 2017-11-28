import { ITableState } from './TableReducers';
import { convertUndefinedAndNullToEmptyString } from '../../utils/FalsyValuesUtils';
import { TABLE_PREDICATE_DEFAULT_VALUE, TableSortingOrder, TableChildComponent } from './TableConstants';
import * as _ from 'underscore';
import { ITableOwnProps } from './Table';
import { modifyState } from './TableActions';
import { turnOnLoading, turnOffLoading } from '../loading/LoadingActions';
import { getLoadingIds, getChildComponentId } from './TableUtils';
import { changeLastUpdated } from '../lastUpdated/LastUpdatedActions';
import { resetPaging, changePage } from '../navigation/pagination/NavigationPaginationActions';
import { addActionsToActionBar } from '../actions/ActionBarActions';
import { selectRow } from './TableRowActions';


export const TableDataModifyerMethods = {
  default(tableState: ITableState): ITableState {
    const tableDataById = tableState.data.byId;

    let totalPages: number;
    let totalEntries: number;
    let nextDisplayedIds = [...tableState.data.allIds];

    // predicates default logic
    if (!_.isEmpty(tableState.predicates)) {
      _.pairs(tableState.predicates).forEach((keyValuePair: string[]) => {
        const attributeName = keyValuePair[0];
        const attributeValue = keyValuePair[1];

        if (attributeValue !== TABLE_PREDICATE_DEFAULT_VALUE) {
          nextDisplayedIds = nextDisplayedIds.filter((dataId: string) =>
            tableDataById[dataId][attributeName] === attributeValue);
        }
      });
    }

    // filter default logic
    if (tableState.filter) {
      nextDisplayedIds = nextDisplayedIds.filter((dataId: string) => {
        let shouldKeep = false;

        tableState.headingAttributes.forEach((headingAttribute: string) => {
          const cleanAttributeValue = convertUndefinedAndNullToEmptyString(tableDataById[dataId][headingAttribute]);
          shouldKeep =
            shouldKeep
            || cleanAttributeValue.toString().toLowerCase().indexOf(tableState.filter.toLowerCase()) > -1;
        });

        return shouldKeep;
      });
    }

    totalEntries = nextDisplayedIds.length;
    totalPages = Math.ceil(totalEntries / tableState.perPage);

    // pagination logic
    const startingIndex = tableState.page * tableState.perPage;
    const endingIndex = startingIndex + tableState.perPage;
    nextDisplayedIds = nextDisplayedIds.slice(startingIndex, endingIndex);

    // sort default logic
    const { sortState } = tableState;
    if (sortState && sortState.order !== TableSortingOrder.UNSORTED) {
      nextDisplayedIds = _.sortBy(
        nextDisplayedIds,
        (displayedId: string) => {
          const cleanAttributeValue = convertUndefinedAndNullToEmptyString(tableDataById[displayedId][sortState.attribute]);
          return cleanAttributeValue.toString().toLowerCase();
        },
      );

      if (sortState.order === TableSortingOrder.DESCENDING) {
        nextDisplayedIds.reverse();
      }
    }

    return {
      ...tableState,
      data: {
        ...tableState.data,
        displayedIds: nextDisplayedIds,
      },
      totalEntries,
      totalPages,
    };
  },
  thunkDefault(tableOwnProps: ITableOwnProps) {
    return (dispatch: any) => {
      dispatch(selectRow(undefined));
      dispatch(
        addActionsToActionBar(
          getChildComponentId(tableOwnProps.id, TableChildComponent.ACTION_BAR),
          [],
        ),
      );
      dispatch(turnOnLoading(getLoadingIds(tableOwnProps.id), tableOwnProps.id));
      dispatch(modifyState(tableOwnProps.id, TableDataModifyerMethods.default));
      dispatch(turnOffLoading(getLoadingIds(tableOwnProps.id), tableOwnProps.id));
      dispatch(changeLastUpdated(getChildComponentId(tableOwnProps.id, TableChildComponent.LAST_UPDATED)));
    };
  },
  server(tableState: ITableState): ITableState {
    // todo
    return undefined;
  },
  thunkServer(tableState: ITableState, tableOwnProps: ITableOwnProps) {
    return (dispatch: any) => {
      // todo
    };
  }
};
