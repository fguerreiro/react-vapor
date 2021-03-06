import { IReduxAction } from '../../../utils/ReduxUtils';
import { ITableRowActionPayload, TableRowActions, unselectAllRows } from '../TableRowActions';
import {
  ITableRowState,
  tableRowsReducer,
  tableRowsInitialState,
  tableRowInitialState,
  tableRowReducer
} from '../TableRowReducers';

describe('Tables', () => {

  describe('TableRowReducers', () => {
    let genericAction: IReduxAction<ITableRowActionPayload> = {
      type: 'DO_SOMETHING',
      payload: {
        id: 'row1'
      }
    };

    it('should return the default state if the action is not defined and the state is undefined', () => {
      let oldState: ITableRowState[] = undefined;
      let collapsibleRowsState: ITableRowState[] = tableRowsReducer(oldState, genericAction);

      expect(collapsibleRowsState).toBe(tableRowsInitialState);
    });

    it('should return the default state if the action is not defined and the state is undefined for one row', () => {
      let oldState: ITableRowState = undefined;
      let collapsibleRowState: ITableRowState = tableRowReducer(oldState, genericAction);

      expect(collapsibleRowState).toBe(tableRowInitialState);
    });

    it('should return the old state when the action is not defined', () => {
      let oldState: ITableRowState[] = [tableRowInitialState];
      let collapsibleRowsState: ITableRowState[] = tableRowsReducer(oldState, genericAction);

      expect(collapsibleRowsState).toBe(oldState);
    });

    it('should return the old state when the action is not defined for one row', () => {
      let oldState: ITableRowState = tableRowInitialState;
      let collapsibleRowState: ITableRowState = tableRowReducer(oldState, genericAction);

      expect(collapsibleRowState).toBe(oldState);
    });

    it('should return the old state with one more CollapsibleRowState when the action is "ADD_ROW"', () => {
      let oldState: ITableRowState[] = tableRowsInitialState;
      let action: IReduxAction<ITableRowActionPayload> = {
        type: TableRowActions.add,
        payload: {
          id: 'row1'
        }
      };
      let collapsibleRowsState: ITableRowState[] = tableRowsReducer(oldState, action);

      expect(collapsibleRowsState.length).toBe(oldState.length + 1);
      expect(collapsibleRowsState.filter(row => row.id === action.payload.id).length).toBe(1);

      oldState = collapsibleRowsState;
      action.payload.id = 'row2';
      collapsibleRowsState = tableRowsReducer(oldState, action);

      expect(collapsibleRowsState.length).toBe(oldState.length + 1);
      expect(collapsibleRowsState.filter(row => row.id === action.payload.id).length).toBe(1);
    });

    it('should return the old state without the CollapsibleRowState with the timer id when the action is "REMOVE_ROW"', () => {
      let oldState: ITableRowState[] = [
        {
          id: 'row2',
          opened: false,
          selected: false,
        }, {
          id: 'row1',
          opened: true,
          selected: false,
        }, {
          id: 'row3',
          opened: false,
          selected: false,
        }
      ];
      let action: IReduxAction<ITableRowActionPayload> = {
        type: TableRowActions.remove,
        payload: {
          id: 'row1'
        }
      };
      let collapsibleRowsState: ITableRowState[] = tableRowsReducer(oldState, action);

      expect(collapsibleRowsState.length).toBe(oldState.length - 1);
      expect(collapsibleRowsState.filter(row => row.id === action.payload.id).length).toBe(0);

      oldState = collapsibleRowsState;
      action.payload.id = 'row2';
      collapsibleRowsState = tableRowsReducer(oldState, action);

      expect(collapsibleRowsState.length).toBe(oldState.length - 1);
      expect(collapsibleRowsState.filter(row => row.id === action.payload.id).length).toBe(0);
    });

    describe('collapsible behaviors', () => {
      let oldState: ITableRowState[];
      let openValue: boolean;

      beforeEach(() => {
        openValue = false;
        oldState = [
          { id: 'row2', opened: openValue, selected: false },
          { id: 'row3', opened: openValue, selected: false },
          { id: 'row1', opened: openValue, selected: false },
        ];
      });

      it('should toggle the open property if the action is "SELECT_ROW" and isCollapsible is true', () => {
        const action: IReduxAction<ITableRowActionPayload> = {
          type: TableRowActions.select,
          payload: {
            id: 'row1',
            isCollapsible: true,
          }
        };
        let collapsibleRowsState: ITableRowState[] = tableRowsReducer(oldState, action);

        expect(collapsibleRowsState.length).toBe(oldState.length);
        expect(collapsibleRowsState.filter(row => row.id === action.payload.id)[0].opened).toBe(!openValue);
        expect(collapsibleRowsState.filter(row => row.id !== action.payload.id)[0].opened).toBe(openValue);

        collapsibleRowsState = tableRowsReducer(collapsibleRowsState, action);

        expect(collapsibleRowsState.filter(row => row.id === action.payload.id)[0].opened).toBe(openValue);
        expect(collapsibleRowsState.filter(row => row.id !== action.payload.id)[0].opened).toBe(openValue);
      });

      it('should leave the open property to a falsy value if the action is "SELECT_ROW" and isCollapsible is undefined', () => {
        const action: IReduxAction<ITableRowActionPayload> = {
          type: TableRowActions.select,
          payload: {
            id: 'row1',
          }
        };
        let collapsibleRowsState: ITableRowState[] = tableRowsReducer(oldState, action);

        expect(collapsibleRowsState.length).toBe(oldState.length);
        expect(collapsibleRowsState.filter(row => row.id === action.payload.id)[0].opened).toBe(false);
        expect(collapsibleRowsState.filter(row => row.id !== action.payload.id)[0].opened).toBe(false);

        collapsibleRowsState = tableRowsReducer(collapsibleRowsState, action);

        expect(collapsibleRowsState.filter(row => row.id === action.payload.id)[0].opened).toBe(false);
        expect(collapsibleRowsState.filter(row => row.id !== action.payload.id)[0].opened).toBe(false);
      });

      it('should leave the open property to a falsy value if the action is "SELECT_ROW" and isCollapsible is false', () => {
        const action: IReduxAction<ITableRowActionPayload> = {
          type: TableRowActions.select,
          payload: {
            id: 'row1',
            isCollapsible: false,
          }
        };
        let collapsibleRowsState: ITableRowState[] = tableRowsReducer(oldState, action);

        expect(collapsibleRowsState.length).toBe(oldState.length);
        expect(collapsibleRowsState.filter(row => row.id === action.payload.id)[0].opened).toBe(false);
        expect(collapsibleRowsState.filter(row => row.id !== action.payload.id)[0].opened).toBe(false);

        collapsibleRowsState = tableRowsReducer(collapsibleRowsState, action);

        expect(collapsibleRowsState.filter(row => row.id === action.payload.id)[0].opened).toBe(false);
        expect(collapsibleRowsState.filter(row => row.id !== action.payload.id)[0].opened).toBe(false);
      });

      describe('selected behavior', () => {
        const actionMaker = (rowId: string): IReduxAction<ITableRowActionPayload> => ({
          type: TableRowActions.select,
          payload: { id: rowId },
        });
        const doesNotMatter = false;

        let oldState: ITableRowState[];

        beforeEach(() => {
          openValue = false;
          oldState = [
            { id: 'row2', opened: doesNotMatter, selected: false },
            { id: 'row3', opened: doesNotMatter, selected: false },
            { id: 'row1', opened: doesNotMatter, selected: false },
          ];
        });

        it('should select the row with the corresponding id and leave the rest unselected', () => {
          const action = actionMaker('row2');
          const rowsState = tableRowsReducer(oldState, action);

          expect(rowsState.filter(row => row.id === action.payload.id)[0].selected).toBe(true);
          expect(rowsState.filter(row => row.id !== action.payload.id).every(row => !row.selected))
            .toBe(true);
        });

        it('should preserve the same selected row if you perform the exact same toggle action twice', () => {
          const action = actionMaker('row2');
          const rowsState = tableRowsReducer(tableRowsReducer(oldState, action), action);

          expect(rowsState.filter(row => row.id === action.payload.id)[0].selected).toBe(true);
          expect(rowsState.filter(row => row.id !== action.payload.id).every(row => !row.selected))
            .toBe(true);
        });

        it('should select a new row on the second time the toggle action is performed with a new row id', () => {
          const action1 = actionMaker('row1');
          const action2 = actionMaker('row2');
          const rowsState = tableRowsReducer(tableRowsReducer(oldState, action1), action2);

          expect(rowsState.filter(row => row.id === action2.payload.id)[0].selected).toBe(true);
          expect(rowsState.filter(row => row.id !== action2.payload.id).every(row => !row.selected))
            .toBe(true);
        });

        it('should unselect all rows having a table id identical to the one received in the payload', () => {
          const tableId = 'tableId';
          const action = unselectAllRows(tableId);

          const currentStateWithTableId = oldState.map(rowState => ({ ...rowState, tableId, selected: true }));

          expect(tableRowsReducer(currentStateWithTableId, action).every(row => !row.selected)).toBe(true);
        });

        it('should leave all rows not having a table id identical to the one received in the payload', () => {
          const tableId = 'tableId';
          const action = unselectAllRows(tableId);

          const currentStateWithTableId = oldState.map(rowState => ({ ...rowState, tableId: `different${tableId}`, selected: true }));

          expect(tableRowsReducer(currentStateWithTableId, action).every(row => row.selected)).toBe(true);
        });
      });
    });
  });
});
