import { getNextTableSortingOrder, getTableChildComponentId, getTableLoadingIds } from '../TableUtils';
import { TableSortingOrder, TableChildComponent } from '../TableConstants';
import * as _ from 'underscore';

describe('TableUtils', () => {
    describe('getNextTableSortingOrder', () => {
        const {
            ASCENDING,
            DESCENDING,
            UNSORTED,
          } = TableSortingOrder;

        it('should return ASCENDING if the previous order was UNSORTED', () => {
            expect(getNextTableSortingOrder(UNSORTED)).toBe(ASCENDING);
        });

        it('should return ASCENDING if the previous order was DESCENDING', () => {
            expect(getNextTableSortingOrder(DESCENDING)).toBe(ASCENDING);
        });

        it('should return DESCENDING if the previous order was ASCENDING', () => {
            expect(getNextTableSortingOrder(ASCENDING)).toBe(DESCENDING);
        });
    });

    describe('getTableChildComponentId', () => {
        const particularCases: any[] = [TableChildComponent.LOADING_NAVIGATION, TableChildComponent.PER_PAGE, TableChildComponent.PAGINATION];
        const tableId = 'tableId';

        it('should return the tableId following by the table child component name if it is not a particular case', () => {
            _.chain(TableChildComponent).values().without(...particularCases).each((childComponent: any) => {
                expect(getTableChildComponentId(tableId, childComponent)).toBe(`${tableId}${childComponent}`);
            });
        });

        it('should return the "loading-" prefix following by the table id and the navigation child component suffix for the LOADING_NAVIGATION component', () => {
            expect(getTableChildComponentId(tableId, TableChildComponent.LOADING_NAVIGATION))
                .toBe(`loading-${tableId}${TableChildComponent.NAVIGATION}`);
        });

        it('should return the "pagination-" prefix following by the table id and the navigation child component suffix for the PAGINATION component', () => {
            expect(getTableChildComponentId(tableId, TableChildComponent.PAGINATION))
                .toBe(`pagination-${tableId}${TableChildComponent.NAVIGATION}`);
        });

        it('should return the table id and the navigation child component suffix for the PER_PAGE component', () => {
            expect(getTableChildComponentId(tableId, TableChildComponent.PER_PAGE))
                .toBe(`${tableId}${TableChildComponent.NAVIGATION}`);
        });
    });

    describe('getTableLoadingIds', () => {
        it('should return an array of all the loading ids to be toggled', () => {
            const tableId = 'tableId';
            expect(getTableLoadingIds(tableId)).toEqual([
                tableId,
                getTableChildComponentId(tableId, TableChildComponent.ACTION_BAR),
                getTableChildComponentId(tableId, TableChildComponent.LOADING_NAVIGATION),
            ]);
        });
    });
});