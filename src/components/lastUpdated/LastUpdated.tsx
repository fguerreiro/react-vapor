import * as React from 'react';
import * as moment from 'moment';

export interface ILastUpdatedOwnProps extends React.ClassAttributes<LastUpdated> {
  id?: string;
  label?: string;
}

export interface ILastUpdatedStateProps {
  time?: Date;
}

export interface ILastUpdatedDispatchProps {
  onRender?: () => void;
  onDestroy?: () => void;
}

export interface ILastUpdatedProps extends ILastUpdatedOwnProps, ILastUpdatedStateProps, ILastUpdatedDispatchProps { }

export const LAST_UPDATE_LABEL: string = 'Last update:';

export class LastUpdated extends React.Component<ILastUpdatedProps, any> {

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
    let label: string = this.props.label || LAST_UPDATE_LABEL;
    let time: Date = this.props.time || new Date();
    let lastUpdateTime: string = moment(time).format('LTS');

    return (
      <div className='table-last-update'>{label} {lastUpdateTime}</div>
    );
  }
}
