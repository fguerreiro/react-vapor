// tslint:disable-next-line:no-unused-variable
import * as React from 'react';

export interface IDropdownPrependProps {
  prepend: JSX.Element | string;
  key?: string;
  children?: any;
}

export const DropdownPrepend = (props: IDropdownPrependProps): JSX.Element =>
  <span className='dropdown-prepend'>{props.prepend}{props.children}</span>;